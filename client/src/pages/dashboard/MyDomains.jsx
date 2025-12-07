import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Globe, Plus } from 'lucide-react'

export default function MyDomains() {
  return (
    <>
      <Helmet><title>My Domains - Magnetic Clouds</title></Helmet>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Domains</h1>
        <Link to="/domains" className="btn-primary"><Plus className="w-4 h-4 mr-2" /> Register Domain</Link>
      </div>
      <div className="card p-12 text-center">
        <Globe className="w-16 h-16 text-dark-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">No Domains Yet</h2>
        <p className="text-dark-500 mb-6">Register your first domain name</p>
        <Link to="/domains" className="btn-primary">Search Domains</Link>
      </div>
    </>
  )
}
