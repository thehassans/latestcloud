import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Search, Trash2, Download, Eye, X, Copy,
  Check, CheckCheck, Filter, Clock, User, Bot
} from 'lucide-react'
import { useAIAgent } from '../../contexts/AIAgentContext'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function AdminAgentChats() {
  const { savedChats, deleteChat, clearAllChats } = useAIAgent()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedChat, setSelectedChat] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Filter chats
  const filteredChats = useMemo(() => {
    return savedChats.filter(chat => {
      // Status filter
      if (statusFilter !== 'all' && chat.status !== statusFilter) return false
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesChatId = chat.chatId?.toLowerCase().includes(query)
        const matchesAgent = chat.agent?.name?.toLowerCase().includes(query)
        const matchesMessage = chat.messages?.some(m => 
          m.content?.toLowerCase().includes(query)
        )
        return matchesChatId || matchesAgent || matchesMessage
      }
      
      return true
    })
  }, [savedChats, searchQuery, statusFilter])

  // Export chats to JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(savedChats, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Chat history exported!')
  }

  // Copy chat ID
  const handleCopyId = (chatId) => {
    navigator.clipboard.writeText(chatId)
    toast.success('Chat ID copied!')
  }

  // Delete single chat
  const handleDelete = (chatId) => {
    deleteChat(chatId)
    toast.success('Chat deleted')
  }

  // Delete all chats
  const handleDeleteAll = () => {
    clearAllChats()
    setShowDeleteConfirm(false)
    toast.success('All chats deleted')
  }

  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <Helmet><title>Chat History - Admin - Magnetic Clouds</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-500" />
            Chat History
          </h1>
          <p className="text-dark-500 mt-1">{savedChats.length} total conversations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={savedChats.length === 0}
            className="btn-outline flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={savedChats.length === 0}
            className="btn-outline text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by chat ID, agent name, or message..."
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-dark-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="closed_by_user">Closed by User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <p className="text-dark-500 font-medium">No chats found</p>
          <p className="text-dark-400 text-sm mt-1">
            {savedChats.length === 0 
              ? "Chat history will appear here when customers start conversations"
              : "Try adjusting your search or filter criteria"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.chatId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {chat.agent?.avatar ? (
                    <img
                      src={chat.agent.avatar}
                      alt={chat.agent.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-dark-200 dark:bg-dark-700 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-dark-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{chat.agent?.name || 'Unknown Agent'}</p>
                      <span className={clsx(
                        "px-2 py-0.5 text-xs rounded-full font-medium",
                        chat.status === 'completed' 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}>
                        {chat.status === 'completed' ? 'Completed' : 'Closed by User'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-dark-500">
                      <button
                        onClick={() => handleCopyId(chat.chatId)}
                        className="flex items-center gap-1 hover:text-indigo-500 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        {chat.chatId}
                      </button>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(chat.startedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {chat.messages?.length || 0} messages
                      </span>
                    </div>
                    {chat.messages && chat.messages.length > 0 && (
                      <p className="text-sm text-dark-400 mt-2 truncate max-w-lg">
                        Last: {chat.messages[chat.messages.length - 1]?.content?.substring(0, 60)}...
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedChat(chat)}
                    className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 text-dark-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(chat.chatId)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chat Detail Modal */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedChat.agent?.avatar && (
                      <img
                        src={selectedChat.agent.avatar}
                        alt={selectedChat.agent.name}
                        className="w-14 h-14 rounded-full border-3 border-white/30"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{selectedChat.agent?.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-white/70">
                        <button
                          onClick={() => handleCopyId(selectedChat.chatId)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          {selectedChat.chatId}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex gap-6 mt-4 text-sm text-white/70">
                  <span>Started: {formatDate(selectedChat.startedAt)}</span>
                  <span>Ended: {formatDate(selectedChat.endedAt)}</span>
                  <span>User: {selectedChat.userName || 'Guest'}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4 bg-dark-50 dark:bg-dark-900">
                {selectedChat.messages?.map((msg, idx) => (
                  <div key={idx}>
                    {msg.type === 'system' ? (
                      <div className="flex justify-center">
                        <span className="px-4 py-1.5 bg-dark-200 dark:bg-dark-700 text-dark-500 text-xs rounded-full">
                          {msg.content}
                        </span>
                      </div>
                    ) : msg.type === 'user' ? (
                      <div className="flex justify-end">
                        <div className="max-w-[80%]">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md">
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs text-dark-400">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-end gap-2">
                        {selectedChat.agent?.avatar && (
                          <img 
                            src={selectedChat.agent.avatar} 
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="max-w-[80%]">
                          <div className="bg-white dark:bg-dark-800 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-dark-100 dark:border-dark-700">
                            <p className="text-sm text-dark-800 dark:text-dark-200">{msg.content}</p>
                          </div>
                          <span className="text-xs text-dark-400 mt-1 block">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete All Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Delete All Chats?</h3>
                <p className="text-dark-500 mb-6">
                  This will permanently delete {savedChats.length} chat{savedChats.length !== 1 ? 's' : ''}. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Delete All
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
