import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Server, CheckCircle, ArrowRight, Cpu, HardDrive, Gauge, Globe, Shield, Zap, Headphones, Lock, MapPin, Clock, Wifi, Check, X, Settings, Plus, Minus } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import { settingsAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const bdPlans = [
  {
    name: 'BD Starter',
    price: 29.99,
    cpu: '2 vCPU',
    ram: '4 GB',
    storage: '80 GB NVMe',
    bandwidth: '2 TB',
    latency: '<5ms',
    ddos: true,
    backup: 'Daily',
    support: 'Priority',
    features: ['Ultra Low Latency', 'Local Support', 'Daily Backups', 'DDoS Protection']
  },
  {
    name: 'BD Pro',
    price: 59.99,
    cpu: '4 vCPU',
    ram: '8 GB',
    storage: '160 GB NVMe',
    bandwidth: '5 TB',
    latency: '<3ms',
    ddos: true,
    backup: 'Daily',
    dedicatedIp: true,
    support: 'Dedicated',
    features: ['Ultra Low Latency', 'Dedicated IP', 'Local Support', 'Premium DDoS'],
    popular: true
  },
  {
    name: 'BD Enterprise',
    price: 119.99,
    cpu: '8 vCPU',
    ram: '16 GB',
    storage: '320 GB NVMe',
    bandwidth: '10 TB',
    latency: '<1ms',
    ddos: true,
    backup: 'Hourly',
    dedicatedIp: true,
    sla: true,
    support: '24/7 VIP',
    features: ['Lowest Latency', 'Multiple IPs', 'Hourly Backups', 'SLA 99.99%']
  }
]

const specRows = [
  { key: 'cpu', label: 'vCPU Cores', icon: Cpu },
  { key: 'ram', label: 'RAM Memory', icon: Gauge },
  { key: 'storage', label: 'NVMe Storage', icon: HardDrive },
  { key: 'bandwidth', label: 'Bandwidth', icon: Globe },
  { key: 'latency', label: 'Local Latency', icon: Wifi },
  { key: 'support', label: 'Support Level', icon: Headphones },
]

const features = [
  { icon: MapPin, title: 'Dhaka Datacenter', desc: 'Servers located in Dhaka for lowest latency to Bangladesh users', color: 'from-green-500 to-emerald-500' },
  { icon: Wifi, title: 'Ultra Low Latency', desc: 'Under 5ms latency for Bangladesh visitors', color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, title: 'Premium DDoS', desc: 'Enterprise-grade protection against attacks', color: 'from-purple-500 to-pink-500' },
  { icon: Clock, title: '99.99% Uptime', desc: 'Guaranteed uptime with SLA protection', color: 'from-yellow-500 to-orange-500' },
  { icon: Headphones, title: 'Local Support', desc: 'Bengali speaking support team available', color: 'from-indigo-500 to-violet-500' },
  { icon: Zap, title: 'Instant Setup', desc: 'Server ready in under 60 seconds', color: 'from-rose-500 to-red-500' },
]

export default function BDServer() {
  const { format } = useCurrencyStore()
  const { themeStyle, theme } = useThemeStore()
  const { addItem } = useCartStore()
  const isDark = theme === 'dark'
  const isGradient = themeStyle === 'gradient'

  // Custom BD Server configurator state
  const [customConfig, setCustomConfig] = useState({
    cpu: 2,
    ram: 4,
    storage: 80,
    bandwidth: 2,
    ddos: true,
    backup: true,
    dedicatedIp: false
  })

  const { data: customPricing } = useQuery({
    queryKey: ['custom-bd-pricing'],
    queryFn: () => settingsAPI.getCustomVPSPricing().then(res => res.data.pricing)
  })

  // BD Server pricing (slightly higher than VPS due to local datacenter)
  const pricing = customPricing ? {
    ...customPricing,
    cpu_price_per_core: customPricing.cpu_price_per_core * 1.2,
    ram_price_per_gb: customPricing.ram_price_per_gb * 1.2,
    base_fee: 5.00,
    dedicated_ip_price: 5.00
  } : {
    cpu_price_per_core: 3.60,
    ram_price_per_gb: 1.80,
    storage_price_per_gb: 0.05,
    bandwidth_price_per_tb: 1.00,
    min_cpu: 1, min_ram: 2, min_storage: 40, min_bandwidth: 1,
    max_cpu: 16, max_ram: 64, max_storage: 1000, max_bandwidth: 50,
    cpu_step: 1, ram_step: 1, storage_step: 10, bandwidth_step: 1,
    base_fee: 5.00,
    ddos_protection_price: 5.00,
    backup_price: 3.00,
    dedicated_ip_price: 5.00
  }

  const calculateCustomPrice = () => {
    let total = pricing.base_fee
    total += customConfig.cpu * pricing.cpu_price_per_core
    total += customConfig.ram * pricing.ram_price_per_gb
    total += customConfig.storage * pricing.storage_price_per_gb
    total += customConfig.bandwidth * pricing.bandwidth_price_per_tb
    if (customConfig.ddos) total += pricing.ddos_protection_price
    if (customConfig.backup) total += pricing.backup_price
    if (customConfig.dedicatedIp) total += pricing.dedicated_ip_price
    return total
  }

  const handleAddCustomToCart = () => {
    const price = calculateCustomPrice()
    addItem({
      id: `custom-bd-server-${Date.now()}`,
      type: 'product',
      name: `Custom BD Server (${customConfig.cpu} vCPU, ${customConfig.ram}GB RAM, ${customConfig.storage}GB NVMe)`,
      price: price,
      billingCycle: 'monthly',
      product_type: 'bd-server',
      customConfig: customConfig
    })
    toast.success('Custom BD Server added to cart!')
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
      id: `bd-server-${plan.name.toLowerCase().replace(/\s/g, '-')}`,
      type: 'product',
      name: plan.name,
      price: plan.price,
      billingCycle: 'monthly',
      product_type: 'bd-server'
    })
    toast.success(`${plan.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>BD Server - Premium Bangladesh Datacenter | Magnetic Clouds</title>
        <meta name="description" content="Ultra-low latency servers in Bangladesh. Premium Dhaka datacenter with local support and fastest speeds for BD users." />
      </Helmet>

      {/* Hero Section */}
      <section className={clsx(
        "relative overflow-hidden py-20",
        isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-green-50 via-white to-emerald-50"
      )}>
        <div className="absolute inset-0">
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          ) : (
            <>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/40 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm",
                isDark 
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400" 
                  : "bg-green-100 border border-green-200 text-green-600"
              )}
            >
              <MapPin className="w-4 h-4" />
              Premium Bangladesh Datacenter
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
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                BD Server
              </span>
              {' '}Premium
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={clsx("mt-6 text-lg max-w-2xl mx-auto", isDark ? "text-dark-300" : "text-dark-600")}
            >
              Ultra-low latency servers located in Dhaka, Bangladesh. Get the fastest speeds for your local users with premium infrastructure.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-8"
            >
              {[
                { value: '<5ms', label: 'Local Latency' },
                { value: '99.99%', label: 'Uptime SLA' },
                { value: 'Dhaka', label: 'Datacenter' },
                { value: '24/7', label: 'Local Support' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{stat.value}</p>
                  <p className={clsx("text-sm", isDark ? "text-dark-400" : "text-dark-500")}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
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
            <div className={clsx("grid grid-cols-4 border-b", isDark ? "border-dark-700" : "border-gray-200")}>
              <div className={clsx("p-6 font-semibold", isDark ? "bg-dark-800 text-white" : "bg-gray-50 text-dark-900")}>
                <Server className="w-6 h-6 mb-2 text-green-500" />
                Compare Plans
              </div>
              {bdPlans.map((plan) => (
                <div key={plan.name} className={clsx("p-6 text-center relative", plan.popular ? "bg-gradient-to-b from-green-500/10 to-emerald-500/5" : isDark ? "bg-dark-800/50" : "bg-gray-50/50")}>
                  {plan.popular && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-b-lg">
                      POPULAR
                    </div>
                  )}
                  <h3 className={clsx("text-lg font-bold mb-2", isDark ? "text-white" : "text-dark-900")}>{plan.name.replace('BD ', '')}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={clsx("text-3xl font-bold", plan.popular ? "text-green-500" : isDark ? "text-white" : "text-dark-900")}>{format(plan.price)}</span>
                    <span className={isDark ? "text-dark-400" : "text-dark-500"}>/mo</span>
                  </div>
                </div>
              ))}
            </div>

            {specRows.map((spec, rowIndex) => (
              <div key={spec.key} className={clsx("grid grid-cols-4 border-b", isDark ? "border-dark-700" : "border-gray-100", rowIndex % 2 === 0 ? isDark ? "bg-dark-800/30" : "bg-gray-50/50" : "")}>
                <div className={clsx("p-4 flex items-center gap-3", isDark ? "text-dark-300" : "text-dark-600")}>
                  <spec.icon className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{spec.label}</span>
                </div>
                {bdPlans.map((plan) => (
                  <div key={`${plan.name}-${spec.key}`} className={clsx("p-4 text-center flex items-center justify-center", plan.popular ? "bg-green-500/5" : "", isDark ? "text-white" : "text-dark-800")}>
                    <span className="font-medium">{plan[spec.key] || '-'}</span>
                  </div>
                ))}
              </div>
            ))}

            {[
              { key: 'ddos', label: 'DDoS Protection' },
              { key: 'dedicatedIp', label: 'Dedicated IP' },
              { key: 'sla', label: 'SLA 99.99%' },
            ].map((feature, rowIndex) => (
              <div key={feature.key} className={clsx("grid grid-cols-4 border-b", isDark ? "border-dark-700" : "border-gray-100", (specRows.length + rowIndex) % 2 === 0 ? isDark ? "bg-dark-800/30" : "bg-gray-50/50" : "")}>
                <div className={clsx("p-4 flex items-center gap-3", isDark ? "text-dark-300" : "text-dark-600")}>
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{feature.label}</span>
                </div>
                {bdPlans.map((plan) => (
                  <div key={`${plan.name}-${feature.key}`} className={clsx("p-4 text-center flex items-center justify-center", plan.popular ? "bg-green-500/5" : "")}>
                    {plan[feature.key] ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-dark-400" />}
                  </div>
                ))}
              </div>
            ))}

            <div className={clsx("grid grid-cols-4", isDark ? "bg-dark-800" : "bg-gray-50")}>
              <div className="p-6"></div>
              {bdPlans.map((plan) => (
                <div key={`action-${plan.name}`} className={clsx("p-6 text-center", plan.popular ? "bg-green-500/5" : "")}>
                  <button onClick={() => handleAddToCart(plan)} className={clsx("w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2", plan.popular ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30" : isDark ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" : "bg-green-100 text-green-700 hover:bg-green-200")}>
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom BD Server Configurator */}
      <section className="py-24 bg-white dark:bg-dark-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium mb-6"
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
              <span className="text-gradient">BD Server</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Configure your perfect Bangladesh server with exactly the resources you need
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 border-2 border-green-500/20"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Configuration Controls */}
              <div className="lg:col-span-2 space-y-6">
                {/* CPU */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-green-500" />
                      <span className="font-medium">vCPU Cores</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.cpu_price_per_core?.toFixed(2) || '3.60'}/core</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('cpu', pricing.cpu_step || 1, pricing.min_cpu || 1)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-green-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_cpu || 1}
                        max={pricing.max_cpu || 16}
                        step={pricing.cpu_step || 1}
                        value={customConfig.cpu}
                        onChange={(e) => updateConfig('cpu', parseInt(e.target.value))}
                        className="w-full accent-green-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('cpu', pricing.cpu_step || 1, pricing.max_cpu || 16)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-green-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-green-600">{customConfig.cpu}</span>
                      <span className="text-sm text-dark-500 ml-1">cores</span>
                    </div>
                  </div>
                </div>

                {/* RAM */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium">RAM Memory</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.ram_price_per_gb?.toFixed(2) || '1.80'}/GB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('ram', pricing.ram_step || 1, pricing.min_ram || 2)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-emerald-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_ram || 2}
                        max={pricing.max_ram || 64}
                        step={pricing.ram_step || 1}
                        value={customConfig.ram}
                        onChange={(e) => updateConfig('ram', parseInt(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('ram', pricing.ram_step || 1, pricing.max_ram || 64)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-emerald-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-emerald-600">{customConfig.ram}</span>
                      <span className="text-sm text-dark-500 ml-1">GB</span>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-teal-500" />
                      <span className="font-medium">NVMe Storage</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.storage_price_per_gb?.toFixed(2) || '0.05'}/GB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('storage', pricing.storage_step || 10, pricing.min_storage || 40)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-teal-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_storage || 40}
                        max={pricing.max_storage || 1000}
                        step={pricing.storage_step || 10}
                        value={customConfig.storage}
                        onChange={(e) => updateConfig('storage', parseInt(e.target.value))}
                        className="w-full accent-teal-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('storage', pricing.storage_step || 10, pricing.max_storage || 1000)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-teal-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-teal-600">{customConfig.storage}</span>
                      <span className="text-sm text-dark-500 ml-1">GB</span>
                    </div>
                  </div>
                </div>

                {/* Bandwidth */}
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-500" />
                      <span className="font-medium">Bandwidth</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.bandwidth_price_per_tb?.toFixed(2) || '1.00'}/TB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('bandwidth', pricing.bandwidth_step || 1, pricing.min_bandwidth || 1)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-cyan-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_bandwidth || 1}
                        max={pricing.max_bandwidth || 50}
                        step={pricing.bandwidth_step || 1}
                        value={customConfig.bandwidth}
                        onChange={(e) => updateConfig('bandwidth', parseInt(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('bandwidth', pricing.bandwidth_step || 1, pricing.max_bandwidth || 50)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-cyan-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-cyan-600">{customConfig.bandwidth}</span>
                      <span className="text-sm text-dark-500 ml-1">TB</span>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="grid sm:grid-cols-3 gap-4">
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

                  <label className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    customConfig.backup 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                      : "border-dark-200 dark:border-dark-700 hover:border-blue-500/50"
                  )}>
                    <input
                      type="checkbox"
                      checked={customConfig.backup}
                      onChange={(e) => updateConfig('backup', e.target.checked)}
                      className="hidden"
                    />
                    <HardDrive className="w-6 h-6 text-blue-500 mb-2" />
                    <div className="font-medium text-sm">Daily Backups</div>
                    <div className="text-xs text-dark-500">+${pricing.backup_price?.toFixed(2) || '3.00'}/mo</div>
                  </label>

                  <label className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    customConfig.dedicatedIp 
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                      : "border-dark-200 dark:border-dark-700 hover:border-purple-500/50"
                  )}>
                    <input
                      type="checkbox"
                      checked={customConfig.dedicatedIp}
                      onChange={(e) => updateConfig('dedicatedIp', e.target.checked)}
                      className="hidden"
                    />
                    <Globe className="w-6 h-6 text-purple-500 mb-2" />
                    <div className="font-medium text-sm">Dedicated IP</div>
                    <div className="text-xs text-dark-500">+${pricing.dedicated_ip_price?.toFixed(2) || '5.00'}/mo</div>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                  <h3 className="text-lg font-bold mb-4">Your Configuration</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">Base Fee</span>
                      <span>${pricing.base_fee?.toFixed(2) || '5.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.cpu} vCPU</span>
                      <span>${(customConfig.cpu * (pricing.cpu_price_per_core || 3.60)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.ram} GB RAM</span>
                      <span>${(customConfig.ram * (pricing.ram_price_per_gb || 1.80)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.storage} GB Storage</span>
                      <span>${(customConfig.storage * (pricing.storage_price_per_gb || 0.05)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.bandwidth} TB Bandwidth</span>
                      <span>${(customConfig.bandwidth * (pricing.bandwidth_price_per_tb || 1.00)).toFixed(2)}</span>
                    </div>
                    {customConfig.ddos && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>DDoS Protection</span>
                        <span>+${(pricing.ddos_protection_price || 5.00).toFixed(2)}</span>
                      </div>
                    )}
                    {customConfig.backup && (
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>Daily Backups</span>
                        <span>+${(pricing.backup_price || 3.00).toFixed(2)}</span>
                      </div>
                    )}
                    {customConfig.dedicatedIp && (
                      <div className="flex justify-between text-sm text-purple-600">
                        <span>Dedicated IP</span>
                        <span>+${(pricing.dedicated_ip_price || 5.00).toFixed(2)}</span>
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
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Server className="w-5 h-5" />
                    Deploy Custom BD Server
                  </button>

                  <p className="text-xs text-dark-500 text-center mt-4">
                    Dhaka datacenter • Ultra low latency
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={clsx("py-24", isDark ? "bg-dark-950" : "bg-gray-50")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-display">
              Why Choose <span className="text-gradient">BD Server</span>?
            </motion.h2>
            <p className={clsx("mt-4 max-w-2xl mx-auto", isDark ? "text-dark-400" : "text-dark-500")}>
              Premium infrastructure designed for Bangladesh users
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }} className={clsx("group p-8 rounded-3xl border transition-all hover:shadow-xl", isDark ? "bg-dark-800 border-dark-700 hover:border-green-500/30" : "bg-white border-gray-100 hover:border-green-500/30")}>
                <div className={clsx("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg", feature.color)}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-dark-900")}>{feature.title}</h3>
                <p className={clsx("mt-3", isDark ? "text-dark-400" : "text-dark-500")}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold font-display text-white">
            Ready for Ultra-Fast BD Hosting?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 text-lg text-white/80">
            Deploy your server in our Dhaka datacenter today and experience the lowest latency.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
