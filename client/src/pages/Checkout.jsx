import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CreditCard, Lock, CheckCircle, Building2, Banknote, Upload, X } from 'lucide-react'
import { useCartStore, useCurrencyStore, useAuthStore } from '../store/useStore'
import { ordersAPI } from '../lib/api'
import toast from 'react-hot-toast'

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, requiresProof: false },
  { id: 'paypal', name: 'PayPal', icon: CreditCard, requiresProof: false },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, requiresProof: true },
  { id: 'cash', name: 'Cash Payment', icon: Banknote, requiresProof: true },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { items, coupon, getTotal, clearCart } = useCartStore()
  const { format } = useCurrencyStore()
  const { user } = useAuthStore()
  const { subtotal, discount, total } = getTotal()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [paymentProof, setPaymentProof] = useState(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState(null)

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
    if (selectedMethod?.requiresProof && !paymentProof) {
      toast.error('Please upload payment proof')
      return
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

      await ordersAPI.create({
        items: orderItems,
        coupon_code: coupon?.code,
        payment_method: paymentMethod,
        payment_proof: paymentProof,
        billing_address: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        }
      })

      clearCart()
      toast.success('Order placed successfully! ' + (selectedMethod?.requiresProof ? 'We will verify your payment shortly.' : ''))
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
      <Helmet><title>Checkout - Magnetic Clouds</title></Helmet>
      <section className="section">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-bold mb-4">Billing Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input type="text" defaultValue={user?.first_name} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" defaultValue={user?.last_name} className="input" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" defaultValue={user?.email} className="input" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors
                      ${paymentMethod === method.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)} className="text-primary-500" />
                      <method.icon className="w-5 h-5" />
                      <span>{method.name}</span>
                      {method.requiresProof && <span className="ml-auto text-xs text-dark-500">(Proof required)</span>}
                    </label>
                  ))}
                </div>

                {/* Payment Proof Upload for Bank/Cash */}
                {selectedMethod?.requiresProof && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Payment Instructions</h3>
                    {paymentMethod === 'bank' && (
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        <p className="mb-2">Transfer to:</p>
                        <p><strong>Bank:</strong> Example Bank</p>
                        <p><strong>Account:</strong> 1234567890</p>
                        <p><strong>Name:</strong> Magnetic Clouds Ltd</p>
                      </div>
                    )}
                    {paymentMethod === 'cash' && (
                      <div className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        <p>Contact us to arrange cash payment. Upload receipt after payment.</p>
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
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-dark-500">{item.name}</span>
                      <span>{format(item.price)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">Subtotal</span>
                      <span>{format(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Discount</span>
                        <span>-{format(discount)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{format(total)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Processing...' : (
                    <><Lock className="w-4 h-4 mr-2" /> Pay {format(total)}</>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-dark-500">
                  <Lock className="w-3 h-3" />
                  Secured by 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
