import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import { useCartStore, useCurrencyStore, useAuthStore } from '../store/useStore'
import { ordersAPI } from '../lib/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, coupon, getTotal, clearCart } = useCartStore()
  const { format } = useCurrencyStore()
  const { user } = useAuthStore()
  const { subtotal, discount, total } = getTotal()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const handleCheckout = async () => {
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
        billing_address: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        }
      })

      clearCart()
      toast.success('Order placed successfully!')
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
                  {['card', 'paypal', 'bank'].map((method) => (
                    <label key={method} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors
                      ${paymentMethod === method ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-700'}`}>
                      <input type="radio" name="payment" value={method} checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)} className="text-primary-500" />
                      <CreditCard className="w-5 h-5" />
                      <span className="capitalize">{method === 'card' ? 'Credit/Debit Card' : method === 'paypal' ? 'PayPal' : 'Bank Transfer'}</span>
                    </label>
                  ))}
                </div>
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
