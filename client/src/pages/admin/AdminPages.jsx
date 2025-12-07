import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { FileText, Plus, Edit, Eye } from 'lucide-react'
import { adminAPI } from '../../lib/api'

export default function AdminPages() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-pages'], queryFn: () => adminAPI.getPages().then(res => res.data) })

  return (
    <>
      <Helmet><title>Pages - Admin - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Pages</h1>
        <button className="btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Page</button>
      </div>
      {isLoading ? <div className="text-center py-12">Loading...</div> : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Updated</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {data?.pages?.map(page => (
                <tr key={page.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <td className="p-4 font-medium">{page.title}</td>
                  <td className="p-4 text-dark-500">/{page.slug}</td>
                  <td className="p-4"><span className={`badge ${page.is_published ? 'badge-success' : 'badge-warning'}`}>{page.is_published ? 'Published' : 'Draft'}</span></td>
                  <td className="p-4 text-dark-500">{new Date(page.updated_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <a href={`/${page.slug}`} target="_blank" className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg inline-block"><Eye className="w-4 h-4" /></a>
                    <button className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
