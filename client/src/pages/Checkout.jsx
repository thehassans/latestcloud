import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, Lock, CheckCircle, Building2, Banknote, Upload, X, Loader2, Smartphone, Wallet, Mail, MapPin, User, Shield, RefreshCcw, Star, Zap, Clock, Award } from 'lucide-react'
import { useCartStore, useCurrencyStore, useAuthStore } from '../store/useStore'
import { ordersAPI, paymentsAPI, settingsAPI, authAPI } from '../lib/api'
import toast from 'react-hot-toast'
import clsx from 'clsx'

// Service reviews for checkout
const serviceReviews = [
  { name: 'Sarah M.', service: 'VPS Hosting', rating: 5, comment: 'Blazing fast servers!', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Ahmed H.', service: 'Dedicated Server', rating: 5, comment: 'Best support ever!', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Emily C.', service: 'Cloud Server', rating: 5, comment: 'Seamless experience', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
]

const trustBadges = [
  { icon: Shield, label: '256-bit SSL', desc: 'Encrypted' },
  { icon: RefreshCcw, label: '45 Days', desc: 'Money Back' },
  { icon: Zap, label: '99.9%', desc: 'Uptime' },
  { icon: Clock, label: '24/7', desc: 'Support' },
]

const getPaymentMethods = (settings) => {
  const methods = []
  if (settings.stripe_enabled) {
    methods.push({ id: 'card', name: 'Credit/Debit Card', icon: CreditCard, requiresProof: false, isStripe: true, color: 'from-[#635BFF] to-[#8B7DFF]' })
  }
  if (settings.paypal_enabled) {
    methods.push({ id: 'paypal', name: 'PayPal', icon: Wallet, requiresProof: true, color: 'from-[#003087] to-[#009cde]' })
  }
  if (settings.bkash_enabled) {
    methods.push({ id: 'bkash', name: 'bKash', icon: Smartphone, requiresProof: true, color: 'from-[#E2136E] to-[#ff4d94]', details: settings.bkash_details })
  }
  if (settings.rocket_enabled) {
    methods.push({ id: 'rocket', name: 'Rocket', icon: Smartphone, requiresProof: true, color: 'from-[#8C3494] to-[#b94dc2]', details: settings.rocket_details })
  }
  if (settings.bank_transfer_enabled) {
    methods.push({ id: 'bank', name: 'Bank Transfer', icon: Building2, requiresProof: true, color: 'from-emerald-600 to-emerald-400', details: settings.bank_details })
  }
  if (settings.cash_payment_enabled) {
    methods.push({ id: 'cash', name: 'Cash Payment', icon: Banknote, requiresProof: true, color: 'from-amber-600 to-amber-400' })
  }
  return methods
}

// Stripe Card Input Styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
}

// Stripe-enabled checkout form (uses Stripe hooks)
function StripeCheckoutForm({ paymentSettings }) {
  const stripe = useStripe()
  const elements = useElements()
  return <CheckoutFormInner stripeEnabled={true} stripe={stripe} elements={elements} paymentSettings={paymentSettings} />
}

