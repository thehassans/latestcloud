import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Shield, CheckCircle, Lock, Globe, Zap, ArrowRight, Award, Headphones, ShieldCheck } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import { settingsAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const defaultPlans = [
  { name: 'Domain Validation', description: 'Basic encryption for personal sites', price: 9.99, features: ['Single Domain', '256-bit Encryption', 'Browser Trust', '10 Min Issuance', '$10K Warranty'], color: 'from-green-500 to-emerald-500' },
  { name: 'Organization Validation', description: 'Business identity verification', price: 49.99, popular: true, features: ['Single Domain', 'Company Verification', 'Site Seal', '1-3 Day Issuance', '$250K Warranty'], color: 'from-blue-500 to-cyan-500' },
  { name: 'Extended Validation', description: 'Maximum trust & green bar', price: 149.99, features: ['Single Domain', 'Green Address Bar', 'Full Verification', '3-5 Day Issuance', '$1M Warranty'], color: 'from-purple-500 to-pink-500' },
  { name: 'Wildcard SSL', description: 'Secure unlimited subdomains', price: 99.99, features: ['Unlimited Subdomains', '256-bit Encryption', 'Browser Trust', '10 Min Issuance', '$500K Warranty'], color: 'from-orange-500 to-red-500' }
]

const features = [
  { icon: Lock, title: 'Data Encryption', desc: '256-bit encryption protects all data in transit', color: 'from-green-500 to-emerald-500' },
  { icon: Shield, title: 'Trust & Credibility', desc: 'Show visitors your site is secure with padlock', color: 'from-blue-500 to-cyan-500' },
  { icon: Globe, title: 'SEO Boost', desc: 'Google ranks HTTPS sites higher in search', color: 'from-purple-500 to-pink-500' },
  { icon: Award, title: 'Warranty Protection', desc: 'Up to $1M warranty for added peace of mind', color: 'from-yellow-500 to-orange-500' },
  { icon: Zap, title: 'Instant Issuance', desc: 'DV certificates issued in under 10 minutes', color: 'from-indigo-500 to-violet-500' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert help with installation and setup', color: 'from-rose-500 to-red-500' },
]

export default function SSL() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'

  const { data: pricingData } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => settingsAPI.getPricing().then(res => res.data.pricing)
  })

  const sslPlans = pricingData?.ssl || defaultPlans

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
      <Helmet>
        <title>SSL Certificates - Magnetic Clouds</title>
        <meta name="description" content="Secure your website with industry-standard SSL encryption. Free SSL included with all hosting plans." />
      </Helmet>

      {/* Ultra Premium Hero with Plans */}
      <section className="relative min-h-screen bg-dark-950 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 via-dark-950 to-emerald-950/50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-green-500/10 via-transparent to-emerald-500/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6"
            >
              <ShieldCheck className="w-4 h-4" />
              Website Security
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6"
            >
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                SSL
              </span>{' '}
              Certificates
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-dark-300 max-w-2xl mx-auto"
            >
              Secure your website with industry-standard encryption. Free SSL included with all hosting plans.
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
              { value: '256-bit', label: 'Encryption' },
              { value: '<10min', label: 'Issuance' },
              { value: '$1M', label: 'Warranty' },
              { value: '99.9%', label: 'Compatibility' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sslPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                className={clsx(
                  "relative group rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02]",
                  plan.popular
                    ? "bg-gradient-to-b from-green-500/20 to-emerald-500/10 border-2 border-green-500/50"
                    : "bg-dark-800/50 backdrop-blur-sm border border-dark-700/50 hover:border-green-500/30"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    POPULAR
                  </div>
                )}

                <div className={clsx(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4",
                  plan.color
                )}>
                  <Lock className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-dark-400 mt-1">{plan.description}</p>

                <div className="my-6">
                  <span className="text-4xl font-bold text-white">{format(plan.price)}</span>
                  <span className="text-dark-400">/year</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-dark-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleAddToCart(plan)}
                  className={clsx(
                    "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                    plan.popular
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25"
                      : "bg-dark-700 text-white hover:bg-dark-600"
                  )}
                >
                  Get SSL <ArrowRight className="w-4 h-4" />
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
              <Lock className="w-5 h-5 text-green-400" />
              256-bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              All Major Browsers
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" />
              Warranty Protection
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
              Why{' '}
              <span className="text-gradient">SSL Matters</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Protect your website and build trust with your visitors
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
                className="group p-8 rounded-3xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 hover:shadow-xl hover:border-green-500/30 transition-all"
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
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-white"
          >
            Secure Your Website Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/80"
          >
            Get SSL protection in minutes. Free installation support included.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link to="/contact" className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
