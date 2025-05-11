import { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin,         setIsAdmin]         = useState(false)
  const [user,            setUser]            = useState(null)

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token')
      if (!token) return

      try {
        const { data: profile } = await api.get('/api/account/profile')
        setUser(profile)
        setIsAuthenticated(true)
        setIsAdmin(Array.isArray(profile.roles) && profile.roles.includes('Admin'))
      } catch {
        await AsyncStorage.removeItem('token')
      }
    })()
  }, [])

  const login = async (userName, password) => {
    const { data } = await api.post('/api/account/login', { userName, password })
    await AsyncStorage.setItem('token', data.token)
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`

    setUser({ userName: data.userName, email: data.email, roles: data.roles })
    setIsAuthenticated(true)
    setIsAdmin(Array.isArray(data.roles) && data.roles.includes('Admin'))
    console.log('ROLES:', data.roles)
  }

  const logout = async () => {
    await AsyncStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

