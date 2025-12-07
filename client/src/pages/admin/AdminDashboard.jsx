import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Users, ShoppingCart, DollarSign, Ticket, Server, TrendingUp } from 'lucide-react'
import { adminAPI } from '../../lib/api'
import { useCurrencyStore, useThemeStore } from '../../store/useStore'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import clsx from 'clsx'

export default function AdminDashboard() {
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()
  const isGradient = themeStyle === 'gradient'

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboard().then(res => res.data)
  })

  const stats = [
    { label: 'Total Users', value: data?.stats?.users?.total || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Orders', value: data?.stats?.orders?.total || 0, icon: ShoppingCart, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Revenue', value: format(data?.stats?.revenue?.total || 0), icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
    { label: 'Open Tickets', value: data?.stats?.tickets?.open || 0, icon: Ticket, color: 'from-red-500 to-rose-500' },
    { label: 'Active Services', value: data?.stats?.services?.active || 0, icon: Server, color: 'from-purple-500 to-pink-500' },
    { label: 'Monthly Revenue', value: format(data?.stats?.revenue?.monthly || 0), icon: TrendingUp, color: 'from-primary-500 to-secondary-500' },
  ]

  return (
    <>
      <Helmet><title>Admin Dashboard - Magnetic Clouds</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-white",
                isGradient ? `bg-gradient-to-br ${stat.color}` : "bg-primary-500")}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.revenueChart && (
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Revenue Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="p-6 border-b border-dark-100 dark:border-dark-700">
            <h2 className="text-lg font-bold">Recent Orders</h2>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-700">
            {data?.recentOrders?.slice(0, 5).map(order => (
              <div key={order.uuid} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-dark-500">{order.email}</p>
                </div>
                <p className="font-bold">{format(order.total)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-dark-100 dark:border-dark-700">
            <h2 className="text-lg font-bold">Recent Tickets</h2>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-700">
            {data?.recentTickets?.slice(0, 5).map(ticket => (
              <div key={ticket.uuid} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="text-sm text-dark-500">{ticket.email}</p>
                </div>
                <span className="badge badge-primary">{ticket.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
