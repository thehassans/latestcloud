import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Moon, Sun, ShoppingCart, Globe, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore, useAuthStore, useCartStore, useCurrencyStore, useSiteSettingsStore } from '../../store/useStore'
import clsx from 'clsx'

const navItems = [
  {
    label: 'Hosting',
    children: [
      { to: '/hosting', label: 'Web Hosting' },
      { to: '/vps', label: 'VPS Servers' },
      { to: '/cloud', label: 'Cloud Servers' },
      { to: '/dedicated', label: 'Dedicated Servers' },
    ]
  },
  {
    label: 'Domains',
    to: '/domains'
  },
  {
    label: 'Security',
    children: [
      { to: '/ssl', label: 'SSL Certificates' },
      { to: '/email', label: 'Professional Email' },
      { to: '/backup', label: 'Website Backup' },
    ]
  },
  {
    label: 'Datacenters',
    to: '/datacenters'
  },
  {
    label: 'Support',
    to: '/support'
  },
]

const currencies = ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'SGD', 'AUD']
const languages = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useThemeStore()
  const { isAuthenticated, user } = useAuthStore()
  const { items: cartItems } = useCartStore()
  const { currency, setCurrency } = useCurrencyStore()
  const { siteName, logo } = useSiteSettingsStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code)
    setActiveDropdown(null)
  }

  return (
    <header className={clsx(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl shadow-lg" 
        : "bg-transparent"
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30 overflow-hidden"
            >
              {logo && logo.startsWith('data:image') ? (
                <img src={logo} alt="" className="w-full h-full object-cover" />
              ) : (
                'MC'
              )}
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl">{siteName?.split(' ')[0] || 'Magnetic'}</span>
              <span className="font-display font-bold text-xl text-gradient ml-1">{siteName?.split(' ')[1] || 'Clouds'}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500 font-medium transition-colors">
                    {item.label}
                    <ChevronDown className={clsx(
                      "w-4 h-4 transition-transform",
                      activeDropdown === item.label && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-56 py-2 mt-1 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-100 dark:border-dark-700"
                      >
                        {item.children.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) => clsx(
                              "block px-4 py-2.5 text-sm font-medium transition-colors",
                              isActive 
                                ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400" 
                                : "text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700"
                            )}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => clsx(
                    "px-4 py-2 font-medium transition-colors",
                    isActive 
                      ? "text-primary-500" 
                      : "text-dark-700 dark:text-dark-300 hover:text-primary-500"
                  )}
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'currency' ? null : 'currency')}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
              >
                {currency}
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'currency' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-24 py-2 mt-1 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-100 dark:border-dark-700"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setActiveDropdown(null) }}
                        className={clsx(
                          "block w-full text-left px-4 py-2 text-sm transition-colors",
                          c === currency 
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" 
                            : "hover:bg-dark-50 dark:hover:bg-dark-700"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                className="p-2 text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'language' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-32 py-2 mt-1 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-100 dark:border-dark-700"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={clsx(
                          "block w-full text-left px-4 py-2 text-sm transition-colors",
                          i18n.language === lang.code 
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" 
                            : "hover:bg-dark-50 dark:hover:bg-dark-700"
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-dark-700 dark:text-dark-300 hover:text-primary-500 font-medium transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-dark-600 dark:text-dark-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  item.children ? (
                    <div key={item.label} className="space-y-1">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-4 py-3 text-dark-700 dark:text-dark-300 font-medium"
                      >
                        {item.label}
                        <ChevronDown className={clsx(
                          "w-4 h-4 transition-transform",
                          activeDropdown === item.label && "rotate-180"
                        )} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1"
                          >
                            {item.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2 text-dark-600 dark:text-dark-400 hover:text-primary-500"
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-dark-700 dark:text-dark-300 font-medium hover:text-primary-500"
                    >
                      {item.label}
                    </NavLink>
                  )
                ))}
                <div className="pt-4 border-t border-dark-200 dark:border-dark-700 space-y-2">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center bg-primary-500 text-white font-medium rounded-xl"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center text-dark-700 dark:text-dark-300 font-medium"
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center bg-primary-500 text-white font-medium rounded-xl"
                      >
                        {t('nav.signup')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
