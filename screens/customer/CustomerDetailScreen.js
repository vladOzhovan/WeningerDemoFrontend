import { useState, useCallback } from 'react'
import { Alert, View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { deleteCustomer, getOrdersByCustomer } from '../../api'
import { useFocusEffect } from '@react-navigation/native'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { styles } from '../../styles'
import Toast from 'react-native-toast-message'

export default function CustomerDetailScreen({ route, navigation }) {
  const { customer } = route.params
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAdmin } = useContext(AuthContext)

  // Safely pick the date field from the item
  const extractRawDate = item => {
    return item.date ?? item.createdOn ?? item.createdAt ?? null
  }

  // Helper to format date strings in European format (DD.MM.YYYY)
  const formatDate = rawDate => {
    if (!rawDate) return '—'
    const timestamp = Date.parse(rawDate)
    if (isNaN(timestamp)) return '—'
    // 'en-GB' locale uses DD/MM/YYYY by default; replace slashes with dots
    return new Date(timestamp).toLocaleDateString('en-GB').replace(/\//g, '.')
  }

  // Load orders for this customer
  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await getOrdersByCustomer(customer.customerNumber)
      //console.log('>>> orders from server:', data)
      setOrders(data)
    } catch (e) {
      if (e.response?.status === 404) {
        setOrders([])
      } else {
        console.error('Error fetching orders for customer', customer.customerNumber, e)
        Toast.show({
          type: 'error',
          text1: 'Error fetching orders',
          text2: e.message
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle deleting the customer
  const handleDeleteCustomer = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this customer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCustomer(customer.id)
            Toast.show({ type: 'success', text1: 'Customer deleted' })
            navigation.goBack()
          } catch (e) {
            console.error(e)
            Toast.show({
              type: 'error',
              text1: 'Failed to delete customer',
              text2: e.response?.data || 'Unknown error'
            })
          }
        }
      }
    ])
  }

  // Reload orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders()
    }, [customer.customerNumber])
  )

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailContent}>
        <Text style={styles.detailTitle}>
          {customer.firstName} {customer.secondName} (#{customer.customerNumber})
        </Text>

        {isAdmin && (
          <View style={styles.newOrderWrapper}>
            <Button
              title="New Order"
              onPress={() =>
                navigation.navigate('AddOrder', {
                  customerNumber: customer.customerNumber
                })
              }
            />
            <Button title="Edit Customer" onPress={() => navigation.navigate('EditCustomer', { customer })} />
          </View>
        )}

        {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

        <View style={styles.listContainer}>
          <FlatList
            data={orders}
            keyExtractor={o => o.id.toString()}
            ListEmptyComponent={<Text>No orders yet.</Text>}
            renderItem={({ item }) => {
              const raw = extractRawDate(item)
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('OrderDetail', { order: item })}
                  style={{ padding: 8, borderBottomWidth: 1 }}
                >
                  <Text>
                    Order #{item.id}
                    {item.total != null && ` - $${item.total}`}
                    {' - '}
                    {formatDate(raw)}
                  </Text>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCustomer}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

