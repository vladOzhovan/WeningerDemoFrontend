import { View, Text, Button, Alert} from 'react-native'
import { getOrderById, deleteOrder, takeOrder, releaseOrder, completeOrder, cancelOrder } from '../../api'
import { styles } from '../../styles'
import { formatDate } from '../../utils/dateUtils'
import { useContext, useState, useCallback } from 'react'
import { AuthContext } from '../../context/authContext'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

export default function OrderDetailScreen({ route, navigation }) {
  const { order: initialOrder } = route.params
  const { isAdmin, isWorker } = useContext(AuthContext)
  const [order, setOrder] = useState(initialOrder)
  const [loading, setLoading] = useState(false)
  const formattedDate = formatDate(order.createdOn)

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const fresh = await getOrderById(initialOrder.id)
      setOrder(fresh)
    } catch (e) {
      console.error('Error fetching order by ID', e)
      Toast.show({ type: 'error', text1: 'Failed to refresh order' })
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchOrder()
    }, [initialOrder.id])
  )

  const handleDelete = () => {
    Alert.alert('Confirm Delete', `Delete Order №${order.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOrder(order.id)
            Toast.show({
              type: 'success',
              text1: `Order №${order.id} deleted`
            })
            navigation.goBack()
          } catch (e) {
            console.error(e)
            Toast.show({
              type: 'error',
              text1: 'Deletion failed',
              text2: e.response?.data || e.message
            })
          }
        }
      }
    ])
  }

  // const handleStatusPress = () => {
  //   const canChangeStatus = isAdmin || (isWorker && order.isTaken && order.userId === currentUser?.id)

  //   if (!canChangeStatus) {
  //     Toast.show({ type: 'info', text1: 'You cannot change status for this order' })
  //     return
  //   }

  //   Alert.alert(
  //     'Update Status',
  //     `Current: ${order.status}`,
  //     STATUSES.map(s => ({
  //       text: s,
  //       onPress: async () => {
  //         if (s === order.status) return
  //         try {
  //           const updated = await updateOrderStatus(order.id, s)
  //           setOrder(updated)
  //           Toast.show({ type: 'success', text1: `Status updated to ${s}` })
  //         } catch (e) {
  //           console.error(e)
  //           Toast.show({
  //             type: 'error',
  //             text1: 'Update failed',
  //             text2: e.response?.data || e.message
  //           })
  //         }
  //       }
  //     }))
  //   )
  // }
  

  // Worker actions
 
  const handleTakeOrder = async () => {
    try {
      await takeOrder(order.id)
      await fetchOrder()
      Toast.show({ type: 'success', text1: `Order №${order.id} taken` })
    } catch (e) {
      console.error(e)
      Toast.show({ type: 'error', text1: 'Take failed' })
    }
  }

  const handleReleaseOrder = async () => {
    try {
      await releaseOrder(order.id)
      await fetchOrder()
      Toast.show({ type: 'info', text1: `Order №${order.id} released` })
    } catch (e) {
      console.error(e)
      Toast.show({ type: 'error', text1: 'Release failed' })
    }
  }

  const handleCompleteOrder = async () => {
    try {
      await completeOrder(order.id)
      await fetchOrder()
      Toast.show({ type: 'success', text1: `Order №${order.id} completed` })
    } catch (e) {
      console.error(e)
      Toast.show({ type: 'error', text1: 'Complete failed' })
    }
  }

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(order.id)
      await fetchOrder()
      Toast.show({ type: 'info', text1: `Order №${order.id} cancelled` })
    } catch (e) {
      console.error(e)
      Toast.show({ type: 'error', text1: 'Cancel failed', text2: e.response?.data || e.message })
    }
  }
  

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailContent}>
        <Text style={styles.detailTitle}>Order №{order.id}</Text>

        {formattedDate && <Text style={styles.detailText}>Date: {formattedDate}</Text>}
        {order.title && <Text style={styles.detailText}>Title: {order.title}</Text>}
        {order.description && (
          <Text style={styles.detailText}>
            Description:{'\n'}
            {order.description}
          </Text>
        )}
        <View style={{ marginVertical: 12 }}>
          <Text style={[styles.detailText, { marginBottom: 4 }]}>Status: {order.status}</Text>
        </View>
      </View>

      {isWorker && (
        <View style={[styles.footerButtons, { marginBottom: 16 }]}>
          {order.isTaken ? (
            <>
              <Button title="Release" color="№d63031" onPress={handleReleaseOrder} />
              <Button title="Complete" color="№0984e3" onPress={handleCompleteOrder} />
              <Button title='Cancel' color="№6c5ce7" onPress={handleCancelOrder} />
            </>
          ) : (
            <Button title="Take" color="№00b894" onPress={handleTakeOrder} />
          )}
        </View>
      )}

      <View style={styles.footerButtons}>
        {isAdmin && (
          <>
            <Button title="Edit Order" onPress={() => navigation.navigate('EditOrder', { order })} />
            <Button title="Delete Order" color="red" onPress={handleDelete} />
          </>
        )}
      </View>
    </View>
  )
}

