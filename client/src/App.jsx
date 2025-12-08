import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore, useAuthStore, useSettingsStore } from './store/useStore'
import { settingsAPI } from './lib/api'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

// Loading component
import LoadingScreen from './components/ui/LoadingScreen'

// AI Agent
import { AIAgentProvider } from './contexts/AIAgentContext'
import AIChatWidget from './components/AIChatWidget'

// Public pages (lazy loaded)
const Home = lazy(() => import('./pages/Home'))
const Hosting = lazy(() => import('./pages/services/Hosting'))
const VPS = lazy(() => import('./pages/services/VPS'))
const Cloud = lazy(() => import('./pages/services/Cloud'))
const Dedicated = lazy(() => import('./pages/services/Dedicated'))
const Domains = lazy(() => import('./pages/Domains'))
const SSL = lazy(() => import('./pages/services/SSL'))
const Email = lazy(() => import('./pages/services/Email'))
const Backup = lazy(() => import('./pages/services/Backup'))
const Datacenters = lazy(() => import('./pages/Datacenters'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Support = lazy(() => import('./pages/Support'))
const Terms = lazy(() => import('./pages/legal/Terms'))
const Privacy = lazy(() => import('./pages/legal/Privacy'))
const Refund = lazy(() => import('./pages/legal/Refund'))
const SLA = lazy(() => import('./pages/legal/SLA'))
const AcceptableUse = lazy(() => import('./pages/legal/AcceptableUse'))

// Company pages
const Careers = lazy(() => import('./pages/Careers'))
const Blog = lazy(() => import('./pages/Blog'))
const Partners = lazy(() => import('./pages/Partners'))

// Support pages
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'))
const SystemStatus = lazy(() => import('./pages/SystemStatus'))
const ReportAbuse = lazy(() => import('./pages/ReportAbuse'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))

// Dashboard pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const Services = lazy(() => import('./pages/dashboard/Services'))
const ServiceDetail = lazy(() => import('./pages/dashboard/ServiceDetail'))
const MyDomains = lazy(() => import('./pages/dashboard/MyDomains'))
const Invoices = lazy(() => import('./pages/dashboard/Invoices'))
const Tickets = lazy(() => import('./pages/dashboard/Tickets'))
const TicketDetail = lazy(() => import('./pages/dashboard/TicketDetail'))
const NewTicket = lazy(() => import('./pages/dashboard/NewTicket'))
const Profile = lazy(() => import('./pages/dashboard/Profile'))
const Orders = lazy(() => import('./pages/dashboard/Orders'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminTickets = lazy(() => import('./pages/admin/AdminTickets'))
const AdminDomains = lazy(() => import('./pages/admin/AdminDomains'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminPages = lazy(() => import('./pages/admin/AdminPages'))
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'))
const AdminAIAgent = lazy(() => import('./pages/admin/AdminAIAgent'))
const AdminAgentChats = lazy(() => import('./pages/admin/AdminAgentChats'))
const AdminServiceCards = lazy(() => import('./pages/admin/AdminServiceCards'))

// Protected Route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  const { theme, themeStyle } = useThemeStore()
  const { setSettings } = useSettingsStore()

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Apply theme style
  useEffect(() => {
    document.documentElement.setAttribute('data-theme-style', themeStyle)
  }, [themeStyle])

  // Fetch public settings
  useEffect(() => {
    settingsAPI.getPublic()
      .then(res => setSettings(res.data.settings))
      .catch(console.error)
  }, [setSettings])

  return (
    <AIAgentProvider>
      <Suspense fallback={<LoadingScreen />}>
        <AIChatWidget />
        <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hosting" element={<Hosting />} />
          <Route path="/vps" element={<VPS />} />
          <Route path="/cloud" element={<Cloud />} />
          <Route path="/dedicated" element={<Dedicated />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/ssl" element={<SSL />} />
          <Route path="/email" element={<Email />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/datacenters" element={<Datacenters />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/sla" element={<SLA />} />
          <Route path="/acceptable-use" element={<AcceptableUse />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/report-abuse" element={<ReportAbuse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
        </Route>

        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:uuid" element={<ServiceDetail />} />
          <Route path="domains" element={<MyDomains />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/new" element={<NewTicket />} />
          <Route path="tickets/:uuid" element={<TicketDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="domains" element={<AdminDomains />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="ai-agent" element={<AdminAIAgent />} />
          <Route path="ai-chats" element={<AdminAgentChats />} />
          <Route path="service-cards" element={<AdminServiceCards />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    </AIAgentProvider>
  )
}

export default App
