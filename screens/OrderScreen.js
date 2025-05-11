import { useState } from "react"
import { styles } from "../styles"
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { getOrders, takeOrder, releaseOrder, completeOrder } from "../api"
import Toast from 'react-native-toast-message'

export default function OrderScreen({ navigation }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load orders.")
    } finally {
      setLoading(false)
    }
  }

  const handleInfo = (order) => {
    console.log("Info about order:", order)
    // Navigation to detailed order screen (if needed)
  }

  const handleTakeOrder = async (orderId) => {
    try {
      await takeOrder(orderId)
      await loadOrders()
      Toast.show({
        type: 'success',
        text1: 'Order taken',
        text2: `Order ${orderId} has been assigned to you.`,
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Fail',
        text2: 'There was an error when trying to assign the order.',
      })
    }
  }

  const handleReleaseOrder = async (orderId) => {
    try {
      await releaseOrder(orderId)
      await loadOrders()
      Toast.show({
        type: 'success',
        text1: 'Order released',
        text2: `Order ${orderId} has been released.`,
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Fail',
        text2: 'There was an error when trying to release the order.',
      })
    }
  }

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId)
      await loadOrders()
      Toast.show({
        type: 'success',
        text1: 'Order completed',
        text2: `Order ${orderId} has been completed.`,
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Fail',
        text2: 'There was an error when trying to complete the order.',
      })
    }
  }

  return (
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 1 }]}>
      <Text style={styles.title}>Orders</Text>
      
      <View style={[styles.buttonWrapper, { marginTop: 1 }]}>
        <Button title="Load Orders" onPress={loadOrders} />
      </View>

      {loading && <ActivityIndicator style={{ margin: 10 }} />}
      {error && <Text style={{ color: "red", margin: 10 }}>{error}</Text>}
      
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 8,
              padding: 12,
              borderWidth: 1,
              borderRadius: 6,
              borderColor: "#ccc",
            }}
          >
            <Text>Order #{item.id}</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Total: ${item.total}</Text>

            <View style={{ flexDirection: "row", marginTop: 6 }}>
              <TouchableOpacity onPress={() => handleInfo(item)} style={{ marginRight: 15 }}>
                <Text style={{ color: "blue" }}>Info</Text>
              </TouchableOpacity>

              {item.isTaken ? (
                <>
                  <TouchableOpacity onPress={() => handleReleaseOrder(item.id)}>
                    <Text style={{ color: "red" }}>Release</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCompleteOrder(item.id)} style={{ marginLeft: 15 }}>
                    <Text style={{ color: "blue" }}>Complete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => handleTakeOrder(item.id)}>
                  <Text style={{ color: "green" }}>Take</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  )
}

