import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { userAPI } from '../../lib/api'
import { useCurrencyStore } from '../../store/useStore'
import clsx from 'clsx'

export default function Invoices() {
  const { format } = useCurrencyStore()
  const { data, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => userAPI.getInvoices().then(res => res.data)
  })

  return (
    <>
      <Helmet><title>Invoices - Magnetic Clouds</title></Helmet>
      <h1 className="text-2xl font-bold mb-8">Invoices</h1>
      {isLoading ? <div className="text-center py-12">Loading...</div> : data?.invoices?.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left p-4 font-medium">Invoice</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Due Date</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {data.invoices.map(inv => (
                <tr key={inv.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <td className="p-4 font-medium">{inv.invoice_number}</td>
                  <td className="p-4">{format(inv.total)}</td>
                  <td className="p-4">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={clsx("badge", inv.status === 'paid' ? 'badge-success' : 'badge-danger')}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Invoices Yet</h2>
          <p className="text-dark-500">Your invoices will appear here</p>
        </div>
      )}
    </>
  )
}
