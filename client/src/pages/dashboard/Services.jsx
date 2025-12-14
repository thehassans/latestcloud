import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  Server, Plus, Bot, Globe, Shield, HardDrive, Cloud, Mail, Database, Inbox, Settings,
  ExternalLink, X, Cpu, MemoryStick, HardDrive as Storage, Activity, Loader2,
  Copy, Check, MonitorPlay, Lock, Zap, RefreshCw
} from 'lucide-react'
import { userAPI, nobotAPI, settingsAPI } from '../../lib/api'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  suspended: 'bg-red-500/20 text-red-400 border border-red-500/30',
  cancelled: 'bg-dark-500/20 text-dark-400 border border-dark-500/30',
}

const serviceIcons = {
  nobot: { icon: Bot, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20' },
  hosting: { icon: Server, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' },
  vps: { icon: Cloud, color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/20' },
  dedicated: { icon: HardDrive, color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/20' },
  domain: { icon: Globe, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20' },
  ssl: { icon: Shield, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/20' },
  email: { icon: Mail, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/20' },
  backup: { icon: Database, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-500/20' },
}

// Check if service is a NoBot service
const isNoBotService = (service) => {
  const name = (service.name || '').toLowerCase()
  return name.includes('nobot') || name.includes('no bot') || name.includes('ai bot') || name.includes('chatbot')
}

// Get service icon config
const getServiceConfig = (service) => {
  if (isNoBotService(service)) return serviceIcons.nobot
  return serviceIcons[service.service_type] || serviceIcons.hosting
}

// Get service link
const getServiceLink = (service) => {
  if (isNoBotService(service)) return `/dashboard/nobot?service=${service.uuid}`
  return `/dashboard/services/${service.uuid}`
}

// Check if service is a hosting/server type
const isHostingService = (service) => {
  const type = (service.service_type || '').toLowerCase()
  const name = (service.name || '').toLowerCase()
  return ['hosting', 'vps', 'dedicated', 'cloud', 'server', 'reseller'].some(t => 
    type.includes(t) || name.includes(t)
  )
}

export default function Services() {
  const [manageModal, setManageModal] = useState({ open: false, service: null })
  const [copied, setCopied] = useState(null)
  const [pleskLoading, setPleskLoading] = useState(false)
  
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => userAPI.getServices().then(res => res.data)
  })
  
  // Fetch Plesk config to check if enabled
  const { data: pleskConfig } = useQuery({
    queryKey: ['plesk-config'],
    queryFn: () => userAPI.getPleskStatus().then(res => res.data).catch(() => ({ enabled: false }))
  })

  // Fetch NoBot services to check setup status
  const { data: nobotData } = useQuery({
    queryKey: ['nobots'],
    queryFn: () => nobotAPI.getBots().then(res => res.data)
  })

  // Check if NoBot setup is complete for a service
  const getNoBotStatus = (serviceUuid) => {
    const bot = nobotData?.bots?.find(b => b.service_uuid === serviceUuid)
    return bot ? { setup_step: bot.setup_step, botUuid: bot.uuid } : null
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(null), 2000)
  }

  const handlePleskLogin = async (service) => {
    setPleskLoading(true)
    try {
      const res = await userAPI.getPleskLoginUrl(service.uuid)
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

  return (
    <>
      <Helmet><title>My Services - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Link to="/hosting" className="btn-primary"><Plus className="w-4 h-4 mr-2" /> New Service</Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-500">Loading services...</p>
        </div>
      ) : data?.services?.length > 0 ? (
        <div className="grid gap-4">
          {data.services.map(service => {
            const config = getServiceConfig(service)
            const IconComponent = config.icon
            const link = getServiceLink(service)
            const isNoBot = isNoBotService(service)
            const nobotStatus = isNoBot ? getNoBotStatus(service.uuid) : null
            const isSetupComplete = nobotStatus?.setup_step >= 4
            
            return (
              <div key={service.uuid} className="group card p-6 flex items-center justify-between hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 border border-dark-200 dark:border-dark-700 hover:border-primary-500/50">
                <Link to={link} className="flex items-center gap-4 flex-1">
                  <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br",
                    config.color,
                    "shadow-lg group-hover:scale-110 transition-transform duration-300"
                  )}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary-500 transition-colors">{service.name}</h3>
                    <p className="text-sm text-dark-500">
                      {isNoBot ? 'AI Chatbot Service' : (service.domain_name || service.service_type)}
                    </p>
                    {isNoBot && !isSetupComplete && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-purple-400">
                        <Bot className="w-3 h-3" /> Click to setup or manage
                      </span>
                    )}
                    {isNoBot && isSetupComplete && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-400">
                        <Bot className="w-3 h-3" /> Setup complete
                      </span>
                    )}
                  </div>
                </Link>
                <div className="flex items-center gap-4">
                  {/* Manage button for hosting/server services */}
                  {isHostingService(service) && service.status === 'active' && (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setManageModal({ open: true, service }) }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all mr-4"
                    >
                      <MonitorPlay className="w-4 h-4" /> Manage
                    </button>
                  )}
                  {/* NoBot Inbox & Settings buttons when setup is complete */}
                  {isNoBot && isSetupComplete && (
                    <div className="flex items-center gap-2 mr-4">
                      <Link 
                        to={`/dashboard/nobot?service=${service.uuid}&tab=inbox`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Inbox className="w-4 h-4" /> Inbox
                      </Link>
                      <Link 
                        to={`/dashboard/nobot?service=${service.uuid}`}
                        className="p-2 bg-dark-100 dark:bg-dark-700 rounded-xl hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Settings className="w-4 h-4 text-dark-500" />
                      </Link>
                    </div>
                  )}
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", statusColors[service.status])}>
                    {service.status}
                  </span>
                  <div className="text-right">
                    <p className="text-dark-500 text-sm">Next Due</p>
                    <p className="font-medium">
                      {service.next_due_date ? new Date(service.next_due_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-800 dark:to-dark-900">
          <div className="w-20 h-20 rounded-full bg-dark-200 dark:bg-dark-700 flex items-center justify-center mx-auto mb-6">
            <Server className="w-10 h-10 text-dark-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Services Yet</h2>
          <p className="text-dark-500 mb-6">Get started with our hosting solutions</p>
          <Link to="/hosting" className="btn-primary">Browse Hosting Plans</Link>
        </div>
      )}

      {/* Server Management Modal */}
      <AnimatePresence>
        {manageModal.open && manageModal.service && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setManageModal({ open: false, service: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white dark:bg-dark-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Gradient Header */}
              <div className="relative px-6 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                </div>
                <button
                  onClick={() => setManageModal({ open: false, service: null })}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Server className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{manageModal.service.name}</h2>
                    <p className="text-white/70">Server Management</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Server Details */}
                <div className="space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary-500" />
                    Server Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Hostname */}
                    <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-dark-500 uppercase tracking-wider">Hostname</span>
                        <button
                          onClick={() => copyToClipboard(manageModal.service.hostname || manageModal.service.domain_name || 'N/A', 'hostname')}
                          className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded"
                        >
                          {copied === 'hostname' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-dark-400" />}
                        </button>
                      </div>
                      <p className="font-medium truncate">{manageModal.service.hostname || manageModal.service.domain_name || 'N/A'}</p>
                    </div>
                    
                    {/* IP Address */}
                    <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-dark-500 uppercase tracking-wider">IP Address</span>
                        <button
                          onClick={() => copyToClipboard(manageModal.service.ip_address || 'N/A', 'ip')}
                          className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded"
                        >
                          {copied === 'ip' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-dark-400" />}
                        </button>
                      </div>
                      <p className="font-medium">{manageModal.service.ip_address || 'Pending'}</p>
                    </div>
                    
                    {/* Username */}
                    <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-dark-500 uppercase tracking-wider">Username</span>
                        <button
                          onClick={() => copyToClipboard(manageModal.service.username || 'N/A', 'username')}
                          className="p-1 hover:bg-dark-200 dark:hover:bg-dark-600 rounded"
                        >
                          {copied === 'username' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-dark-400" />}
                        </button>
                      </div>
                      <p className="font-medium">{manageModal.service.username || 'N/A'}</p>
                    </div>
                    
                    {/* Password */}
                    <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-dark-500 uppercase tracking-wider">Password</span>
                        <Lock className="w-3 h-3 text-dark-400" />
                      </div>
                      <p className="font-medium">••••••••</p>
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div className="space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Resources
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl text-center">
                      <Cpu className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-2xl font-bold">{manageModal.service.cpu_cores || '1'}</p>
                      <p className="text-xs text-dark-500">CPU Cores</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-center">
                      <MemoryStick className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <p className="text-2xl font-bold">{manageModal.service.ram || '1'} GB</p>
                      <p className="text-xs text-dark-500">RAM</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl text-center">
                      <Storage className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                      <p className="text-2xl font-bold">{manageModal.service.storage || '20'} GB</p>
                      <p className="text-xs text-dark-500">Storage</p>
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div className="space-y-3 p-4 bg-dark-50 dark:bg-dark-700 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-500">Service Type</span>
                    <span className="font-medium capitalize">{manageModal.service.service_type || 'Hosting'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark-500">Status</span>
                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", statusColors[manageModal.service.status])}>
                      {manageModal.service.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark-500">Billing Cycle</span>
                    <span className="font-medium capitalize">{manageModal.service.billing_cycle || 'Monthly'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark-500">Next Due Date</span>
                    <span className="font-medium">
                      {manageModal.service.next_due_date 
                        ? new Date(manageModal.service.next_due_date).toLocaleDateString() 
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {pleskConfig?.enabled && (
                    <button
                      onClick={() => handlePleskLogin(manageModal.service)}
                      disabled={pleskLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                    >
                      {pleskLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ExternalLink className="w-5 h-5" />
                          Login to Plesk
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setManageModal({ open: false, service: null })}
                    className="flex-1 px-6 py-3 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-xl font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
