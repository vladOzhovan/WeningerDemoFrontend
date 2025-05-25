import { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { styles } from '../../styles'
import {
  View,
  Text,
  TextInput,
  Modal,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator
} from 'react-native'
import { AuthContext } from '../../context/authContext'
import { getCustomers, generateCustomers, deleteMultipleCustomers } from '../../api'
import { useIsFocused } from '@react-navigation/native'
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
  const isFocused = useIsFocused()

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

  // Fetch on focus or when search/sort changes
  useEffect(() => {
    if (isFocused) loadCustomers()
  }, [isFocused, search, sortBy, isDescending])

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
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 16 }]}>
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
                style={[styles.button, { backgroundColor: '#b2bec3', flex: 1 }]}
                onPress={() => {
                  setSelectedIds([])
                  setSelectionMode(false)
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#0984e3', flex: 1 }]}
                onPress={() => setSelectedIds(customers.map(c => c.id))}
              >
                <Text style={styles.buttonText}>Select All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#d63031', flex: 1 }]}
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

      {/* Generate Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
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

      {/* Search & Sort */}
      <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
        <TextInput
          placeholder="Search by name or number"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={loadCustomers}
          style={{
            flex: 1,
            backgroundColor: '#f1f2f6',
            padding: 10,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#ccc'
          }}
          returnKeyType="search"
        />
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

      {/* List */}
      <FlatList
        data={customers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              backgroundColor: isAdmin && selectedIds.includes(item.id) ? '#ffeaa7' : 'white'
            }}
          >
            <Text>
              {item.customerNumber}: {item.firstName} {item.secondName} ({item.overallStatus})
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  )
}

