import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, ArrowRight, Server, Shield, Clock, Zap } from 'lucide-react'
import { productsAPI } from '../../lib/api'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import clsx from 'clsx'
import toast from 'react-hot-toast'

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

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'web-hosting'],
    queryFn: () => productsAPI.getByCategory('web-hosting').then(res => res.data)
  })

  const handleAddToCart = (product, billingCycle) => {
    const price = billingCycle === 'monthly' ? product.price_monthly : product.price_annual / 12
    addItem({
      id: product.uuid,
      type: 'product',
      product_uuid: product.uuid,
      name: product.name,
      price: billingCycle === 'monthly' ? product.price_monthly : product.price_annual,
      billingCycle,
      product_type: 'hosting'
    })
    toast.success(`${product.name} added to cart!`)
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
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Choose Your Plan</h2>
            <p className="section-subheading mx-auto">
              All plans include free SSL, daily backups, and 24/7 support.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-8 animate-pulse">
                  <div className="h-6 bg-dark-200 dark:bg-dark-700 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-dark-200 dark:bg-dark-700 rounded w-1/3 mb-6" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-dark-200 dark:bg-dark-700 rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {data?.products?.map((product, i) => (
                <motion.div
                  key={product.uuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={clsx(
                    "card p-8 relative",
                    product.is_featured && "pricing-popular"
                  )}
                >
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-dark-500 text-sm mt-1">{product.description}</p>
                  
                  <div className="mt-6">
                    <span className="text-4xl font-bold">{format(product.price_monthly)}</span>
                    <span className="text-dark-500">/month</span>
                  </div>
                  
                  {product.price_annual && (
                    <p className="text-sm text-dark-500 mt-1">
                      or {format(product.price_annual)}/year (save {Math.round((1 - product.price_annual / (product.price_monthly * 12)) * 100)}%)
                    </p>
                  )}

                  <ul className="mt-6 space-y-3">
                    {product.features?.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={() => handleAddToCart(product, 'monthly')}
                      className={clsx(
                        "w-full btn",
                        product.is_featured ? "btn-primary" : "btn-outline"
                      )}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
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
