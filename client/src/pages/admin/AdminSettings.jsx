import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Save, Palette, Globe, CreditCard, Image, Upload, X } from 'lucide-react'
import { useThemeStore, useSiteSettingsStore } from '../../store/useStore'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { themeStyle, setThemeStyle } = useThemeStore()
  const { siteName, siteTagline, logo, favicon, contactEmail, setSiteSettings, updateSiteSetting } = useSiteSettingsStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    siteName: siteName || 'Magnetic Clouds',
    siteTagline: siteTagline || 'Premium Cloud Hosting',
    contactEmail: contactEmail || 'support@magneticclouds.com',
    logo: logo || null,
    favicon: favicon || null
  })
  const logoInputRef = useRef(null)
  const faviconInputRef = useRef(null)

  // Load settings from server on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get('/settings/public')
        if (res.data.settings) {
          const s = res.data.settings
          setFormData(prev => ({
            ...prev,
            siteName: s.site_name || prev.siteName,
            siteTagline: s.site_tagline || prev.siteTagline,
            contactEmail: s.contact_email || prev.contactEmail,
            logo: s.site_logo || prev.logo,
            favicon: s.site_favicon || prev.favicon
          }))
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }
    loadSettings()
  }, [])

  const handleFileUpload = async (file, type) => {
    if (!file) return
    
    // For favicon, resize to 32x32
    if (type === 'favicon') {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, 32, 32)
        const resized = canvas.toDataURL('image/png')
        setFormData(prev => ({ ...prev, [type]: resized }))
      }
      img.src = URL.createObjectURL(file)
      return
    }
    
    // For logo, resize to max 200px height while maintaining aspect ratio
    if (type === 'logo') {
      const img = new Image()
      img.onload = () => {
        const maxHeight = 100
        const maxWidth = 300
        let width = img.width
        let height = img.height
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const resized = canvas.toDataURL('image/png')
        setFormData(prev => ({ ...prev, [type]: resized }))
      }
      img.src = URL.createObjectURL(file)
      return
    }
    
    // Fallback: Convert to base64 for storage
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [type]: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Save to server
      await api.put('/settings', {
        settings: {
          site_name: formData.siteName,
          site_tagline: formData.siteTagline,
          contact_email: formData.contactEmail,
          site_logo: formData.logo,
          site_favicon: formData.favicon
        }
      })
      
      // Update local store
      setSiteSettings({
        siteName: formData.siteName,
        siteTagline: formData.siteTagline,
        contactEmail: formData.contactEmail,
        logo: formData.logo,
        favicon: formData.favicon
      })

      // Update favicon in DOM
      if (formData.favicon) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
        link.type = 'image/x-icon'
        link.rel = 'shortcut icon'
        link.href = formData.favicon
        document.head.appendChild(link)
      }

      // Update document title
      document.title = formData.siteName

      toast.success('Settings saved successfully!')
    } catch (err) {
      console.error('Save error:', err)
      toast.error('Failed to save settings')
    }
    setLoading(false)
  }

  return (
    <>
      <Helmet><title>Settings - Admin - {formData.siteName}</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Site Settings</h1>
      
      <div className="space-y-8 max-w-3xl">
        {/* Branding Section */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Image className="w-6 h-6 text-primary-500" />
            <h2 className="text-lg font-bold">Branding</h2>
          </div>
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Site Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-xl flex items-center justify-center overflow-hidden bg-dark-50 dark:bg-dark-800">
                  {formData.logo && formData.logo.startsWith('data:image') ? (
                    <img src={formData.logo} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-dark-400" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="btn-outline text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload Logo
                  </button>
                  {formData.logo && formData.logo.startsWith('data:image') && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, logo: null }))}
                      className="btn text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4 mr-2" /> Remove
                    </button>
                  )}
                  <p className="text-xs text-dark-500">Recommended: 200x60px, PNG/SVG</p>
                </div>
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Favicon</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-xl flex items-center justify-center overflow-hidden bg-dark-50 dark:bg-dark-800">
                  {formData.favicon && formData.favicon.startsWith('data:image') ? (
                    <img src={formData.favicon} alt="" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Upload className="w-5 h-5 text-dark-400" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*,.ico"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'favicon')}
                  />
                  <button
                    onClick={() => faviconInputRef.current?.click()}
                    className="btn-outline text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload Favicon
                  </button>
                  {formData.favicon && formData.favicon.startsWith('data:image') && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, favicon: null }))}
                      className="btn text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4 mr-2" /> Remove
                    </button>
                  )}
                  <p className="text-xs text-dark-500">Recommended: 32x32px, ICO/PNG</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Section */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary-500" />
            <h2 className="text-lg font-bold">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input 
                type="text" 
                value={formData.siteName}
                onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                className="input" 
                placeholder="Your Site Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site Tagline</label>
              <input 
                type="text" 
                value={formData.siteTagline}
                onChange={(e) => setFormData(prev => ({ ...prev, siteTagline: e.target.value }))}
                className="input" 
                placeholder="Your site tagline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input 
                type="email" 
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="input" 
                placeholder="support@example.com"
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-primary-500" />
            <h2 className="text-lg font-bold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme Style</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setThemeStyle('gradient')}
                  className={`p-4 rounded-xl border-2 transition-all ${themeStyle === 'gradient' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                  <div className="h-8 rounded bg-gradient-to-r from-primary-500 to-secondary-500 mb-2" />
                  <p className="font-medium">Gradient</p>
                </button>
                <button onClick={() => setThemeStyle('flat')}
                  className={`p-4 rounded-xl border-2 transition-all ${themeStyle === 'flat' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                  <div className="h-8 rounded bg-primary-500 mb-2" />
                  <p className="font-medium">Flat</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary-500" />
            <h2 className="text-lg font-bold">Billing</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Currency</label>
              <select className="input">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>BDT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Money Back Days</label>
              <input type="number" defaultValue="45" className="input" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary">
          <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </>
  )
}
