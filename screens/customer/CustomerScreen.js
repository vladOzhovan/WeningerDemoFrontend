import { useState, useEffect, useContext, useLayoutEffect, useRef, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { styles } from '../../theme/styles'
import {
  View,
  Text,
  TextInput,
  Modal,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { AuthContext } from '../../context/authContext'
import { getCustomers, generateCustomers, deleteMultipleCustomers } from '../../api'
import SortMenu from '../../SortMenu'
import Toast from 'react-native-toast-message'

export default function CustomerScreen({ navigation }) {
  const { isAdmin } = useContext(AuthContext)

  const [modalVisible, setModalVisible] = useState(false)
  const [customerCount, setCustomerCount] = useState('10')

  // все клиенты, полученные с сервера (без фильтрации по статусу и без поиска)
  const [allCustomers, setAllCustomers] = useState([])
  // клиенты после фильтрации по statusFilter и search
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
  const statuses = ['Canceled', 'Completed', 'InProgress', 'Pending']

  // 1) Функция загрузки (запрос на сервер)
  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Передаём на сервер только параметры сортировки (в API уже реализована серверная сортировка по sortBy/isDescending)
      const data = await getCustomers({
        sortBy,
        isDescending,
        // НЕ передаём search на сервер, потому что будем искать на клиенте
      })

      setAllCustomers(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }, [sortBy, isDescending])

  // 2) useLayoutEffect для кнопки «Reload»
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={loadCustomers} style={{ marginRight: 15 }}>
          <Text style={{ color: 'blue' }}>Reload</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation, loadCustomers])

  // 3) useFocusEffect — мемоизируем колл‑бэк, чтобы не перерегистрировать эффект на каждый рендер
  useFocusEffect(
    useCallback(() => {
      loadCustomers()
    }, [loadCustomers])
  )

  // 4) Выходим из режима выбора, если ничего не выделено
  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectionMode(false)
    }
  }, [selectedIds])

  // 5) Локальная фильтрация: сначала по статусу, потом по поиску
  useEffect(() => {
    let temp = [...allCustomers]

    // Фильтруем по статусу, если statusFilter !== 'all'
    if (statusFilter !== 'all') {
      temp = temp.filter(c => c.overallStatus === statusFilter)
    }

    // Затем фильтруем по поисковой строке (name, secondName или customerNumber)
    if (search.trim() !== '') {
      const lower = search.trim().toLowerCase()
      temp = temp.filter(c => {
        const full = `${c.firstName} ${c.secondName} ${c.customerNumber}`.toLowerCase()
        return full.includes(lower)
      })
    }

    setFilteredCustomers(temp)
  }, [allCustomers, search, statusFilter])

  // 6) Переключение выделения кнопками
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
    <View style={[styles.container, { paddingTop: 16, paddingHorizontal: 10, flex: 1 }]}>
      <View style={{ width: '95%' }}>
        {isAdmin && (
          <>
            {/* New + Generate */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, paddingVertical: 8 }]}
                onPress={() => navigation.navigate('AddCustomer')}
              >
                <Text style={styles.buttonText}>New Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: '#6c5ce7', paddingVertical: 8 }]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}>Generate</Text>
              </TouchableOpacity>
            </View>

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
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await deleteMultipleCustomers(selectedIds)
                            Toast.show({ type: 'success', text1: 'Deleted' })
                            setSelectedIds([])
                            loadCustomers() // после удаления заново подтянем полный список
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
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
          {statuses.map(stat => (
            <TouchableOpacity
              key={stat}
              onPress={() => setStatusFilter(prev => (prev === stat ? 'all' : stat))}
              style={{
                flex: 1,
                marginHorizontal: 3,
                paddingVertical: 8,
                borderRadius: 6,
                alignItems: 'center',
                backgroundColor: statusFilter === stat ? '#0984e3' : '#dfe6e9',
              }}
            >
              <Text style={{ color: statusFilter === stat ? 'white' : 'black' }}>
                {
                  {
                    Pending: 'Pending',
                    InProgress: 'In Progress',
                    Completed: 'Completed',
                    Canceled: 'Canceled',
                  }[stat]
                }
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Loading/Error */}
        {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}
        {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
      </View>

      {/* Список клиентов после фильтрации */}
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
              <Text style={{ fontSize: 16, color: '#3b3e24', }}>
                {item.customerNumber}: {item.firstName} {item.secondName}{' '}
                <Text style={{ fontSize: 14, color: '#97b349' }}>({item.overallStatus})</Text>
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {/* Generate Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#cccccc',
          }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ marginBottom: 10 }}>How many?</Text>
            <TextInput
              keyboardType="numeric"
              value={customerCount}
              onChangeText={setCustomerCount}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />
            <Button
              title="Generate"
              onPress={async () => {
                const count = parseInt(customerCount, 10)
                if (isNaN(count) || count <= 0) {
                  Toast.show({ type: 'error', text1: 'Invalid' })
                  return
                }
                try {
                  await generateCustomers(count)
                  Toast.show({ type: 'success', text1: `Generated ${count}` })
                  setModalVisible(false)
                  loadCustomers()
                } catch (e) {
                  console.error(e)
                  Toast.show({ type: 'error', text1: 'Error', text2: e.message })
                }
              }}
            />
            <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}
