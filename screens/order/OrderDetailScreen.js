import { View, Text, ScrollView} from 'react-native'
import { getOrderById } from '../../api'
import { styles } from '../../theme/styles'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { formatDate } from '../../utils/dateUtils'
import OrderActions from './OrderActions'
import Toast from 'react-native-toast-message'

export default function OrderDetailScreen({ route, navigation }) {
  const { order: initialOrder } = route.params
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
  
  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailContent}>
        <Text style={styles.detailTitle}>Order №{order.id}</Text>

        {formattedDate && <Text style={styles.detailText}>Date: {formattedDate}</Text>}
        <View style={styles.detailText}>
          <Text style={[styles.detailText, { marginBottom: 4 }]}>Status: {order.status}</Text>
        </View>
        {order.title && <Text style={styles.detailText}>Title: {order.title}</Text>}
        {order.description && (
          <View style={{ width: '100%', marginVertical: 10 }}>
            <ScrollView
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                maxHeight: 300,
                backgroundColor: '#f9f9f9',
              }}
              contentContainerStyle={{ paddingBottom: 5 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.orderDetailText}>{order.description}</Text>
            </ScrollView>
          </View>
        )}
      </View>
      
      <View style={{ flex: 1 }}>  
      
      </View>

      <OrderActions
        order={order}
        onRefresh={fetchOrder}
        onEdit={() => navigation.navigate('EditOrder', { order })}
        onDeleted={() => navigation.goBack()}
        //compact={false}
      />
    </View>
  )
}

