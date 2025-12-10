import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Mail, Lock, CheckCircle } from 'lucide-react'
import { useCartStore, useCurrencyStore, useAuthStore } from '../store/useStore'
import clsx from 'clsx'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, removeItem, updateQuantity, coupon, setCoupon, removeCoupon, getTotal, clearCart } = useCartStore()
  const { format } = useCurrencyStore()
  const { isAuthenticated } = useAuthStore()
  const [couponCode, setCouponCode] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const { subtotal, discount, total } = getTotal()
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleGuestCheckout = () => {
    if (!guestEmail.trim()) {
      setEmailError('Please enter your email')
      return
    }
    if (!validateEmail(guestEmail)) {
      setEmailError('Please enter a valid email')
      return
    }
    setEmailError('')
    // Store email for checkout
    sessionStorage.setItem('guestEmail', guestEmail)
    navigate('/checkout')
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCoupon({ code: couponCode, type: 'percentage', value: 10 })
      setCouponCode('')
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Cart - Magnetic Clouds</title></Helmet>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <ShoppingCart className="w-24 h-24 text-dark-300 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-dark-500 mb-6">Add some services to get started</p>
          <Link to="/hosting" className="btn-primary">Browse Hosting Plans</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>{`Cart (${items.length}) - Magnetic Clouds`}</title></Helmet>
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div key={`${item.id}-${item.billingCycle}`} initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="card p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-dark-500">{item.billingCycle}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="font-bold">{format(item.price)}</p>
                    <button onClick={() => removeItem(item.id, item.billingCycle)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              <button onClick={clearCart} className="text-sm text-dark-500 hover:text-red-500">
                Clear Cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-dark-500">Subtotal</span>
                    <span>{format(subtotal)}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-green-500">
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" /> {coupon.code}
                        <button onClick={removeCoupon} className="text-red-500 text-xs ml-2">Remove</button>
                      </span>
                      <span>-{format(discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{format(total)}</span>
                  </div>
                </div>

                {!coupon && (
                  <div className="flex gap-2 mb-6">
                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                      placeholder="Coupon code" className="input flex-1" />
                    <button onClick={handleApplyCoupon} className="btn-secondary">Apply</button>
                  </div>
                )}

                {isAuthenticated ? (
                  <Link to="/checkout" className="btn-primary w-full justify-center">
                    Checkout <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input 
                          type="email" 
                          value={guestEmail} 
                          onChange={e => { setGuestEmail(e.target.value); setEmailError(''); }}
                          placeholder="Enter your email"
                          className={clsx(
                            "input pl-11 w-full",
                            emailError && "border-red-500 focus:ring-red-500"
                          )}
                        />
                      </div>
                      {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>
                    <button onClick={handleGuestCheckout} className="btn-primary w-full justify-center">
                      Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <div className="flex items-center gap-2 text-xs text-dark-500">
                      <Lock className="w-4 h-4" />
                      <span>You'll set your password after payment</span>
                    </div>
                  </div>
                )}

                <p className="mt-4 text-xs text-dark-500 text-center">
                  45-day money-back guarantee on all plans
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
