import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'
import { getUsers } from '../../api'

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleUserPress = (user) => {
    navigation.navigate('EditUser', { user })
  }

  return (
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 1 }]}>
      <Text style={styles.title}>Users</Text>

      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd' }}
            onPress={() => handleUserPress(item)}
          >
            <Text>{item.username} ({item.email})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

