import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  Server, Globe, FileText, Ticket, AlertCircle, ArrowRight,
  TrendingUp, Clock, CheckCircle, XCircle, Plus
} from 'lucide-react'
import { userAPI } from '../../lib/api'
import { useAuthStore, useCurrencyStore, useThemeStore } from '../../store/useStore'
import clsx from 'clsx'

const statusColors = {
  active: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  suspended: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  cancelled: 'bg-dark-100 dark:bg-dark-800 text-dark-500',
  open: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  answered: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  'customer-reply': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  closed: 'bg-dark-100 dark:bg-dark-800 text-dark-500',
  paid: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  unpaid: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const { format } = useCurrencyStore()
  const { themeStyle } = useThemeStore()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userAPI.getDashboard().then(res => res.data)
  })

  const isGradient = themeStyle === 'gradient'

  const stats = [
    { 
      label: 'Active Services', 
      value: data?.stats?.services?.active || 0,
      total: data?.stats?.services?.total || 0,
      icon: Server, 
      color: 'from-blue-500 to-cyan-500',
      to: '/dashboard/services'
    },
    { 
      label: 'Open Tickets', 
      value: data?.stats?.tickets?.open || 0,
      total: data?.stats?.tickets?.total || 0,
      icon: Ticket, 
      color: 'from-yellow-500 to-orange-500',
      to: '/dashboard/tickets'
    },
    { 
      label: 'Unpaid Invoices', 
      value: data?.stats?.invoices?.unpaid || 0,
      total: data?.stats?.invoices?.total || 0,
      icon: FileText, 
      color: 'from-red-500 to-rose-500',
      to: '/dashboard/invoices'
    },
    { 
      label: 'Total Orders', 
      value: data?.stats?.orders?.total || 0,
      icon: TrendingUp, 
      color: 'from-green-500 to-emerald-500',
      to: '/dashboard/orders'
    },
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard - Magnetic Clouds</title>
      </Helmet>

      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="mt-1 text-dark-500">
              Here's what's happening with your services today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/hosting" className="btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              New Service
            </Link>
            <Link to="/dashboard/tickets/new" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Open Ticket
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={stat.to}
                className="block card p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                    isGradient ? `bg-gradient-to-br ${stat.color}` : "bg-primary-500"
                  )}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-dark-400" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-dark-500 text-sm">{stat.label}</p>
                  {stat.total !== undefined && stat.total > 0 && (
                    <p className="text-xs text-dark-400 mt-1">
                      of {stat.total} total
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="p-6 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Services</h2>
              <Link to="/dashboard/services" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-dark-100 dark:divide-dark-700">
              {isLoading ? (
                <div className="p-6 text-center text-dark-500">Loading...</div>
              ) : data?.recent?.services?.length > 0 ? (
                data.recent.services.slice(0, 5).map((service) => (
                  <Link
                    key={service.uuid}
                    to={`/dashboard/services/${service.uuid}`}
                    className="flex items-center justify-between p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Server className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-dark-500">{service.service_type}</p>
                      </div>
                    </div>
                    <span className={clsx(
                      "badge",
                      statusColors[service.status]
                    )}>
                      {service.status}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Server className="w-12 h-12 mx-auto text-dark-300 mb-3" />
                  <p className="text-dark-500">No services yet</p>
                  <Link to="/hosting" className="text-primary-500 hover:underline text-sm mt-1 inline-block">
                    Get started with hosting →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="p-6 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Tickets</h2>
              <Link to="/dashboard/tickets" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-dark-100 dark:divide-dark-700">
              {isLoading ? (
                <div className="p-6 text-center text-dark-500">Loading...</div>
              ) : data?.recent?.tickets?.length > 0 ? (
                data.recent.tickets.slice(0, 5).map((ticket) => (
                  <Link
                    key={ticket.uuid}
                    to={`/dashboard/tickets/${ticket.uuid}`}
                    className="flex items-center justify-between p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-dark-500">#{ticket.ticket_number}</p>
                      </div>
                    </div>
                    <span className={clsx(
                      "badge",
                      statusColors[ticket.status]
                    )}>
                      {ticket.status}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Ticket className="w-12 h-12 mx-auto text-dark-300 mb-3" />
                  <p className="text-dark-500">No tickets yet</p>
                  <Link to="/dashboard/tickets/new" className="text-primary-500 hover:underline text-sm mt-1 inline-block">
                    Open a support ticket →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="p-6 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Invoices</h2>
            <Link to="/dashboard/invoices" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100 dark:border-dark-700">
                  <th className="text-left p-4 text-sm font-medium text-dark-500">Invoice</th>
                  <th className="text-left p-4 text-sm font-medium text-dark-500">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-dark-500">Due Date</th>
                  <th className="text-left p-4 text-sm font-medium text-dark-500">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-dark-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-dark-500">Loading...</td>
                  </tr>
                ) : data?.recent?.invoices?.length > 0 ? (
                  data.recent.invoices.slice(0, 5).map((invoice) => (
                    <tr key={invoice.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                      <td className="p-4 font-medium">{invoice.invoice_number}</td>
                      <td className="p-4">{format(invoice.total)}</td>
                      <td className="p-4 text-dark-500">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={clsx(
                          "badge",
                          statusColors[invoice.status]
                        )}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/dashboard/invoices/${invoice.uuid}`}
                          className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                        >
                          {invoice.status === 'unpaid' ? 'Pay Now' : 'View'}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center">
                      <FileText className="w-12 h-12 mx-auto text-dark-300 mb-3" />
                      <p className="text-dark-500">No invoices yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </>
  )
}
