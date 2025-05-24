import { useState, useEffect, useContext } from 'react'
import { styles } from '../../styles'
import { View, Text, TextInput, Modal, FlatList, TouchableOpacity, Button, Alert } from 'react-native'
import { AuthContext } from '../../context/authContext'
import { getCustomers, generateCustomers, deleteMultipleCustomers } from '../../api'
import { useIsFocused } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

export default function CustomerScreen({ navigation }) {
  const { isAdmin } = useContext(AuthContext)
  const isFocused = useIsFocused()
  const [modalVisible, setModalVisible] = useState(false)
  const [customerCount, setCustomerCount] = useState('10')
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)

  const loadCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    loadCustomers()
  }, [isFocused])

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelectionMode(false)
    }
  }, [selectedIds])

  const toggleSelection = id => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
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
    if (!selectionMode) {
      setSelectionMode(true)
    }
    toggleSelection(customer.id)
  }

  return (
    <View style={styles.container}>
      {isAdmin && (
        <>
          {/* Row 1: New + Generate */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10, marginTop: 15 }}>
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
              <Text style={styles.buttonText}>Generate Customers</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Selection Controls */}
          {selectionMode && (
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: '#b2bec3', paddingVertical: 8 }]}
                onPress={() => {
                  setSelectedIds([])
                  setSelectionMode(false)
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: '#0984e3', paddingVertical: 8 }]}
                onPress={() => {
                  setSelectedIds(customers.map(c => c.id))
                }}
              >
                <Text style={styles.buttonText}>Select All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: '#d63031', paddingVertical: 8 }]}
                onPress={() => {
                  Alert.alert('Confirm', `Delete ${selectedIds.length} customers?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteMultipleCustomers(selectedIds)
                          Toast.show({ type: 'success', text1: 'Customers deleted' })
                          setSelectedIds([])
                          setSelectionMode(false)
                          loadCustomers()
                        } catch (e) {
                          console.error(e)
                          Toast.show({
                            type: 'error',
                            text1: 'Error deleting customers',
                            text2: e.message
                          })
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ marginBottom: 10 }}>How many customers to generate?</Text>
            <TextInput
              keyboardType="numeric"
              value={customerCount}
              onChangeText={setCustomerCount}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />
            <Button
              title="Generate"
              onPress={async () => {
                try {
                  const count = parseInt(customerCount)
                  if (isNaN(count) || count <= 0) {
                    Toast.show({ type: 'error', text1: 'Enter a valid number' })
                    return
                  }
                  await generateCustomers(count)
                  Toast.show({ type: 'success', text1: `Generated ${count} customers` })
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

      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={customers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              borderBottomWidth: 1,
              backgroundColor: isAdmin && selectedIds.includes(item.id) ? '#ffeaa7' : 'white'
            }}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
          >
            <Text>
              {item.customerNumber} - {item.firstName} {item.secondName} ({item.overallStatus})
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={<View style={{ height: 80 }} />} // 👈 Добавь отступ
      />
    </View>
  )
}

