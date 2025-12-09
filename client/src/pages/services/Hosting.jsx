import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, ArrowRight, Server, Shield, Clock, Zap, Globe, Headphones, Star, MessageCircle, Lock } from 'lucide-react'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import { settingsAPI } from '../../lib/api'
import { useAIAgent } from '../../contexts/AIAgentContext'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const defaultPlans = [
  { name: 'Starter Hosting', price: 2.99, features: ['1 Website', '10 GB SSD Storage', 'Free SSL Certificate', 'Weekly Backups', '24/7 Support', 'Plesk License Included'], color: 'from-blue-500 to-cyan-500' },
  { name: 'Professional Hosting', price: 5.99, popular: true, features: ['Unlimited Websites', '50 GB SSD Storage', 'Free SSL Certificate', 'Daily Backups', 'Priority Support', 'Plesk License Included', 'Free Domain'], color: 'from-primary-500 to-purple-500' },
  { name: 'Business Hosting', price: 9.99, features: ['Unlimited Websites', '100 GB NVMe Storage', 'Free SSL Certificate', 'Real-time Backups', 'Dedicated Support', 'Plesk License Included', 'Free Domain', 'Staging Environment'], color: 'from-purple-500 to-pink-500' }
]

const features = [
  { icon: Zap, title: 'NVMe SSD Storage', desc: 'Up to 10x faster than traditional drives', color: 'from-yellow-500 to-orange-500' },
  { icon: Shield, title: 'Free SSL & Security', desc: 'Enterprise-grade DDoS protection', color: 'from-green-500 to-emerald-500' },
  { icon: Clock, title: '99.99% Uptime SLA', desc: 'Guaranteed with credit compensation', color: 'from-blue-500 to-cyan-500' },
  { icon: Server, title: 'Plesk Control Panel', desc: 'Professional server management', color: 'from-purple-500 to-pink-500' },
  { icon: Globe, title: 'Global CDN', desc: 'Content delivery in 200+ locations', color: 'from-indigo-500 to-violet-500' },
  { icon: Headphones, title: '24/7 Expert Support', desc: 'Average response time under 5 min', color: 'from-rose-500 to-red-500' },
]

export default function Hosting() {
  const { format } = useCurrencyStore()
  const { themeStyle, theme } = useThemeStore()
  const { addItem } = useCartStore()
  const { setIsOpen: openChat } = useAIAgent()
  const isGradient = themeStyle === 'gradient'
  const isDark = theme === 'dark'

  const { data: pricingData } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => settingsAPI.getPricing().then(res => res.data.pricing)
  })

  const hostingPlans = pricingData?.hosting || defaultPlans

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

  const handleLiveChat = () => {
    openChat(true)
  }

  return (
    <>
      <Helmet>
        <title>Web Hosting - Magnetic Clouds</title>
        <meta name="description" content="Fast, reliable web hosting with free SSL, daily backups, and 24/7 support. Starting at $2.99/month." />
      </Helmet>

      {/* Hero with integrated pricing */}
      <section className={clsx(
        "relative overflow-hidden",
        isDark ? "bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" : "bg-gradient-to-b from-primary-50 via-white to-purple-50"
      )}>
        {/* Animated background */}
        <div className="absolute inset-0">
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          ) : (
            <>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm",
                isDark 
                  ? "bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30 text-primary-400" 
                  : "bg-primary-100 border border-primary-200 text-primary-600"
              )}
            >
              <Star className={clsx("w-4 h-4", isDark ? "fill-primary-400" : "fill-primary-500")} />
              #1 Rated Web Hosting Provider
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
              Lightning-Fast{' '}
              <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Web Hosting
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={clsx("mt-6 text-lg", isDark ? "text-dark-300" : "text-dark-600")}
            >
              Power your website with blazing-fast NVMe SSD storage, free SSL certificates, 
              and 24/7 expert support. 45-day money-back guarantee.
            </motion.p>
            
            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-8"
            >
              {[
                { value: '99.99%', label: 'Uptime' },
                { value: '<50ms', label: 'Response' },
                { value: '50,000+', label: 'Websites' },
                { value: '4.9/5', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-dark-900")}>{stat.value}</p>
                  <p className={clsx("text-sm", isDark ? "text-dark-400" : "text-dark-500")}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Pricing Cards - Now in hero */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {hostingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={clsx(
                  "relative p-8 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] group",
                  plan.popular
                    ? "bg-gradient-to-b from-primary-500/20 to-purple-500/10 border-2 border-primary-500/50 shadow-2xl shadow-primary-500/20"
                    : isDark 
                      ? "bg-white/5 border border-white/10 hover:border-white/20"
                      : "bg-white/80 border border-primary-100 hover:border-primary-300 shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                    ⭐ MOST POPULAR
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Server className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-dark-900")}>{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={clsx("text-5xl font-bold", isDark ? "text-white" : "text-dark-900")}>{format(plan.price)}</span>
                  <span className={isDark ? "text-dark-400" : "text-dark-500"}>/month</span>
                </div>
                
                <p className={clsx("mt-2 text-sm", isDark ? "text-dark-400" : "text-dark-500")}>Billed monthly, cancel anytime</p>
                
                <ul className="mt-8 space-y-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className={clsx("flex items-center gap-3 text-sm", isDark ? "text-dark-200" : "text-dark-600")}>
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleAddToCart(plan)}
                  className={clsx(
                    "w-full mt-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group-hover:gap-3",
                    plan.popular
                      ? "bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-lg hover:shadow-primary-500/30"
                      : isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                  )}
                >
                  Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            ))}
          </div>
          
          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={clsx("mt-12 flex flex-wrap justify-center items-center gap-6 text-sm", isDark ? "text-dark-400" : "text-dark-600")}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              45-Day Money Back
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" />
              Free SSL Included
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-purple-500" />
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
              Everything You Need to{' '}
              <span className="text-gradient">Succeed Online</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Enterprise-grade features at affordable prices. No hidden fees, no surprises.
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
                className="group p-8 rounded-3xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 hover:shadow-xl hover:border-primary-500/30 transition-all"
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
      <section className="py-24 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-white"
          >
            Need Help Choosing the Right Plan?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/80"
          >
            Our hosting experts are available 24/7 to help you find the perfect solution for your needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link to="/contact" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
              Contact Sales <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLiveChat}
              className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
