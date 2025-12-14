import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, Globe, CheckCircle, XCircle, ShoppingCart, Shield, Zap, Lock, ArrowRight, Headphones, RefreshCw } from 'lucide-react'
import { domainsAPI } from '../lib/api'
import { useCurrencyStore, useThemeStore, useCartStore } from '../store/useStore'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const features = [
  { icon: Shield, title: 'Free WHOIS Privacy', desc: 'Protect your personal information from public databases', color: 'from-green-500 to-emerald-500' },
  { icon: Lock, title: 'Domain Lock', desc: 'Prevent unauthorized transfers of your domain', color: 'from-blue-500 to-cyan-500' },
  { icon: Zap, title: 'Instant Activation', desc: 'Your domain is active within minutes of registration', color: 'from-yellow-500 to-orange-500' },
  { icon: RefreshCw, title: 'Easy Management', desc: 'Full DNS control with our intuitive control panel', color: 'from-purple-500 to-pink-500' },
  { icon: Globe, title: '500+ Extensions', desc: 'Choose from hundreds of TLDs including new gTLDs', color: 'from-indigo-500 to-violet-500' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert domain support whenever you need it', color: 'from-rose-500 to-red-500' },
]

export default function Domains() {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [searched, setSearched] = useState(!!searchParams.get('search'))
  const { format } = useCurrencyStore()
  const { themeStyle, theme } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'
  const isDark = theme === 'dark'

  const { data: tlds } = useQuery({
    queryKey: ['tlds'],
    queryFn: () => domainsAPI.getTLDs().then(res => res.data.tlds)
  })

  const { data: searchResults, isLoading: searching, refetch } = useQuery({
    queryKey: ['domain-search', searchTerm],
    queryFn: () => domainsAPI.search(searchTerm).then(res => res.data),
    enabled: searched && searchTerm.length > 0
  })

  // Auto-search on URL param
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchTerm(urlSearch)
      setSearched(true)
    }
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSearched(true)
    }
  }

  const handleAddToCart = (result) => {
    addItem({
      id: `domain-${result.domain}`,
      type: 'domain',
      name: result.domain,
      domain_name: result.domain,
      tld: result.tld,
      action: 'register',
      price: result.promo_price || result.price_register,
      years: 1,
      billingCycle: '1 year'
    })
    toast.success(`${result.domain} added to cart!`)
  }

  return (
    <>
      <Helmet>
        <title>Domain Registration - Magnetic Clouds</title>
        <meta name="description" content="Register your perfect domain name. Search from hundreds of TLDs at competitive prices." />
      </Helmet>

      {/* Ultra Premium Hero */}
      <section className={clsx(
        "relative min-h-[70vh] overflow-hidden flex items-center",
        isDark ? "bg-dark-950" : "bg-gradient-to-b from-emerald-50 via-white to-teal-50"
      )}>
        {/* Animated background */}
        <div className="absolute inset-0">
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-dark-950 to-teal-950/50" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-emerald-500/10 via-transparent to-teal-500/10 rounded-full blur-2xl" />
            </>
          ) : (
            <>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6",
                isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-100 border border-emerald-200 text-emerald-600"
              )}
            >
              <Globe className="w-4 h-4" />
              Domain Registration
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={clsx(
                "text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6",
                isDark ? "text-white" : "text-dark-900"
              )}
            >
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Domain
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={clsx("text-lg max-w-2xl mx-auto", isDark ? "text-dark-300" : "text-dark-600")}
            >
              Search from 500+ domain extensions and secure your online identity today.
            </motion.p>
          </div>

          {/* Premium Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20" />
              <div className={clsx(
                "relative backdrop-blur-sm rounded-2xl p-2 flex gap-2",
                isDark ? "bg-dark-800/80 border border-dark-700" : "bg-white/80 border border-emerald-100 shadow-lg"
              )}>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for your perfect domain name..."
                    className={clsx(
                      "w-full bg-transparent pl-12 pr-4 py-4 focus:outline-none text-lg",
                      isDark ? "text-white placeholder-dark-400" : "text-dark-900 placeholder-dark-400"
                    )}
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </motion.form>

          {/* Popular TLDs Quick View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {['.com', '.net', '.io', '.ai', '.co', '.dev'].map((ext) => (
              <span 
                key={ext} 
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm transition-all cursor-pointer",
                  isDark 
                    ? "bg-dark-800/50 border border-dark-700 text-dark-300 hover:border-emerald-500/50 hover:text-emerald-400"
                    : "bg-white/80 border border-emerald-100 text-dark-600 hover:border-emerald-300 hover:text-emerald-600 shadow-sm"
                )}
              >
                {ext}
              </span>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            {[
              { value: '500+', label: 'Extensions' },
              { value: 'Free', label: 'WHOIS Privacy' },
              { value: 'Instant', label: 'Activation' },
              { value: '24/7', label: 'Support' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{stat.value}</div>
                <div className={clsx("text-sm", isDark ? "text-dark-400" : "text-dark-500")}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      {searched && (
        <section className="py-16 bg-white dark:bg-dark-900">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-dark-900 dark:text-white">Search Results for "{searchTerm}"</h2>
            {searching ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-dark-500">Searching available domains...</p>
              </div>
            ) : searchResults?.results?.length > 0 ? (
              <div className="space-y-4">
                {searchResults.results.map((result, i) => (
                  <motion.div
                    key={result.domain}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={clsx(
                      "rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all",
                      result.available
                        ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-2 border-emerald-500/30 hover:border-emerald-500/50"
                        : "bg-dark-50 dark:bg-dark-800 border-2 border-dark-200 dark:border-dark-700"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        result.available
                          ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                          : "bg-dark-200 dark:bg-dark-700"
                      )}>
                        {result.available ?
                          <CheckCircle className="w-6 h-6 text-white" /> :
                          <XCircle className="w-6 h-6 text-dark-400" />}
                      </div>
                      <div>
                        <p className="font-bold text-xl text-dark-900 dark:text-white">{result.domain}</p>
                        <p className={clsx("text-sm font-medium", result.available ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
                          {result.available 
                            ? `✓ ${result.domain} is available!` 
                            : `✗ ${result.domain} is already registered`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {result.available && (
                        <>
                          <div className="text-right">
                            {result.promo_price ? (
                              <>
                                <p className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">{format(result.promo_price)}<span className="text-sm text-dark-500">/yr</span></p>
                                <p className="text-sm text-dark-400 line-through">{format(result.price_register)}/yr</p>
                              </>
                            ) : (
                              <p className="font-bold text-2xl text-dark-900 dark:text-white">{format(result.price_register)}<span className="text-sm text-dark-500">/yr</span></p>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(result)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                          >
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                          </button>
                        </>
                      )}
                      {!result.available && (
                        <p className="text-dark-400 text-sm">Try a different extension</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-dark-500">Enter a domain name to search</div>
            )}
          </div>
        </section>
      )}

      {/* Popular Extensions */}
      <section className={clsx("py-24", searched ? "bg-dark-50 dark:bg-dark-950" : "bg-white dark:bg-dark-900")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold font-display"
            >
              Popular{' '}
              <span className="text-gradient">Domain Extensions</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Choose from our most popular TLDs at competitive prices
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {tlds?.filter(t => t.is_popular).map((tld, i) => (
              <motion.div
                key={tld.tld}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-6 rounded-2xl bg-white dark:bg-dark-800 border border-dark-100 dark:border-dark-700 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all text-center cursor-pointer"
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">{tld.tld}</p>
                <p className="mt-3 font-bold text-lg text-dark-900 dark:text-white">{format(tld.price_register)}</p>
                <p className="text-xs text-dark-500">/year</p>
              </motion.div>
            ))}
          </div>
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
              Everything Included{' '}
              <span className="text-gradient">With Every Domain</span>
            </motion.h2>
            <p className="mt-4 text-dark-500 max-w-2xl mx-auto">
              Premium features at no extra cost
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
                className="group p-8 rounded-3xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 hover:shadow-xl hover:border-emerald-500/30 transition-all"
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
      <section className="py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-white"
          >
            Ready to Claim Your Domain?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/80"
          >
            Start building your online presence today with a memorable domain name.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              Search Domains <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
