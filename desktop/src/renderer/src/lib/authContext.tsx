import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import instance from './axios'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { Button } from '@renderer/shadcn/components/ui/button'

export interface userDataType {
  id: string
  email: string
  role: string
}

export interface authContextType {
  userData: userDataType | null
  setUserData: (data: userDataType | null) => void
  logout: () => void
}

export const AuthContext = createContext<authContextType>({
  userData: null,
  setUserData: () => {},
  logout: () => {}
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }): ReactElement => {
  const [userData, setUserData] = useState<userDataType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({
    status: false,
    message: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        if (!loading) return
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          if (window.api && typeof window.api.send === 'function') {
            window.api.send('resize', { width: 1200, height: 900 })
          }
          navigate('/login', { replace: true })
          return
        }

        const response = await instance.get('/auth/verify')
        if (response.status === 200) {
          setUserData(response.data.user)
          setLoading(false)
        } else {
          localStorage.removeItem('token')
          setLoading(false)
          if (window.api && typeof window.api.send === 'function') {
            window.api.send('resize', { width: 1200, height: 900 })
          }
          navigate('/login', { replace: true, state: { verification_error: true } })
        }
      } catch (error: any) {
        console.error('Error fetching user info', error)
        setError({ status: true, message: error.message })
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const logout = () => {
    setUserData(null)
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData, logout }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen text-orange-600 bg-orange-50">
          <Loader size={48} className="animate-spin" />
        </div>
      ) : (
        <>
          {error.status ? (
            <div className="flex items-center justify-center h-screen text-orange-600 bg-orange-50 flex-col gap-4">
              <p className="text-xl font-semibold">Wystąpił błąd podczas ładowania aplikacji</p>
              <p>{error.message}</p>

              <Button onClick={() => window.location.reload()} className="w-48">
                Spróbuj ponownie
              </Button>
            </div>
          ) : (
            children
          )}
        </>
      )}
    </AuthContext.Provider>
  )
}
