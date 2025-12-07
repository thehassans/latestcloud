import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff, User, Phone, Building, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { authAPI } from '../../lib/api'
import { useAuthStore, useThemeStore } from '../../store/useStore'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', check: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', check: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter', check: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number', check: (p) => /[0-9]/.test(p) },
]

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { themeStyle } = useThemeStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    company: '',
    terms: false
  })

  const isGradient = themeStyle === 'gradient'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate password
    const allRequirementsMet = passwordRequirements.every(req => req.check(form.password))
    if (!allRequirementsMet) {
      setError('Please meet all password requirements')
      return
    }

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }

    if (!form.terms) {
      setError('Please accept the terms of service')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        company: form.company || undefined
      })

      setUser(response.data.user, response.data.token)
      toast.success(t('auth.signupSuccess'))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Account - Magnetic Clouds</title>
      </Helmet>

      <div className={clsx(
        "min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4",
        isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className={clsx(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl",
                isGradient 
                  ? "bg-gradient-to-br from-primary-500 to-secondary-500" 
                  : "bg-primary-500"
              )}>
                MC
              </div>
            </Link>
            <h1 className="text-3xl font-bold font-display">Create your account</h1>
            <p className="mt-2 text-dark-500">Join thousands of satisfied customers</p>
          </div>

          {/* Register form */}
          <div className="glass-card p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.firstName')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      placeholder="John"
                      className="input pl-12"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.lastName')}</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    placeholder="Doe"
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input pl-12"
                    required
                  />
                </div>
              </div>

              {/* Phone & Company row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+880 1XXX-XXXXXX"
                      className="input pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.company')}</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Company name"
                      className="input pl-12"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password requirements */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.id}
                      className={clsx(
                        "flex items-center gap-2 text-xs",
                        req.check(form.password) ? "text-green-500" : "text-dark-400"
                      )}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.confirmPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="password"
                    value={form.confirm_password}
                    onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                    placeholder="••••••••"
                    className="input pl-12"
                    required
                  />
                </div>
                {form.confirm_password && form.password !== form.confirm_password && (
                  <p className="mt-2 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-dark-600 dark:text-dark-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-500 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  "w-full btn-primary py-3.5",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {t('auth.createAccount')}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Login link */}
          <p className="mt-8 text-center text-dark-600 dark:text-dark-400">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
              {t('auth.login')}
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
