import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, ArrowRight, HardDrive, Shield, Cpu, Gauge, Globe, Zap, Server, Lock, Headphones, Star } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import { settingsAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const defaultPlans = [
  { name: 'VPS Basic', price: 9.99, cpu: '1 vCPU', ram: '2 GB RAM', storage: '40 GB NVMe', bandwidth: '2 TB Transfer', features: ['Full Root Access', 'KVM Virtualization', '24/7 Support'] },
  { name: 'VPS Standard', price: 19.99, popular: true, cpu: '2 vCPU', ram: '4 GB RAM', storage: '80 GB NVMe', bandwidth: '4 TB Transfer', features: ['Full Root Access', 'KVM Virtualization', 'DDoS Protection', 'Priority Support'] },
  { name: 'VPS Advanced', price: 39.99, cpu: '4 vCPU', ram: '8 GB RAM', storage: '160 GB NVMe', bandwidth: '8 TB Transfer', features: ['Full Root Access', 'KVM Virtualization', 'DDoS Protection', 'Dedicated IP', 'Daily Backups'] },
  { name: 'VPS Pro', price: 79.99, cpu: '8 vCPU', ram: '16 GB RAM', storage: '320 GB NVMe', bandwidth: '16 TB Transfer', features: ['Full Root Access', 'KVM Virtualization', 'Advanced DDoS', 'Multiple IPs', 'Real-time Backups', 'SLA 99.99%'] }
]

const features = [
  { icon: Cpu, title: 'Dedicated Resources', desc: 'Guaranteed CPU and RAM allocation with no overselling', color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, title: 'DDoS Protection', desc: 'Enterprise-grade protection up to 10Tbps', color: 'from-green-500 to-emerald-500' },
  { icon: HardDrive, title: 'NVMe SSD Storage', desc: 'Up to 10x faster than traditional SSDs', color: 'from-purple-500 to-pink-500' },
  { icon: Zap, title: 'Instant Deployment', desc: 'Server provisioned in under 60 seconds', color: 'from-yellow-500 to-orange-500' },
  { icon: Globe, title: '10 Global Locations', desc: 'Deploy close to your users worldwide', color: 'from-indigo-500 to-violet-500' },
  { icon: Headphones, title: '24/7 Expert Support', desc: 'Average response time under 5 minutes', color: 'from-rose-500 to-red-500' },
]

export default function VPS() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'

  const { data: pricingData } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => settingsAPI.getPricing().then(res => res.data.pricing)
  })

  const vpsPlans = (pricingData?.vps || defaultPlans).map(p => ({
    ...p,
    specs: { cpu: p.cpu, ram: p.ram, storage: p.storage, bandwidth: p.bandwidth },
    features: p.features || ['Full Root Access', 'KVM Virtualization', '24/7 Support']
  }))

  const handleAddToCart = (plan) => {
    addItem({
      id: `vps-${plan.name.toLowerCase().replace(/\s/g, '-')}`,
      type: 'product',
      name: plan.name,
      price: plan.price,
      billingCycle: 'monthly',
      product_type: 'vps'
    })
    toast.success(`${plan.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>VPS Servers - Magnetic Clouds</title>
        <meta name="description" content="High-performance VPS servers with full root access, NVMe SSD storage, and global locations." />
      </Helmet>

      {/* Ultra Premium Hero with Plans */}
      <section className="relative min-h-screen bg-gray-50 dark:bg-dark-950 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-gray-50 to-purple-100/50 dark:from-blue-950/50 dark:via-dark-950 dark:to-purple-950/50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6"
            >
              <Server className="w-4 h-4" />
              Virtual Private Servers
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-dark-900 dark:text-white mb-6"
            >
              Powerful{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VPS Servers
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-dark-600 dark:text-dark-300 max-w-2xl mx-auto"
            >
              Full root access with dedicated resources. Deploy your applications on enterprise-grade infrastructure.
            </motion.p>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { value: '99.99%', label: 'Uptime SLA' },
              { value: '<60s', label: 'Deploy Time' },
              { value: '10+', label: 'Locations' },
              { value: '24/7', label: 'Support' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-dark-500 dark:text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vpsPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                className={clsx(
                  "relative group rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02]",
                  plan.popular
                    ? "bg-gradient-to-b from-blue-500/20 to-purple-500/10 border-2 border-blue-500/50"
                    : "bg-white dark:bg-dark-800/50 backdrop-blur-sm border border-gray-200 dark:border-dark-700/50 hover:border-blue-500/30 shadow-lg dark:shadow-none"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-dark-900 dark:text-white">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-dark-900 dark:text-white">{format(plan.price)}</span>
                  <span className="text-dark-500 dark:text-dark-400">/month</span>
                </div>

                {/* Specs */}
                <div className="p-4 bg-gray-100 dark:bg-dark-900/50 rounded-2xl mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Cpu className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-dark-800 dark:text-white">{plan.specs.cpu}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Gauge className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-dark-800 dark:text-white">{plan.specs.ram}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <HardDrive className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                    <span className="text-dark-800 dark:text-white">{plan.specs.storage}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    <span className="text-dark-800 dark:text-white">{plan.specs.bandwidth}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleAddToCart(plan)}
                  className={clsx(
                    "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                      : "bg-blue-600 dark:bg-dark-700 text-white hover:bg-blue-700 dark:hover:bg-dark-600"
                  )}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-dark-600 dark:text-dark-400 text-sm"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              DDoS Protection
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              Full Root Access
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-purple-400" />
              24/7 Expert Support
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
              <span className="text-gradient">VPS Features</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Everything you need for high-performance applications
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
                className="group p-8 rounded-3xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 hover:shadow-xl hover:border-blue-500/30 transition-all"
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
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-white"
          >
            Ready to Deploy Your VPS?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/80"
          >
            Get started in minutes with our instant provisioning system.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link to="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
