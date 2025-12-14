import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  Server, ArrowLeft, Globe, Shield, HardDrive, Cloud, Mail, Database,
  ExternalLink, Cpu, MemoryStick, HardDrive as Storage, Activity, Loader2,
  Copy, Check, MonitorPlay, Lock, Zap, RefreshCw, Settings, Calendar,
  CreditCard, Clock, ChevronRight, FileText, Power, Pause, Play, Sparkles,
  Receipt, Headphones, BarChart3, Wifi, Key
} from 'lucide-react'
import { userAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

// Format currency
const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

// Parse specs from service name like "Custom VPS (32 vCPU, 128GB RAM, 2000GB SSD)"
const parseServiceSpecs = (service) => {
  const name = service.name || ''
  const specs = { cpu: null, ram: null, storage: null, bandwidth: null, type: null }
  
  // Detect service type
  const nameLower = name.toLowerCase()
  if (nameLower.includes('vps')) specs.type = 'VPS'
  else if (nameLower.includes('dedicated')) specs.type = 'Dedicated Server'
  else if (nameLower.includes('cloud')) specs.type = 'Cloud Server'
  else if (nameLower.includes('reseller')) specs.type = 'Reseller Hosting'
  else if (nameLower.includes('hosting')) specs.type = 'Hosting'
  else specs.type = service.service_type || 'Hosting'
  
  // Parse CPU - look for patterns like "32 vCPU", "8 CPU", "4 Core"
  const cpuMatch = name.match(/(\d+)\s*(vcpu|cpu|core)/i)
  if (cpuMatch) specs.cpu = cpuMatch[1]
  
  // Parse RAM - look for patterns like "128GB RAM", "4GB RAM", "8 GB RAM"
  const ramMatch = name.match(/(\d+)\s*GB\s*RAM/i)
  if (ramMatch) specs.ram = ramMatch[1]
  
  // Parse Storage - look for patterns like "2000GB SSD", "500GB NVMe", "100 GB"
  const storageMatch = name.match(/(\d+)\s*GB\s*(SSD|NVMe|HDD|Storage)?/i)
  if (storageMatch && !name.toLowerCase().includes(storageMatch[0].toLowerCase() + ' ram')) {
    // Make sure it's not the RAM value
    const fullMatch = storageMatch[0]
    if (!fullMatch.toLowerCase().includes('ram')) {
      specs.storage = storageMatch[1]
    }
  }
  
  // Better storage parsing - find storage after RAM or at end
  const storageBetterMatch = name.match(/,\s*(\d+)\s*GB\s*(SSD|NVMe|HDD)?/i)
  if (storageBetterMatch) specs.storage = storageBetterMatch[1]
  
  // Parse Bandwidth if present
  const bwMatch = name.match(/(\d+)\s*(TB|GB)\s*(Bandwidth|BW)?/i)
  if (bwMatch) specs.bandwidth = bwMatch[1] + (bwMatch[2] === 'GB' ? ' GB' : ' TB')
  
  return specs
}

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  suspended: 'bg-red-500/20 text-red-400 border border-red-500/30',
  cancelled: 'bg-dark-500/20 text-dark-400 border border-dark-500/30',
}

