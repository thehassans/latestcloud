import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Server, Shield, Zap } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { settingsAPI } from '../lib/api'
import { useThemeStore } from '../store/useStore'
import clsx from 'clsx'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Static datacenter locations as fallback
const staticDatacenters = [
  { id: 1, name: 'New York', location: 'USA', latitude: 40.7128, longitude: -74.0060, description: 'East Coast USA datacenter' },
  { id: 2, name: 'Los Angeles', location: 'USA', latitude: 34.0522, longitude: -118.2437, description: 'West Coast USA datacenter' },
  { id: 3, name: 'London', location: 'UK', latitude: 51.5074, longitude: -0.1278, description: 'European datacenter' },
  { id: 4, name: 'Frankfurt', location: 'Germany', latitude: 50.1109, longitude: 8.6821, description: 'Central Europe datacenter' },
  { id: 5, name: 'Singapore', location: 'Singapore', latitude: 1.3521, longitude: 103.8198, description: 'Southeast Asia datacenter' },
  { id: 6, name: 'Tokyo', location: 'Japan', latitude: 35.6762, longitude: 139.6503, description: 'East Asia datacenter' },
  { id: 7, name: 'Sydney', location: 'Australia', latitude: -33.8688, longitude: 151.2093, description: 'Oceania datacenter' },
  { id: 8, name: 'Mumbai', location: 'India', latitude: 19.0760, longitude: 72.8777, description: 'South Asia datacenter' },
  { id: 9, name: 'São Paulo', location: 'Brazil', latitude: -23.5505, longitude: -46.6333, description: 'South America datacenter' },
  { id: 10, name: 'Dubai', location: 'UAE', latitude: 25.2048, longitude: 55.2708, description: 'Middle East datacenter' },
]

export default function Datacenters() {
  const { themeStyle } = useThemeStore()
  const isGradient = themeStyle === 'gradient'

  const { data: datacenters, isLoading } = useQuery({
    queryKey: ['datacenters'],
    queryFn: () => settingsAPI.getDatacenters().then(res => res.data.datacenters)
  })

  return (
    <>
      <Helmet>
        <title>Global Datacenters - Magnetic Clouds</title>
        <meta name="description" content="10+ datacenter locations worldwide for optimal performance and low latency." />
      </Helmet>

      <section className={clsx("py-20", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-950")}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm font-medium mb-6">
            <MapPin className="w-4 h-4" /> Global Infrastructure
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">
            Global <span className={isGradient ? "text-gradient" : "text-primary-500"}>Datacenters</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-dark-500 max-w-2xl mx-auto">
            Deploy your applications closer to your users with our worldwide datacenter network.
          </motion.p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-dark-700 relative z-0" style={{ height: '400px' }}>
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }} 
              scrollWheelZoom={false}
              zoomControl={true}
              attributionControl={false}
              dragging={true}
              doubleClickZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {(datacenters || staticDatacenters).map((dc) => (
                <Marker key={dc.id} position={[dc.latitude, dc.longitude]} icon={customIcon}>
                  <Popup>
                    <div className="p-1">
                      <div className="font-bold text-gray-900">{dc.name}</div>
                      <div className="text-sm text-gray-600">{dc.location}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Our Locations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(datacenters || staticDatacenters).map((dc, i) => (
              <motion.div key={dc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-white",
                    isGradient ? "bg-gradient-to-br from-primary-500 to-secondary-500" : "bg-primary-500")}>
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{dc.name}</h3>
                    <p className="text-dark-500">{dc.location}</p>
                    <p className="text-sm text-dark-400 mt-2">{dc.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={clsx("section", isGradient ? "bg-gradient-mesh" : "bg-dark-50 dark:bg-dark-900")}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Low Latency</h3>
              <p className="mt-2 text-dark-500">Sub-millisecond response times with strategically placed servers.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Tier-4 Security</h3>
              <p className="mt-2 text-dark-500">Enterprise-grade physical and network security.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Server className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold">99.99% Uptime</h3>
              <p className="mt-2 text-dark-500">Redundant power, cooling, and network connectivity.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
