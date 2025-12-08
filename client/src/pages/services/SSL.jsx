import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Lock, Globe, Zap } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import api from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const defaultPlans = [
  {
    name: 'Domain Validation',
    description: 'Basic encryption for personal sites',
    price: 9.99,
    features: ['Single Domain', '256-bit Encryption', 'Browser Trust', '10 Min Issuance', '$10K Warranty'],
    icon: Lock,
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Organization Validation',
    description: 'Business identity verification',
    price: 49.99,
    features: ['Single Domain', 'Company Verification', 'Site Seal', '1-3 Day Issuance', '$250K Warranty'],
    icon: Shield,
    popular: true,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Extended Validation',
    description: 'Maximum trust & green bar',
    price: 149.99,
    features: ['Single Domain', 'Green Address Bar', 'Full Verification', '3-5 Day Issuance', '$1M Warranty'],
    icon: Globe,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Wildcard SSL',
    description: 'Secure unlimited subdomains',
    price: 99.99,
    features: ['Unlimited Subdomains', '256-bit Encryption', 'Browser Trust', '10 Min Issuance', '$500K Warranty'],
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  }
]

export default function SSL() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'
  const [plans, setPlans] = useState(defaultPlans)

  useEffect(() => {
    api.get('/api/pricing/ssl')
      .then(res => setPlans(res.data))
      .catch(() => {})
  }, [])

  const handleAddToCart = (plan) => {
    addItem({
      id: `ssl-${plan.name.toLowerCase().replace(/\s/g, '-')}`,
      type: 'product',
      name: `${plan.name} SSL`,
      price: plan.price,
      billingCycle: 'yearly',
      product_type: 'ssl'
    })
    toast.success(`${plan.name} SSL added to cart!`)
  }

  return (
    <>
      <Helmet><title>SSL Certificates - Magnetic Clouds</title></Helmet>
      <section className={clsx("py-20", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950")}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Website Security
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display">
            <span className={isGradient ? "text-gradient" : "text-primary-500"}>SSL</span> Certificates
          </h1>
          <p className="mt-6 text-lg text-dark-500 max-w-2xl mx-auto">
            Secure your website with industry-standard encryption. Free SSL included with all hosting plans.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.name} 
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
                    POPULAR
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-dark-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-dark-900 dark:text-white">{format(plan.price)}</span>
                  <span className="text-dark-500">/year</span>
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
                    "w-full mt-6 py-3 rounded-xl font-semibold transition-all",
                    plan.popular 
                      ? "bg-primary-500 text-white hover:bg-primary-600" 
                      : "bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white hover:bg-dark-200 dark:hover:bg-dark-600"
                  )}
                >
                  Get SSL
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-dark-900 dark:text-white mb-12">Why SSL Matters</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Data Encryption', desc: '256-bit encryption protects sensitive data in transit' },
              { icon: Shield, title: 'Trust & Credibility', desc: 'Show visitors your site is secure with padlock icon' },
              { icon: Globe, title: 'SEO Boost', desc: 'Google ranks HTTPS sites higher in search results' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-dark-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