export default function ServiceManagement() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(null)
  const [pleskLoading, setPleskLoading] = useState(false)

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', uuid],
    queryFn: () => userAPI.getService(uuid).then(res => res.data?.service)
  })

  const { data: pleskConfig } = useQuery({
    queryKey: ['plesk-config'],
    queryFn: () => userAPI.getPleskStatus().then(res => res.data).catch(() => ({ enabled: false }))
  })

  // Parse specs from service name
  const specs = service ? parseServiceSpecs(service) : {}

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(null), 2000)
  }

  const handlePleskLogin = async () => {
    setPleskLoading(true)
    try {
      const res = await userAPI.getPleskLoginUrl(uuid)
      if (res.data?.url) {
        window.open(res.data.url, '_blank')
      } else {
        toast.error('Could not generate Plesk login URL')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to connect to Plesk')
    } finally {
      setPleskLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-20">
        <Server className="w-16 h-16 mx-auto mb-4 text-dark-400" />
        <h2 className="text-xl font-bold mb-2">Service Not Found</h2>
        <p className="text-dark-500 mb-6">The service you're looking for doesn't exist.</p>
        <Link to="/dashboard/services" className="btn-primary">Back to Services</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{service.name} - Server Management</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/dashboard/services" 
          className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-500 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Server className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{service.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", statusColors[service.status])}>
                  {service.status}
                </span>
                <span className="text-dark-500 capitalize">{specs.type || service.service_type || 'Hosting'}</span>
              </div>
            </div>
          </div>
          
          {service.status === 'active' && (
            <button
              onClick={handlePleskLogin}
              disabled={pleskLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
            >
              {pleskLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Login to Panel
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Server Details Card */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Server Details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Hostname */}
                <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-dark-500 uppercase tracking-wider">Hostname</span>
                    <button
                      onClick={() => copyToClipboard(service.hostname || service.domain_name || 'N/A', 'hostname')}
                      className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded transition-colors"
                    >
                      {copied === 'hostname' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-dark-400" />}
                    </button>
                  </div>
                  <p className="font-medium truncate">{service.hostname || service.domain_name || 'N/A'}</p>
                </div>
                
                {/* IP Address */}
                <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-dark-500 uppercase tracking-wider">IP Address</span>
                    <button
                      onClick={() => copyToClipboard(service.ip_address || 'N/A', 'ip')}
                      className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded transition-colors"
                    >
                      {copied === 'ip' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-dark-400" />}
                    </button>
                  </div>
                  <p className="font-medium">{service.ip_address || 'Pending'}</p>
                </div>
                
                {/* Username */}
                <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-dark-500 uppercase tracking-wider">Username</span>
                    <button
                      onClick={() => copyToClipboard(service.username || 'N/A', 'username')}
                      className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded transition-colors"
                    >
                      {copied === 'username' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-dark-400" />}
                    </button>
                  </div>
                  <p className="font-medium">{service.username || 'N/A'}</p>
                </div>
                
                {/* Password */}
                <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-dark-500 uppercase tracking-wider">Password</span>
                    <Lock className="w-3 h-3 text-dark-400" />
                  </div>
                  <p className="font-medium">••••••••</p>
                </div>

                {/* Nameservers */}
                {service.nameservers && (
                  <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-dark-500 uppercase tracking-wider">Nameservers</span>
                      <button
                        onClick={() => copyToClipboard(service.nameservers, 'ns')}
                        className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded transition-colors"
                      >
                        {copied === 'ns' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-dark-400" />}
                      </button>
                    </div>
                    <p className="font-medium">{service.nameservers}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resources Card */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Resources
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl text-center"
                >
                  <Cpu className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{specs.cpu || service.cpu_cores || '1'}</p>
                  <p className="text-xs text-dark-500">vCPU</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-center"
                >
                  <MemoryStick className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{specs.ram || service.ram || '1'} GB</p>
                  <p className="text-xs text-dark-500">RAM</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl text-center"
                >
                  <Storage className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <p className="text-2xl font-bold">{specs.storage || service.storage || '20'} GB</p>
                  <p className="text-xs text-dark-500">Storage</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-xl text-center"
                >
                  <Wifi className="w-8 h-8 mx-auto mb-2 text-rose-500" />
                  <p className="text-2xl font-bold">{specs.bandwidth || service.bandwidth || '1 TB'}</p>
                  <p className="text-xs text-dark-500">Bandwidth</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {pleskConfig?.enabled && service.status === 'active' && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-500" />
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button 
                  onClick={handlePleskLogin}
                  className="p-4 bg-dark-50 dark:bg-dark-700 hover:bg-dark-100 dark:hover:bg-dark-600 rounded-xl transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <MonitorPlay className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-medium">Control Panel</p>
                        <p className="text-xs text-dark-500">Manage via Plesk</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </button>
                <button className="p-4 bg-dark-50 dark:bg-dark-700 hover:bg-dark-100 dark:hover:bg-dark-600 rounded-xl transition-colors text-left group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Databases</p>
                        <p className="text-xs text-dark-500">Manage MySQL/PgSQL</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </button>
                <button className="p-4 bg-dark-50 dark:bg-dark-700 hover:bg-dark-100 dark:hover:bg-dark-600 rounded-xl transition-colors text-left group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Email Accounts</p>
                        <p className="text-xs text-dark-500">Setup email</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Info */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Service Information
              </h3>
            </div>
            <div className="p-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-dark-100 dark:border-dark-700">
                <span className="text-dark-500">Service Type</span>
                <span className="font-medium capitalize">{specs.type || service.service_type || 'Hosting'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-dark-100 dark:border-dark-700">
                <span className="text-dark-500">Status</span>
                <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", statusColors[service.status])}>
                  {service.status}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-dark-100 dark:border-dark-700">
                <span className="text-dark-500">Billing Cycle</span>
                <span className="font-medium capitalize">{service.billing_cycle || 'Monthly'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-dark-100 dark:border-dark-700">
                <span className="text-dark-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Created
                </span>
                <span className="font-medium">
                  {service.created_at ? new Date(service.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Next Due
                </span>
                <span className="font-medium">
                  {service.next_due_date ? new Date(service.next_due_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            </div>
          </div>

          {/* Billing */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing
              </h3>
            </div>
            <div className="p-5">
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl mb-4">
                <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Current Plan</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(service.amount || service.price || service.total || 0)}
                  <span className="text-sm font-normal text-dark-500">/{service.billing_cycle || 'monthly'}</span>
                </p>
              </div>
              <Link 
                to={`/dashboard/invoices?service=${uuid}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
              >
                <Receipt className="w-4 h-4" />
                View Invoices
              </Link>
            </div>
          </div>

          {/* Need Help */}
          <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-indigo-500/10 border-primary-500/20">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-dark-500 mb-4">Our support team is available 24/7 to assist you.</p>
            <Link 
              to="/dashboard/tickets"
              className="block w-full text-center py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium"
            >
              Open Support Ticket
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
