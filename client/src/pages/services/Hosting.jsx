import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Server, Shield, Clock, Zap } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import api from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const planColors = ['from-blue-500 to-cyan-500', 'from-primary-500 to-purple-500', 'from-purple-500 to-pink-500']

const features = [
  { icon: Zap, title: 'SSD Storage', desc: 'Lightning-fast NVMe SSD drives' },
  { icon: Shield, title: 'Free SSL', desc: 'Secure your website for free' },
  { icon: Clock, title: '99.9% Uptime', desc: 'Enterprise-grade reliability' },
  { icon: Server, title: 'cPanel', desc: 'Easy-to-use control panel' },
]

export default function Hosting() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/pricing/hosting')
      .then(res => setPlans(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = (plan) => {
    addItem({
      id: `hosting-${plan.name.toLowerCase().replace(/\s/g, '-')}`,
      type: 'product',
      name: plan.name,
      price: plan.price,
      billingCycle: 'monthly',
      product_type: 'hosting'
    })
    toast.success(`${plan.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>Web Hosting - Magnetic Clouds</title>
        <meta name="description" content="Fast, reliable web hosting with free SSL, daily backups, and 24/7 support. Starting at $2.99/month." />
      </Helmet>

      {/* Hero */}
      <section className={clsx(
        "relative py-20 overflow-hidden",
        isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6"
            >
              <Server className="w-4 h-4" />
              Premium Web Hosting
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display"
            >
              Fast & Reliable{' '}
              <span className={isGradient ? "text-gradient" : "text-primary-500"}>Web Hosting</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-dark-600 dark:text-dark-400"
            >
              Power your website with lightning-fast SSD hosting, free SSL certificates, 
              and 24/7 expert support. 45-day money-back guarantee.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b border-dark-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="text-center"
              >
                <div className={clsx(
                  "w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white",
                  isGradient ? "bg-gradient-to-br from-primary-500 to-secondary-500" : "bg-primary-500"
                )}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-dark-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900 dark:text-white">Choose Your Plan</h2>
            <p className="mt-4 text-dark-500">All plans include free SSL, backups, and 24/7 support.</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading plans...</div>
          ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id || plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={clsx(
                  "relative p-8 rounded-2xl border-2 transition-all hover:shadow-xl",
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
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${planColors[i % planColors.length]} flex items-center justify-center mb-4`}>
                  <Server className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-dark-900 dark:text-white">{format(plan.price)}</span>
                  <span className="text-dark-500">/mo</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleAddToCart(plan)}
                  className={clsx(
                    "w-full mt-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                    plan.popular
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white hover:bg-dark-200 dark:hover:bg-dark-600"
                  )}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Need Help Choosing?
          </h2>
          <p className="mt-4 text-dark-300 max-w-2xl mx-auto">
            Our hosting experts are available 24/7 to help you find the perfect plan for your needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Contact Sales
            </Link>
            <Link to="/support" className="btn bg-white/10 hover:bg-white/20 text-white">
              Live Chat
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
