import { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'
import { getCustomers } from '../../api'

export default function CustomerListScreen({ navigation }) {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const handleInfo = (customer) => {
    navigation.navigate('CustomerDetail', { customer })
  }

  return (
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 1 }]}>
      <Text style={styles.title}>Customer List</Text>

      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, borderBottomWidth: 1 }}
            onPress={() => handleInfo(item)}
          >
            <Text>{item.firstName} {item.secondName} ({item.overallStatus})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
