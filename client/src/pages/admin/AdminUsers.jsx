import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { 
  Users, Search, X, Mail, Phone, Building2, Calendar, MapPin,
  ShoppingCart, Server, Ticket, FileText, CreditCard, LogIn,
  Edit, Shield, Clock, DollarSign, Package, CheckCircle, AlertCircle,
  Loader2, ExternalLink, User, Globe, Activity
} from 'lucide-react'
import { adminAPI } from '../../lib/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useStore'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [loggingIn, setLoggingIn] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => adminAPI.getUsers({ search }).then(res => res.data)
  })

  const loadUserDetails = async (user) => {
    setSelectedUser(user)
    setLoadingDetails(true)
    setActiveTab('overview')
    try {
      const res = await adminAPI.getUser(user.uuid)
      setUserDetails(res.data)
    } catch (err) {
      toast.error('Failed to load user details')
      setSelectedUser(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleLoginAsUser = async () => {
    if (!userDetails?.user) return
    setLoggingIn(true)
    try {
      const res = await adminAPI.loginAsUser(userDetails.user.uuid)
      // Store original admin token
      const currentToken = localStorage.getItem('token')
      sessionStorage.setItem('adminToken', currentToken)
      sessionStorage.setItem('adminUser', JSON.stringify(useAuthStore.getState().user))
      // Login as user
      login(res.data.user, res.data.token)
      toast.success(`Logged in as ${res.data.user.first_name}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to login as user')
    } finally {
      setLoggingIn(false)
    }
  }

  const closeModal = () => {
    setSelectedUser(null)
    setUserDetails(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      inactive: 'bg-dark-200 text-dark-600 dark:bg-dark-700 dark:text-dark-400',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      closed: 'bg-dark-200 text-dark-600 dark:bg-dark-700 dark:text-dark-400',
    }
    return colors[status] || colors.pending
  }

  return (
    <>
      <Helmet><title>Users - Admin - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-dark-500 mt-1">{data?.users?.length || 0} total users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..." className="input pl-12 w-64" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {data?.users?.length > 0 ? data.users.map(user => (
                <tr 
                  key={user.uuid} 
                  onClick={() => loadUserDetails(user)}
                  className="hover:bg-dark-50 dark:hover:bg-dark-800/50 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white">
                        {user.first_name?.[0] || 'U'}{user.last_name?.[0] || ''}
                      </div>
                      <div>
                        <span className="font-medium block">{user.first_name || 'Unknown'} {user.last_name || ''}</span>
                        {user.company && <span className="text-xs text-dark-500">{user.company}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-dark-500">{user.email}</td>
                  <td className="p-4">
                    <span className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    )}>{user.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(user.status))}>{user.status}</span>
                  </td>
                  <td className="p-4 text-dark-500">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-dark-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeModal}>
          <div 
            className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-5xl my-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {loadingDetails ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : userDetails ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-dark-200 dark:border-dark-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white text-2xl">
                        {userDetails.user.first_name?.[0] || 'U'}{userDetails.user.last_name?.[0] || ''}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{userDetails.user.first_name} {userDetails.user.last_name}</h2>
                        <p className="text-dark-500">{userDetails.user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(userDetails.user.status))}>
                            {userDetails.user.status}
                          </span>
                          <span className={clsx(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            userDetails.user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          )}>{userDetails.user.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {userDetails.user.role !== 'admin' && (
                        <button 
                          onClick={handleLoginAsUser}
                          disabled={loggingIn}
                          className="btn-primary flex items-center gap-2"
                        >
                          {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                          Login as User
                        </button>
                      )}
                      <button onClick={closeModal} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-dark-200 dark:border-dark-700 px-6">
                  <div className="flex gap-6">
                    {[
                      { id: 'overview', label: 'Overview', icon: User },
                      { id: 'orders', label: 'Orders', icon: ShoppingCart, count: userDetails.orders?.length },
                      { id: 'services', label: 'Services', icon: Server, count: userDetails.services?.length },
                      { id: 'tickets', label: 'Tickets', icon: Ticket, count: userDetails.tickets?.length },
                      { id: 'invoices', label: 'Invoices', icon: FileText, count: userDetails.invoices?.length },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                          "flex items-center gap-2 py-4 border-b-2 transition-colors",
                          activeTab === tab.id 
                            ? "border-primary-500 text-primary-600" 
                            : "border-transparent text-dark-500 hover:text-dark-700"
                        )}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.count > 0 && (
                          <span className="bg-dark-200 dark:bg-dark-700 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* User Info */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <User className="w-5 h-5 text-primary-500" /> Contact Information
                        </h3>
                        <div className="card p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-dark-400" />
                            <div>
                              <p className="text-xs text-dark-500">Email</p>
                              <p className="font-medium">{userDetails.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-dark-400" />
                            <div>
                              <p className="text-xs text-dark-500">Phone</p>
                              <p className="font-medium">{userDetails.user.phone || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-dark-400" />
                            <div>
                              <p className="text-xs text-dark-500">Company</p>
                              <p className="font-medium">{userDetails.user.company || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-dark-400" />
                            <div>
                              <p className="text-xs text-dark-500">Address</p>
                              <p className="font-medium">{userDetails.user.address || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-dark-400" />
                            <div>
                              <p className="text-xs text-dark-500">Member Since</p>
                              <p className="font-medium">{new Date(userDetails.user.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary-500" /> Account Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="card p-4 text-center">
                            <ShoppingCart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{userDetails.orders?.length || 0}</p>
                            <p className="text-xs text-dark-500">Total Orders</p>
                          </div>
                          <div className="card p-4 text-center">
                            <Server className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{userDetails.services?.length || 0}</p>
                            <p className="text-xs text-dark-500">Active Services</p>
                          </div>
                          <div className="card p-4 text-center">
                            <Ticket className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">{userDetails.tickets?.length || 0}</p>
                            <p className="text-xs text-dark-500">Support Tickets</p>
                          </div>
                          <div className="card p-4 text-center">
                            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold">
                              {formatCurrency(userDetails.orders?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0))}
                            </p>
                            <p className="text-xs text-dark-500">Total Spent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div>
                      {userDetails.orders?.length > 0 ? (
                        <div className="card overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-dark-50 dark:bg-dark-800">
                              <tr>
                                <th className="text-left p-3 font-medium text-sm">Order ID</th>
                                <th className="text-left p-3 font-medium text-sm">Date</th>
                                <th className="text-left p-3 font-medium text-sm">Status</th>
                                <th className="text-left p-3 font-medium text-sm">Payment</th>
                                <th className="text-right p-3 font-medium text-sm">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                              {userDetails.orders.map(order => (
                                <tr key={order.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                                  <td className="p-3 font-mono text-sm">#{order.id}</td>
                                  <td className="p-3 text-dark-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                  <td className="p-3">
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(order.status))}>{order.status}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(order.payment_status))}>{order.payment_status}</span>
                                  </td>
                                  <td className="p-3 text-right font-medium">{formatCurrency(order.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-dark-500">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No orders yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div>
                      {userDetails.services?.length > 0 ? (
                        <div className="grid gap-4">
                          {userDetails.services.map(service => (
                            <div key={service.uuid || service.id} className="card p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                  <Server className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{service.name || service.product_name || 'Service'}</h4>
                                  <p className="text-sm text-dark-500">{service.domain || service.hostname || '-'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(service.status))}>{service.status}</span>
                                <p className="text-xs text-dark-500 mt-1">Expires: {service.next_due_date ? new Date(service.next_due_date).toLocaleDateString() : 'N/A'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-dark-500">
                          <Server className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No active services</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tickets' && (
                    <div>
                      {userDetails.tickets?.length > 0 ? (
                        <div className="card overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-dark-50 dark:bg-dark-800">
                              <tr>
                                <th className="text-left p-3 font-medium text-sm">Ticket ID</th>
                                <th className="text-left p-3 font-medium text-sm">Subject</th>
                                <th className="text-left p-3 font-medium text-sm">Department</th>
                                <th className="text-left p-3 font-medium text-sm">Status</th>
                                <th className="text-left p-3 font-medium text-sm">Last Updated</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                              {userDetails.tickets.map(ticket => (
                                <tr key={ticket.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                                  <td className="p-3 font-mono text-sm">#{ticket.id}</td>
                                  <td className="p-3 font-medium text-sm">{ticket.subject}</td>
                                  <td className="p-3 text-dark-500 text-sm">{ticket.department}</td>
                                  <td className="p-3">
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(ticket.status))}>{ticket.status}</span>
                                  </td>
                                  <td className="p-3 text-dark-500 text-sm">{new Date(ticket.updated_at).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-dark-500">
                          <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No support tickets</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'invoices' && (
                    <div>
                      {userDetails.invoices?.length > 0 ? (
                        <div className="card overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-dark-50 dark:bg-dark-800">
                              <tr>
                                <th className="text-left p-3 font-medium text-sm">Invoice #</th>
                                <th className="text-left p-3 font-medium text-sm">Date</th>
                                <th className="text-left p-3 font-medium text-sm">Due Date</th>
                                <th className="text-left p-3 font-medium text-sm">Status</th>
                                <th className="text-right p-3 font-medium text-sm">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                              {userDetails.invoices.map(invoice => (
                                <tr key={invoice.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                                  <td className="p-3 font-mono text-sm">{invoice.invoice_number}</td>
                                  <td className="p-3 text-dark-500 text-sm">{new Date(invoice.created_at).toLocaleDateString()}</td>
                                  <td className="p-3 text-dark-500 text-sm">{new Date(invoice.due_date).toLocaleDateString()}</td>
                                  <td className="p-3">
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(invoice.status))}>{invoice.status}</span>
                                  </td>
                                  <td className="p-3 text-right font-medium">{formatCurrency(invoice.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-dark-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No invoices</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}
