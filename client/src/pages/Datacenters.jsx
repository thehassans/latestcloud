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
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

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
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-dark-700" style={{ height: '350px' }}>
            {!isLoading && datacenters && (
              <MapContainer 
                center={[25, 20]} 
                zoom={2} 
                style={{ height: '100%', width: '100%' }} 
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                dragging={true}
                doubleClickZoom={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {datacenters.map((dc) => (
                  <Marker key={dc.id} position={[dc.latitude, dc.longitude]} icon={customIcon}>
                    <Popup className="custom-popup">
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Server className="w-4 h-4 text-primary-500" />
                          <span className="font-bold text-dark-900">{dc.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-dark-600">
                          <MapPin className="w-3 h-3" />
                          {dc.location}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Our Locations</h2>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datacenters?.map((dc, i) => (
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
          )}
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
