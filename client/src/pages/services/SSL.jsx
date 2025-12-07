import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Shield, CheckCircle } from 'lucide-react'
import { productsAPI } from '../../lib/api'
import { useCurrencyStore, useThemeStore, useCartStore } from '../../store/useStore'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function SSL() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'ssl-certificates'],
    queryFn: () => productsAPI.getByCategory('ssl-certificates').then(res => res.data)
  })

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
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? <div className="text-center py-12">Loading...</div> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.products?.map((product, i) => (
                <motion.div key={product.uuid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }} className="card p-6">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-dark-500 mt-1">{product.description}</p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">{format(product.price_annual)}</span>
                    <span className="text-dark-500">/year</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {product.features?.slice(0, 4).map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />{f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full btn-primary mt-6">Get SSL</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
