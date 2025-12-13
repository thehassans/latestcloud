import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './i18n'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster 
            position="top-right"
            gutter={12}
            containerStyle={{
              top: 20,
              right: 20,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
                color: '#f9fafb',
                padding: '16px 20px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '420px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              success: {
                duration: 4000,
                style: {
                  background: 'linear-gradient(135deg, rgba(5, 46, 22, 0.95) 0%, rgba(20, 83, 45, 0.95) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(34, 197, 94, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                },
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#dcfce7',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: 'linear-gradient(135deg, rgba(69, 10, 10, 0.95) 0%, rgba(127, 29, 29, 0.95) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(239, 68, 68, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fecaca',
                },
              },
              loading: {
                style: {
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(147, 51, 234, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                },
                iconTheme: {
                  primary: '#a855f7',
                  secondary: '#f3e8ff',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)
