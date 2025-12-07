import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Image, Upload, Trash2 } from 'lucide-react'
import { adminAPI } from '../../lib/api'
import toast from 'react-hot-toast'

export default function AdminMedia() {
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-media'], 
    queryFn: () => adminAPI.getMedia().then(res => res.data) 
  })

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      await adminAPI.uploadImage(file)
      queryClient.invalidateQueries(['admin-media'])
      toast.success('Image uploaded and converted to WebP!')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const deleteMutation = useMutation({
    mutationFn: (uuid) => adminAPI.deleteMedia(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-media'])
      toast.success('Media deleted')
    }
  })

  return (
    <>
      <Helmet><title>Media Library - Admin - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <label className="btn-primary cursor-pointer">
          <Upload className="w-4 h-4 mr-2" /> 
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
      
      <p className="text-dark-500 mb-6">All uploaded images are automatically converted to WebP format for optimal performance.</p>
      
      {isLoading ? <div className="text-center py-12">Loading...</div> : data?.media?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.media.map(item => (
            <div key={item.uuid} className="group relative aspect-square card overflow-hidden">
              <img src={item.path} alt={item.alt_text || item.filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <p className="text-white text-xs px-2 text-center truncate w-full">{item.original_filename}</p>
                <button onClick={() => deleteMutation.mutate(item.uuid)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Image className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Media Yet</h2>
          <p className="text-dark-500">Upload your first image to get started</p>
        </div>
      )}
    </>
  )
}
