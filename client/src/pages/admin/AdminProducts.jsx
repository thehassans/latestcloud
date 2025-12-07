import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import { adminAPI } from '../../lib/api'
import { useCurrencyStore } from '../../store/useStore'

export default function AdminProducts() {
  const { format } = useCurrencyStore()
  const { data, isLoading } = useQuery({ queryKey: ['admin-products'], queryFn: () => adminAPI.getProducts().then(res => res.data) })

  return (
    <>
      <Helmet><title>Products - Admin - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Product</button>
      </div>
      {isLoading ? <div className="text-center py-12">Loading...</div> : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Price (Monthly)</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {data?.products?.map(product => (
                <tr key={product.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-dark-500">{product.category_name}</td>
                  <td className="p-4">{product.price_monthly ? format(product.price_monthly) : 'N/A'}</td>
                  <td className="p-4">
                    <span className={`badge ${product.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
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