// Main checkout form component
function CheckoutFormInner({ stripeEnabled, stripe = null, elements = null, paymentSettings = {} }) {
  const navigate = useNavigate()
  const { items, coupon, getTotal, clearCart } = useCartStore()
  const { format } = useCurrencyStore()
  const { user, isAuthenticated, login } = useAuthStore()
  const { subtotal, discount, total } = getTotal()
  const [loading, setLoading] = useState(false)
  
  const paymentMethods = getPaymentMethods({ ...paymentSettings, stripe_enabled: stripeEnabled })
  
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]?.id || 'card')
  const [paymentProof, setPaymentProof] = useState(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState(null)
  const [cardComplete, setCardComplete] = useState(false)
  
  // Guest checkout fields
  const guestEmail = sessionStorage.getItem('guestEmail') || ''
  const [email, setEmail] = useState(user?.email || guestEmail)
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod)

  const handleProofUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentProof(reader.result)
        setPaymentProofPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProof = () => {
    setPaymentProof(null)
    setPaymentProofPreview(null)
  }

  const handleCheckout = async () => {
    // Validate required fields
    if (!email || !firstName || !lastName) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (selectedMethod?.requiresProof && !paymentProof) {
      toast.error('Please upload payment proof')
      return
    }

    // Validate Stripe card if card payment selected
    if (paymentMethod === 'card' && stripeEnabled) {
      if (!stripe || !elements) {
        toast.error('Payment system not ready. Please try again.')
        return
      }
      if (!cardComplete) {
        toast.error('Please complete your card details')
        return
      }
    }

    setLoading(true)
    try {
      const orderItems = items.map(item => ({
        type: item.type,
        product_uuid: item.product_uuid,
        domain_name: item.domain_name,
        tld: item.tld,
        action: item.action,
        billing_cycle: item.billingCycle,
        product_type: item.product_type,
        years: item.years,
        quantity: item.quantity || 1
      }))

      // For guest checkout, create account first
      let userToken = null
      let createdUser = null
      if (!isAuthenticated) {
        try {
          const registerRes = await authAPI.guestCheckout({
            email,
            first_name: firstName,
            last_name: lastName,
            address,
            city,
            country
          })
          userToken = registerRes.data.token
          createdUser = registerRes.data.user
          // Auto login
          login(createdUser, userToken)
        } catch (regErr) {
          // If user exists, continue with order
          if (!regErr.response?.data?.error?.includes('exists')) {
            toast.error(regErr.response?.data?.error || 'Failed to create account')
            return
          }
        }
      }

      // Create order
      const orderRes = await ordersAPI.create({
        items: orderItems,
        coupon_code: coupon?.code,
        payment_method: paymentMethod,
        payment_proof: paymentProof,
        billing_address: {
          name: `${firstName} ${lastName}`,
          email: email,
          address,
          city,
          country
        }
      })

      // Handle Stripe payment
      if (paymentMethod === 'card' && stripeEnabled && stripe && elements) {
        try {
          const intentRes = await paymentsAPI.createStripeIntent({
            amount: total,
            currency: 'usd',
            order_uuid: orderRes.data.order.uuid
          })

          const { clientSecret } = intentRes.data
          const cardElement = elements.getElement(CardElement)
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${firstName} ${lastName}`,
                email: email,
              },
            },
          })

          if (error) {
            toast.error(error.message)
            return
          }

          if (paymentIntent.status === 'succeeded') {
            await paymentsAPI.confirmStripePayment({
              payment_intent_id: paymentIntent.id,
              order_uuid: orderRes.data.order.uuid
            })
          }
        } catch (paymentErr) {
          toast.error('Payment failed. Please try again.')
          return
        }
      }

      // Clear cart and session storage
      clearCart()
      sessionStorage.removeItem('guestEmail')
      
      toast.success('🎉 Order placed successfully! Check your email for login details.')
      navigate('/dashboard/orders')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <>
      <Helmet><title>Secure Checkout - Magnetic Clouds</title></Helmet>
      
      {/* Ultra Premium Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Secure Checkout</h1>
                <p className="text-sm text-white/70">256-bit SSL Encrypted</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-white/90">
                  <badge.icon className="w-5 h-5" />
                  <div className="text-xs">
                    <p className="font-bold">{badge.label}</p>
                    <p className="text-white/60">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 bg-dark-50 dark:bg-dark-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-dark-100 dark:border-dark-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Contact Information</h2>
                    <p className="text-sm text-dark-500">We'll send your login details here</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className="input pl-11 w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" className="input pl-11 w-full" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="input pl-11 w-full" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Billing Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-dark-100 dark:border-dark-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Billing Address</h2>
                    <p className="text-sm text-dark-500">For invoice purposes</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Street" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="New York" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" className="input w-full" />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-dark-100 dark:border-dark-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Payment Method</h2>
                    <p className="text-sm text-dark-500">Choose how you'd like to pay</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => {
                    if (method.isStripe && !stripeEnabled) return null
                    return (
                      <label key={method.id} className={clsx(
                        "relative flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-[1.02]",
                        paymentMethod === method.id 
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg" 
                          : "border-dark-200 dark:border-dark-700 hover:border-primary-300"
                      )}>
                        <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)} className="hidden" />
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg`}>
                          <method.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-sm text-center">{method.name}</span>
                        {paymentMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-primary-500 absolute top-2 right-2" />
                        )}
                      </label>
                    )
                  })}
                </div>

                {/* Stripe Card Element */}
                {paymentMethod === 'card' && stripeEnabled && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2">Card Details</label>
                    <div className="p-4 border border-dark-200 dark:border-dark-700 rounded-xl bg-white dark:bg-dark-800">
                      <CardElement 
                        options={cardElementOptions}
                        onChange={(e) => setCardComplete(e.complete)}
                      />
                    </div>
                    <p className="text-xs text-dark-500 mt-2 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Your card details are secured with 256-bit encryption
                    </p>
                  </div>
                )}

                {/* Payment Proof Upload for Bank/Cash/bKash/Rocket/PayPal */}
                {selectedMethod?.requiresProof && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Payment Instructions</h3>
                    
                    {/* bKash */}
                    {paymentMethod === 'bkash' && (
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-[#E2136E] rounded-lg flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold">bKash</span>
                        </div>
                        <p><strong>Number:</strong> {paymentSettings.bkash_details?.number || 'Not configured'}</p>
                        <p><strong>Account Type:</strong> {paymentSettings.bkash_details?.account_type || 'Personal'}</p>
                        {paymentSettings.bkash_details?.instructions && (
                          <p className="mt-2 text-xs">{paymentSettings.bkash_details.instructions}</p>
                        )}
                        <p className="mt-2 text-xs">Use your Order ID as reference when sending payment.</p>
                      </div>
                    )}
                    
                    {/* Rocket */}
                    {paymentMethod === 'rocket' && (
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-[#8C3494] rounded-lg flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold">Rocket</span>
                        </div>
                        <p><strong>Number:</strong> {paymentSettings.rocket_details?.number || 'Not configured'}</p>
                        <p><strong>Account Type:</strong> {paymentSettings.rocket_details?.account_type || 'Personal'}</p>
                        {paymentSettings.rocket_details?.instructions && (
                          <p className="mt-2 text-xs">{paymentSettings.rocket_details.instructions}</p>
                        )}
                        <p className="mt-2 text-xs">Use your Order ID as reference when sending payment.</p>
                      </div>
                    )}
                    
                    {/* PayPal */}
                    {paymentMethod === 'paypal' && (
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-[#003087] rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold">PayPal</span>
                        </div>
                        <p>Please send payment via PayPal and upload the confirmation screenshot.</p>
                        <p className="mt-2 text-xs">Include your Order ID in the payment note.</p>
                      </div>
                    )}
                    
                    {/* Bank Transfer */}
                    {paymentMethod === 'bank' && (
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        <p className="mb-2">Transfer to:</p>
                        <p><strong>Bank:</strong> {paymentSettings.bank_details?.bank_name || 'Not configured'}</p>
                        <p><strong>Account:</strong> {paymentSettings.bank_details?.account_number || 'Not configured'}</p>
                        <p><strong>Name:</strong> {paymentSettings.bank_details?.account_holder || 'Not configured'}</p>
                        {paymentSettings.bank_details?.additional_info && (
                          <p className="mt-2 text-xs">{paymentSettings.bank_details.additional_info}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Cash */}
                    {paymentMethod === 'cash' && (
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        <p>{paymentSettings.cash_instructions || 'Contact us to arrange cash payment. Upload receipt after payment.'}</p>
                      </div>
                    )}
                    
                    <label className="block">
                      <span className="text-sm font-medium mb-2 block">Upload Payment Proof *</span>
                      {paymentProofPreview ? (
                        <div className="relative inline-block">
                          <img src={paymentProofPreview} alt="Payment proof" className="max-w-xs max-h-48 rounded-lg border" />
                          <button onClick={removeProof} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
                          <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" id="proof-upload" />
                          <label htmlFor="proof-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-dark-400" />
                            <p className="text-sm text-dark-500">Click to upload receipt/screenshot</p>
                            <p className="text-xs text-dark-400">Max 5MB, JPG/PNG</p>
                          </label>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl border border-dark-100 dark:border-dark-700"
                >
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-500" />
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-start py-2 border-b border-dark-100 dark:border-dark-700">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-dark-500">{item.billingCycle}</p>
                        </div>
                        <span className="font-semibold">{format(item.price)}</span>
                      </div>
                    ))}
                    <div className="pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-500">Subtotal</span>
                        <span>{format(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-500 mt-1">
                          <span>Discount</span>
                          <span>-{format(discount)}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-dark-200 dark:border-dark-700 pt-3 flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="text-primary-500">{format(total)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout} 
                    disabled={loading || (paymentMethod === 'card' && stripeEnabled && (!stripe || !elements))} 
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <><Lock className="w-5 h-5" /> Complete Payment</>
                    )}
                  </button>

                  <p className="mt-3 text-xs text-dark-500 text-center">
                    Your password will be sent to your email after payment
                  </p>
                </motion.div>

                {/* Money Back Guarantee */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-2xl p-5 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <RefreshCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-700 dark:text-emerald-400">45-Day Money Back</h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500">Full refund, no questions asked</p>
                    </div>
                  </div>
                </motion.div>

                {/* Customer Reviews */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl p-5 shadow-xl border border-dark-100 dark:border-dark-700"
                >
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    Customer Reviews
                  </h3>
                  <div className="space-y-4">
                    {serviceReviews.map((review, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <img src={review.img} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{review.name}</span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, j) => (
                                <Star key={j} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-dark-500 mt-0.5">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3">
                  {trustBadges.slice(0, 2).map((badge) => (
                    <div key={badge.label} className="bg-white dark:bg-dark-800 rounded-xl p-3 border border-dark-100 dark:border-dark-700 flex items-center gap-2">
                      <badge.icon className="w-5 h-5 text-primary-500" />
                      <div className="text-xs">
                        <p className="font-bold">{badge.label}</p>
                        <p className="text-dark-500">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Main Checkout component with Stripe Elements wrapper
export default function Checkout() {
  const navigate = useNavigate()
  const { items } = useCartStore()
  const [stripePromise, setStripePromise] = useState(null)
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [paymentSettings, setPaymentSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if cart is empty
    if (items.length === 0) {
      navigate('/cart')
      return
    }

    // Load payment settings
    const loadPaymentSettings = async () => {
      try {
        // Load both Stripe key and payment methods in parallel
        const [stripeRes, methodsRes] = await Promise.all([
          settingsAPI.getStripeKey(),
          settingsAPI.getPaymentMethods()
        ])
        
        if (stripeRes.data.enabled && stripeRes.data.publishableKey) {
          setStripeEnabled(true)
          setStripePromise(loadStripe(stripeRes.data.publishableKey))
        }
        
        setPaymentSettings(methodsRes.data)
      } catch (err) {
        console.error('Failed to load payment settings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPaymentSettings()
  }, [items.length, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (stripeEnabled && stripePromise) {
    return (
      <Elements stripe={stripePromise}>
        <StripeCheckoutForm paymentSettings={paymentSettings} />
      </Elements>
    )
  }

  return <CheckoutFormInner stripeEnabled={false} paymentSettings={paymentSettings} />
}
