import { useState, useLayoutEffect, useEffect, useRef, useContext } from 'react'
import { styles } from "../styles"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { getOrders, takeOrder, releaseOrder, completeOrder, deleteOrders } from '../api'
import { AuthContext } from '../context/authContext'
import Toast from 'react-native-toast-message'

export default function OrderScreen({ navigation }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedOrders, setSelectedOrders] = useState([])
  const selectionMode = selectedOrders.length > 0
  const flatListRef = useRef(null)
  const { isAdmin } = useContext(AuthContext)

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

  const toggleSelect = id => {
    setSelectedOrders(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }  

  // Auto-load when screen mounts
  useEffect(() => {
    loadOrders()
  }, [])

  // Add refresh button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={loadOrders} style={{ marginRight: 15 }}>
          <Text style={{ color: "blue" }}>Reload</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  const handleInfo = (order) => {
    console.log("Info about order:", order)
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

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return
    try {
      await deleteOrders(selectedOrders)
      setSelectedOrders([])
      await loadOrders()
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false })

      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Selected orders deleted successfully.'
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: 'Could not delete selected orders.'
      })
    }
  }


  return (
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 1 }]}>
      <Text style={styles.title}>Orders</Text>

      {isAdmin && selectionMode && (
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: '#b2bec3', paddingVertical: 8 }]}
            onPress={() => setSelectedOrders([])}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: '#0984e3', paddingVertical: 8 }]}
            onPress={() => setSelectedOrders(orders.map(o => o.id))}
          >
            <Text style={styles.buttonText}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: '#d63031', paddingVertical: 8 }]}
            onPress={handleDeleteSelected}
          >
            <Text style={styles.buttonText}>Delete ({selectedOrders.length})</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <ActivityIndicator style={{ margin: 10 }} />}
      {error && <Text style={{ color: 'red', margin: 10 }}>{error}</Text>}

      <FlatList
        ref={flatListRef}
        data={orders}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleSelect(item.id)}
            style={{
              marginBottom: 8,
              padding: 12,
              borderWidth: 2,
              borderRadius: 6,
              borderColor: selectedOrders.includes(item.id) ? 'blue' : '#ccc',
              backgroundColor: selectedOrders.includes(item.id) ? '#e0f0ff' : 'white'
            }}
          >
            <Text>Order #{item.id}</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Total: ${item.total}</Text>

            <View style={{ flexDirection: 'row', marginTop: 6 }}>
              <TouchableOpacity onPress={() => handleInfo(item)} style={{ marginRight: 15 }}>
                <Text style={{ color: 'blue' }}>Info</Text>
              </TouchableOpacity>

              {item.isTaken ? (
                <>
                  <TouchableOpacity onPress={() => handleReleaseOrder(item.id)}>
                    <Text style={{ color: 'red' }}>Release</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCompleteOrder(item.id)} style={{ marginLeft: 15 }}>
                    <Text style={{ color: 'blue' }}>Complete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => handleTakeOrder(item.id)}>
                  <Text style={{ color: 'green' }}>Take</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

