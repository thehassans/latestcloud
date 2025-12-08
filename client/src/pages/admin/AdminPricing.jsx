import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { DollarSign, Save, RotateCcw, Server, Cloud, Database, Shield, Mail, Archive, Globe } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const serviceIcons = {
  hosting: Server,
  vps: Server,
  cloud: Cloud,
  dedicated: Database,
  ssl: Shield,
  email: Mail,
  backup: Archive
}

const serviceLabels = {
  hosting: 'Web Hosting',
  vps: 'VPS Servers',
  cloud: 'Cloud Servers',
  dedicated: 'Dedicated Servers',
  ssl: 'SSL Certificates',
  email: 'Professional Email',
  backup: 'Website Backup'
}

export default function AdminPricing() {
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeService, setActiveService] = useState('hosting')

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      const res = await api.get('/api/pricing')
      setPricing(res.data)
    } catch (error) {
      toast.error('Failed to load pricing')
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (service, planIndex, value) => {
    const newPricing = { ...pricing }
    newPricing[service][planIndex].price = parseFloat(value) || 0
    setPricing(newPricing)
  }

  const handleNameChange = (service, planIndex, value) => {
    const newPricing = { ...pricing }
    newPricing[service][planIndex].name = value
    setPricing(newPricing)
  }

  const handleFeatureChange = (service, planIndex, featureIndex, value) => {
    const newPricing = { ...pricing }
    newPricing[service][planIndex].features[featureIndex] = value
    setPricing(newPricing)
  }

  const addFeature = (service, planIndex) => {
    const newPricing = { ...pricing }
    newPricing[service][planIndex].features.push('New Feature')
    setPricing(newPricing)
  }

  const removeFeature = (service, planIndex, featureIndex) => {
    const newPricing = { ...pricing }
    newPricing[service][planIndex].features.splice(featureIndex, 1)
    setPricing(newPricing)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/api/pricing', { pricing })
      toast.success('Pricing saved successfully!')
    } catch (error) {
      toast.error('Failed to save pricing')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset all pricing to defaults?')) return
    try {
      const res = await api.post('/api/pricing/reset')
      setPricing(res.data.pricing)
      toast.success('Pricing reset to defaults')
    } catch (error) {
      toast.error('Failed to reset pricing')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Pricing Management - Admin</title></Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-primary-500" />
              Pricing Management
            </h1>
            <p className="text-dark-500 mt-1">Manage pricing for all services</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="btn bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-200 hover:bg-dark-200 dark:hover:bg-dark-600">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-dark-100 dark:bg-dark-800 rounded-xl">
          {Object.keys(serviceLabels).map((service) => {
            const Icon = serviceIcons[service]
            return (
              <button
                key={service}
                onClick={() => setActiveService(service)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                  activeService === service
                    ? "bg-white dark:bg-dark-700 text-primary-600 shadow-sm"
                    : "text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                {serviceLabels[service]}
              </button>
            )
          })}
        </div>

        {/* Pricing Cards */}
        {pricing && pricing[activeService] && (
          <div className="grid md:grid-cols-3 gap-6">
            {pricing[activeService].map((plan, planIndex) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: planIndex * 0.1 }}
                className={clsx(
                  "p-6 rounded-2xl border-2",
                  plan.popular
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                    : "border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800"
                )}
              >
                {plan.popular && (
                  <span className="inline-block mb-3 px-2 py-1 bg-primary-500 text-white text-xs font-bold rounded">
                    POPULAR
                  </span>
                )}
                
                {/* Plan Name */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-dark-500 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handleNameChange(activeService, planIndex, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-dark-500 mb-1">Price ($/month)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(activeService, planIndex, e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-2xl font-bold"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-xs font-medium text-dark-500 mb-2">Features</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(activeService, planIndex, featureIndex, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm rounded border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
                        />
                        <button
                          onClick={() => removeFeature(activeService, planIndex, featureIndex)}
                          className="px-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addFeature(activeService, planIndex)}
                    className="mt-2 text-sm text-primary-500 hover:text-primary-600"
                  >
                    + Add Feature
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
