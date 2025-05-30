import { useState, useEffect, useContext, useLayoutEffect, useCallback, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { styles } from '../../theme/styles'
import { View, Text, TextInput, Modal, FlatList, TouchableOpacity, Button, Alert, ActivityIndicator } from 'react-native'
import { AuthContext } from '../../context/authContext'
import { getCustomers, generateCustomers, deleteMultipleCustomers } from '../../api'
import SortMenu from '../../SortMenu'
import Toast from 'react-native-toast-message'

export default function CustomerScreen({ navigation }) {
  const { isAdmin } = useContext(AuthContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [customerCount, setCustomerCount] = useState('10')
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [isDescending, setIsDescending] = useState(false)
  const inputRef = useRef(null)

  // Load customers with search & sort params
  const loadCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCustomers({ search: search.trim(), sortBy, isDescending })
      setCustomers(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }

  // Reload button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={loadCustomers} style={{ marginRight: 15 }}>
          <Text style={{ color: 'blue' }}>Reload</Text>
        </TouchableOpacity>
      )
    })
  }, [navigation, loadCustomers])

  // Reload when screen is focused or search/sort changes
  useFocusEffect(
    useCallback(() => {
      loadCustomers()
    }, [search, sortBy, isDescending])
  )

  // Exit selection mode when none selected
  useEffect(() => {
    if (selectedIds.length === 0) setSelectionMode(false)
  }, [selectedIds])

  const toggleSelection = id => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  }

  const handlePress = customer => {
    if (selectionMode && isAdmin) toggleSelection(customer.id)
    else navigation.navigate('CustomerDetail', { customer })
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
                  onPress={() => setSelectedIds(customers.map(c => c.id))}
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
                            loadCustomers()
                          } catch (e) {
                            console.error(e)
                            Toast.show({ type: 'error', text1: 'Error', text2: e.message })
                          }
                        }
                      }
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
              onSubmitEditing={loadCustomers}
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
            onChange={loadCustomers}
          />
        </View>

        {/* Loading/Error */}
        {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}
        {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
      </View>

      <View style={{ flex: 1, width: '95%' }}>
        <FlatList
          data={customers}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.customerList,
                { width: '100%' },
                isAdmin &&
                  selectedIds.includes(item.id) && {
                    borderColor: '#b23939',
                    backgroundColor: '#eec7be'
                  }
              ]}
              onPress={() => handlePress(item)}
              onLongPress={() => handleLongPress(item)}
            >
              <Text style={styles.text}>
                {item.customerNumber}: {item.firstName} {item.secondName}{' '}
                <Text style={{ fontSize: 14, color: '#97b349' }}>({item.overallStatus})</Text>
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cccccc' }}>
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

