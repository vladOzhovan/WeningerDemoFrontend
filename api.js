import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const api = axios.create({
  baseURL: 'http://10.0.0.5:5052',
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

export const registerUser = async (userName, email, password) => {
  try {
    const response = await api.post('/api/account/register-user', {
      userName,
      email,
      password
    })
    return response.data
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message)
    throw new Error('Registration failed')
  }
}

export const getUsers = async () => {
  try {
    const response = await api.get('/api/account/get-users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const updatrUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/account/update-user/${id}`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user ${id}:`, error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/account/delete-user/${id}`)
    return response.data 
  } catch (error) {
    console.error(`Error deleting user ${id}`)
    throw error
  }
}

export const getCustomers = async (query = {}) => {
  try {
    const response = await api.get(`/api/customer`, {
      params: query
    })
    return response.data
  } catch (error) {
    console.error('Error when trying to get the customers:', error)
    throw error
  }
}

export const getCustomerById = async (id) => {
  try {
    const response = await api.get(`/api/customer/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error when trying to get the customer ${id}`, error)
    throw error
  }
}

export const createCustomer = async customerDto => {
  try {
    const response = await api.post('/api/customer', customerDto)
    return response.data
  } catch (error) {
    console.error('Error creating customer:', error.response?.data || error.message)
    throw error
  }
}

export const generateCustomers = async (count = 10) => {
  try {
    const response = await api.post(`/api/customer/generate-customers?count=${count}`)
    return response.data 
  } catch (error) {
    console.error(`Error generating customers`)
    throw error
  }
}

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/api/customer/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting customer ${id}`)
    throw error
  }
}

export const deleteMultipleCustomers = async ids => {
  try {
    const response = await api.post('/api/customer/delete-multiple', ids)
    return response.data 
  } catch (error) {
    console.error(`Error deleting customers:`, error)
    throw error
  }
}

export const updateCustomer = async (id, customerDto) => {
  try {
    const response = await api.put(`/api/customer/${id}`, customerDto)
    return response.data
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error)
    throw error
  }
}

export const getOrders = async (query = {}) => {
  try {
    const response = await api.get(`/api/order`, {
      params: query 
    })
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error.response?.data || error.message)
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

export const getUserOrderList = async () => {
  try {
    const response = await api.get(`/api/order/user-order-list`)
    return response.data
  } catch (error) {
    console.error(`Error fetching orders`, error)
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

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/api/order/cancel/${orderId}`)
    return response.data
  } catch (error) {
    console.error('Error cancelling order:', error)
    throw error
  }
}

export const createOrder = async (customerNumber, orderDto) => {
  try {
    const response = await api.post(`/api/order/by-number/${customerNumber}`, orderDto)
    return response.data
  } catch (error) {
    console.error(`Error creating order ${id}:`, error)
    throw error
  }
}

export const deleteOrder = async id => {
  try {
    const response = await api.delete(`/api/order/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error)
    throw error
  }
}

export const deleteMultipleOrders = async ids => {
  try {
    const response = await api.post(`api/order/delete-multiple`, ids)
    return response.data
  } catch (error) {
    console.error(`Error deleting orders`, error)
    throw error
  } 
}

export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`api/order/${id}`, orderData)
    return response.data
  } catch (error) {
    console.error(`Error updating order ${id}:`, error)
    throw error
  }
  
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

