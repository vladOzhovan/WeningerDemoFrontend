import { View, Text, Button, Alert, TouchableOpacity } from 'react-native'
import { deleteOrder, getOrderById, updateOrderStatus } from '../../api'
import { styles } from '../../styles'
import { formatDate } from '../../utils/dateUtils'
import { useContext, useState, useCallback } from 'react'
import { AuthContext } from '../../context/authContext'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

const STATUSES = ['Pending', 'InProgress', 'Completed', 'Canceled']

export default function OrderDetailScreen({ route, navigation }) {
  const { order: initialOrder } = route.params
  const { isAdmin } = useContext(AuthContext)
  const [ order, setOrder ] = useState(initialOrder)
  const [ loading, setLoading ] = useState(false)
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
    Alert.alert('Confirm Delete', `Delete Order #${order.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteOrder(order.id)
            Toast.show({
              type: 'success',
              text1: `Order #${order.id} deleted`
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

  const handleStatusPress = () => {
    Alert.alert(
      'Update Status',
      `Current: ${order.status}`,
      STATUSES.map(s => ({
        text: s,
        onPress: async () => {
          if (s === order.status) return
          try {
            const updated = await updateOrderStatus(order.id, s)
            setOrder(updated)
            Toast.show({ type: 'success', text1: `Status updated to ${s}` })
          } catch (e) {
            console.error(e)
            Toast.show({
              type: 'error',
              text1: 'Update failed',
              text2: e.response?.data || e.message
            })
          }
        }
      }))
    )
  }

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailContent}>
        <Text style={styles.detailTitle}>Order #{order.id}</Text>

        {formattedDate && <Text style={styles.detailText}>Date: {formattedDate}</Text>}
        {order.title && <Text style={styles.detailText}>Title: {order.title}</Text>}
        {order.description && (
          <Text style={styles.detailText}>
            Description:{'\n'}
            {order.description}
          </Text>
        )}
        <View style={{ marginVertical: 12 }}>
          <Text style={[styles.detailText, { marginBottom: 4 }]}>Status:</Text>
          <TouchableOpacity onPress={handleStatusPress}>
            <Text style={[styles.detailText, { color: '#0984e3' }]}>{order.status}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerButtons}>
        {isAdmin && <Button title="Edit Order" onPress={() => navigation.navigate('EditOrder', { order })} />}
        <Button title="Delete Order" color="red" onPress={handleDelete} />
      </View>
    </View>
  )
}

