import { useState, useEffect } from "react"
import { Alert, View, Text, Button, FlatList, ActivityIndicator } from "react-native"
import { deleteCustomer } from "../../api"
import { getOrdersByCustomer } from "../../api"
import Toast from "react-native-toast-message"
import { styles } from "../../styles"

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
    if (e.response?.status === 404) {
      setOrders([])
    } else {
      console.error('Error fetching orders for customer', customer.customerNumber, e)
      Toast.show({
        type: 'error',
        text1: 'Error fetching orders',
        text2: e.message,
      })
    }
  } finally {
    setLoading(false)
  }
}

  const handleDeleteCustomer = () => {
    Alert.alert( "Confirm Delete", "Are you sure you want to delete this customer?",
      [{ text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomer(customer.id)
              console.log('Deleting customer', customer.id, customer.customerNumber)
              Toast.show({
                type: "success",
                text1: "Customer deleted",
              })
              navigation.goBack()
            } catch (e) {
              console.error(e)
              Toast.show({
                type: "error",
                text1: "Failed to delete customer",
                text2: e.response?.data || "Unknown error",
              })
            }
          },
        },
      ]
    )
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {customer.firstName} {customer.secondName} (#{customer.customerNumber})
      </Text>

      <Button 
        title="New Order"
        onPress={() =>
          navigation.navigate("AddOrder", {
            customerNumber: customer.customerNumber,
          })
        }
      />

      <Button 
        title="Delete Customer"
        color="red"
        onPress={handleDeleteCustomer}
      />

      {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>
              Order #{item.id} – ${item.total} –{" "}
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
