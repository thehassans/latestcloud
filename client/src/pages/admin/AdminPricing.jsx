import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { DollarSign, Plus, Trash2, Save, Server, Shield, Cloud, HardDrive } from 'lucide-react'
import { settingsAPI } from '../../lib/api'
import toast from 'react-hot-toast'

const categories = [
  { id: 'hosting', name: 'Web Hosting', icon: Server },
  { id: 'ssl', name: 'SSL Certificates', icon: Shield },
  { id: 'vps', name: 'VPS Servers', icon: Cloud },
  { id: 'dedicated', name: 'Dedicated Servers', icon: HardDrive },
]

const defaultPlans = {
  hosting: [
    { name: 'Starter Hosting', price: 2.99, features: ['1 Website', '10 GB SSD Storage', 'Free SSL Certificate'], color: 'from-blue-500 to-cyan-500' }
  ],
  ssl: [
    { name: 'Domain Validation', description: 'Basic encryption', price: 9.99, features: ['Single Domain', '256-bit Encryption'], color: 'from-green-500 to-emerald-500' }
  ],
  vps: [
    { name: 'VPS Starter', price: 5.99, cpu: '1 vCPU', ram: '1 GB', storage: '25 GB SSD', bandwidth: '1 TB', color: 'from-blue-500 to-cyan-500' }
  ],
  dedicated: [
    { name: 'Entry Server', price: 79.99, cpu: 'Intel Xeon E3', ram: '16 GB DDR4', storage: '500 GB SSD', bandwidth: '10 TB', color: 'from-blue-500 to-cyan-500' }
  ]
}

export default function AdminPricing() {
  const [activeCategory, setActiveCategory] = useState('hosting')
  const [pricing, setPricing] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPricing()
  }, [])

  const loadPricing = async () => {
    try {
      const res = await settingsAPI.getPricing()
      setPricing(res.data.pricing)
    } catch (err) {
      console.error('Failed to load pricing:', err)
      toast.error('Failed to load pricing')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.updatePricing(activeCategory, pricing[activeCategory])
      toast.success('Pricing saved successfully!')
    } catch (err) {
      console.error('Failed to save pricing:', err)
      toast.error('Failed to save pricing')
    } finally {
      setSaving(false)
    }
  }

  const addPlan = () => {
    const newPlan = activeCategory === 'hosting' || activeCategory === 'ssl' 
      ? { name: 'New Plan', price: 0, features: [], color: 'from-blue-500 to-cyan-500' }
      : { name: 'New Plan', price: 0, cpu: '', ram: '', storage: '', bandwidth: '', color: 'from-blue-500 to-cyan-500' }
    
    if (activeCategory === 'ssl') {
      newPlan.description = ''
    }
    
    setPricing(prev => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), newPlan]
    }))
  }

  const removePlan = (index) => {
    setPricing(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].filter((_, i) => i !== index)
    }))
  }

  const updatePlan = (index, field, value) => {
    setPricing(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((plan, i) => 
        i === index ? { ...plan, [field]: value } : plan
      )
    }))
  }

  const updateFeature = (planIndex, featureIndex, value) => {
    setPricing(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((plan, i) => 
        i === planIndex ? {
          ...plan,
          features: plan.features.map((f, fi) => fi === featureIndex ? value : f)
        } : plan
      )
    }))
  }

  const addFeature = (planIndex) => {
    setPricing(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((plan, i) => 
        i === planIndex ? { ...plan, features: [...(plan.features || []), 'New Feature'] } : plan
      )
    }))
  }

  const removeFeature = (planIndex, featureIndex) => {
    setPricing(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((plan, i) => 
        i === planIndex ? { ...plan, features: plan.features.filter((_, fi) => fi !== featureIndex) } : plan
      )
    }))
  }

  const plans = pricing[activeCategory] || []

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <>
      <Helmet><title>Pricing Management - Admin - Magnetic Clouds</title></Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-primary-500" />
            Pricing Management
          </h1>
          <p className="text-dark-500 mt-1">Manage prices for all services</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Plans List */}
      <div className="space-y-6">
        {plans.map((plan, index) => (
          <div key={index} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">Plan {index + 1}</h3>
              <button 
                onClick={() => removePlan(index)}
                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan Name</label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => updatePlan(index, 'name', e.target.value)}
                  className="input"
                  placeholder="Plan Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (USD/month)</label>
                <input
                  type="number"
                  step="0.01"
                  value={plan.price}
                  onChange={(e) => updatePlan(index, 'price', parseFloat(e.target.value) || 0)}
                  className="input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Popular?</label>
                <select
                  value={plan.popular ? 'yes' : 'no'}
                  onChange={(e) => updatePlan(index, 'popular', e.target.value === 'yes')}
                  className="input"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            {/* VPS/Dedicated specific fields */}
            {(activeCategory === 'vps' || activeCategory === 'dedicated') && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">CPU</label>
                  <input
                    type="text"
                    value={plan.cpu || ''}
                    onChange={(e) => updatePlan(index, 'cpu', e.target.value)}
                    className="input"
                    placeholder="e.g., 2 vCPU"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">RAM</label>
                  <input
                    type="text"
                    value={plan.ram || ''}
                    onChange={(e) => updatePlan(index, 'ram', e.target.value)}
                    className="input"
                    placeholder="e.g., 4 GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Storage</label>
                  <input
                    type="text"
                    value={plan.storage || ''}
                    onChange={(e) => updatePlan(index, 'storage', e.target.value)}
                    className="input"
                    placeholder="e.g., 80 GB SSD"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bandwidth</label>
                  <input
                    type="text"
                    value={plan.bandwidth || ''}
                    onChange={(e) => updatePlan(index, 'bandwidth', e.target.value)}
                    className="input"
                    placeholder="e.g., 3 TB"
                  />
                </div>
              </div>
            )}

            {/* SSL description */}
            {activeCategory === 'ssl' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={plan.description || ''}
                  onChange={(e) => updatePlan(index, 'description', e.target.value)}
                  className="input"
                  placeholder="Brief description"
                />
              </div>
            )}

            {/* Features (for hosting and SSL) */}
            {(activeCategory === 'hosting' || activeCategory === 'ssl') && (
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="space-y-2">
                  {(plan.features || []).map((feature, fi) => (
                    <div key={fi} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, fi, e.target.value)}
                        className="input flex-1"
                        placeholder="Feature"
                      />
                      <button
                        onClick={() => removeFeature(index, fi)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addFeature(index)}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addPlan}
          className="w-full py-4 border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-xl text-dark-500 hover:text-primary-500 hover:border-primary-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Plan
        </button>
      </div>
    </>
  )
}
