import { useState, useLayoutEffect, useEffect, useRef, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../../theme/styles'
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { getOrders, getUserOrderList, takeOrder, releaseOrder, completeOrder, deleteMultipleOrders } from '../../api'
import { AuthContext } from '../../context/authContext'
import { formatDate } from '../../utils/dateUtils'
import SortMenu from '../../SortMenu'
import Toast from 'react-native-toast-message'

export default function OrderScreen({ navigation }) {
  const inputRef = useRef(null)
  const flatListRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('Active')
  const { isAdmin, isWorker } = useContext(AuthContext)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [isDescending, setIsDescending] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState([])
  const selectionMode = selectedOrders.length > 0

  const filters = isWorker
    ? ['MyOrders', 'Pending', 'InProgress', 'Completed', 'Canceled', 'All']
    : ['All', 'Completed', 'Canceled', 'InProgress', 'Pending']

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const query = {
        search: search.trim()
      }
      let data = []
      if (filter === 'MyOrders' && isWorker) {
        data = await getUserOrderList()
      } else {
        data = await getOrders({
          search: search,
          isDescending: isDescending,
          sortBy: sortBy
        })
      }

      let filtered = []

      switch (filter) {
        case 'Pending':
          filtered = data.filter(order => order.status === 'Pending')
          break
        case 'InProgress': 
          filtered = data.filter(order => order.status === 'InProgress')
          break
        case 'Completed':
          filtered = data.filter(order => order.status === 'Completed')
          break
        case 'Canceled':
          filtered = data.filter(order => order.status === 'Canceled')
          break
        case 'All':
        default:
          filtered = data
          break
      }
      setOrders(filtered)
    } catch (err) {
      console.error(err)
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = id => {
    setSelectedOrders(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  // Single-tap handler: navigate or select
  const handlePress = order => {
    if (selectionMode) {
      toggleSelect(order.id)
    } else {
      navigation.navigate('OrderDetail', { order })
    }
  }

  // Long-tap starts multi-select
  const handleLongPress = order => {
    if (!isAdmin) return
    if (!selectionMode) {
      setSelectedOrders([order.id])
    } else {
      toggleSelect(order.id)
    }
  }

  // Header "Reload" button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={loadOrders} style={{ marginRight: 15 }}>
          <Text style={{ color: 'blue' }}>Reload</Text>
        </TouchableOpacity>
      )
    })
  }, [navigation, loadOrders])

  // Initial load
  useEffect(() => {
    loadOrders()
  }, [filter, search, sortBy, isDescending])

  // Handlers for take/release/complete
  const handleTakeOrder = async id => {
    try {
      await takeOrder(id)
      await loadOrders()
      Toast.show({
        type: 'success',
        text1: 'Taken',
        text2: `Order #${id} taken.`
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Take failed',
        text2: `Failed to take order #${id}.`
      })
    }
  }

  const handleReleaseOrder = async id => {
    try {
      await releaseOrder(id)
      await loadOrders()
      Toast.show({
        type: 'info',
        text1: 'Released',
        text2: `Order #${id} released.`
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Release failed',
        text2: `Failed to release order #${id}.`
      })
    }
  }

  const handleCompleteOrder = async id => {
    try {
      await completeOrder(id)
      await loadOrders()
      Toast.show({
        type: 'success',
        text1: 'Completed',
        text2: `Order #${id} completed.`
      })
    } catch (err) {
      console.error(err)
      Toast.show({
        type: 'error',
        text1: 'Complete failed',
        text2: `Failed to complete order #${id}.`
      })
    }
  }

  // Delete selected
  const handleDeleteSelected = () => {
    if (selectedOrders.length === 0) return

    Alert.alert('Confirm Deletion', `Are you sure you want to delete ${selectedOrders.length} selected orders?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMultipleOrders(selectedOrders)
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
      }
    ])
  }

  return (
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 1 }]}>
      {/* Search + Sort */}
      <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
        <View style={{ flex: 1, position: 'relative' }}>
          <TextInput
            style={styles.inputSearch}
            placeholder="Search"
            ref={inputRef}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={loadOrders}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: [{ translateY: -12 }],
                zIndex: 1
              }}
              onPress={() => {
                setSearch('')
                inputRef.current?.blur()
              }}
            >
              <Ionicons name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        <SortMenu
          sortBy={sortBy}
          setSortBy={setSortBy}
          isDescending={isDescending}
          setIsDescending={setIsDescending}
          onChange={loadOrders}
        />
      </View>

      {/* Filters */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 5,
          marginBottom: 10
        }}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: filter === f ? '#0984e3' : '#dfe6e9',
              margin: 4
            }}
          >
            <Text style={{ color: filter === f ? 'white' : 'black' }}>
              {
                {
                  MyOrders: 'My Orders',
                  Pending: 'Pending',
                  InProgress: 'In Progress',
                  Completed: 'Completed',
                  Canceled: 'Canceled',
                  All: 'All'
                }[f]
              }
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isAdmin && selectionMode && (
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.buttonSelectionCancel}
            onPress={() => setSelectedOrders([])}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSelectionSelectAll}
            onPress={() => setSelectedOrders(orders.map(o => o.id))}
          >
            <Text style={styles.buttonText}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSelectionDelete}
            onPress={handleDeleteSelected}
          >
            <Text style={styles.buttonText}>Delete ({selectedOrders.length})</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <ActivityIndicator style={{ margin: 10 }} />}
      {error && <Text style={{ color: 'red', margin: 10 }}>{error}</Text>}

      <View style={{ flex: 1, width: '95%' }}>
        <FlatList
          ref={flatListRef}
          data={orders}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={[
                  styles.orderList,
                  selectedOrders.includes(item.id) && {
                    borderColor: '#b23939',
                    backgroundColor: '#eec7be'
                  },
                  { width: '100%' }
                ]}
                onPress={() => handlePress(item)}
                onLongPress={() => handleLongPress(item)}
              >
                <Text>Name: {item.customerFullName}</Text>
                <Text>Customer №: {item.customerNumber}</Text>
                <Text>Date: {formatDate(item.createdOn)}</Text>
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                  {isWorker &&
                    (item.isTaken ? (
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
                    ))}
                </View>
              </TouchableOpacity>
            </>
          )}
        />
      </View>
    </View>
  )
}

