import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Cloud as CloudIcon, CheckCircle, ArrowRight, Cpu, HardDrive, Gauge, Globe, Shield, Zap, Headphones, Lock, RefreshCw, Check, X, Settings, Plus, Minus } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import { settingsAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const cloudPlans = [
  {
    name: 'Starter',
    price: 19.99,
    cpu: '2 vCPU',
    ram: '4 GB',
    storage: '80 GB NVMe',
    bandwidth: '4 TB',
    autoScale: true,
    loadBalancer: true,
    backup: 'Daily',
    ddos: false,
    support: 'Standard',
    features: ['Auto Scaling', 'Load Balancer', 'Daily Backups', '24/7 Support']
  },
  {
    name: 'Pro',
    price: 49.99,
    cpu: '4 vCPU',
    ram: '8 GB',
    storage: '160 GB NVMe',
    bandwidth: '8 TB',
    autoScale: true,
    loadBalancer: true,
    backup: 'Daily',
    ddos: true,
    support: 'Priority',
    features: ['Auto Scaling', 'Load Balancer', 'Daily Backups', 'DDoS Protection', 'Priority Support'],
    popular: true
  },
  {
    name: 'Business',
    price: 99.99,
    cpu: '8 vCPU',
    ram: '16 GB',
    storage: '320 GB NVMe',
    bandwidth: '16 TB',
    autoScale: true,
    loadBalancer: true,
    backup: 'Hourly',
    ddos: true,
    sla: true,
    support: 'Dedicated',
    features: ['Auto Scaling', 'Load Balancer', 'Hourly Backups', 'DDoS Protection', 'Dedicated Support']
  }
]

// Spec rows for comparison table
const specRows = [
  { key: 'cpu', label: 'vCPU Cores', icon: Cpu },
  { key: 'ram', label: 'RAM Memory', icon: Gauge },
  { key: 'storage', label: 'NVMe Storage', icon: HardDrive },
  { key: 'bandwidth', label: 'Bandwidth', icon: Globe },
  { key: 'backup', label: 'Backup Frequency', icon: RefreshCw },
  { key: 'support', label: 'Support Level', icon: Headphones },
]

const features = [
  { icon: RefreshCw, title: 'Auto Scaling', desc: 'Automatically scale resources based on traffic demands', color: 'from-cyan-500 to-blue-500' },
  { icon: Shield, title: 'DDoS Protection', desc: 'Enterprise-grade protection up to 10Tbps attacks', color: 'from-green-500 to-emerald-500' },
  { icon: HardDrive, title: 'NVMe SSD Storage', desc: 'Up to 10x faster than traditional SSDs', color: 'from-purple-500 to-pink-500' },
  { icon: Zap, title: 'Instant Deployment', desc: 'Deploy your cloud server in under 60 seconds', color: 'from-yellow-500 to-orange-500' },
  { icon: Globe, title: 'Global Network', desc: 'Deploy across 10+ worldwide locations', color: 'from-indigo-500 to-violet-500' },
  { icon: Headphones, title: '24/7 Expert Support', desc: 'Average response time under 5 minutes', color: 'from-rose-500 to-red-500' },
]

export default function Cloud() {
  const { format } = useCurrencyStore()
  const { themeStyle, theme } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'
  const isDark = theme === 'dark'

  // Custom Cloud configurator state
  const [customConfig, setCustomConfig] = useState({
    cpu: 2,
    ram: 4,
    storage: 80,
    bandwidth: 4,
    autoScale: true,
    loadBalancer: true,
    ddos: false
  })

  const { data: customPricing } = useQuery({
    queryKey: ['custom-cloud-pricing'],
    queryFn: () => settingsAPI.getCustomVPSPricing().then(res => res.data.pricing)
  })

  // Cloud pricing (slightly higher than VPS due to auto-scaling features)
  const pricing = customPricing ? {
    ...customPricing,
    cpu_price_per_core: customPricing.cpu_price_per_core * 1.3,
    ram_price_per_gb: customPricing.ram_price_per_gb * 1.3,
    base_fee: 3.00,
    auto_scale_price: 5.00,
    load_balancer_price: 5.00
  } : {
    cpu_price_per_core: 3.90,
    ram_price_per_gb: 1.95,
    storage_price_per_gb: 0.05,
    bandwidth_price_per_tb: 1.00,
    min_cpu: 1, min_ram: 2, min_storage: 40, min_bandwidth: 1,
    max_cpu: 32, max_ram: 128, max_storage: 2000, max_bandwidth: 100,
    cpu_step: 1, ram_step: 1, storage_step: 10, bandwidth_step: 1,
    base_fee: 3.00,
    ddos_protection_price: 5.00,
    auto_scale_price: 5.00,
    load_balancer_price: 5.00
  }

  const calculateCustomPrice = () => {
    let total = pricing.base_fee
    total += customConfig.cpu * pricing.cpu_price_per_core
    total += customConfig.ram * pricing.ram_price_per_gb
    total += customConfig.storage * pricing.storage_price_per_gb
    total += customConfig.bandwidth * pricing.bandwidth_price_per_tb
    if (customConfig.autoScale) total += pricing.auto_scale_price
    if (customConfig.loadBalancer) total += pricing.load_balancer_price
    if (customConfig.ddos) total += pricing.ddos_protection_price
    return total
  }

  const handleAddCustomToCart = () => {
    const price = calculateCustomPrice()
    addItem({
      id: `custom-cloud-${Date.now()}`,
      type: 'product',
      name: `Custom Cloud (${customConfig.cpu} vCPU, ${customConfig.ram}GB RAM, ${customConfig.storage}GB NVMe)`,
      price: price,
      billingCycle: 'monthly',
      product_type: 'cloud',
      customConfig: customConfig
    })
    toast.success('Custom Cloud Server added to cart!')
  }

  const updateConfig = (key, value) => {
    setCustomConfig(prev => ({ ...prev, [key]: value }))
  }

  const incrementConfig = (key, step, max) => {
    setCustomConfig(prev => ({
      ...prev,
      [key]: Math.min(prev[key] + step, max)
    }))
  }

  const decrementConfig = (key, step, min) => {
    setCustomConfig(prev => ({
      ...prev,
      [key]: Math.max(prev[key] - step, min)
    }))
  }

  const handleAddToCart = (plan) => {
    addItem({
      id: `cloud-${plan.name.toLowerCase().replace(/\s/g, '-')}`,
      type: 'product',
      name: `Cloud ${plan.name}`,
      price: plan.price,
      billingCycle: 'monthly',
      product_type: 'cloud'
    })
    toast.success(`Cloud ${plan.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>Cloud Servers - Magnetic Clouds</title>
        <meta name="description" content="Auto-scaling cloud infrastructure with 99.99% uptime SLA and global availability." />
      </Helmet>

      {/* Hero Section */}
      <section className={clsx(
        "relative overflow-hidden py-20",
        isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-cyan-50 via-white to-blue-50"
      )}>
        {/* Animated background */}
        <div className="absolute inset-0">
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          ) : (
            <>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm",
                isDark 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400" 
                  : "bg-cyan-100 border border-cyan-200 text-cyan-600"
              )}
            >
              <CloudIcon className="w-4 h-4" />
              Cloud Infrastructure
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={clsx(
                "text-4xl md:text-5xl lg:text-6xl font-bold font-display",
                isDark ? "text-white" : "text-dark-900"
              )}
            >
              Scalable{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Cloud Servers
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={clsx("mt-6 text-lg", isDark ? "text-dark-300" : "text-dark-600")}
            >
              Auto-scaling cloud infrastructure with 99.99% uptime SLA and global availability.
            </motion.p>
            
            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-8"
            >
              {[
                { value: '99.99%', label: 'Uptime SLA' },
                { value: 'Auto', label: 'Scaling' },
                { value: '10+', label: 'Locations' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{stat.value}</p>
                  <p className={clsx("text-sm", isDark ? "text-dark-400" : "text-dark-500")}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Row-by-Row Pricing Table */}
      <section className={clsx("py-16", isDark ? "bg-dark-900" : "bg-white")}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={clsx(
              "rounded-3xl overflow-hidden border",
              isDark ? "bg-dark-800/50 border-dark-700" : "bg-white border-gray-200 shadow-xl"
            )}
          >
            {/* Table Header - Plan Names & Prices */}
            <div className={clsx(
              "grid grid-cols-4 border-b",
              isDark ? "border-dark-700" : "border-gray-200"
            )}>
              <div className={clsx(
                "p-6 font-semibold",
                isDark ? "bg-dark-800 text-white" : "bg-gray-50 text-dark-900"
              )}>
                <CloudIcon className="w-6 h-6 mb-2 text-cyan-500" />
                Compare Plans
              </div>
              {cloudPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={clsx(
                    "p-6 text-center relative",
                    plan.popular 
                      ? "bg-gradient-to-b from-cyan-500/10 to-blue-500/5" 
                      : isDark ? "bg-dark-800/50" : "bg-gray-50/50"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-b-lg">
                      POPULAR
                    </div>
                  )}
                  <h3 className={clsx(
                    "text-lg font-bold mb-2",
                    isDark ? "text-white" : "text-dark-900"
                  )}>{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={clsx(
                      "text-3xl font-bold",
                      plan.popular ? "text-cyan-500" : isDark ? "text-white" : "text-dark-900"
                    )}>{format(plan.price)}</span>
                    <span className={isDark ? "text-dark-400" : "text-dark-500"}>/mo</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec Rows */}
            {specRows.map((spec, rowIndex) => (
              <div
                key={spec.key}
                className={clsx(
                  "grid grid-cols-4 border-b",
                  isDark ? "border-dark-700" : "border-gray-100",
                  rowIndex % 2 === 0 
                    ? isDark ? "bg-dark-800/30" : "bg-gray-50/50"
                    : ""
                )}
              >
                <div className={clsx(
                  "p-4 flex items-center gap-3",
                  isDark ? "text-dark-300" : "text-dark-600"
                )}>
                  <spec.icon className="w-5 h-5 text-cyan-500" />
                  <span className="font-medium">{spec.label}</span>
                </div>
                {cloudPlans.map((plan) => (
                  <div
                    key={`${plan.name}-${spec.key}`}
                    className={clsx(
                      "p-4 text-center flex items-center justify-center",
                      plan.popular ? "bg-cyan-500/5" : "",
                      isDark ? "text-white" : "text-dark-800"
                    )}
                  >
                    <span className="font-medium">{plan[spec.key] || '-'}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Boolean Features */}
            {[
              { key: 'autoScale', label: 'Auto Scaling' },
              { key: 'loadBalancer', label: 'Load Balancer' },
              { key: 'ddos', label: 'DDoS Protection' },
              { key: 'sla', label: 'SLA 99.99%' },
            ].map((feature, rowIndex) => (
              <div
                key={feature.key}
                className={clsx(
                  "grid grid-cols-4 border-b",
                  isDark ? "border-dark-700" : "border-gray-100",
                  (specRows.length + rowIndex) % 2 === 0 
                    ? isDark ? "bg-dark-800/30" : "bg-gray-50/50"
                    : ""
                )}
              >
                <div className={clsx(
                  "p-4 flex items-center gap-3",
                  isDark ? "text-dark-300" : "text-dark-600"
                )}>
                  <Shield className="w-5 h-5 text-cyan-500" />
                  <span className="font-medium">{feature.label}</span>
                </div>
                {cloudPlans.map((plan) => (
                  <div
                    key={`${plan.name}-${feature.key}`}
                    className={clsx(
                      "p-4 text-center flex items-center justify-center",
                      plan.popular ? "bg-cyan-500/5" : ""
                    )}
                  >
                    {plan[feature.key] ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-dark-400" />
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Action Row */}
            <div className={clsx(
              "grid grid-cols-4",
              isDark ? "bg-dark-800" : "bg-gray-50"
            )}>
              <div className="p-6"></div>
              {cloudPlans.map((plan) => (
                <div
                  key={`action-${plan.name}`}
                  className={clsx(
                    "p-6 text-center",
                    plan.popular ? "bg-cyan-500/5" : ""
                  )}
                >
                  <button
                    onClick={() => handleAddToCart(plan)}
                    className={clsx(
                      "w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30"
                        : isDark 
                          ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" 
                          : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                    )}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={clsx("mt-8 flex flex-wrap justify-center items-center gap-6 text-sm", isDark ? "text-dark-400" : "text-dark-600")}
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-500" />
              Auto Scaling
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              DDoS Protection
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-blue-500" />
              24/7 Expert Support
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Cloud Configurator */}
      <section className="py-24 bg-dark-50 dark:bg-dark-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 rounded-full text-sm font-medium mb-6"
            >
              <Settings className="w-4 h-4" />
              Build Your Own
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold font-display"
            >
              Customize Your{' '}
              <span className="text-gradient">Cloud Server</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Configure your perfect cloud infrastructure with exactly the resources you need
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 border-2 border-cyan-500/20"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Configuration Controls */}
              <div className="lg:col-span-2 space-y-6">
                {/* CPU */}
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-cyan-500" />
                      <span className="font-medium">vCPU Cores</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.cpu_price_per_core?.toFixed(2) || '3.90'}/core</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('cpu', pricing.cpu_step || 1, pricing.min_cpu || 1)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-cyan-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_cpu || 1}
                        max={pricing.max_cpu || 32}
                        step={pricing.cpu_step || 1}
                        value={customConfig.cpu}
                        onChange={(e) => updateConfig('cpu', parseInt(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('cpu', pricing.cpu_step || 1, pricing.max_cpu || 32)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-cyan-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-cyan-600">{customConfig.cpu}</span>
                      <span className="text-sm text-dark-500 ml-1">cores</span>
                    </div>
                  </div>
                </div>

                {/* RAM */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">RAM Memory</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.ram_price_per_gb?.toFixed(2) || '1.95'}/GB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('ram', pricing.ram_step || 1, pricing.min_ram || 2)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-blue-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_ram || 2}
                        max={pricing.max_ram || 128}
                        step={pricing.ram_step || 1}
                        value={customConfig.ram}
                        onChange={(e) => updateConfig('ram', parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('ram', pricing.ram_step || 1, pricing.max_ram || 128)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-blue-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-blue-600">{customConfig.ram}</span>
                      <span className="text-sm text-dark-500 ml-1">GB</span>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">NVMe Storage</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.storage_price_per_gb?.toFixed(2) || '0.05'}/GB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('storage', pricing.storage_step || 10, pricing.min_storage || 40)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-purple-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_storage || 40}
                        max={pricing.max_storage || 2000}
                        step={pricing.storage_step || 10}
                        value={customConfig.storage}
                        onChange={(e) => updateConfig('storage', parseInt(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('storage', pricing.storage_step || 10, pricing.max_storage || 2000)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-purple-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-purple-600">{customConfig.storage}</span>
                      <span className="text-sm text-dark-500 ml-1">GB</span>
                    </div>
                  </div>
                </div>

                {/* Bandwidth */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-500" />
                      <span className="font-medium">Bandwidth</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.bandwidth_price_per_tb?.toFixed(2) || '1.00'}/TB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('bandwidth', pricing.bandwidth_step || 1, pricing.min_bandwidth || 1)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-indigo-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_bandwidth || 1}
                        max={pricing.max_bandwidth || 100}
                        step={pricing.bandwidth_step || 1}
                        value={customConfig.bandwidth}
                        onChange={(e) => updateConfig('bandwidth', parseInt(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('bandwidth', pricing.bandwidth_step || 1, pricing.max_bandwidth || 100)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-indigo-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-indigo-600">{customConfig.bandwidth}</span>
                      <span className="text-sm text-dark-500 ml-1">TB</span>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <label className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    customConfig.autoScale 
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" 
                      : "border-dark-200 dark:border-dark-700 hover:border-cyan-500/50"
                  )}>
                    <input
                      type="checkbox"
                      checked={customConfig.autoScale}
                      onChange={(e) => updateConfig('autoScale', e.target.checked)}
                      className="hidden"
                    />
                    <RefreshCw className="w-6 h-6 text-cyan-500 mb-2" />
                    <div className="font-medium text-sm">Auto Scaling</div>
                    <div className="text-xs text-dark-500">+${pricing.auto_scale_price?.toFixed(2) || '5.00'}/mo</div>
                  </label>

                  <label className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    customConfig.loadBalancer 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                      : "border-dark-200 dark:border-dark-700 hover:border-blue-500/50"
                  )}>
                    <input
                      type="checkbox"
                      checked={customConfig.loadBalancer}
                      onChange={(e) => updateConfig('loadBalancer', e.target.checked)}
                      className="hidden"
                    />
                    <Globe className="w-6 h-6 text-blue-500 mb-2" />
                    <div className="font-medium text-sm">Load Balancer</div>
                    <div className="text-xs text-dark-500">+${pricing.load_balancer_price?.toFixed(2) || '5.00'}/mo</div>
                  </label>

                  <label className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    customConfig.ddos 
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                      : "border-dark-200 dark:border-dark-700 hover:border-green-500/50"
                  )}>
                    <input
                      type="checkbox"
                      checked={customConfig.ddos}
                      onChange={(e) => updateConfig('ddos', e.target.checked)}
                      className="hidden"
                    />
                    <Shield className="w-6 h-6 text-green-500 mb-2" />
                    <div className="font-medium text-sm">DDoS Protection</div>
                    <div className="text-xs text-dark-500">+${pricing.ddos_protection_price?.toFixed(2) || '5.00'}/mo</div>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
                  <h3 className="text-lg font-bold mb-4">Your Configuration</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">Base Fee</span>
                      <span>${pricing.base_fee?.toFixed(2) || '3.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.cpu} vCPU</span>
                      <span>${(customConfig.cpu * (pricing.cpu_price_per_core || 3.90)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.ram} GB RAM</span>
                      <span>${(customConfig.ram * (pricing.ram_price_per_gb || 1.95)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.storage} GB Storage</span>
                      <span>${(customConfig.storage * (pricing.storage_price_per_gb || 0.05)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.bandwidth} TB Bandwidth</span>
                      <span>${(customConfig.bandwidth * (pricing.bandwidth_price_per_tb || 1.00)).toFixed(2)}</span>
                    </div>
                    {customConfig.autoScale && (
                      <div className="flex justify-between text-sm text-cyan-600">
                        <span>Auto Scaling</span>
                        <span>+${(pricing.auto_scale_price || 5.00).toFixed(2)}</span>
                      </div>
                    )}
                    {customConfig.loadBalancer && (
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>Load Balancer</span>
                        <span>+${(pricing.load_balancer_price || 5.00).toFixed(2)}</span>
                      </div>
                    )}
                    {customConfig.ddos && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>DDoS Protection</span>
                        <span>+${(pricing.ddos_protection_price || 5.00).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-dark-200 dark:border-dark-700 pt-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-medium">Total</span>
                      <div>
                        <span className="text-3xl font-bold text-gradient">${calculateCustomPrice().toFixed(2)}</span>
                        <span className="text-dark-500">/mo</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddCustomToCart}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <CloudIcon className="w-5 h-5" />
                    Deploy Custom Cloud
                  </button>

                  <p className="text-xs text-dark-500 text-center mt-4">
                    Auto-scaling • Global deployment
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold font-display"
            >
              Enterprise-Grade{' '}
              <span className="text-gradient">Cloud Features</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Everything you need for scalable cloud infrastructure
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group p-8 rounded-3xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 hover:shadow-xl hover:border-cyan-500/30 transition-all"
              >
                <div className={clsx(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg",
                  feature.color
                )}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-dark-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-white"
          >
            Ready to Scale Your Infrastructure?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/80"
          >
            Deploy your cloud server in minutes with auto-scaling built-in.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link to="/contact" className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
