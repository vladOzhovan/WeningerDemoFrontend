import { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, Button, Alert } from 'react-native'
import { AuthContext } from '../../context/authContext'
import { takeOrder, releaseOrder, completeOrder, cancelOrder, deleteOrder } from '../../api'
import { styles } from '../../theme/styles'
import Toast from 'react-native-toast-message'

export default function OrderActions({ order, onRefresh, onEdit, onDeleted, compact = false }) {
  const { isAdmin, isWorker } = useContext(AuthContext)
  const [loadingAction, setLoadingAction] = useState(false)

  const handleAction = async ({ actionName, apiCall, successMessage, confirmText, destructive = false }) => {
    Alert.alert(
      actionName,
      `${actionName} Order №${order.id}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: confirmText,
          style: destructive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setLoadingAction(true)
              await apiCall()
              Toast.show({ type: 'success', text1: successMessage })
              //if (onRefresh) await onRefresh()
              if (actionName === 'Delete') {
                if (onDeleted) onDeleted()
              } else {
                if (onRefresh) await onRefresh()
              }
            } catch (err) {
              console.error(`${actionName} failed:`, err)
              Toast.show({
                type: 'error',
                text1: `${actionName} failed`,
                text2: err.response?.data || err.message,
              })
            } finally {
              setLoadingAction(false)
            }
          },
        },
      ]
    )
  }

  const renderCompactButton = (title, color, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={loadingAction}
      style={{ marginHorizontal: 4, paddingVertical: 4 }}
    >
      <Text style={{ color, fontSize: 14 }}>{title}</Text>
    </TouchableOpacity>
  )

  const renderFullButton = (title, color, onPress) => (
    <View style={styles.buttonOrderOptions}>
      <Button title={title} color={color} onPress={onPress} disabled={loadingAction} />
    </View>
  )

  if (compact) {
    return (
      <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
        {isWorker && (
          <>
            {order.isTaken ? (
              <>
                {renderCompactButton(
                  'Cancel',
                  '#c32323',
                  () =>
                    handleAction({
                      actionName: 'Cancel',
                      apiCall: () => cancelOrder(order.id),
                      successMessage: `Order №${order.id} cancelled`,
                      confirmText: 'Cancel Order',
                      destructive: true,
                    })
                )}
                {renderCompactButton(
                  'Complete',
                  '#3890ef',
                  () =>
                    handleAction({
                      actionName: 'Complete',
                      apiCall: () => completeOrder(order.id),
                      successMessage: `Order №${order.id} completed`,
                      confirmText: 'Complete',
                    })
                )}
                {renderCompactButton(
                  'Release',
                  'gray',
                  () =>
                    handleAction({
                      actionName: 'Release',
                      apiCall: () => releaseOrder(order.id),
                      successMessage: `Order №${order.id} released`,
                      confirmText: 'Release',
                    })
                )}
              </>
            ) : (
              renderCompactButton(
                'Take',
                'green',
                () =>
                  handleAction({
                    actionName: 'Take',
                    apiCall: () => takeOrder(order.id),
                    successMessage: `Order №${order.id} taken`,
                    confirmText: 'Take',
                  })
              )
            )}
          </>
        )}

        {isAdmin && (
          <>
            {renderCompactButton(
              'Delete',
              'red',
              () =>
                handleAction({
                  actionName: 'Delete',
                  apiCall: () => deleteOrder(order.id),
                  successMessage: `Order №${order.id} deleted`,
                  confirmText: 'Delete',
                  destructive: true,
                })
            )}
            {renderCompactButton('Edit', 'black', () => onEdit && onEdit(order))}
          </>
        )}
      </View>
    )
  }

  return (
    <View style={styles.detailContainer}>
      {isWorker && (
        <View style={styles.buttonOrderDetailsUser}>
          {order.isTaken ? (
            <>
              {renderFullButton(
                'Cancel',
                '#c32323',
                () =>
                  handleAction({
                    actionName: 'Cancel',
                    apiCall: () => cancelOrder(order.id),
                    successMessage: `Order №${order.id} cancelled`,
                    confirmText: 'Cancel Order',
                    destructive: true,
                  })
              )}
              {renderFullButton(
                'Complete',
                '#3890ef',
                () =>
                  handleAction({
                    actionName: 'Complete',
                    apiCall: () => completeOrder(order.id),
                    successMessage: `Order №${order.id} completed`,
                    confirmText: 'Complete',
                  })
              )}
              {renderFullButton(
                'Release',
                'gray',
                () =>
                  handleAction({
                    actionName: 'Release',
                    apiCall: () => releaseOrder(order.id),
                    successMessage: `Order №${order.id} released`,
                    confirmText: 'Release',
                  })
              )}
            </>
          ) : (
            renderFullButton(
              'Take',
              '#e99a3b',
              () =>
                handleAction({
                  actionName: 'Take',
                  apiCall: () => takeOrder(order.id),
                  successMessage: `Order №${order.id} taken`,
                  confirmText: 'Take',
                })
            )
          )}
        </View>
      )}

      {isAdmin && (
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-around' }}>
          <View style={styles.buttonOrderOptions}>
            <Button
              title="Delete"
              color="red"
              onPress={() =>
                handleAction({
                  actionName: 'Delete',
                  apiCall: () => deleteOrder(order.id),
                  successMessage: `Order №${order.id} deleted`,
                  confirmText: 'Delete',
                  destructive: true,
                })
              }
              disabled={loadingAction}
            />
          </View>
          <View style={styles.buttonOrderOptions}>
            <Button title="Edit" onPress={() => onEdit && onEdit(order)} disabled={loadingAction} />
          </View>
        </View>
      )}
    </View>
  )
}
