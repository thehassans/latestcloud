import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Server, Globe, FileText, Ticket, 
  User, Settings, LogOut, Menu, X, ChevronRight,
  ShoppingCart, Moon, Sun, Bell
} from 'lucide-react'
import { useAuthStore, useThemeStore } from '../store/useStore'
import clsx from 'clsx'

const sidebarLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/services', icon: Server, label: 'My Services' },
  { to: '/dashboard/domains', icon: Globe, label: 'My Domains' },
  { to: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
  { to: '/dashboard/tickets', icon: Ticket, label: 'Support Tickets' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={clsx(
        "fixed top-0 left-0 z-50 h-full bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 transform transition-all duration-300",
        sidebarCollapsed ? "w-20" : "w-72",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-200 dark:border-dark-800">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              MC
            </div>
            {!sidebarCollapsed && <span className="font-display font-bold text-xl">Magnetic</span>}
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={clsx("p-2 space-y-1", sidebarCollapsed && "px-2")}>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                sidebarCollapsed && "justify-center px-2",
                isActive 
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" 
                  : "text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800"
              )}
              title={sidebarCollapsed ? link.label : undefined}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-dark-200 dark:border-dark-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-50 dark:bg-dark-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-sm text-dark-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={clsx(
              "mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors",
              sidebarCollapsed && "px-2"
            )}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full mt-2 items-center justify-center gap-2 px-4 py-2 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 rounded-xl transition-colors text-sm text-dark-500"
          >
            <ChevronRight className={clsx("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            {!sidebarCollapsed && "Collapse"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={clsx("transition-all duration-300", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-200 dark:border-dark-800">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden sm:flex items-center text-sm text-dark-500">
                <NavLink to="/dashboard" className="hover:text-primary-500">Dashboard</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
