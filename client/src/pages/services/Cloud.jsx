import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Cloud as CloudIcon, CheckCircle, ArrowRight, Cpu, HardDrive, Gauge, Globe, Shield, Zap, Headphones, Lock, RefreshCw } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const cloudPlans = [
  {
    name: 'Cloud Starter',
    price: 19.99,
    specs: { cpu: '2 vCPU', ram: '4 GB RAM', storage: '80 GB NVMe', bandwidth: '4 TB Transfer' },
    features: ['Auto Scaling', 'Load Balancer', 'Daily Backups', '24/7 Support']
  },
  {
    name: 'Cloud Pro',
    price: 49.99,
    specs: { cpu: '4 vCPU', ram: '8 GB RAM', storage: '160 GB NVMe', bandwidth: '8 TB Transfer' },
    features: ['Auto Scaling', 'Load Balancer', 'Daily Backups', 'DDoS Protection', 'Priority Support'],
    popular: true
  },
  {
    name: 'Cloud Business',
    price: 99.99,
    specs: { cpu: '8 vCPU', ram: '16 GB RAM', storage: '320 GB NVMe', bandwidth: '16 TB Transfer' },
    features: ['Auto Scaling', 'Load Balancer', 'Hourly Backups', 'DDoS Protection', 'Dedicated Support']
  },
  {
    name: 'Cloud Enterprise',
    price: 199.99,
    specs: { cpu: '16 vCPU', ram: '32 GB RAM', storage: '640 GB NVMe', bandwidth: 'Unlimited' },
    features: ['Auto Scaling', 'Load Balancer', 'Real-time Backups', 'Advanced DDoS', 'SLA 99.99%']
  }
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
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'

  const handleAddToCart = (plan) => {
    addItem({
      id: `cloud-${plan.name.toLowerCase().replace(/\s/g, '-')}`,
      type: 'product',
      name: plan.name,
      price: plan.price,
      billingCycle: 'monthly',
      product_type: 'cloud'
    })
    toast.success(`${plan.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>Cloud Servers - Magnetic Clouds</title>
        <meta name="description" content="Auto-scaling cloud infrastructure with 99.99% uptime SLA and global availability." />
      </Helmet>

      {/* Ultra Premium Hero with Plans */}
      <section className="relative min-h-screen bg-dark-950 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-dark-950 to-blue-950/50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-cyan-500/10 via-transparent to-blue-500/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-6"
            >
              <CloudIcon className="w-4 h-4" />
              Cloud Infrastructure
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6"
            >
              Scalable{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cloud Servers
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-dark-300 max-w-2xl mx-auto"
            >
              Auto-scaling cloud infrastructure with 99.99% uptime SLA and global availability.
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
              { value: 'Auto', label: 'Scaling' },
              { value: '10+', label: 'Locations' },
              { value: '24/7', label: 'Support' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cloudPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                className={clsx(
                  "relative group rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02]",
                  plan.popular
                    ? "bg-gradient-to-b from-cyan-500/20 to-blue-500/10 border-2 border-cyan-500/50"
                    : "bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 hover:border-cyan-500/30"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    BEST VALUE
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{format(plan.price)}</span>
                  <span className="text-dark-400">/month</span>
                </div>

                {/* Specs */}
                <div className="p-4 bg-dark-900/50 rounded-2xl mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-white">{plan.specs.cpu}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Gauge className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{plan.specs.ram}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span className="text-white">{plan.specs.storage}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-pink-400" />
                    <span className="text-white">{plan.specs.bandwidth}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-dark-300">
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
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25"
                      : "bg-dark-700 text-white hover:bg-dark-600"
                  )}
                >
                  Deploy Now <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-dark-400 text-sm"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              Auto Scaling
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              DDoS Protection
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-blue-400" />
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
