import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native'
import { useContext, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { getCustomerById, getOrdersByCustomer, deleteCustomer } from '../../api'
import { AuthContext } from '../../context/authContext'
import { styles } from '../../theme/styles'

export default function CustomerDetailScreen({ route, navigation }) {
  const { customer: initialCustomer } = route.params
  const [customer, setCustomer] = useState(initialCustomer)
  const [orders, setOrders] = useState([])
  const { isAdmin } = useContext(AuthContext)

  const fetchCustomer = async () => {
    try {
      const updated = await getCustomerById(initialCustomer.id)
      setCustomer(updated)
      const data = await getOrdersByCustomer(updated.customerNumber)
      setOrders(data)
    } catch (e) {
      console.error('Error fetching customer or orders', e)
      Toast.show({ type: 'error', text1: 'Failed to load customer data' })
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCustomer()
    }, [initialCustomer.id])
  )

  const handleDeleteCustomer = () => {
    Alert.alert('Confirm Delete', `Delete customer ${customer.firstName}?`, [
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
              text1: 'Delete failed',
              text2: e.response?.data || e.message
            })
          }
        }
      }
    ])
  }

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>
        {customer.firstName} {customer.secondName}
      </Text>
      {/* <Text style={styles.detailText}>Customer №: {customer.customerNumber}</Text> */}
      <Text style={styles.detailText}>Phone: {customer.phone}</Text>
      <Text style={styles.detailText}>Email: {customer.email}</Text>

      <View style={styles.container}>
        <Text style={styles.title}>Orders:</Text>
        {orders.length === 0 ? (
          <Text style={styles.detailText}>No orders found.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('OrderDetail', { order: item })}>
                <Text style={styles.itemText}>
                  №{item.id}: {item.title} — {item.status}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {isAdmin && (
        <View style={[styles.footerButtons]}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              navigation.navigate('AddOrder', {
                customerNumber: customer.customerNumber
              })
            }
          >
            <Text style={styles.buttonText}>New Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={() => navigation.navigate('EditCustomer', { customer })}
          >
            <Text style={styles.buttonText}>Edit Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCustomer}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

