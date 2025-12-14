import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { 
  FileText, Search, Eye, Download, CheckCircle, XCircle, Clock,
  DollarSign, User, Calendar, Loader2, Filter, ExternalLink, X,
  CreditCard, Building2, Mail, Phone, MapPin, Receipt, Ban, RotateCcw
} from 'lucide-react'
import { adminAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function AdminInvoices() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoiceDetails, setInvoiceDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', invoice: null })
  const [actionLoading, setActionLoading] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-invoices', statusFilter],
    queryFn: () => adminAPI.getInvoices({ status: statusFilter }).then(res => res.data)
  })

  const loadInvoiceDetails = async (invoice) => {
    setSelectedInvoice(invoice)
    setLoadingDetails(true)
    try {
      const res = await adminAPI.getInvoice(invoice.uuid)
      setInvoiceDetails(res.data.invoice)
    } catch (err) {
      toast.error('Failed to load invoice details')
      setSelectedInvoice(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const updateStatus = async (uuid, newStatus) => {
    try {
      await adminAPI.updateInvoiceStatus(uuid, newStatus)
      toast.success('Invoice status updated')
      refetch()
      if (invoiceDetails?.uuid === uuid) {
        setInvoiceDetails({ ...invoiceDetails, status: newStatus })
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const closeModal = () => {
    setSelectedInvoice(null)
    setInvoiceDetails(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
  }

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      draft: 'bg-dark-200 text-dark-600 dark:bg-dark-700 dark:text-dark-400',
      cancelled: 'bg-dark-200 text-dark-600 dark:bg-dark-700 dark:text-dark-400',
      refunded: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    }
    return colors[status] || colors.draft
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return CheckCircle
      case 'unpaid': return Clock
      case 'cancelled': return XCircle
      default: return FileText
    }
  }

  const filteredInvoices = data?.invoices?.filter(invoice => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      invoice.invoice_number?.toLowerCase().includes(searchLower) ||
      invoice.email?.toLowerCase().includes(searchLower) ||
      invoice.first_name?.toLowerCase().includes(searchLower) ||
      invoice.last_name?.toLowerCase().includes(searchLower)
    )
  }) || []

  // Stats
  const stats = {
    total: data?.invoices?.length || 0,
    paid: data?.invoices?.filter(i => i.status === 'paid').length || 0,
    unpaid: data?.invoices?.filter(i => i.status === 'unpaid').length || 0,
    totalRevenue: data?.invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.total || 0), 0) || 0,
  }

  return (
    <>
      <Helmet><title>Invoices - Admin - Magnetic Clouds</title></Helmet>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-dark-500 mt-1">Manage all invoices from proposals and orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-dark-500">Total Invoices</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.paid}</p>
            <p className="text-xs text-dark-500">Paid</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.unpaid}</p>
            <p className="text-xs text-dark-500">Unpaid</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-dark-500">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="input pl-11 w-full"
          />
        </div>
        <div className="flex gap-2">
          {['', 'unpaid', 'paid', 'cancelled', 'refunded'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === status 
                  ? "bg-primary-500 text-white" 
                  : "bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700"
              )}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filteredInvoices.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left p-4 font-medium">Invoice #</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Due Date</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {filteredInvoices.map(invoice => {
                const StatusIcon = getStatusIcon(invoice.status)
                return (
                  <tr 
                    key={invoice.uuid}
                    onClick={() => loadInvoiceDetails(invoice)}
                    className="hover:bg-dark-50 dark:hover:bg-dark-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-mono font-medium">{invoice.invoice_number}</p>
                          {invoice.proposal_title && (
                            <p className="text-xs text-dark-500">{invoice.proposal_title}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{invoice.first_name} {invoice.last_name}</p>
                      <p className="text-sm text-dark-500">{invoice.email}</p>
                    </td>
                    <td className="p-4 text-dark-500">{new Date(invoice.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-dark-500">{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={clsx("px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1", getStatusColor(invoice.status))}>
                        <StatusIcon className="w-3 h-3" />
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold">{formatCurrency(invoice.total)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Invoices Found</h2>
          <p className="text-dark-500">Invoices will appear here when proposals are accepted or orders are placed.</p>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={closeModal}>
          <div 
            className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-4xl my-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {loadingDetails ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : invoiceDetails ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-dark-200 dark:border-dark-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{invoiceDetails.invoice_number}</h2>
                          <p className="text-dark-500">{invoiceDetails.proposal_title || 'Invoice'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx("px-3 py-1.5 rounded-full text-sm font-medium", getStatusColor(invoiceDetails.status))}>
                        {invoiceDetails.status}
                      </span>
                      <button onClick={closeModal} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Info */}
                    <div className="card p-4 space-y-3">
                      <h3 className="font-bold flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-500" /> Bill To
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{invoiceDetails.first_name} {invoiceDetails.last_name}</p>
                        <p className="text-dark-500 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> {invoiceDetails.email}
                        </p>
                        {invoiceDetails.phone && (
                          <p className="text-dark-500 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {invoiceDetails.phone}
                          </p>
                        )}
                        {invoiceDetails.company && (
                          <p className="text-dark-500 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> {invoiceDetails.company}
                          </p>
                        )}
                        {invoiceDetails.address && (
                          <p className="text-dark-500 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {invoiceDetails.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="card p-4 space-y-3">
                      <h3 className="font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-500" /> Invoice Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-dark-500">Issue Date</p>
                          <p className="font-medium">{new Date(invoiceDetails.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-dark-500">Due Date</p>
                          <p className="font-medium">{new Date(invoiceDetails.due_date).toLocaleDateString()}</p>
                        </div>
                        {invoiceDetails.paid_date && (
                          <div>
                            <p className="text-dark-500">Paid Date</p>
                            <p className="font-medium text-emerald-600">{new Date(invoiceDetails.paid_date).toLocaleDateString()}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-dark-500">Currency</p>
                          <p className="font-medium">{invoiceDetails.currency || 'USD'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  {invoiceDetails.items && invoiceDetails.items.length > 0 && (
                    <div className="card overflow-hidden mb-6">
                      <table className="w-full">
                        <thead className="bg-dark-50 dark:bg-dark-800">
                          <tr>
                            <th className="text-left p-3 font-medium text-sm">Item</th>
                            <th className="text-right p-3 font-medium text-sm">Qty</th>
                            <th className="text-right p-3 font-medium text-sm">Price</th>
                            <th className="text-right p-3 font-medium text-sm">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
                          {invoiceDetails.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-3">
                                <p className="font-medium">{item.name}</p>
                                {item.description && <p className="text-xs text-dark-500">{item.description}</p>}
                              </td>
                              <td className="p-3 text-right">{item.quantity || 1}</td>
                              <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                              <td className="p-3 text-right font-medium">{formatCurrency((item.quantity || 1) * item.price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-72 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-500">Subtotal</span>
                        <span>{formatCurrency(invoiceDetails.subtotal)}</span>
                      </div>
                      {parseFloat(invoiceDetails.discount) > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-{formatCurrency(invoiceDetails.discount)}</span>
                        </div>
                      )}
                      {parseFloat(invoiceDetails.tax) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-dark-500">Tax</span>
                          <span>{formatCurrency(invoiceDetails.tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark-200 dark:border-dark-700">
                        <span>Total</span>
                        <span className="text-primary-500">{formatCurrency(invoiceDetails.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {invoiceDetails.notes && (
                    <div className="mt-6 p-4 bg-dark-50 dark:bg-dark-900 rounded-xl">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm text-dark-500">{invoiceDetails.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-dark-200 dark:border-dark-700 flex flex-wrap gap-3">
                    {invoiceDetails.status === 'unpaid' && (
                      <button 
                        onClick={() => updateStatus(invoiceDetails.uuid, 'paid')}
                        className="btn-primary"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Mark as Paid
                      </button>
                    )}
                    {invoiceDetails.status === 'paid' && (
                      <button 
                        onClick={() => setConfirmDialog({ open: true, type: 'refund', invoice: invoiceDetails })}
                        className="btn-secondary text-amber-600"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" /> Refund Invoice
                      </button>
                    )}
                    {invoiceDetails.status !== 'cancelled' && invoiceDetails.status !== 'paid' && (
                      <button 
                        onClick={() => setConfirmDialog({ open: true, type: 'cancel', invoice: invoiceDetails })}
                        className="btn-secondary text-red-500"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Cancel Invoice
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: '', invoice: null })}
        onConfirm={async () => {
          setActionLoading(true)
          try {
            const newStatus = confirmDialog.type === 'cancel' ? 'cancelled' : 'refunded'
            await updateStatus(confirmDialog.invoice.uuid, newStatus)
            setConfirmDialog({ open: false, type: '', invoice: null })
          } finally {
            setActionLoading(false)
          }
        }}
        title={confirmDialog.type === 'cancel' ? 'Cancel Invoice?' : 'Refund Invoice?'}
        message={
          confirmDialog.type === 'cancel' 
            ? `Are you sure you want to cancel invoice ${confirmDialog.invoice?.invoice_number}? This action cannot be undone.`
            : `Are you sure you want to refund invoice ${confirmDialog.invoice?.invoice_number}? The payment will be marked as refunded.`
        }
        confirmText={confirmDialog.type === 'cancel' ? 'Yes, Cancel Invoice' : 'Yes, Refund'}
        type={confirmDialog.type === 'cancel' ? 'danger' : 'warning'}
        icon={confirmDialog.type === 'cancel' ? Ban : RotateCcw}
        loading={actionLoading}
      />
    </>
  )
}
