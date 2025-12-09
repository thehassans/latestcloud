import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Server, Shield, Zap, Navigation } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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

// Active/selected marker icon
const activeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 41"><path fill="#8b5cf6" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 29 12 29s12-20 12-29c0-6.6-5.4-12-12-12z"/><circle fill="white" cx="12" cy="12" r="5"/></svg>`),
  iconSize: [24, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -34]
})

// Map controller component
function MapController({ selectedLocation, locations }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedLocation) {
      const loc = locations.find(l => l.id === selectedLocation)
      if (loc) {
        map.flyTo([loc.latitude, loc.longitude], 5, {
          duration: 1.5
        })
      }
    } else {
      // Reset to world view
      map.flyTo([20, 0], 2, {
        duration: 1.5
      })
    }
  }, [selectedLocation, locations, map])
  
  return null
}

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
  const { themeStyle, theme } = useThemeStore()
  const isGradient = themeStyle === 'gradient'
  const isDark = theme === 'dark'
  const [selectedLocation, setSelectedLocation] = useState(null)

  const { data: datacenters } = useQuery({
    queryKey: ['datacenters'],
    queryFn: () => settingsAPI.getDatacenters().then(res => res.data.datacenters)
  })

  // Use API data if available and not empty, otherwise use static data
  const locations = (datacenters && datacenters.length > 0) ? datacenters : staticDatacenters
  
  // Tile layer URLs for light and dark themes
  const lightTileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

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
          <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-primary-500/20 dark:border-primary-500/30 relative z-0" style={{ height: '400px' }}>
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }} 
              scrollWheelZoom={false}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              doubleClickZoom={false}
              touchZoom={false}
              keyboard={false}
            >
              <TileLayer url={isDark ? darkTileUrl : lightTileUrl} />
              <MapController selectedLocation={selectedLocation} locations={locations} />
              {locations.map((dc) => (
                <Marker 
                  key={dc.id} 
                  position={[dc.latitude, dc.longitude]} 
                  icon={selectedLocation === dc.id ? activeIcon : customIcon}
                  eventHandlers={{
                    click: () => setSelectedLocation(dc.id)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[150px]">
                      <div className="font-bold text-gray-900 text-base">{dc.name}</div>
                      <div className="text-sm text-gray-600">{dc.location}</div>
                      <div className="text-xs text-gray-500 mt-1">{dc.description}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-2 mx-auto"
              >
                <Navigation className="w-4 h-4" />
                Reset Map View
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Our Locations</h2>
          <p className="text-center text-dark-500 -mt-8 mb-8">Click on a location to view it on the map</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((dc, i) => (
              <motion.button
                key={dc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedLocation(dc.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={clsx(
                  "card p-6 text-left transition-all duration-300 hover:scale-[1.02]",
                  selectedLocation === dc.id
                    ? "ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "hover:shadow-lg"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all",
                    selectedLocation === dc.id
                      ? "bg-gradient-to-br from-primary-500 to-purple-500 scale-110"
                      : isGradient ? "bg-gradient-to-br from-primary-500 to-secondary-500" : "bg-primary-500"
                  )}>
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{dc.name}</h3>
                    <p className="text-dark-500">{dc.location}</p>
                    <p className="text-sm text-dark-400 mt-2">{dc.description}</p>
                  </div>
                </div>
                {selectedLocation === dc.id && (
                  <div className="mt-3 flex items-center gap-1 text-primary-500 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    Currently viewing
                  </div>
                )}
              </motion.button>
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
