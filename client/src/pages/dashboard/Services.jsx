import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Server, Plus } from 'lucide-react'
import { userAPI } from '../../lib/api'
import clsx from 'clsx'

const statusColors = {
  active: 'bg-green-100 text-green-600',
  pending: 'bg-yellow-100 text-yellow-600',
  suspended: 'bg-red-100 text-red-600',
}

export default function Services() {
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => userAPI.getServices().then(res => res.data)
  })

  return (
    <>
      <Helmet><title>My Services - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Link to="/hosting" className="btn-primary"><Plus className="w-4 h-4 mr-2" /> New Service</Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : data?.services?.length > 0 ? (
        <div className="grid gap-4">
          {data.services.map(service => (
            <Link key={service.uuid} to={`/dashboard/services/${service.uuid}`}
              className="card p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Server className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-bold">{service.name}</h3>
                  <p className="text-sm text-dark-500">{service.domain_name || service.service_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={clsx("badge", statusColors[service.status])}>{service.status}</span>
                <span className="text-dark-500 text-sm">
                  Due: {service.next_due_date ? new Date(service.next_due_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Server className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Services Yet</h2>
          <p className="text-dark-500 mb-6">Get started with our hosting solutions</p>
          <Link to="/hosting" className="btn-primary">Browse Hosting Plans</Link>
        </div>
      )}
    </>
  )
}
