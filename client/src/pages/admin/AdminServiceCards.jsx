import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, GripVertical, Save, X, Image, Server, Cloud, Database, Globe, Shield, Mail, Archive, Zap, Monitor } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const iconOptions = [
  { name: 'Server', icon: Server },
  { name: 'Cloud', icon: Cloud },
  { name: 'Database', icon: Database },
  { name: 'Globe', icon: Globe },
  { name: 'Shield', icon: Shield },
  { name: 'Mail', icon: Mail },
  { name: 'Archive', icon: Archive },
  { name: 'Zap', icon: Zap },
  { name: 'Monitor', icon: Monitor }
]

const getIcon = (iconName) => {
  const found = iconOptions.find(i => i.name === iconName)
  return found ? found.icon : Server
}

export default function AdminServiceCards() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCard, setEditingCard] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    link: '',
    icon: 'Server',
    image_url: '',
    is_active: true
  })

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const res = await api.get('/service-cards/admin')
      setCards(res.data || [])
    } catch (error) {
      toast.error('Failed to load service cards')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCard) {
        await api.put(`/service-cards/${editingCard.id}`, formData)
        toast.success('Card updated!')
      } else {
        await api.post('/service-cards', { ...formData, display_order: cards.length })
        toast.success('Card created!')
      }
      fetchCards()
      resetForm()
    } catch (error) {
      toast.error('Failed to save card')
    }
  }

  const handleEdit = (card) => {
    setEditingCard(card)
    setFormData({
      title: card.title,
      description: card.description || '',
      price: card.price,
      link: card.link,
      icon: card.icon || 'Server',
      image_url: card.image_url || '',
      is_active: card.is_active
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service card?')) return
    try {
      await api.delete(`/service-cards/${id}`)
      toast.success('Card deleted!')
      fetchCards()
    } catch (error) {
      toast.error('Failed to delete card')
    }
  }

  const resetForm = () => {
    setEditingCard(null)
    setShowForm(false)
    setFormData({
      title: '',
      description: '',
      price: '',
      link: '',
      icon: 'Server',
      image_url: '',
      is_active: true
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    
    try {
      const res = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFormData(prev => ({ ...prev, image_url: res.data.url }))
      toast.success('Image uploaded!')
    } catch (error) {
      toast.error('Failed to upload image')
    }
  }

  return (
    <>
      <Helmet><title>Service Cards - Admin</title></Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Service Cards</h1>
            <p className="text-dark-500 mt-1">Manage homepage service cards with pricing and images</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Card
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                  {editingCard ? 'Edit Card' : 'Add New Card'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700 dark:text-dark-300">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
                    placeholder="Web Hosting"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700 dark:text-dark-300">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
                    placeholder="Fast & reliable hosting"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-dark-700 dark:text-dark-300">Price ($/mo)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
                      placeholder="2.99"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-dark-700 dark:text-dark-300">Link</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-dark-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white"
                      placeholder="/services/hosting"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700 dark:text-dark-300">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: name }))}
                        className={`p-3 rounded-lg border-2 flex items-center justify-center transition-all ${
                          formData.icon === name
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-dark-200 dark:border-dark-600 hover:border-dark-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${formData.icon === name ? 'text-primary-500' : 'text-dark-500'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700 dark:text-dark-300">Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {formData.image_url ? (
                      <div className="relative">
                        <img src={formData.image_url} alt="Card" className="w-20 h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-lg cursor-pointer hover:border-primary-500">
                        <Image className="w-5 h-5 text-dark-500" />
                        <span className="text-sm text-dark-500">Upload Image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-dark-300 text-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-dark-700 dark:text-dark-300">Active (visible on homepage)</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetForm} className="flex-1 btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {editingCard ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-dark-500">Loading...</div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-500 mb-4">No service cards yet</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Create First Card</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
              const IconComponent = getIcon(card.icon)
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative p-6 rounded-xl border-2 ${
                    card.is_active
                      ? 'bg-white dark:bg-dark-800 border-dark-200 dark:border-dark-700'
                      : 'bg-dark-50 dark:bg-dark-900 border-dark-100 dark:border-dark-800 opacity-60'
                  }`}
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => handleEdit(card)} className="p-1.5 hover:bg-dark-100 dark:hover:bg-dark-700 rounded">
                      <Edit2 className="w-4 h-4 text-dark-500" />
                    </button>
                    <button onClick={() => handleDelete(card.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  {card.image_url ? (
                    <img src={card.image_url} alt={card.title} className="w-12 h-12 object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3">
                      <IconComponent className="w-6 h-6 text-primary-500" />
                    </div>
                  )}

                  <h3 className="font-semibold text-dark-900 dark:text-white">{card.title}</h3>
                  <p className="text-sm text-dark-500 mt-1">{card.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-dark-400">{card.link}</span>
                    <span className="text-lg font-bold text-primary-500">${card.price}/mo</span>
                  </div>
                  {!card.is_active && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-dark-200 dark:bg-dark-700 text-xs rounded">Hidden</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
