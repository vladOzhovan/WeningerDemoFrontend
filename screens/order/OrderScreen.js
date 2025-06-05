import { useState, useLayoutEffect, useEffect, useCallback, useRef, useContext } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { getOrders, getUserOrderList, deleteMultipleOrders } from '../../api'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../../theme/styles'
import { AuthContext } from '../../context/authContext'
import { formatDate } from '../../utils/dateUtils'
import OrderActions from './OrderActions'
import SortMenu from '../../SortMenu'
import Toast from 'react-native-toast-message'

export default function OrderScreen({ navigation }) {
  const inputRef = useRef(null)
  const flatListRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const { isAdmin, isWorker } = useContext(AuthContext)

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [isDescending, setIsDescending] = useState(false)

  const [selectedOrders, setSelectedOrders] = useState([])
  const selectionMode = selectedOrders.length > 0

  const filters = isAdmin
    ? ['Pending', 'InProgress', 'Completed', 'Canceled']
    : ['MyOrders', 'Pending', 'InProgress', 'Completed', 'Canceled']

  const loadOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      let data = []

      if (filter === 'MyOrders' && isWorker) {
        const allMy = await getUserOrderList()
        const term = search.trim().toLowerCase()

        if (term.length > 0) {
          data = allMy.filter(o => {
            return o.customerFullName.toLowerCase().includes(term) || o.customerNumber.toString().includes(term)
          })
        } else {
          data = allMy
        }

        data.sort((a, b) => {
          let cmp = 0
          if (sortBy === 'date') cmp = new Date(a.createdOn) - new Date(b.createdOn)
          else if (sortBy === 'name') cmp = a.customerFullName.localeCompare(b.customerFullName)
          else if (sortBy === 'number') cmp = a.customerNumber - b.customerNumber

          return isDescending ? -cmp : cmp
        })
      } else {
        data = await getOrders({
          search: search.trim(),
          isDescending,
          sortBy,
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

  const handlePress = order => {
    if (selectionMode) {
      toggleSelect(order.id)
    } else {
      navigation.navigate('OrderDetail', { order })
    }
  }

  const handleLongPress = order => {
    if (!isAdmin) return
    if (!selectionMode) {
      setSelectedOrders([order.id])
    } else {
      toggleSelect(order.id)
    }
  }

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
              text2: 'Selected orders deleted successfully.',
            })
          } catch (err) {
            console.error(err)
            Toast.show({
              type: 'error',
              text1: 'Delete failed',
              text2: 'Could not delete selected orders.',
            })
          }
        },
      },
    ])
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={loadOrders} style={{ marginRight: 15 }}>
          <Text style={{ color: 'blue' }}>Reload</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation, loadOrders])

  useEffect(() => {
    loadOrders()
  }, [filter, search, sortBy, isDescending])

  useFocusEffect(
    useCallback(() => {
      loadOrders()
    }, [filter, search, sortBy, isDescending])
  )

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
                zIndex: 1,
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
      {isAdmin ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(prev => (prev === f ? '' : f))}
              style={{
                flex: 1,
                borderRadius: 6,
                marginTop: 5,
                paddingVertical: 8,
                marginHorizontal: 3,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: filter === f ? '#0984e3' : '#dfe6e9',
              }}
            >
              <Text style={{ color: filter === f ? 'white' : 'black' }}>
                {
                  {
                    Pending: 'Pending',
                    InProgress: 'In Progress',
                    Completed: 'Completed',
                    Canceled: 'Canceled',
                  }[f]
                }
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 5,
            marginBottom: 10,
          }}
        >
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(prev => (prev === f ? '' : f))}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: filter === f ? '#0984e3' : '#dfe6e9',
                margin: 4,
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
                  }[f]
                }
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bulk delete buttons (Admin only) */}
      {isAdmin && selectionMode && (
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity style={styles.buttonSelectionCancel} onPress={() => setSelectedOrders([])}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSelectionSelectAll}
            onPress={() => setSelectedOrders(orders.map(o => o.id))}
          >
            <Text style={styles.buttonText}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSelectionDelete} onPress={handleDeleteSelected}>
            <Text style={styles.buttonText}>Delete ({selectedOrders.length})</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading / Error */}
      {loading && <ActivityIndicator style={{ margin: 10 }} />}
      {error && <Text style={{ color: 'red', margin: 10 }}>{error}</Text>}

      {/* Order list */}
      <View style={{ flex: 1, width: '95%' }}>
        <FlatList
          ref={flatListRef}
          data={orders}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.orderList,
                selectedOrders.includes(item.id) && {
                  borderColor: '#b23939',
                  backgroundColor: '#eec7be',
                },
                { width: '100%' },
              ]}
              onPress={() => handlePress(item)}
              onLongPress={() => handleLongPress(item)}
            >
              <Text>№{item.id}</Text>
              <Text>Name: {item.customerFullName}</Text>
              <Text>Customer №: {item.customerNumber}</Text>
              <Text>Date: {formatDate(item.createdOn)}</Text>

              <OrderActions
                order={item}
                onRefresh={loadOrders}
                onEdit={(order) => navigation.navigate('EditOrder', { order })}
                compact={true} 
              />

            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  )
}
