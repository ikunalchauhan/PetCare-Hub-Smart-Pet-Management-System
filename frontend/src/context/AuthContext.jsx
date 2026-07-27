import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/endpoints'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('petcare_token')
    const storedUser = localStorage.getItem('petcare_user')

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      authApi.me()
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('petcare_user', JSON.stringify(res.data))
        })
        .catch(() => {
          localStorage.removeItem('petcare_token')
          localStorage.removeItem('petcare_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    const { token, user: loggedInUser } = res.data
    localStorage.setItem('petcare_token', token)
    localStorage.setItem('petcare_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload)
    const { token, user: newUser } = res.data
    localStorage.setItem('petcare_token', token)
    localStorage.setItem('petcare_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('petcare_token')
    localStorage.removeItem('petcare_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(updated)
    localStorage.setItem('petcare_user', JSON.stringify(updated))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
