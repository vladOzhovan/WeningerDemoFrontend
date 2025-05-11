import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.0.4:5052',
});

// Interceptor for token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
  
);

// Interceptor for answer
api.interceptors.response.use(
  response => response,
  async error => {
    // Invalid token (error 401), clear token and redirect to LoginScreen
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // redirect to Login can be added
    }
    return Promise.reject(error);
  }
);

export default api;

export const getCustomers = async () => {
  try {
    const response = await api.get(`/api/customer`);
    return response.data;
  } catch (error) {
    console.error('There’s an error when trying to get the customers:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get(`/api/order`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const takeOrder = async (orderId) => {
  try {
    const response = await api.put(`/api/order/take/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error taking order ${orderId}:`, error);
    throw error;
  }
};

export const releaseOrder = async (orderId) => {
  try {
    const response = await api.put(`/api/order/release/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error releasing order ${orderId}:`, error);
    throw error;
  }
};

export const completeOrder = async (orderId) => {
  try {
    const response = await api.put(`/api/order/complete/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
};

export const register = async (userName, email, password) => {
  try {
    const response = await api.post('/api/account/register', {
      userName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw new Error('Registration failed');
  }
};

