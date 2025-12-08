import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Search, Server, Cloud, Database, Globe, Shield, Mail,
  Archive, CheckCircle, Zap, Clock, HeadphonesIcon, MapPin,
  ArrowRight, ChevronRight, Star, Users, Award, TrendingUp
} from 'lucide-react'
import { productsAPI, domainsAPI, settingsAPI } from '../lib/api'
import { useCurrencyStore, useThemeStore, useSiteSettingsStore } from '../store/useStore'
import clsx from 'clsx'

const features = [
  { icon: Zap, title: '99.9% Uptime', desc: 'Enterprise-grade reliability', color: 'from-yellow-500 to-orange-500' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Expert help anytime', color: 'from-green-500 to-emerald-500' },
  { icon: Shield, title: 'Free SSL', desc: 'Secure your website', color: 'from-blue-500 to-cyan-500' },
  { icon: Archive, title: 'Daily Backups', desc: 'Your data is safe', color: 'from-purple-500 to-pink-500' },
  { icon: Clock, title: '45-Day Money Back', desc: 'Risk-free guarantee', color: 'from-red-500 to-rose-500' },
  { icon: MapPin, title: 'Global Network', desc: '10+ locations', color: 'from-indigo-500 to-violet-500' },
]

const services = [
  { icon: Server, title: 'Web Hosting', desc: 'Fast & reliable shared hosting', to: '/hosting', price: 2.99 },
  { icon: Database, title: 'VPS Servers', desc: 'Full root access & control', to: '/vps', price: 9.99 },
  { icon: Cloud, title: 'Cloud Servers', desc: 'Scalable cloud infrastructure', to: '/cloud', price: 24.99 },
  { icon: Server, title: 'Dedicated Servers', desc: 'Maximum performance', to: '/dedicated', price: 99.99 },
  { icon: Globe, title: 'Domains', desc: 'Register your perfect domain', to: '/domains', price: 2.99 },
  { icon: Shield, title: 'SSL Certificates', desc: 'Secure your website', to: '/ssl', price: 9.99 },
  { icon: Mail, title: 'Professional Email', desc: 'Business email solutions', to: '/email', price: 1.99 },
  { icon: Archive, title: 'Website Backup', desc: 'Automated backups', to: '/backup', price: 2.99 },
]

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '10+', label: 'Data Centers' },
]

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { logo, siteName } = useSiteSettingsStore()
  const [domainSearch, setDomainSearch] = useState('')

  const { data: datacenters } = useQuery({
    queryKey: ['datacenters'],
    queryFn: () => settingsAPI.getDatacenters().then(res => res.data.datacenters)
  })

  const handleDomainSearch = (e) => {
    e.preventDefault()
    if (domainSearch.trim()) {
      navigate(`/domains?search=${encodeURIComponent(domainSearch)}`)
    }
  }

  const isGradient = themeStyle === 'gradient'

  return (
    <>
      <Helmet>
        <title>Magnetic Clouds - Premium Web Hosting from Bangladesh</title>
        <meta name="description" content="Premium web hosting, VPS, cloud & dedicated servers from Bangladesh. 24/7 support, free SSL, 45-day money back guarantee." />
      </Helmet>

      {/* Hero Section */}
      <section className={clsx(
        "relative min-h-[90vh] flex items-center overflow-hidden",
        isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950"
      )}>
        {/* Background elements */}
        {isGradient && (
          <>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-primary-500/20 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary-500/20 to-transparent blur-3xl" />
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Trusted by 50,000+ Customers Worldwide
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
                {t('hero.title')}
                <span className={clsx(
                  "block mt-2",
                  isGradient ? "text-gradient" : "text-primary-500"
                )}>
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              
              <p className="mt-6 text-lg sm:text-xl text-dark-600 dark:text-dark-400 max-w-xl">
                {t('hero.subtitle')}
              </p>

              {/* Domain search */}
              <form onSubmit={handleDomainSearch} className="mt-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      value={domainSearch}
                      onChange={(e) => setDomainSearch(e.target.value)}
                      placeholder={t('hero.searchDomain')}
                      className="input-lg pl-12"
                    />
                  </div>
                  <button type="submit" className="btn-primary px-8 py-4 text-lg">
                    {t('hero.search')}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-dark-500">
                  <span>Popular:</span>
                  {['.com', '.net', '.io', '.ai'].map((tld) => (
                    <button
                      key={tld}
                      type="button"
                      onClick={() => setDomainSearch(`yourdomain${tld}`)}
                      className="px-3 py-1 bg-dark-100 dark:bg-dark-800 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-colors"
                    >
                      {tld}
                    </button>
                  ))}
                </div>
              </form>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/hosting" className="btn-primary">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/pricing" className="btn-outline">
                  View Pricing
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 border-2 border-white dark:border-dark-900 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-dark-500">4.9/5 from 2000+ reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Right content - Ultra Premium Status Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Premium Glass Card */}
                <div className="relative">
                  {/* Glow effect behind */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl rounded-full" />
                  
                  {/* Main premium status card */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    {/* Status indicator with Logo */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="relative">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 p-1 shadow-2xl shadow-primary-500/40"
                        >
                          <div className="w-full h-full rounded-full bg-white dark:bg-dark-900 flex items-center justify-center overflow-hidden p-2">
                            {logo && logo.startsWith('data:image') ? (
                              <img src={logo} alt="" className="w-32 h-32 object-contain" />
                            ) : (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center"
                              >
                                <CheckCircle className="w-12 h-12 text-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                        {/* Pulse rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-primary-400/30 animate-ping" />
                        <div className="absolute -inset-4 rounded-full border border-primary-400/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Status text */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                          All Systems Operational
                        </span>
                      </h3>
                      <p className="text-dark-600 dark:text-dark-400">Real-time infrastructure monitoring</p>
                    </div>

                    {/* Stats row with 4 columns - uniform alignment */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Active Users', value: '50,000+', color: 'text-primary-400' },
                        { label: 'Uptime', value: '99.99%', color: 'text-green-400' },
                        { label: 'Response', value: '<50ms', color: 'text-blue-400' },
                        { label: 'Performance', value: '+99.9%', color: 'text-emerald-400' }
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="text-center p-5 rounded-2xl bg-white/80 dark:bg-dark-800/50 backdrop-blur border border-gray-200 dark:border-dark-700 shadow-lg"
                        >
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="text-xs text-dark-500 mt-2">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className={clsx(
                  "text-4xl md:text-5xl font-bold font-display",
                  isGradient ? "text-gradient" : "text-primary-400"
                )}>
                  {stat.value}
                </p>
                <p className="mt-2 text-dark-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-heading"
            >
              Why Choose <span className={isGradient ? "text-gradient" : "text-primary-500"}>Magnetic Clouds</span>?
            </motion.h2>
            <p className="section-subheading mx-auto">
              Experience enterprise-grade hosting with features designed for your success.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover p-6"
              >
                <div className={clsx(
                  "feature-icon",
                  isGradient ? `bg-gradient-to-br ${feature.color}` : "bg-primary-500"
                )}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-dark-600 dark:text-dark-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={clsx(
        "section",
        isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-900"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-heading"
            >
              Our <span className={isGradient ? "text-gradient" : "text-primary-500"}>Services</span>
            </motion.h2>
            <p className="section-subheading mx-auto">
              From shared hosting to dedicated servers, we have the perfect solution for you.
            </p>
          </div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={service.to}
                  className="block card-hover p-6 group"
                >
                  <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                    isGradient 
                      ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white" 
                      : "bg-primary-100 dark:bg-primary-900/30 text-primary-500"
                  )}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-primary-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-dark-500 text-sm">{service.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-dark-400">Starting at</span>
                    <span className="font-bold text-primary-500">{format(service.price)}/mo</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={clsx(
            "relative rounded-3xl p-8 md:p-16 overflow-hidden",
            isGradient 
              ? "bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500" 
              : "bg-primary-500"
          )}>
            {/* Background pattern */}
            {isGradient && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,white_0%,transparent_50%)]" />
              </div>
            )}
            
            <div className="relative text-center text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Join thousands of satisfied customers and experience the Magnetic Clouds difference.
                45-day money-back guarantee on all plans.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/hosting"
                  className="btn bg-white text-primary-600 hover:bg-dark-100 shadow-xl"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="btn bg-white/10 hover:bg-white/20 text-white border border-white/30"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
