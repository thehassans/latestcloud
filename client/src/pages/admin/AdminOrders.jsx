import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../../lib/api'
import { useCurrencyStore } from '../../store/useStore'
import clsx from 'clsx'

const statusColors = { pending: 'badge-warning', processing: 'badge-primary', active: 'badge-success', completed: 'badge-success', cancelled: 'badge-danger' }

export default function AdminOrders() {
  const { format } = useCurrencyStore()
  const { data, isLoading } = useQuery({ queryKey: ['admin-orders'], queryFn: () => adminAPI.getOrders().then(res => res.data) })

  return (
    <>
      <Helmet><title>Orders - Admin - Magnetic Clouds</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      {isLoading ? <div className="text-center py-12">Loading...</div> : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Payment</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {data?.orders?.map(order => (
                <tr key={order.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <td className="p-4 font-medium">{order.order_number}</td>
                  <td className="p-4 text-dark-500">{order.email}</td>
                  <td className="p-4 font-bold">{format(order.total)}</td>
                  <td className="p-4"><span className={clsx("badge", order.payment_status === 'paid' ? 'badge-success' : 'badge-warning')}>{order.payment_status}</span></td>
                  <td className="p-4"><span className={clsx("badge", statusColors[order.status])}>{order.status}</span></td>
                  <td className="p-4 text-dark-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
