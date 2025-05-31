import { useContext, useState, useCallback } from 'react'
import { styles } from '../../theme/styles'
import { AuthContext } from '../../context/authContext'
import { useFocusEffect } from '@react-navigation/native'
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { getCustomerById, getOrdersByCustomer, deleteCustomer } from '../../api'
import Toast from 'react-native-toast-message'

export default function CustomerDetailScreen({ route, navigation }) {
  const noData = ' - - - '
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
              text2: e.response?.data || e.message,
            })
          }
        },
      },
    ])
  }

  const renderField = (label, value) => {
    const text =
      value === null || value === undefined || value.toString().trim() === '' ? noData : value.toString().trim()

    return (
      <View style={{ flexDirection: 'row', marginVertical: 1, textAlign: 'center' }}>
        <Text style={styles.customerAddressText}>
          <Text style={{ fontWeight: 'bold' }}>{label}: </Text>
          {text}
        </Text>
      </View>
    )
  }

  const renderAddressBlock = () => {
    const addr = customer.address || {}
    const { country = '', city = '', street = '', houseNumber = '', apartment = '', zipCode = '' } = addr

    const hasAnyAddress =
      country.trim() ||
      city.trim() ||
      street.trim() ||
      houseNumber.toString().trim() ||
      apartment.trim() ||
      zipCode.toString().trim()

    return (
      <View style={ styles.customerAddressBlock }>
        <Text style={[styles.title, { fontWeight: 'bold', marginBottom: 4 }]}>Address</Text>
        {hasAnyAddress ? (
          <>
            {renderField('Country', country)}
            {renderField('City', city)}
            {renderField('Street', street)}
            {renderField('House Number', houseNumber)}
            {renderField('Apartment', apartment)}
            {renderField('Zip Code', zipCode)}
          </>
        ) : (
          <Text style={styles.customerDetailText}>{noData}</Text>
        )}
      </View>
    )
  }

  const renderPhone = () => {
    const raw = customer.phoneNumber == null ? '' : customer.phoneNumber.toString().trim()
    return raw === '' || raw === '0' ? noData : raw
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 15 }}>
        <Text style={styles.detailTitle}>
          {customer.firstName} {customer.secondName}
        </Text>

        <View style={{ alignItems: 'center', marginBottom: 7 }}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.customerDetailText}>Status: {customer.overallStatus}</Text>
            <Text style={styles.customerDetailText}>Created: {new Date(customer.createdOn).toLocaleDateString()}</Text>
            <Text style={styles.customerDetailText}>Phone: {renderPhone()}</Text>
            <Text style={styles.customerDetailText}>
              Email: {customer.email?.trim() !== '' ? customer.email : noData}
            </Text>
          </View>
        </View>

        {renderAddressBlock()}

        <Text style={[styles.title, { marginTop: 10, marginBottom: 5 }]}>Orders:</Text>

        {orders.length === 0 ? (
          <Text style={styles.detailText}>No orders found.</Text>
        ) : (
          <ScrollView style={{ maxHeight: 300 }}>
            {orders.map(item => (
              <TouchableOpacity key={item.id} onPress={() => navigation.navigate('OrderDetail', { order: item })}>
                <Text style={[styles.detailText, { fontWeight: 'bold', color: '#304709' }]}>
                  №{item.id}: {item.title} — {item.status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {isAdmin && (
        <View style={styles.customerFooterButton}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: '#d63031', marginHorizontal: 4 }]}
            onPress={handleDeleteCustomer}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: '#fdcb6e', marginHorizontal: 4 }]}
            onPress={() => navigation.navigate('EditCustomer', { customer })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: '#dc80e8', marginHorizontal: 4 }]}
            onPress={() =>
              navigation.navigate('AddOrder', {
                customerNumber: customer.customerNumber,
              })
            }
          >
            <Text style={styles.buttonText}>New Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )  
}
