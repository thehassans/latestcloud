import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { DollarSign, Plus, Trash2, Save, Server, Shield, Cloud, HardDrive, Bot, MessageCircle } from 'lucide-react'
import { settingsAPI } from '../../lib/api'
import toast from 'react-hot-toast'

const categories = [
  { id: 'hosting', name: 'Web Hosting', icon: Server },
  { id: 'ssl', name: 'SSL Certificates', icon: Shield },
  { id: 'vps', name: 'VPS Servers', icon: Cloud },
  { id: 'bdserver', name: 'BD Server', icon: Server },
  { id: 'cloud', name: 'Cloud Server', icon: Cloud },
  { id: 'dedicated', name: 'Dedicated Servers', icon: HardDrive },
  { id: 'nobot', name: 'NoBot AI', icon: Bot },
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
  bdserver: [
    { name: 'BD Starter', price: 29.99, cpu: '2 vCPU', ram: '4 GB', storage: '80 GB NVMe', bandwidth: '2 TB', latency: '<5ms', features: ['Ultra Low Latency', 'Local Support', 'Daily Backups', 'DDoS Protection'], color: 'from-green-500 to-emerald-500' },
    { name: 'BD Pro', price: 59.99, cpu: '4 vCPU', ram: '8 GB', storage: '160 GB NVMe', bandwidth: '5 TB', latency: '<3ms', features: ['Ultra Low Latency', 'Dedicated IP', 'Local Support', 'Premium DDoS'], color: 'from-green-500 to-emerald-500', popular: true },
    { name: 'BD Enterprise', price: 119.99, cpu: '8 vCPU', ram: '16 GB', storage: '320 GB NVMe', bandwidth: '10 TB', latency: '<1ms', features: ['Lowest Latency', 'Multiple IPs', 'Hourly Backups', 'SLA 99.99%'], color: 'from-green-500 to-emerald-500' }
  ],
  cloud: [
    { name: 'Cloud Starter', price: 19.99, cpu: '2 vCPU', ram: '4 GB', storage: '80 GB NVMe', bandwidth: '4 TB', features: ['Auto Scaling', 'Load Balancer', 'Daily Backups', '24/7 Support'], color: 'from-cyan-500 to-blue-500' },
    { name: 'Cloud Pro', price: 49.99, cpu: '4 vCPU', ram: '8 GB', storage: '160 GB NVMe', bandwidth: '8 TB', features: ['Auto Scaling', 'Load Balancer', 'Daily Backups', 'DDoS Protection', 'Priority Support'], color: 'from-cyan-500 to-blue-500', popular: true },
    { name: 'Cloud Business', price: 99.99, cpu: '8 vCPU', ram: '16 GB', storage: '320 GB NVMe', bandwidth: '16 TB', features: ['Auto Scaling', 'Load Balancer', 'Hourly Backups', 'DDoS Protection', 'Dedicated Support'], color: 'from-cyan-500 to-blue-500' }
  ],
  dedicated: [
    { name: 'Entry Server', price: 79.99, cpu: 'Intel Xeon E3', ram: '16 GB DDR4', storage: '500 GB SSD', bandwidth: '10 TB', color: 'from-orange-500 to-red-500' },
    { name: 'Professional', price: 199.99, cpu: 'Intel Xeon E-2288G', ram: '64 GB DDR4', storage: '2 TB NVMe', bandwidth: '20 TB', features: ['Full Root Access', 'IPMI Access', 'Advanced DDoS', 'Priority Support', 'Hardware RAID'], color: 'from-orange-500 to-red-500', popular: true },
    { name: 'Enterprise', price: 399.99, cpu: 'Dual Xeon Gold', ram: '128 GB DDR4', storage: '4 TB RAID', bandwidth: 'Unlimited', features: ['Full Root Access', 'IPMI Access', 'Premium DDoS', 'Dedicated Support', 'Hardware RAID', 'SLA 99.99%'], color: 'from-orange-500 to-red-500' }
  ],
  nobot: [
    { name: 'Starter', description: 'Perfect for small businesses', price: 29, channel_limit: 1, messages: '5,000', languages: '3', features: ['1 Channel (Any One)', '5,000 messages/mo', '3 languages', 'Basic training'], color: 'from-blue-500 to-cyan-500' },
    { name: 'Professional', description: 'Best for growing teams', price: 79, channel_limit: 2, messages: '25,000', languages: '10', features: ['2 Channels (Any Two)', '25,000 messages/mo', '10 languages', 'Advanced training', 'Advanced analytics', 'Priority support'], color: 'from-purple-500 to-pink-500', popular: true },
    { name: 'Enterprise', description: 'Complete AI solution', price: 199, channel_limit: 5, messages: 'Unlimited', languages: 'All', features: ['All Channels', 'Unlimited messages/mo', 'All languages', 'Custom training', 'Advanced analytics', 'Priority support', 'Dedicated manager'], color: 'from-primary-500 to-secondary-500' }
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
      const data = res.data?.pricing || {}
      // Ensure all categories have data
      setPricing({
        hosting: data.hosting || defaultPlans.hosting,
        ssl: data.ssl || defaultPlans.ssl,
        vps: data.vps || defaultPlans.vps,
        bdserver: data.bdserver || defaultPlans.bdserver,
        cloud: data.cloud || defaultPlans.cloud,
        dedicated: data.dedicated || defaultPlans.dedicated,
        nobot: data.nobot || defaultPlans.nobot,
      })
    } catch (err) {
      console.error('Failed to load pricing:', err)
      toast.error('Failed to load pricing')
      // Set defaults on error
      setPricing({
        hosting: defaultPlans.hosting,
        ssl: defaultPlans.ssl,
        vps: defaultPlans.vps,
        bdserver: defaultPlans.bdserver,
        cloud: defaultPlans.cloud,
        dedicated: defaultPlans.dedicated,
        nobot: defaultPlans.nobot,
      })
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
    let newPlan;
    if (activeCategory === 'nobot') {
      newPlan = { name: 'New Plan', description: '', price: 0, channel_limit: 1, messages: '5,000', languages: '3', features: [], color: 'from-blue-500 to-cyan-500' }
    } else if (activeCategory === 'hosting' || activeCategory === 'ssl') {
      newPlan = { name: 'New Plan', price: 0, features: [], color: 'from-blue-500 to-cyan-500' }
    } else if (activeCategory === 'bdserver') {
      newPlan = { name: 'New Plan', price: 0, cpu: '', ram: '', storage: '', bandwidth: '', latency: '', features: [], color: 'from-green-500 to-emerald-500' }
    } else if (activeCategory === 'cloud') {
      newPlan = { name: 'New Plan', price: 0, cpu: '', ram: '', storage: '', bandwidth: '', features: [], color: 'from-cyan-500 to-blue-500' }
    } else if (activeCategory === 'dedicated') {
      newPlan = { name: 'New Plan', price: 0, cpu: '', ram: '', storage: '', bandwidth: '', features: [], color: 'from-orange-500 to-red-500' }
    } else {
      newPlan = { name: 'New Plan', price: 0, cpu: '', ram: '', storage: '', bandwidth: '', color: 'from-blue-500 to-cyan-500' }
    }
    
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

            {/* Server specific fields (VPS, BD Server, Cloud, Dedicated) */}
            {(activeCategory === 'vps' || activeCategory === 'bdserver' || activeCategory === 'cloud' || activeCategory === 'dedicated') && (
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

            {/* BD Server specific latency field */}
            {activeCategory === 'bdserver' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latency</label>
                  <input
                    type="text"
                    value={plan.latency || ''}
                    onChange={(e) => updatePlan(index, 'latency', e.target.value)}
                    className="input"
                    placeholder="e.g., <5ms"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Backup</label>
                  <input
                    type="text"
                    value={plan.backup || ''}
                    onChange={(e) => updatePlan(index, 'backup', e.target.value)}
                    className="input"
                    placeholder="e.g., Daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Support Level</label>
                  <input
                    type="text"
                    value={plan.support || ''}
                    onChange={(e) => updatePlan(index, 'support', e.target.value)}
                    className="input"
                    placeholder="e.g., Priority"
                  />
                </div>
              </div>
            )}

            {/* Cloud Server specific fields */}
            {activeCategory === 'cloud' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Backup</label>
                  <input
                    type="text"
                    value={plan.backup || ''}
                    onChange={(e) => updatePlan(index, 'backup', e.target.value)}
                    className="input"
                    placeholder="e.g., Daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Support Level</label>
                  <input
                    type="text"
                    value={plan.support || ''}
                    onChange={(e) => updatePlan(index, 'support', e.target.value)}
                    className="input"
                    placeholder="e.g., Standard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Auto Scale</label>
                  <select
                    value={plan.autoScale ? 'yes' : 'no'}
                    onChange={(e) => updatePlan(index, 'autoScale', e.target.value === 'yes')}
                    className="input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Load Balancer</label>
                  <select
                    value={plan.loadBalancer ? 'yes' : 'no'}
                    onChange={(e) => updatePlan(index, 'loadBalancer', e.target.value === 'yes')}
                    className="input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dedicated Server specific fields */}
            {activeCategory === 'dedicated' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Support Level</label>
                  <input
                    type="text"
                    value={plan.support || ''}
                    onChange={(e) => updatePlan(index, 'support', e.target.value)}
                    className="input"
                    placeholder="e.g., Standard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Root Access</label>
                  <select
                    value={plan.rootAccess ? 'yes' : 'no'}
                    onChange={(e) => updatePlan(index, 'rootAccess', e.target.value === 'yes')}
                    className="input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">IPMI Access</label>
                  <select
                    value={plan.ipmi ? 'yes' : 'no'}
                    onChange={(e) => updatePlan(index, 'ipmi', e.target.value === 'yes')}
                    className="input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hardware RAID</label>
                  <select
                    value={plan.raid ? 'yes' : 'no'}
                    onChange={(e) => updatePlan(index, 'raid', e.target.value === 'yes')}
                    className="input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            )}

            {/* DDoS and SLA for server types */}
            {(activeCategory === 'bdserver' || activeCategory === 'cloud' || activeCategory === 'dedicated') && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">DDoS Protection</label>
                  <select
                    value={plan.ddos ? 'yes' : 'no'}
                    onChange={(e) => updatePlan(index, 'ddos', e.target.value === 'yes')}
                    className="input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SLA 99.99%</label>
                  <select
                    value={plan.sla ? 'yes' : 'no'}
                    onChange={(e) => updatePlan(index, 'sla', e.target.value === 'yes')}
                    className="input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {activeCategory === 'bdserver' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Dedicated IP</label>
                    <select
                      value={plan.dedicatedIp ? 'yes' : 'no'}
                      onChange={(e) => updatePlan(index, 'dedicatedIp', e.target.value === 'yes')}
                      className="input"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* SSL/NoBot description */}
            {(activeCategory === 'ssl' || activeCategory === 'nobot') && (
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

            {/* NoBot specific fields */}
            {activeCategory === 'nobot' && (
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Channel Limit</label>
                  <select
                    value={plan.channel_limit || 1}
                    onChange={(e) => updatePlan(index, 'channel_limit', parseInt(e.target.value))}
                    className="input"
                  >
                    <option value={1}>1 Channel (Any One)</option>
                    <option value={2}>2 Channels (Any Two)</option>
                    <option value={3}>3 Channels</option>
                    <option value={5}>All Channels (Unlimited)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Messages/month</label>
                  <input
                    type="text"
                    value={plan.messages || '5,000'}
                    onChange={(e) => updatePlan(index, 'messages', e.target.value)}
                    className="input"
                    placeholder="e.g., 5,000 or Unlimited"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Languages</label>
                  <input
                    type="text"
                    value={plan.languages || '3'}
                    onChange={(e) => updatePlan(index, 'languages', e.target.value)}
                    className="input"
                    placeholder="e.g., 3 or All"
                  />
                </div>
              </div>
            )}

            {/* Features (for hosting, SSL, and NoBot) */}
            {(activeCategory === 'hosting' || activeCategory === 'ssl' || activeCategory === 'nobot') && (
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
