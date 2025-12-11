import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Plus, Send, Eye, Trash2, Search, Filter, CheckCircle, XCircle, 
  Clock, User, Mail, Building2, DollarSign, Calendar, ChevronDown, X,
  Sparkles, Crown, Zap, Shield, Star, Package, CreditCard, Loader2,
  UserPlus, Check
} from 'lucide-react'
import { adminAPI, productsAPI, settingsAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import clsx from 'clsx'

// Invoice Template Designs
const INVOICE_TEMPLATES = [
  { 
    id: 'modern', 
    name: 'Modern Minimal', 
    icon: Sparkles,
    gradient: 'from-slate-600 to-slate-800',
    preview: 'Clean lines with subtle gradients'
  },
  { 
    id: 'premium', 
    name: 'Premium Gold', 
    icon: Crown,
    gradient: 'from-amber-500 to-yellow-600',
    preview: 'Luxurious gold accents'
  },
  { 
    id: 'tech', 
    name: 'Tech Futuristic', 
    icon: Zap,
    gradient: 'from-cyan-500 to-blue-600',
    preview: 'Neon cyber aesthetic'
  },
  { 
    id: 'corporate', 
    name: 'Corporate Pro', 
    icon: Building2,
    gradient: 'from-indigo-600 to-purple-700',
    preview: 'Professional business style'
  },
  { 
    id: 'elegant', 
    name: 'Elegant Dark', 
    icon: Star,
    gradient: 'from-gray-800 to-black',
    preview: 'Sophisticated dark theme'
  }
]

// Create/Edit Proposal Modal
function ProposalModal({ isOpen, onClose, proposal, onSave, products, users, bankSettings }) {
  const [loading, setLoading] = useState(false)
  const [showNewUser, setShowNewUser] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    user_id: '',
    items: [{ product_id: '', name: '', description: '', quantity: 1, price: 0 }],
    discount: 0,
    discount_type: 'percentage',
    tax: 0,
    notes: '',
    terms: 'Payment is due within 7 days of proposal acceptance.',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    template: 'modern',
    bank_method: 'bank_transfer',
    ...proposal
  })
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: ''
  })

  useEffect(() => {
    if (proposal) {
      setForm(prev => ({ ...prev, ...proposal }))
    }
  }, [proposal])

  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', name: '', description: '', quantity: 1, price: 0 }]
    }))
  }

  const handleRemoveItem = (index) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleItemChange = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== index) return item
        
        // If selecting a product, auto-fill details
        if (field === 'product_id' && value) {
          const product = products.find(p => p.id === parseInt(value))
          if (product) {
            return {
              ...item,
              product_id: value,
              name: product.name,
              description: product.description?.substring(0, 100) || '',
              price: product.price_monthly || product.price || 0
            }
          }
        }
        
        return { ...item, [field]: value }
      })
    }))
  }

  const calculateSubtotal = () => {
    return form.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (form.discount_type === 'percentage') {
      return (subtotal * form.discount) / 100
    }
    return form.discount
  }

  const calculateTax = () => {
    const afterDiscount = calculateSubtotal() - calculateDiscount()
    return (afterDiscount * form.tax) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax()
  }

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.first_name) {
      toast.error('Email and first name are required')
      return
    }
    
    setLoading(true)
    try {
      const res = await adminAPI.createUser?.(newUser) || 
        await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        }).then(r => r.json())
      
      if (res.data?.user || res.user) {
        const user = res.data?.user || res.user
        setForm(prev => ({ ...prev, user_id: user.id }))
        setShowNewUser(false)
        toast.success('User created successfully')
        // Refresh users list would happen via parent
      }
    } catch (err) {
      toast.error('Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.user_id && !showNewUser) {
      toast.error('Please select a user or create a new one')
      return
    }
    
    if (form.items.length === 0 || !form.items[0].name) {
      toast.error('Please add at least one item')
      return
    }

    setLoading(true)
    try {
      const data = {
        ...form,
        subtotal: calculateSubtotal(),
        discount_amount: calculateDiscount(),
        tax_amount: calculateTax(),
        total: calculateTotal()
      }
      
      await onSave(data)
      onClose()
    } catch (err) {
      toast.error('Failed to save proposal')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl my-8"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {proposal ? 'Edit Proposal' : 'Create New Proposal'}
                </h2>
                <p className="text-white/70 text-sm">Design a custom offer for your client</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Proposal Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Enterprise Hosting Package"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Valid Until</label>
              <input
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm(prev => ({ ...prev, valid_until: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this proposal..."
              rows={2}
              className="input"
            />
          </div>

          {/* Select User */}
          <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />
                Select Client
              </h3>
              <button
                type="button"
                onClick={() => setShowNewUser(!showNewUser)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                {showNewUser ? 'Select Existing' : 'Create New User'}
              </button>
            </div>

            {showNewUser ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <input
                      type="text"
                      value={newUser.first_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                      className="input"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newUser.last_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                      className="input"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      value={newUser.company}
                      onChange={(e) => setNewUser(prev => ({ ...prev, company: e.target.value }))}
                      className="input"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  Create & Select User
                </button>
              </div>
            ) : (
              <select
                value={form.user_id}
                onChange={(e) => setForm(prev => ({ ...prev, user_id: e.target.value }))}
                className="input"
                required={!showNewUser}
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Services/Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-500" />
                Services & Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {form.items.map((item, index) => (
                <div key={index} className="p-4 bg-dark-50 dark:bg-dark-700/50 rounded-xl border border-dark-200 dark:border-dark-600">
                  <div className="grid md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium mb-1 text-dark-500">Select Service</label>
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        className="input text-sm"
                      >
                        <option value="">Custom item...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium mb-1 text-dark-500">Item Name *</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Service name"
                        className="input text-sm"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1 text-dark-500">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        className="input text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1 text-dark-500">Price ($)</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="input text-sm"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      {form.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item description (optional)"
                      className="input text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Discount</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={form.discount}
                      onChange={(e) => setForm(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      className="input flex-1"
                    />
                    <select
                      value={form.discount_type}
                      onChange={(e) => setForm(prev => ({ ...prev, discount_type: e.target.value }))}
                      className="input w-24"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax (%)</label>
                  <input
                    type="number"
                    value={form.tax}
                    onChange={(e) => setForm(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={form.bank_method}
                  onChange={(e) => setForm(prev => ({ ...prev, bank_method: e.target.value }))}
                  className="input"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="bkash">bKash</option>
                  <option value="rocket">Rocket</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Credit/Debit Card (Stripe)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3">Price Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-500">Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                {form.discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount ({form.discount}{form.discount_type === 'percentage' ? '%' : '$'})</span>
                    <span>-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                {form.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-dark-500">Tax ({form.tax}%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-emerald-600">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Template Selection */}
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              Invoice Template
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {INVOICE_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, template: template.id }))}
                  className={clsx(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    form.template === template.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-dark-200 dark:border-dark-600 hover:border-primary-300"
                  )}
                >
                  <div className={clsx(
                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2",
                    template.gradient
                  )}>
                    <template.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-dark-500 mt-1">{template.preview}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Notes (visible to client)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
                rows={3}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Terms & Conditions</label>
              <textarea
                value={form.terms}
                onChange={(e) => setForm(prev => ({ ...prev, terms: e.target.value }))}
                rows={3}
                className="input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              {proposal ? 'Update Proposal' : 'Create Proposal'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Main Admin Proposals Page
export default function AdminProposals() {
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [bankSettings, setBankSettings] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editingProposal, setEditingProposal] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [proposalsRes, productsRes, usersRes, bankRes] = await Promise.all([
        adminAPI.getProposals?.() || { data: { proposals: [] } },
        productsAPI.getAll(),
        adminAPI.getUsers(),
        settingsAPI.getPaymentGateway()
      ])
      
      setProposals(proposalsRes.data?.proposals || [])
      setProducts(productsRes.data?.products || productsRes.data || [])
      setUsers(usersRes.data?.users || [])
      setBankSettings(bankRes.data?.settings || {})
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProposal = async (data) => {
    try {
      if (editingProposal) {
        await adminAPI.updateProposal(editingProposal.uuid, data)
        toast.success('Proposal updated!')
      } else {
        await adminAPI.createProposal(data)
        toast.success('Proposal created!')
      }
      loadData()
      setShowModal(false)
      setEditingProposal(null)
    } catch (err) {
      throw err
    }
  }

  const handleSendProposal = async (proposal) => {
    try {
      await adminAPI.sendProposal(proposal.uuid)
      toast.success('Proposal sent to client!')
      loadData()
    } catch (err) {
      toast.error('Failed to send proposal')
    }
  }

  const handleDeleteProposal = async (proposal) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return
    
    try {
      await adminAPI.deleteProposal(proposal.uuid)
      toast.success('Proposal deleted')
      loadData()
    } catch (err) {
      toast.error('Failed to delete proposal')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      viewed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    }
    
    const icons = {
      draft: Clock,
      sent: Send,
      viewed: Eye,
      accepted: CheckCircle,
      rejected: XCircle,
      expired: Clock
    }
    
    const Icon = icons[status] || Clock
    
    return (
      <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', styles[status])}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const filteredProposals = proposals.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) && 
        !p.user_email?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Proposals - Admin - Magnetic Clouds</title></Helmet>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Proposals
          </h1>
          <p className="text-dark-500 mt-1">Create and manage custom offers for clients</p>
        </div>
        <button
          onClick={() => { setEditingProposal(null); setShowModal(true) }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', value: proposals.length, color: 'from-slate-500 to-slate-600' },
          { label: 'Draft', value: proposals.filter(p => p.status === 'draft').length, color: 'from-gray-500 to-gray-600' },
          { label: 'Sent', value: proposals.filter(p => p.status === 'sent').length, color: 'from-blue-500 to-blue-600' },
          { label: 'Accepted', value: proposals.filter(p => p.status === 'accepted').length, color: 'from-green-500 to-green-600' },
          { label: 'Rejected', value: proposals.filter(p => p.status === 'rejected').length, color: 'from-red-500 to-red-600' }
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <div className={clsx('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2', stat.color)}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-dark-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'draft', 'sent', 'accepted', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      {filteredProposals.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No proposals yet</h3>
          <p className="text-dark-500 mb-6">Create your first proposal to send custom offers to clients</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mx-auto">
            <Plus className="w-4 h-4 mr-2" /> Create Proposal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((proposal, index) => (
            <motion.div
              key={proposal.uuid || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{proposal.title}</h3>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {proposal.user_name || proposal.user_email || 'No user'}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${proposal.total?.toFixed(2) || '0.00'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Valid until {new Date(proposal.valid_until).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {proposal.status === 'draft' && (
                    <button
                      onClick={() => handleSendProposal(proposal)}
                      className="btn-primary text-sm"
                    >
                      <Send className="w-4 h-4 mr-1" /> Send
                    </button>
                  )}
                  <button
                    onClick={() => { setEditingProposal(proposal); setShowModal(true) }}
                    className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProposal(proposal)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ProposalModal
            isOpen={showModal}
            onClose={() => { setShowModal(false); setEditingProposal(null) }}
            proposal={editingProposal}
            onSave={handleSaveProposal}
            products={products}
            users={users}
            bankSettings={bankSettings}
          />
        )}
      </AnimatePresence>
    </>
  )
}
