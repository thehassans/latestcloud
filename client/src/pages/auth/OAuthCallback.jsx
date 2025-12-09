import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/useStore'
import { authAPI } from '../../lib/api'
import toast from 'react-hot-toast'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        toast.error('OAuth authentication failed. Please try again.')
        navigate('/login')
        return
      }

      if (token) {
        try {
          // Store the token
          localStorage.setItem('token', token)
          
          // Fetch user data
          const response = await authAPI.me()
          setUser(response.data.user, token)
          
          toast.success('Login successful!')
          
          // Redirect based on role
          if (response.data.user.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/dashboard')
          }
        } catch (err) {
          console.error('OAuth callback error:', err)
          toast.error('Failed to complete authentication')
          navigate('/login')
        }
      } else {
        toast.error('No authentication token received')
        navigate('/login')
      }
    }

    handleCallback()
  }, [searchParams, navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-300 text-lg">Completing authentication...</p>
      </div>
    </div>
  )
}
