import { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native'
import { styles } from '../../styles'
import { getOrdersByCustomer } from '../../api'

export default function CustomerDetailScreen({ route, navigation }) {
  const { customer } = route.params
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await getOrdersByCustomer(customer.customerNumber)
      setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {customer.firstName} {customer.secondName} (#{customer.customerNumber})
      </Text>

      <Button
        title="New Order"
        onPress={() =>
          navigation.navigate('AddOrder', {
            customerNumber: customer.customerNumber,
          })
        }
      />

      {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}
      <FlatList
        data={orders}
        keyExtractor={o => o.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>Order #{item.id} – ${item.total} –{' '}
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No orders yet.</Text>}
      />

      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  )
}


