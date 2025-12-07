import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Archive, CheckCircle } from 'lucide-react'
import { useCurrencyStore, useThemeStore } from '../../store/useStore'
import clsx from 'clsx'

const plans = [
  { name: 'Basic', price: 2.99, storage: '10 GB', retention: '7 Days' },
  { name: 'Pro', price: 9.99, storage: '50 GB', retention: '30 Days' },
  { name: 'Enterprise', price: 24.99, storage: '200 GB', retention: '90 Days' },
]

export default function Backup() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const isGradient = themeStyle === 'gradient'

  return (
    <>
      <Helmet><title>Website Backup - Magnetic Clouds</title></Helmet>
      <section className={clsx("py-20", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950")}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-sm font-medium mb-6">
            <Archive className="w-4 h-4" /> Data Protection
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display">
            Website <span className={isGradient ? "text-gradient" : "text-primary-500"}>Backup</span>
          </h1>
          <p className="mt-6 text-lg text-dark-500 max-w-2xl mx-auto">
            Automated daily backups with one-click restore. Never lose your data again.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }} className="card p-8 text-center">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{format(plan.price)}</span>
                  <span className="text-dark-500">/mo</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{plan.storage} Storage</li>
                  <li className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{plan.retention} Retention</li>
                  <li className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Daily Backups</li>
                  <li className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />One-Click Restore</li>
                </ul>
                <button className="w-full btn-primary mt-6">Get Started</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
