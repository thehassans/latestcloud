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
                    {/* Status indicator with Logo - Magnet attracting clouds */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="relative">
                        {/* Ultra Premium Magnet + Clouds Vector Animation */}
                        
                        {/* Outer glow rings */}
                        <div className="absolute inset-0 -m-16">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: `radial-gradient(circle, transparent 60%, rgba(139, 92, 246, ${0.1 - i * 0.03}) 100%)`,
                                margin: `${i * 20}px`
                              }}
                              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                            />
                          ))}
                        </div>

                        {/* Magnetic field curved lines */}
                        <svg className="absolute inset-0 w-full h-full -m-8" viewBox="0 0 200 200" style={{ width: 'calc(100% + 64px)', height: 'calc(100% + 64px)' }}>
                          <defs>
                            <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <motion.path
                              key={angle}
                              d={`M 100 100 Q ${100 + 60 * Math.cos((angle - 20) * Math.PI / 180)} ${100 + 60 * Math.sin((angle - 20) * Math.PI / 180)} ${100 + 85 * Math.cos(angle * Math.PI / 180)} ${100 + 85 * Math.sin(angle * Math.PI / 180)}`}
                              fill="none"
                              stroke="url(#fieldGradient)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
                              transition={{ duration: 2.5, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          ))}
                        </svg>

                        {/* Floating clouds being attracted */}
                        {[
                          { x: -95, y: -70, delay: 0, scale: 1.2 },
                          { x: 100, y: -50, delay: 0.4, scale: 0.9 },
                          { x: -110, y: 40, delay: 0.8, scale: 1 },
                          { x: 95, y: 65, delay: 1.2, scale: 0.8 },
                          { x: -70, y: 90, delay: 1.6, scale: 0.7 },
                          { x: 80, y: -85, delay: 2, scale: 0.85 },
                          { x: -45, y: -100, delay: 2.4, scale: 0.75 },
                          { x: 55, y: 95, delay: 2.8, scale: 0.65 },
                        ].map((cloud, i) => (
                          <motion.div
                            key={i}
                            className="absolute left-1/2 top-1/2"
                            style={{ marginLeft: -12, marginTop: -12 }}
                            animate={{
                              x: [cloud.x, cloud.x * 0.2, cloud.x],
                              y: [cloud.y, cloud.y * 0.2, cloud.y],
                              opacity: [0.3, 1, 0.3],
                              scale: [cloud.scale, cloud.scale * 1.3, cloud.scale]
                            }}
                            transition={{
                              duration: 3.5,
                              delay: cloud.delay,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                              <path
                                d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
                                fill="url(#cloudGrad)"
                                stroke="rgba(139, 92, 246, 0.5)"
                                strokeWidth="0.5"
                              />
                              <defs>
                                <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#a78bfa" />
                                  <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </motion.div>
                        ))}

                        {/* Main magnet circle with premium design */}
                        <motion.div
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="relative z-10 w-44 h-44"
                        >
                          {/* Gradient border ring */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-[3px] shadow-2xl shadow-purple-500/40">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                              
                              {/* Vector Magnet SVG */}
                              <svg viewBox="0 0 100 100" className="w-28 h-28" fill="none">
                                <defs>
                                  <linearGradient id="magnetRed" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f43f5e" />
                                    <stop offset="100%" stopColor="#dc2626" />
                                  </linearGradient>
                                  <linearGradient id="magnetBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#4f46e5" />
                                  </linearGradient>
                                  <linearGradient id="magnetSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#e2e8f0" />
                                    <stop offset="100%" stopColor="#94a3b8" />
                                  </linearGradient>
                                  <filter id="magnetGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge>
                                      <feMergeNode in="coloredBlur"/>
                                      <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                  </filter>
                                </defs>
                                
                                {/* Horseshoe magnet shape */}
                                <g filter="url(#magnetGlow)">
                                  {/* Left pole (red/north) */}
                                  <path d="M25 30 L25 65 C25 75 35 85 50 85 L50 70 C40 70 35 65 35 58 L35 30 Z" fill="url(#magnetRed)" />
                                  <rect x="25" y="20" width="10" height="15" rx="2" fill="url(#magnetSilver)" />
                                  
                                  {/* Right pole (blue/south) */}
                                  <path d="M75 30 L75 65 C75 75 65 85 50 85 L50 70 C60 70 65 65 65 58 L65 30 Z" fill="url(#magnetBlue)" />
                                  <rect x="65" y="20" width="10" height="15" rx="2" fill="url(#magnetSilver)" />
                                  
                                  {/* Metallic shine */}
                                  <path d="M28 30 L28 55 C28 62 35 68 45 70 L45 72 C32 70 25 62 25 52 L25 30 Z" fill="rgba(255,255,255,0.2)" />
                                  <path d="M72 30 L72 55 C72 62 65 68 55 70 L55 72 C68 70 75 62 75 52 L75 30 Z" fill="rgba(255,255,255,0.15)" />
                                </g>
                                
                                {/* Magnetic attraction particles */}
                                <motion.g
                                  animate={{ opacity: [0.4, 1, 0.4] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <circle cx="50" cy="55" r="2" fill="#a78bfa" />
                                  <circle cx="45" cy="50" r="1.5" fill="#c4b5fd" />
                                  <circle cx="55" cy="50" r="1.5" fill="#c4b5fd" />
                                </motion.g>
                              </svg>
                              
                            </div>
                          </div>
                          
                          {/* Inner glow */}
                          <div className="absolute inset-4 rounded-full bg-gradient-to-t from-purple-500/20 to-transparent blur-xl" />
                        </motion.div>

                        {/* Energy particles flowing to magnet */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-purple-500"
                            style={{
                              left: '50%',
                              top: '50%',
                            }}
                            animate={{
                              x: [Math.cos(i * 30 * Math.PI / 180) * 100, 0],
                              y: [Math.sin(i * 30 * Math.PI / 180) * 100, 0],
                              opacity: [0, 1, 0],
                              scale: [0.5, 1.5, 0]
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.15,
                              repeat: Infinity,
                              ease: "easeIn"
                            }}
                          />
                        ))}
                        
                        {/* Pulse rings */}
                        <motion.div 
                          className="absolute inset-0 rounded-full border-2 border-purple-400/40"
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div 
                          className="absolute -inset-4 rounded-full border border-violet-400/30"
                          animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                        />
                        <motion.div 
                          className="absolute -inset-8 rounded-full border border-indigo-400/20"
                          animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                          transition={{ duration: 2, delay: 1, repeat: Infinity }}
                        />
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
