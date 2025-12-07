import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'
import { useCurrencyStore, useThemeStore } from '../../store/useStore'
import clsx from 'clsx'

const plans = [
  { name: 'Starter', price: 1.99, storage: '5 GB', accounts: '5 Accounts' },
  { name: 'Business', price: 4.99, storage: '25 GB', accounts: '25 Accounts' },
  { name: 'Enterprise', price: 9.99, storage: '100 GB', accounts: 'Unlimited' },
]

export default function Email() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const isGradient = themeStyle === 'gradient'

  return (
    <>
      <Helmet><title>Professional Email - Magnetic Clouds</title></Helmet>
      <section className={clsx("py-20", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950")}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full text-sm font-medium mb-6">
            <Mail className="w-4 h-4" /> Business Email
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display">
            Professional <span className={isGradient ? "text-gradient" : "text-primary-500"}>Email</span>
          </h1>
          <p className="mt-6 text-lg text-dark-500 max-w-2xl mx-auto">
            Build trust with professional email addresses using your own domain.
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
                  <li className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{plan.accounts}</li>
                  <li className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Spam Protection</li>
                  <li className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Mobile Access</li>
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
