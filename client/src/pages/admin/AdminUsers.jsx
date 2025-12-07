import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Users, Search } from 'lucide-react'
import { adminAPI } from '../../lib/api'
import { useState } from 'react'
import clsx from 'clsx'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => adminAPI.getUsers({ search }).then(res => res.data)
  })

  return (
    <>
      <Helmet><title>Users - Admin - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..." className="input pl-12 w-64" />
        </div>
      </div>
      {isLoading ? <div className="text-center py-12">Loading...</div> : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {data?.users?.map(user => (
                <tr key={user.uuid} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-dark-500">{user.email}</td>
                  <td className="p-4"><span className="badge badge-primary">{user.role}</span></td>
                  <td className="p-4">
                    <span className={clsx("badge", user.status === 'active' ? 'badge-success' : 'badge-danger')}>{user.status}</span>
                  </td>
                  <td className="p-4 text-dark-500">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
