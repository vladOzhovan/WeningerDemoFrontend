import { useState, useContext, useCallback } from "react"
import {useFocusEffect} from '@react-navigation/native'
import { styles } from "../../styles"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { AuthContext } from "../../context/authContext"
import { getUsers } from "../../api"

export default function UserScreen({ navigation }) {
  const { isAdmin } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Function for loading the user list
  const loadUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load users.")
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadUsers()
    }, [])
  )

  const handleUserPress = (user) => {
    navigation.navigate('UserDetail', { user })
  }

  return (
    <View style={styles.container}>
      {isAdmin && (
        <TouchableOpacity
          style={[styles.addUserButton]}
          onPress={() => navigation.navigate("RegisterUser")}
        >
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
      )}

      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 15, borderBottomWidth: 1 }}
            onPress={() => handleUserPress(item)}
          >
            <Text style={{ alignContent: 'center', fontSize: 16}}>{item.userName} ({item.email})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

