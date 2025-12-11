import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  FileText, CheckCircle, XCircle, Clock, Building2, Mail, Phone, Globe,
  Calendar, DollarSign, Shield, Sparkles, Crown, Zap, Star, Download,
  Check, X, Loader2, Lock, CreditCard, AlertCircle
} from 'lucide-react'
import { proposalsAPI } from '../lib/api'
import toast from 'react-hot-toast'
import clsx from 'clsx'

// Invoice Template Components
const InvoiceModern = ({ proposal, company }) => (
  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
    {/* Header */}
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{company?.name || 'Magnetic Clouds'}</h1>
          <p className="text-slate-300 mt-1">{company?.tagline || 'Premium Cloud Solutions'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">PROPOSAL</p>
          <p className="text-2xl font-bold">#{proposal.proposal_number || proposal.uuid?.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-8">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">PREPARED FOR</h3>
          <p className="font-bold text-lg">{proposal.user_name}</p>
          <p className="text-slate-600">{proposal.user_email}</p>
          {proposal.user_company && <p className="text-slate-600">{proposal.user_company}</p>}
        </div>
        <div className="text-right">
          <div className="mb-4">
            <p className="text-sm text-slate-500">Issue Date</p>
            <p className="font-medium">{new Date(proposal.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Valid Until</p>
            <p className="font-medium">{new Date(proposal.valid_until).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-8 p-6 bg-slate-50 rounded-xl">
        <h2 className="text-xl font-bold mb-2">{proposal.title}</h2>
        {proposal.description && <p className="text-slate-600">{proposal.description}</p>}
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="text-left py-3 text-sm font-medium text-slate-500">DESCRIPTION</th>
            <th className="text-center py-3 text-sm font-medium text-slate-500">QTY</th>
            <th className="text-right py-3 text-sm font-medium text-slate-500">PRICE</th>
            <th className="text-right py-3 text-sm font-medium text-slate-500">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {proposal.items?.map((item, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-4">
                <p className="font-medium">{item.name}</p>
                {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
              </td>
              <td className="text-center py-4">{item.quantity}</td>
              <td className="text-right py-4">${parseFloat(item.price).toFixed(2)}</td>
              <td className="text-right py-4 font-medium">${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-72">
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Subtotal</span>
            <span>${proposal.subtotal?.toFixed(2)}</span>
          </div>
          {proposal.discount_amount > 0 && (
            <div className="flex justify-between py-2 text-green-600">
              <span>Discount</span>
              <span>-${proposal.discount_amount?.toFixed(2)}</span>
            </div>
          )}
          {proposal.tax_amount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Tax</span>
              <span>${proposal.tax_amount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t-2 border-slate-900 text-xl font-bold">
            <span>Total</span>
            <span>${proposal.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const InvoicePremium = ({ proposal, company }) => (
  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-200">
    {/* Header */}
    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="relative flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{company?.name || 'Magnetic Clouds'}</h1>
            <p className="text-amber-100">Premium Proposal</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-amber-100 text-sm">PROPOSAL NO.</p>
          <p className="text-2xl font-bold">#{proposal.proposal_number || proposal.uuid?.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-8">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h3 className="text-xs font-bold text-amber-600 mb-2 flex items-center gap-1">
            <Star className="w-3 h-3" /> PREPARED FOR
          </h3>
          <p className="font-bold text-lg">{proposal.user_name}</p>
          <p className="text-slate-600">{proposal.user_email}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm text-right">
          <div className="mb-3">
            <p className="text-xs text-amber-600 font-bold">ISSUE DATE</p>
            <p className="font-medium">{new Date(proposal.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-amber-600 font-bold">VALID UNTIL</p>
            <p className="font-medium">{new Date(proposal.valid_until).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border-l-4 border-amber-500">
        <h2 className="text-xl font-bold text-amber-800">{proposal.title}</h2>
        {proposal.description && <p className="text-slate-600 mt-1">{proposal.description}</p>}
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-amber-500 text-white px-6 py-3 grid grid-cols-12 text-sm font-bold">
          <div className="col-span-6">ITEM</div>
          <div className="col-span-2 text-center">QTY</div>
          <div className="col-span-2 text-right">PRICE</div>
          <div className="col-span-2 text-right">TOTAL</div>
        </div>
        {proposal.items?.map((item, i) => (
          <div key={i} className="px-6 py-4 grid grid-cols-12 border-b border-amber-100 items-center">
            <div className="col-span-6">
              <p className="font-medium">{item.name}</p>
              {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
            </div>
            <div className="col-span-2 text-center">{item.quantity}</div>
            <div className="col-span-2 text-right">${parseFloat(item.price).toFixed(2)}</div>
            <div className="col-span-2 text-right font-bold text-amber-700">${(item.quantity * item.price).toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-80 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl p-6 text-white">
          <div className="flex justify-between py-2 border-b border-white/20">
            <span className="text-amber-100">Subtotal</span>
            <span>${proposal.subtotal?.toFixed(2)}</span>
          </div>
          {proposal.discount_amount > 0 && (
            <div className="flex justify-between py-2 border-b border-white/20">
              <span className="text-amber-100">Discount</span>
              <span>-${proposal.discount_amount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 text-2xl font-bold">
            <span>Total</span>
            <span>${proposal.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const InvoiceTech = ({ proposal, company }) => (
  <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden text-white">
    {/* Header */}
    <div className="p-8 border-b border-cyan-500/30 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
      <div className="relative flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {company?.name || 'Magnetic Clouds'}
            </h1>
            <p className="text-slate-400 text-sm">PROPOSAL DOCUMENT</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block px-4 py-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
            <p className="text-xs text-cyan-400">ID</p>
            <p className="font-mono font-bold">{proposal.uuid?.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-8">
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-xs text-cyan-400 mb-1">CLIENT</p>
          <p className="font-bold">{proposal.user_name}</p>
          <p className="text-sm text-slate-400">{proposal.user_email}</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-xs text-cyan-400 mb-1">ISSUED</p>
          <p className="font-bold">{new Date(proposal.created_at).toLocaleDateString()}</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-xs text-cyan-400 mb-1">EXPIRES</p>
          <p className="font-bold">{new Date(proposal.valid_until).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8 p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
        <h2 className="text-xl font-bold">{proposal.title}</h2>
        {proposal.description && <p className="text-slate-400 mt-1">{proposal.description}</p>}
      </div>

      {/* Items */}
      <div className="mb-8 space-y-3">
        {proposal.items?.map((item, i) => (
          <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <p className="font-medium">{item.name}</p>
              {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">{item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
              <p className="font-bold text-cyan-400">${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-cyan-100 text-sm">TOTAL AMOUNT</p>
            <p className="text-3xl font-bold">${proposal.total?.toFixed(2)}</p>
          </div>
          <div className="text-right text-sm">
            {proposal.discount_amount > 0 && (
              <p className="text-cyan-100">Discount: -${proposal.discount_amount?.toFixed(2)}</p>
            )}
            {proposal.tax_amount > 0 && (
              <p className="text-cyan-100">Tax: ${proposal.tax_amount?.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)

const InvoiceCorporate = ({ proposal, company }) => (
  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
    {/* Header */}
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{company?.name || 'Magnetic Clouds'}</h1>
            <p className="text-indigo-200">Business Proposal</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold">#{proposal.uuid?.slice(0, 6).toUpperCase()}</p>
          <p className="text-indigo-200">Proposal</p>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-8">
      <div className="flex justify-between mb-8 pb-8 border-b-2 border-indigo-100">
        <div>
          <h3 className="text-xs font-bold text-indigo-600 mb-2">BILL TO</h3>
          <p className="font-bold text-lg">{proposal.user_name}</p>
          <p className="text-slate-600">{proposal.user_email}</p>
          {proposal.user_company && <p className="text-slate-600">{proposal.user_company}</p>}
        </div>
        <div className="text-right">
          <div className="inline-grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <span className="text-slate-500">Date:</span>
            <span className="font-medium">{new Date(proposal.created_at).toLocaleDateString()}</span>
            <span className="text-slate-500">Valid Until:</span>
            <span className="font-medium">{new Date(proposal.valid_until).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-indigo-900">{proposal.title}</h2>
        {proposal.description && <p className="text-slate-600 mt-2">{proposal.description}</p>}
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="text-left py-3 px-4 rounded-l-lg">Description</th>
            <th className="text-center py-3 px-4">Qty</th>
            <th className="text-right py-3 px-4">Rate</th>
            <th className="text-right py-3 px-4 rounded-r-lg">Amount</th>
          </tr>
        </thead>
        <tbody>
          {proposal.items?.map((item, i) => (
            <tr key={i} className="border-b border-indigo-100">
              <td className="py-4 px-4">
                <p className="font-medium">{item.name}</p>
                {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
              </td>
              <td className="text-center py-4 px-4">{item.quantity}</td>
              <td className="text-right py-4 px-4">${parseFloat(item.price).toFixed(2)}</td>
              <td className="text-right py-4 px-4 font-bold">${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-72">
          <div className="flex justify-between py-2 text-slate-600">
            <span>Subtotal</span>
            <span>${proposal.subtotal?.toFixed(2)}</span>
          </div>
          {proposal.discount_amount > 0 && (
            <div className="flex justify-between py-2 text-green-600">
              <span>Discount</span>
              <span>-${proposal.discount_amount?.toFixed(2)}</span>
            </div>
          )}
          {proposal.tax_amount > 0 && (
            <div className="flex justify-between py-2 text-slate-600">
              <span>Tax</span>
              <span>${proposal.tax_amount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 mt-2 bg-indigo-600 text-white rounded-lg px-4 text-xl font-bold">
            <span>Total</span>
            <span>${proposal.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const InvoiceElegant = ({ proposal, company }) => (
  <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden text-white">
    {/* Header */}
    <div className="p-10 border-b border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light tracking-wider">{company?.name || 'MAGNETIC CLOUDS'}</h1>
          <p className="text-gray-500 mt-1 tracking-widest text-sm">PROPOSAL</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-thin">{proposal.uuid?.slice(0, 4).toUpperCase()}</p>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-10">
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-gray-500 text-xs tracking-widest mb-3">PREPARED FOR</p>
          <p className="text-xl font-light">{proposal.user_name}</p>
          <p className="text-gray-400">{proposal.user_email}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs tracking-widest mb-3">DATE</p>
          <p className="font-light">{new Date(proposal.created_at).toLocaleDateString()}</p>
          <p className="text-gray-500 text-xs tracking-widest mt-4 mb-3">VALID UNTIL</p>
          <p className="font-light">{new Date(proposal.valid_until).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Title */}
      <div className="mb-12">
        <h2 className="text-2xl font-light">{proposal.title}</h2>
        {proposal.description && <p className="text-gray-400 mt-2">{proposal.description}</p>}
      </div>

      {/* Items */}
      <div className="mb-12">
        {proposal.items?.map((item, i) => (
          <div key={i} className="py-6 border-b border-gray-800 flex justify-between">
            <div>
              <p className="text-lg font-light">{item.name}</p>
              {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">{item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
              <p className="text-lg">${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-3 text-gray-400">
            <span>Subtotal</span>
            <span>${proposal.subtotal?.toFixed(2)}</span>
          </div>
          {proposal.discount_amount > 0 && (
            <div className="flex justify-between py-3 text-gray-400">
              <span>Discount</span>
              <span>-${proposal.discount_amount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-6 border-t border-gray-700 text-2xl">
            <span className="font-light">Total</span>
            <span>${proposal.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Template selector
const TEMPLATES = {
  modern: InvoiceModern,
  premium: InvoicePremium,
  tech: InvoiceTech,
  corporate: InvoiceCorporate,
  elegant: InvoiceElegant
}

export default function ProposalView() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [proposal, setProposal] = useState(null)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    loadProposal()
  }, [uuid])

  const loadProposal = async () => {
    try {
      const res = await proposalsAPI.getProposal(uuid)
      setProposal(res.data.proposal)
    } catch (err) {
      setError('Proposal not found or has expired')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!confirm('Are you sure you want to accept this proposal? You will be enrolled in the services listed.')) return
    
    setProcessing(true)
    try {
      await proposalsAPI.acceptProposal(uuid, {})
      toast.success('Proposal accepted! You have been enrolled in the services.')
      loadProposal()
    } catch (err) {
      toast.error('Failed to accept proposal')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    setProcessing(true)
    try {
      await proposalsAPI.rejectProposal(uuid, { reason: rejectReason })
      toast.success('Proposal rejected')
      setShowRejectModal(false)
      loadProposal()
    } catch (err) {
      toast.error('Failed to reject proposal')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-900 dark:to-dark-800">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-900 dark:to-dark-800">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Proposal Not Found</h1>
          <p className="text-dark-500">{error || 'This proposal may have expired or been removed.'}</p>
        </div>
      </div>
    )
  }

  const InvoiceTemplate = TEMPLATES[proposal.template] || TEMPLATES.modern
  const isExpired = new Date(proposal.valid_until) < new Date()
  const canRespond = proposal.status === 'sent' || proposal.status === 'viewed'

  return (
    <>
      <Helmet>
        <title>Proposal: {proposal.title} - Magnetic Clouds</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-dark-900 dark:to-dark-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Status Banner */}
          {proposal.status === 'accepted' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-bold text-green-800 dark:text-green-200">Proposal Accepted</p>
                <p className="text-sm text-green-600 dark:text-green-300">You have been enrolled in the services. Check your email for details.</p>
              </div>
            </motion.div>
          )}

          {proposal.status === 'rejected' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl flex items-center gap-3"
            >
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-bold text-red-800 dark:text-red-200">Proposal Rejected</p>
                <p className="text-sm text-red-600 dark:text-red-300">This proposal has been declined.</p>
              </div>
            </motion.div>
          )}

          {isExpired && canRespond && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl flex items-center gap-3"
            >
              <Clock className="w-6 h-6 text-amber-600" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-200">Proposal Expired</p>
                <p className="text-sm text-amber-600 dark:text-amber-300">This proposal has expired. Please contact us for a new quote.</p>
              </div>
            </motion.div>
          )}

          {/* Invoice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InvoiceTemplate proposal={proposal} company={{}} />
          </motion.div>

          {/* Notes & Terms */}
          {(proposal.notes || proposal.terms) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 p-6 bg-white dark:bg-dark-800 rounded-xl shadow-lg"
            >
              {proposal.notes && (
                <div className="mb-4">
                  <h3 className="font-bold text-sm text-dark-500 mb-2">NOTES</h3>
                  <p className="text-dark-700 dark:text-dark-300">{proposal.notes}</p>
                </div>
              )}
              {proposal.terms && (
                <div>
                  <h3 className="font-bold text-sm text-dark-500 mb-2">TERMS & CONDITIONS</h3>
                  <p className="text-dark-700 dark:text-dark-300 text-sm">{proposal.terms}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          {canRespond && !isExpired && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={handleAccept}
                disabled={processing}
                className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Accept Proposal
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={processing}
                className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Reject Proposal
              </button>
            </motion.div>
          )}

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-dark-500">
              <Lock className="w-4 h-4" />
              Secured by Magnetic Clouds
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Reject Proposal</h3>
            <p className="text-dark-500 mb-4">Please let us know why you're declining this proposal (optional):</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="input w-full mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
