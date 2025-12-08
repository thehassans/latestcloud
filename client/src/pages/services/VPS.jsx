import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, HardDrive, Shield, Cpu, Gauge, Globe, Zap } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import api from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const planColors = ['from-blue-500 to-cyan-500', 'from-primary-500 to-purple-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500']

export default function VPS() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/pricing/vps')
      .then(res => setPlans(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
        <meta name="description" content="High-performance VPS servers with full root access, SSD storage, and global locations." />
      </Helmet>

      <section className={clsx("relative py-20 overflow-hidden", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
              <HardDrive className="w-4 h-4" /> Virtual Private Servers
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">
              Powerful <span className={isGradient ? "text-gradient" : "text-primary-500"}>VPS Servers</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-dark-600 dark:text-dark-400">
              Full root access, NVMe SSD storage, and dedicated resources for your applications.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white">VPS Plans</h2>
            <p className="mt-4 text-dark-500">Scale your resources as you grow. All plans include full root access.</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading plans...</div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id || plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={clsx(
                  "relative p-6 rounded-2xl border-2 transition-all hover:shadow-xl",
                  plan.popular
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                    : "border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-dark-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-dark-900 dark:text-white">{format(plan.price)}</span>
                  <span className="text-dark-500">/mo</span>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="w-4 h-4 text-primary-500" />
                    <span className="text-dark-700 dark:text-dark-200">{plan.specs.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Gauge className="w-4 h-4 text-primary-500" />
                    <span className="text-dark-700 dark:text-dark-200">{plan.specs.ram}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="w-4 h-4 text-primary-500" />
                    <span className="text-dark-700 dark:text-dark-200">{plan.specs.storage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-primary-500" />
                    <span className="text-dark-700 dark:text-dark-200">{plan.specs.bandwidth}</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleAddToCart(plan)}
                  className={clsx(
                    "w-full mt-6 py-3 rounded-xl font-semibold transition-all",
                    plan.popular
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white hover:bg-dark-200 dark:hover:bg-dark-600"
                  )}
                >
                  Order Now
                </button>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark-900 dark:text-white mb-12">VPS Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Cpu, title: 'Dedicated Resources', desc: 'Guaranteed CPU and RAM allocation' },
              { icon: HardDrive, title: 'NVMe SSD', desc: 'Ultra-fast storage performance' },
              { icon: Shield, title: 'DDoS Protection', desc: 'Enterprise-grade security' },
              { icon: Zap, title: 'Instant Deploy', desc: 'Server ready in minutes' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-white dark:bg-dark-700 rounded-2xl"
              >
                <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-bold text-dark-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-dark-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
