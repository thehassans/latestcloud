import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '../../lib/api'
import { useCurrencyStore } from '../../store/useStore'
import { CheckCircle, XCircle, Eye, Clock, CreditCard, Building2, Banknote, X } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const statusColors = { pending: 'badge-warning', processing: 'badge-primary', active: 'badge-success', completed: 'badge-success', cancelled: 'badge-danger' }
const paymentStatusColors = { pending: 'badge-warning', paid: 'badge-success', failed: 'badge-danger', refunded: 'badge-primary' }

export default function AdminOrders() {
  const { format } = useCurrencyStore()
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [viewProof, setViewProof] = useState(null)
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-orders'], 
    queryFn: () => adminAPI.getOrders().then(res => res.data) 
  })

  const updateStatus = useMutation({
    mutationFn: ({ uuid, status, payment_status }) => adminAPI.updateOrderStatus(uuid, { status, payment_status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders'])
      toast.success('Order updated successfully')
      setSelectedOrder(null)
    },
    onError: () => toast.error('Failed to update order')
  })

  const handleApprove = (order) => {
    updateStatus.mutate({ uuid: order.uuid, status: 'active', payment_status: 'paid' })
  }

  const handleReject = (order) => {
    updateStatus.mutate({ uuid: order.uuid, status: 'cancelled', payment_status: 'failed' })
  }

  const getPaymentIcon = (method) => {
    if (method === 'bank') return Building2
    if (method === 'cash') return Banknote
    return CreditCard
  }

  return (
    <>
      <Helmet><title>Orders - Admin - Magnetic Clouds</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Orders Management</h1>
      
      {isLoading ? <div className="text-center py-12">Loading...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="text-left p-4 font-medium">Order #</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Method</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                {data?.orders?.map(order => {
                  const PaymentIcon = getPaymentIcon(order.payment_method)
                  return (
                    <tr key={order.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                      <td className="p-4 font-medium">{order.order_number}</td>
                      <td className="p-4">
                        <div>{order.first_name} {order.last_name}</div>
                        <div className="text-sm text-dark-500">{order.email}</div>
                      </td>
                      <td className="p-4 font-bold">{format(order.total)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="w-4 h-4" />
                          <span className="capitalize">{order.payment_method}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={clsx("badge", paymentStatusColors[order.payment_status])}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={clsx("badge", statusColors[order.status])}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-dark-500">
                        <div>{new Date(order.created_at).toLocaleDateString()}</div>
                        <div className="text-xs">{new Date(order.created_at).toLocaleTimeString()}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.payment_proof && (
                            <button 
                              onClick={() => setViewProof(order.payment_proof)}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg text-blue-500"
                              title="View Payment Proof"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {order.payment_status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApprove(order)}
                                className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg text-green-500"
                                title="Approve Payment"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(order)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-500"
                                title="Reject Order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {(!data?.orders || data.orders.length === 0) && (
            <div className="p-12 text-center text-dark-500">No orders found</div>
          )}
        </div>
      )}

      {/* Payment Proof Modal */}
      {viewProof && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewProof(null)}>
          <div className="bg-white dark:bg-dark-800 rounded-2xl max-w-2xl max-h-[90vh] overflow-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Payment Proof</h3>
              <button onClick={() => setViewProof(null)} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={viewProof} alt="Payment proof" className="max-w-full rounded-lg" />
          </div>
        </div>
      )}
    </>
  )
}
