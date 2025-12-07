import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { MessageSquare, FileText, Phone, Mail, HelpCircle, Book, Ticket, Search } from 'lucide-react'
import { useThemeStore, useAuthStore } from '../store/useStore'
import clsx from 'clsx'

const supportOptions = [
  { icon: Ticket, title: 'Submit a Ticket', desc: 'Get help from our support team', to: '/dashboard/tickets/new', color: 'from-primary-500 to-secondary-500' },
  { icon: Book, title: 'Knowledge Base', desc: 'Browse our help articles', to: '/kb', color: 'from-green-500 to-emerald-500' },
  { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with us in real-time', to: '#', color: 'from-blue-500 to-cyan-500' },
  { icon: Phone, title: 'Phone Support', desc: '+880 1XXX-XXXXXX', to: 'tel:+8801XXXXXXXXX', color: 'from-yellow-500 to-orange-500' },
]

const popularArticles = [
  'How to set up your first website',
  'Connecting a domain to your hosting',
  'Email configuration guide',
  'SSL certificate installation',
  'cPanel basics tutorial',
  'DNS management guide',
]

export default function Support() {
  const { themeStyle } = useThemeStore()
  const { isAuthenticated } = useAuthStore()
  const isGradient = themeStyle === 'gradient'

  return (
    <>
      <Helmet><title>Support - Magnetic Clouds</title></Helmet>

      <section className={clsx("py-20", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950")}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-display">
            How Can We <span className={isGradient ? "text-gradient" : "text-primary-500"}>Help</span>?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-dark-500 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or issues.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input type="text" placeholder="Search for help..." className="input-lg pl-12 w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, i) => (
              <motion.div key={option.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}>
                <Link to={option.to} className="block card p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center text-white",
                    isGradient ? `bg-gradient-to-br ${option.color}` : "bg-primary-500")}>
                    <option.icon className="w-7 h-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{option.title}</h3>
                  <p className="mt-1 text-dark-500 text-sm">{option.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={clsx("section", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-900")}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center">Popular Help Articles</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {popularArticles.map((article, i) => (
              <motion.div key={article} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link to="/kb" className="flex items-center gap-3 p-4 card hover:shadow-md transition-shadow">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">{article}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Still Need Help?</h2>
          <p className="mt-4 text-dark-500 max-w-xl mx-auto">
            Our expert support team is available around the clock to assist you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard/tickets/new" className="btn-primary">Open Support Ticket</Link>
            ) : (
              <Link to="/login" className="btn-primary">Login to Get Support</Link>
            )}
            <Link to="/contact" className="btn-secondary">Contact Sales</Link>
          </div>
        </div>
      </section>
    </>
  )
}
