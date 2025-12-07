import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Cloud as CloudIcon, CheckCircle } from 'lucide-react'
import { productsAPI } from '../../lib/api'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function Cloud() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'cloud-servers'],
    queryFn: () => productsAPI.getByCategory('cloud-servers').then(res => res.data)
  })

  const handleAddToCart = (product) => {
    addItem({
      id: product.uuid, type: 'product', product_uuid: product.uuid,
      name: product.name, price: product.price_monthly,
      billingCycle: 'monthly', product_type: 'cloud'
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>Cloud Servers - Magnetic Clouds</title>
      </Helmet>

      <section className={clsx(
        "relative py-20 overflow-hidden",
        isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
            <CloudIcon className="w-4 h-4" /> Cloud Infrastructure
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">
            Scalable <span className={isGradient ? "text-gradient" : "text-primary-500"}>Cloud Servers</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Auto-scaling cloud infrastructure with 99.99% uptime SLA and global availability.
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {data?.products?.map((product, i) => (
                <motion.div key={product.uuid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }} className="card p-8">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{format(product.price_monthly)}</span>
                    <span className="text-dark-500">/mo</span>
                  </div>
                  <ul className="mt-6 space-y-2">
                    {product.features?.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleAddToCart(product)} className="w-full btn-primary mt-6">
                    Deploy Now
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
