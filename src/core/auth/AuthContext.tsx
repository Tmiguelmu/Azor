import { createContext, useContext, ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { loginSuccess, logout as logoutAction } from '../../store/slices/authSlice'
import { LoginCredentials, AuthUser } from '../../shared/types/auth.types'
import { mockCredentials } from './mockCredentials'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const found = mockCredentials.find(
      (c) => c.email === credentials.email && c.password === credentials.password
    )
    if (found) {
      dispatch(loginSuccess({ user: found.user, rememberMe: credentials.rememberMe }))
      return true
    }
    return false
  }

  const logout = () => {
    dispatch(logoutAction())
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
