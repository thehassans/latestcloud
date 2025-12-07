import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, Globe, CheckCircle, XCircle, ShoppingCart } from 'lucide-react'
import { domainsAPI } from '../lib/api'
import { useCurrencyStore, useThemeStore, useCartStore } from '../store/useStore'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function Domains() {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [searched, setSearched] = useState(!!searchParams.get('search'))
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const { addItem } = useCartStore()
  const isGradient = themeStyle === 'gradient'

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

      <section className={clsx("py-20", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950")}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm font-medium mb-6">
            <Globe className="w-4 h-4" /> Domain Registration
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">
            Find Your Perfect <span className={isGradient ? "text-gradient" : "text-primary-500"}>Domain</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-dark-500 max-w-2xl mx-auto">
            Search from hundreds of domain extensions and secure your online identity.
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter your domain name..." className="input-lg pl-12" />
              </div>
              <button type="submit" className="btn-primary px-8">Search</button>
            </div>
          </motion.form>
        </div>
      </section>

      {searched && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            {searching ? (
              <div className="text-center py-12">Searching domains...</div>
            ) : searchResults?.results?.length > 0 ? (
              <div className="space-y-4">
                {searchResults.results.map((result, i) => (
                  <motion.div key={result.domain} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={clsx("card p-4 flex items-center justify-between", 
                      result.available 
                        ? "border-2 border-green-500 bg-green-50 dark:bg-green-900/20" 
                        : "border-2 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10")}>
                    <div className="flex items-center gap-4">
                      {result.available ? 
                        <CheckCircle className="w-8 h-8 text-green-500" /> : 
                        <XCircle className="w-8 h-8 text-red-500" />}
                      <div>
                        <p className="font-bold text-lg">{result.domain}</p>
                        <p className={clsx("text-sm font-medium", result.available ? "text-green-600" : "text-red-500")}>
                          {result.available ? '✓ Available - Register Now!' : '✗ Domain is Taken'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {result.available && (
                        <>
                          <div className="text-right">
                            {result.promo_price ? (
                              <>
                                <p className="font-bold text-xl text-green-600">{format(result.promo_price)}/yr</p>
                                <p className="text-sm text-dark-400 line-through">{format(result.price_register)}/yr</p>
                              </>
                            ) : (
                              <p className="font-bold text-xl">{format(result.price_register)}/yr</p>
                            )}
                          </div>
                          <button onClick={() => handleAddToCart(result)} className="btn-primary">
                            <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                          </button>
                        </>
                      )}
                      {!result.available && (
                        <div className="text-right">
                          <p className="text-dark-400 text-sm">Try a different extension</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-dark-500">Enter a domain name to search</div>
            )}
          </div>
        </section>
      )}

      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Popular Domain Extensions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {tlds?.filter(t => t.is_popular).map((tld) => (
              <div key={tld.tld} className="card p-4 text-center hover:shadow-lg transition-shadow">
                <p className="text-2xl font-bold text-primary-500">{tld.tld}</p>
                <p className="mt-2 font-semibold">{format(tld.price_register)}</p>
                <p className="text-xs text-dark-500">/year</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
