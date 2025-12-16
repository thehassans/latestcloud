import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Database, CheckCircle, ArrowRight, Cpu, HardDrive, Shield, Zap, Globe, Server, Headphones, Lock, Check, X, Settings, Plus, Minus, Gauge } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import { settingsAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const defaultPlans = [
  { name: 'Starter', price: 99.99, cpu: 'Intel Xeon E-2236', ram: '32 GB DDR4', storage: '1 TB NVMe', bandwidth: '10 TB', rootAccess: true, ipmi: true, ddos: true, raid: false, support: 'Standard', features: ['Full Root Access', 'IPMI Access', 'DDoS Protection', '24/7 Support'] },
  { name: 'Professional', price: 199.99, popular: true, cpu: 'Intel Xeon E-2288G', ram: '64 GB DDR4', storage: '2 TB NVMe', bandwidth: '20 TB', rootAccess: true, ipmi: true, ddos: true, raid: true, support: 'Priority', features: ['Full Root Access', 'IPMI Access', 'Advanced DDoS', 'Priority Support', 'Hardware RAID'] },
  { name: 'Enterprise', price: 399.99, cpu: 'Dual Xeon Gold', ram: '128 GB DDR4', storage: '4 TB RAID', bandwidth: 'Unlimited', rootAccess: true, ipmi: true, ddos: true, raid: true, sla: true, support: 'Dedicated', features: ['Full Root Access', 'IPMI Access', 'Premium DDoS', 'Dedicated Support', 'Hardware RAID', 'SLA 99.99%'] }
]

// Spec rows for comparison table
const specRows = [
  { key: 'cpu', label: 'Processor', icon: Cpu },
  { key: 'ram', label: 'RAM Memory', icon: Database },
  { key: 'storage', label: 'Storage', icon: HardDrive },
  { key: 'bandwidth', label: 'Bandwidth', icon: Globe },
  { key: 'support', label: 'Support Level', icon: Headphones },
]

const features = [
  { icon: Cpu, title: 'Dedicated Hardware', desc: 'No virtualization overhead - pure bare-metal performance', color: 'from-orange-500 to-red-500' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Advanced DDoS protection and hardware firewall', color: 'from-green-500 to-emerald-500' },
  { icon: HardDrive, title: 'NVMe RAID Storage', desc: 'Hardware RAID with hot-swap capability', color: 'from-purple-500 to-pink-500' },
  { icon: Zap, title: 'Maximum Performance', desc: 'No noisy neighbors, all resources are yours', color: 'from-yellow-500 to-orange-500' },
  { icon: Globe, title: 'Global Locations', desc: 'Deploy in strategic locations worldwide', color: 'from-indigo-500 to-violet-500' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Personal account manager for enterprise clients', color: 'from-rose-500 to-red-500' },
]

export default function Dedicated() {
  const { format } = useCurrencyStore()
  const { themeStyle, theme } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'
  const isDark = theme === 'dark'

  // Custom Dedicated Server configurator state
  const [customConfig, setCustomConfig] = useState({
    cpu: 8,
    ram: 32,
    storage: 500,
    bandwidth: 10,
    raid: true,
    ipmi: true,
    ddos: true
  })

  const { data: pricingData } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => settingsAPI.getPricing().then(res => res.data.pricing)
  })

  const { data: customPricing } = useQuery({
    queryKey: ['custom-dedicated-pricing'],
    queryFn: () => settingsAPI.getCustomVPSPricing().then(res => res.data.pricing)
  })

  // Dedicated server pricing (much higher than VPS)
  const pricing = customPricing ? {
    cpu_price_per_core: 8.00,
    ram_price_per_gb: 2.50,
    storage_price_per_gb: 0.10,
    bandwidth_price_per_tb: 2.00,
    min_cpu: 4, min_ram: 16, min_storage: 250, min_bandwidth: 5,
    max_cpu: 64, max_ram: 512, max_storage: 8000, max_bandwidth: 100,
    cpu_step: 4, ram_step: 8, storage_step: 250, bandwidth_step: 5,
    base_fee: 50.00,
    raid_price: 20.00,
    ipmi_price: 10.00,
    ddos_protection_price: 15.00
  } : {
    cpu_price_per_core: 8.00,
    ram_price_per_gb: 2.50,
    storage_price_per_gb: 0.10,
    bandwidth_price_per_tb: 2.00,
    min_cpu: 4, min_ram: 16, min_storage: 250, min_bandwidth: 5,
    max_cpu: 64, max_ram: 512, max_storage: 8000, max_bandwidth: 100,
    cpu_step: 4, ram_step: 8, storage_step: 250, bandwidth_step: 5,
    base_fee: 50.00,
    raid_price: 20.00,
    ipmi_price: 10.00,
    ddos_protection_price: 15.00
  }

  const calculateCustomPrice = () => {
    let total = pricing.base_fee
    total += customConfig.cpu * pricing.cpu_price_per_core
    total += customConfig.ram * pricing.ram_price_per_gb
    total += customConfig.storage * pricing.storage_price_per_gb
    total += customConfig.bandwidth * pricing.bandwidth_price_per_tb
    if (customConfig.raid) total += pricing.raid_price
    if (customConfig.ipmi) total += pricing.ipmi_price
    if (customConfig.ddos) total += pricing.ddos_protection_price
    return total
  }

  const handleAddCustomToCart = () => {
    const price = calculateCustomPrice()
    addItem({
      id: `custom-dedicated-${Date.now()}`,
      type: 'product',
      name: `Custom Dedicated (${customConfig.cpu} Cores, ${customConfig.ram}GB RAM, ${customConfig.storage}GB NVMe)`,
      price: price,
      billingCycle: 'monthly',
      product_type: 'dedicated',
      customConfig: customConfig
    })
    toast.success('Custom Dedicated Server added to cart!')
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

  const dedicatedPlans = pricingData?.dedicated || defaultPlans

  const handleAddToCart = (plan) => {
    addItem({
      id: `dedicated-${plan.name.toLowerCase().replace(/\s/g, '-')}`,
      type: 'product',
      name: plan.name,
      price: plan.price,
      billingCycle: 'monthly',
      product_type: 'dedicated'
    })
    toast.success(`${plan.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>Dedicated Servers - Magnetic Clouds</title>
        <meta name="description" content="Maximum performance with dedicated hardware and full server control. Enterprise-grade bare-metal servers." />
      </Helmet>

      {/* Hero Section */}
      <section className={clsx(
        "relative overflow-hidden py-20",
        isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-orange-50 via-white to-red-50"
      )}>
        {/* Animated background */}
        <div className="absolute inset-0">
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          ) : (
            <>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
                  ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400" 
                  : "bg-orange-100 border border-orange-200 text-orange-600"
              )}
            >
              <Server className="w-4 h-4" />
              Enterprise Bare-Metal
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
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Dedicated
              </span>{' '}
              Servers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={clsx("mt-6 text-lg", isDark ? "text-dark-300" : "text-dark-600")}
            >
              Maximum performance with dedicated hardware. Full server control with enterprise-grade infrastructure.
            </motion.p>
            
            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-8"
            >
              {[
                { value: '100%', label: 'Dedicated' },
                { value: '99.99%', label: 'Uptime SLA' },
                { value: 'IPMI', label: 'Access' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{stat.value}</p>
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
                <Server className="w-6 h-6 mb-2 text-orange-500" />
                Compare Plans
              </div>
              {dedicatedPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={clsx(
                    "p-6 text-center relative",
                    plan.popular 
                      ? "bg-gradient-to-b from-orange-500/10 to-red-500/5" 
                      : isDark ? "bg-dark-800/50" : "bg-gray-50/50"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-b-lg">
                      BEST VALUE
                    </div>
                  )}
                  <h3 className={clsx(
                    "text-lg font-bold mb-2",
                    isDark ? "text-white" : "text-dark-900"
                  )}>{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={clsx(
                      "text-3xl font-bold",
                      plan.popular ? "text-orange-500" : isDark ? "text-white" : "text-dark-900"
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
                  <spec.icon className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{spec.label}</span>
                </div>
                {dedicatedPlans.map((plan) => (
                  <div
                    key={`${plan.name}-${spec.key}`}
                    className={clsx(
                      "p-4 text-center flex items-center justify-center",
                      plan.popular ? "bg-orange-500/5" : "",
                      isDark ? "text-white" : "text-dark-800"
                    )}
                  >
                    <span className="font-medium text-sm">{plan[spec.key] || '-'}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Boolean Features */}
            {[
              { key: 'rootAccess', label: 'Full Root Access' },
              { key: 'ipmi', label: 'IPMI Access' },
              { key: 'ddos', label: 'DDoS Protection' },
              { key: 'raid', label: 'Hardware RAID' },
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
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{feature.label}</span>
                </div>
                {dedicatedPlans.map((plan) => (
                  <div
                    key={`${plan.name}-${feature.key}`}
                    className={clsx(
                      "p-4 text-center flex items-center justify-center",
                      plan.popular ? "bg-orange-500/5" : ""
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
              {dedicatedPlans.map((plan) => (
                <div
                  key={`action-${plan.name}`}
                  className={clsx(
                    "p-6 text-center",
                    plan.popular ? "bg-orange-500/5" : ""
                  )}
                >
                  <button
                    onClick={() => handleAddToCart(plan)}
                    className={clsx(
                      "w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                      plan.popular
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30"
                        : isDark 
                          ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" 
                          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
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
              <Lock className="w-5 h-5 text-orange-500" />
              Full Root Access
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              DDoS Protection
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-red-500" />
              Dedicated Support
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Dedicated Server Configurator */}
      <section className="py-24 bg-dark-50 dark:bg-dark-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-6"
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
              <span className="text-gradient">Dedicated Server</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Configure your perfect bare-metal server with enterprise-grade hardware
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 border-2 border-orange-500/20"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Configuration Controls */}
              <div className="lg:col-span-2 space-y-6">
                {/* CPU Cores */}
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">CPU Cores</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.cpu_price_per_core.toFixed(2)}/core</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('cpu', pricing.cpu_step, pricing.min_cpu)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-orange-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_cpu}
                        max={pricing.max_cpu}
                        step={pricing.cpu_step}
                        value={customConfig.cpu}
                        onChange={(e) => updateConfig('cpu', parseInt(e.target.value))}
                        className="w-full accent-orange-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('cpu', pricing.cpu_step, pricing.max_cpu)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-orange-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-orange-600">{customConfig.cpu}</span>
                      <span className="text-sm text-dark-500 ml-1">cores</span>
                    </div>
                  </div>
                </div>

                {/* RAM */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-red-500" />
                      <span className="font-medium">DDR4 RAM</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.ram_price_per_gb.toFixed(2)}/GB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('ram', pricing.ram_step, pricing.min_ram)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-red-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_ram}
                        max={pricing.max_ram}
                        step={pricing.ram_step}
                        value={customConfig.ram}
                        onChange={(e) => updateConfig('ram', parseInt(e.target.value))}
                        className="w-full accent-red-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('ram', pricing.ram_step, pricing.max_ram)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-red-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-red-600">{customConfig.ram}</span>
                      <span className="text-sm text-dark-500 ml-1">GB</span>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-pink-500" />
                      <span className="font-medium">NVMe Storage</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.storage_price_per_gb.toFixed(2)}/GB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('storage', pricing.storage_step, pricing.min_storage)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-pink-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_storage}
                        max={pricing.max_storage}
                        step={pricing.storage_step}
                        value={customConfig.storage}
                        onChange={(e) => updateConfig('storage', parseInt(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('storage', pricing.storage_step, pricing.max_storage)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-pink-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-24 text-center">
                      <span className="text-2xl font-bold text-pink-600">{customConfig.storage >= 1000 ? `${(customConfig.storage / 1000).toFixed(1)}` : customConfig.storage}</span>
                      <span className="text-sm text-dark-500 ml-1">{customConfig.storage >= 1000 ? 'TB' : 'GB'}</span>
                    </div>
                  </div>
                </div>

                {/* Bandwidth */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">Bandwidth</span>
                    </div>
                    <span className="text-sm text-dark-500">${pricing.bandwidth_price_per_tb.toFixed(2)}/TB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decrementConfig('bandwidth', pricing.bandwidth_step, pricing.min_bandwidth)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-purple-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={pricing.min_bandwidth}
                        max={pricing.max_bandwidth}
                        step={pricing.bandwidth_step}
                        value={customConfig.bandwidth}
                        onChange={(e) => updateConfig('bandwidth', parseInt(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                    <button
                      onClick={() => incrementConfig('bandwidth', pricing.bandwidth_step, pricing.max_bandwidth)}
                      className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 flex items-center justify-center hover:border-purple-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-purple-600">{customConfig.bandwidth}</span>
                      <span className="text-sm text-dark-500 ml-1">TB</span>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <label className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    customConfig.raid 
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
                      : "border-dark-200 dark:border-dark-700 hover:border-orange-500/50"
                  )}>
                    <input
                      type="checkbox"
                      checked={customConfig.raid}
                      onChange={(e) => updateConfig('raid', e.target.checked)}
                      className="hidden"
                    />
                    <HardDrive className="w-6 h-6 text-orange-500 mb-2" />
                    <div className="font-medium text-sm">Hardware RAID</div>
                    <div className="text-xs text-dark-500">+${pricing.raid_price.toFixed(2)}/mo</div>
                  </label>

                  <label className={clsx(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    customConfig.ipmi 
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                      : "border-dark-200 dark:border-dark-700 hover:border-red-500/50"
                  )}>
                    <input
                      type="checkbox"
                      checked={customConfig.ipmi}
                      onChange={(e) => updateConfig('ipmi', e.target.checked)}
                      className="hidden"
                    />
                    <Server className="w-6 h-6 text-red-500 mb-2" />
                    <div className="font-medium text-sm">IPMI Access</div>
                    <div className="text-xs text-dark-500">+${pricing.ipmi_price.toFixed(2)}/mo</div>
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
                    <div className="text-xs text-dark-500">+${pricing.ddos_protection_price.toFixed(2)}/mo</div>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-500/20">
                  <h3 className="text-lg font-bold mb-4">Your Configuration</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">Base Fee</span>
                      <span>${pricing.base_fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.cpu} CPU Cores</span>
                      <span>${(customConfig.cpu * pricing.cpu_price_per_core).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.ram} GB DDR4</span>
                      <span>${(customConfig.ram * pricing.ram_price_per_gb).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.storage >= 1000 ? `${(customConfig.storage / 1000).toFixed(1)} TB` : `${customConfig.storage} GB`} Storage</span>
                      <span>${(customConfig.storage * pricing.storage_price_per_gb).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">{customConfig.bandwidth} TB Bandwidth</span>
                      <span>${(customConfig.bandwidth * pricing.bandwidth_price_per_tb).toFixed(2)}</span>
                    </div>
                    {customConfig.raid && (
                      <div className="flex justify-between text-sm text-orange-600">
                        <span>Hardware RAID</span>
                        <span>+${pricing.raid_price.toFixed(2)}</span>
                      </div>
                    )}
                    {customConfig.ipmi && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>IPMI Access</span>
                        <span>+${pricing.ipmi_price.toFixed(2)}</span>
                      </div>
                    )}
                    {customConfig.ddos && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>DDoS Protection</span>
                        <span>+${pricing.ddos_protection_price.toFixed(2)}</span>
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
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Server className="w-5 h-5" />
                    Deploy Custom Dedicated
                  </button>

                  <p className="text-xs text-dark-500 text-center mt-4">
                    Bare-metal • Full root access
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
              Why Choose{' '}
              <span className="text-gradient">Dedicated Servers</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Uncompromised performance with enterprise-grade hardware
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
                className="group p-8 rounded-3xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 hover:shadow-xl hover:border-orange-500/30 transition-all"
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
      <section className="py-24 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-white"
          >
            Need Custom Hardware Configuration?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/80"
          >
            Our enterprise team can build a custom dedicated server solution for your specific needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link to="/contact" className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
