import { useState, useEffect, useContext, useLayoutEffect, useRef, useCallback } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { styles, statusColors } from '../../theme/styles'
import { AuthContext } from '../../context/authContext'
import { getCustomers, deleteMultipleCustomers } from '../../api'
import SortMenu from '../../SortMenu'
import Toast from 'react-native-toast-message'

export default function CustomerScreen({ navigation }) {
  const { isAdmin } = useContext(AuthContext)
  const [allCustomers, setAllCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [isDescending, setIsDescending] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const inputRef = useRef(null)
  const statuses = ['Canceled', 'Completed', 'InProgress', 'Pending', 'NoOrders']

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCustomers({
        sortBy,
        isDescending,
      })

      setAllCustomers(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }, [sortBy, isDescending])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={loadCustomers} style={{ marginRight: 15 }}>
          <Text style={{ color: 'blue' }}>Reload</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation, loadCustomers])

  useFocusEffect(
    useCallback(() => {
      loadCustomers()
    }, [loadCustomers])
  )

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectionMode(false)
    }
  }, [selectedIds])

  useEffect(() => {
    let temp = [...allCustomers]

    if (statusFilter !== 'all') {
      temp = temp.filter(c => c.overallStatus === statusFilter)
    }

    if (search.trim() !== '') {
      const lower = search.trim().toLowerCase()
      temp = temp.filter(c => {
        const full = `${c.firstName} ${c.secondName} ${c.customerNumber}`.toLowerCase()
        return full.includes(lower)
      })
    }

    setFilteredCustomers(temp)
  }, [allCustomers, search, statusFilter])

  const toggleSelection = id => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const handlePress = customer => {
    if (selectionMode && isAdmin) {
      toggleSelection(customer.id)
    } else {
      navigation.navigate('CustomerDetail', { customer })
    }
  }

  const handleLongPress = customer => {
    if (!isAdmin) return
    if (!selectionMode) setSelectionMode(true)
    toggleSelection(customer.id)
  }

  return (
    <View style={styles.customerContainer}>
      <View style={{ width: '95%' }}>
        {isAdmin && (
          <>
            {/* Bulk actions */}
            {selectionMode && (
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.buttonSelectionCancel}
                  onPress={() => {
                    setSelectedIds([])
                    setSelectionMode(false)
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonSelectionSelectAll}
                  onPress={() => setSelectedIds(filteredCustomers.map(c => c.id))}
                >
                  <Text style={styles.buttonText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonSelectionDelete}
                  onPress={() => {
                    Alert.alert('Confirm', `Delete ${selectedIds.length} customers?`, [
                      { text: 'No', style: 'cancel' },
                      {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await deleteMultipleCustomers(selectedIds)
                            Toast.show({ type: 'success', text1: 'Deleted' })
                            setSelectedIds([])
                            loadCustomers()
                          } catch (e) {
                            console.error(e)
                            Toast.show({ type: 'error', text1: 'Error', text2: e.message })
                          }
                        },
                      },
                    ])
                  }}
                >
                  <Text style={styles.buttonText}>Delete ({selectedIds.length})</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Search & Sort */}
        <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
          <View style={{ flex: 1, position: 'relative' }}>
            <TextInput
              style={styles.inputSearch}
              ref={inputRef}
              placeholder="Search by name or number"
              value={search}
              onChangeText={setSearch}
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
            onChange={loadCustomers}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {statuses.map(stat => (
            <TouchableOpacity
              key={stat}
              onPress={() => setStatusFilter(prev => (prev === stat ? 'all' : stat))}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
                backgroundColor: statusFilter === stat ? '#0984e3' : '#dfe6e9',
              }}
            >
              <Text style={{ color: statusFilter === stat ? 'white' : 'black' }}>
                {
                  {
                    NoOrders: 'No Orders',
                    Pending: 'Pending',
                    InProgress: 'In Progress',
                    Completed: 'Completed',
                    Canceled: 'Canceled',
                  }[stat]
                }
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Loading/Error */}
        {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}
        {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
      </View>

      {/* Filtred customer list */}
      <View style={{ flex: 1, width: '95%' }}>
        <FlatList
          data={filteredCustomers}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.customerList,
                { width: '100%' },
                isAdmin &&
                  selectedIds.includes(item.id) && {
                    borderColor: '#b23939',
                    backgroundColor: '#eec7be',
                  },
              ]}
              onPress={() => handlePress(item)}
              onLongPress={() => handleLongPress(item)}
            >
              <Text style={{ fontSize: 16, color: '#3b3e24' }}>
                {item.customerNumber}: {item.firstName} {item.secondName}{' '}
                <Text style={{ fontSize: 14, color: statusColors[item.overallStatus] }}>({item.overallStatus})</Text>
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {isAdmin && (
        <>
          {/* Add customer */}
          <View style={{ flexDirection: 'row', marginBottom: 50, marginBlock: 7 }}>
            <TouchableOpacity style={styles.addCustomerButton} onPress={() => navigation.navigate('AddCustomer')}>
              <Text style={styles.buttonText}>Add Customer</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}
