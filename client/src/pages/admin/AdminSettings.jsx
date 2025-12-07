import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Save, Palette, Globe, CreditCard, Mail } from 'lucide-react'
import { useThemeStore } from '../../store/useStore'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { themeStyle, setThemeStyle } = useThemeStore()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    toast.success('Settings saved!')
    setLoading(false)
  }

  return (
    <>
      <Helmet><title>Settings - Admin - Magnetic Clouds</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8 max-w-3xl">
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

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary-500" />
            <h2 className="text-lg font-bold">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input type="text" defaultValue="Magnetic Clouds" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site Tagline</label>
              <input type="text" defaultValue="Premium Web Hosting from Bangladesh" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input type="email" defaultValue="support@magneticclouds.com" className="input" />
            </div>
          </div>
        </div>

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
          <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </>
  )
}
