import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = axios.create({
  baseURL: 'http://10.0.0.4:5052',
})

// Interceptor for token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
  
)

// Interceptor for answer
api.interceptors.response.use(
  response => response,
  async error => {
    // Invalid token (error 401), clear token and redirect to LoginScreen
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token')
      // redirect to Login can be added
    }
    return Promise.reject(error)
  }
)

export default api

export const getUsers = async () => {
  try {
    const response = await api.get('/api/account/users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const createCustomer = async ({ customerNumber, firstName, secondName }) => {
  const response = await api.post('/api/customer', { customerNumber, firstName, secondName })
  return response.data
}

export const generateCustomers = async (count = 10) => {
  const response = await api.post(`/api/customer/generate-customers?count=${count}`)
  return response.data
}

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/api/customer/${id}`)  
  return response.data
}

export const deleteMultipleCustomers = async ids => {
  const response = await api.post('/api/customer/delete-multiple', ids)
  return response.data
}

export const getCustomers = async () => {
  try {
    const response = await api.get(`/api/customer`)
    return response.data
  } catch (error) {
    console.error('There’s an error when trying to get the customers:', error)
    throw error
  }
}

export const getOrders = async () => {
  try {
    const response = await api.get(`/api/order`)
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export const getOrdersByCustomer = async (customerNumber) => {
  try {
    const response = await api.get(`/api/order/by-customer/${customerNumber}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerNumber}:`, error)
    throw error
  }
}

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/api/order/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching order ${id}`, error)
    throw error
  }
}

export const takeOrder = async (orderId) => {
  try {
    const response = await api.put(`/api/order/take/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Error taking order ${orderId}:`, error)
    throw error
  }
}

export const releaseOrder = async (orderId) => {
  try {
    const response = await api.put(`/api/order/release/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Error releasing order ${orderId}:`, error)
    throw error
  }
}

export const completeOrder = async (orderId) => {
  try {
    const response = await api.put(`/api/order/complete/${orderId}`)
    return response.data
  } catch (error) {
    console.error('Error completing order:', error)
    throw error
  }
}

export const createOrder = async (customerNumber, orderDto) => {
  const response = await api.post(
    `/api/order/by-number/${customerNumber}`,
    orderDto
  )
  return response.data
}

export const deleteOrder = async id => {
  const { data } = await api.delete(`/api/order/${id}`)
  return data
}

export const deleteOrders = async ids => {
  const response = await fetch(`${API_URL}/orders/delete-multiple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${yourAuthToken}`
    },
    body: JSON.stringify(ids)
  })
  if (!response.ok) throw new Error('Failed to delete orders')
}

export async function updateOrder(id, orderData) {
  const response = await api.put(`api/order/${id}`, orderData)
  return response.data
}

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`api/order/${id}/update-status`, { status })
    return response.data
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error)
    throw error
  }
  
}

export const register = async (userName, email, password) => {
  try {
    const response = await api.post('/api/account/register', {
      userName,
      email,
      password,
    })
    return response.data
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message)
    throw new Error('Registration failed')
  }
}

