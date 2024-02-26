import { ReactElement, ReactNode, createContext, useContext, useState } from 'react'

import { useNavigate } from 'react-router-dom'

export interface userDataType {
  id: string
  email: string
  role: string
}

export interface authContextType {
  userDataContext: userDataType | null
  setUserDataContext: (data: userDataType | null) => void
  logout: () => void
}

export const AuthContext = createContext<authContextType>({
  userDataContext: null,
  setUserDataContext: () => {},
  logout: () => {}
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }): ReactElement => {
  const [userDataContext, setUserDataContext] = useState<userDataType | null>(null)

  const navigate = useNavigate()

  const logout = () => {
    setUserDataContext(null)
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ userDataContext, setUserDataContext, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
