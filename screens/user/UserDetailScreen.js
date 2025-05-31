import { View, Text, Button, Alert } from 'react-native'
import { styles } from '../../theme/styles'
import { useContext, useState, useCallback } from 'react'
import { AuthContext } from '../../context/authContext'
import { deleteUser, getUsers } from '../../api'
import { useFocusEffect } from '@react-navigation/native'

export default function DetailUserScreen({ route, navigation }) {
  const { user } = route.params
  const { isAdmin } = useContext(AuthContext)

  const [detailUser, setDetailUser] = useState(user)

  const handleDelete = async () => {
    Alert.alert('Confirm Deletion', `Are you sure you want to delete user "${detailUser.userName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(detailUser.id)
            navigation.goBack()
          } catch (err) {
            Alert.alert('Error', 'Failed to delete user.')
          }
        }
      }
    ])
  }

  const handleEdit = () => {
    navigation.navigate('EditUser', { user: detailUser })
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      const refreshUser = async () => {
        try {
          const allUsers = await getUsers()
          const fresh = allUsers.find(u => u.id === user.id)
          if (isActive && fresh) {
            setDetailUser(fresh)
          }
        } catch (e) {
          console.error('Failed to refresh user details', e)
        }
      }
      refreshUser()
      return () => {
        isActive = false
      }
    }, [user.id])
  )
  

  return (
    <View style={styles.container}>
      <Text>User ID: {detailUser.id}</Text>
      <Text>Username: {detailUser.userName}</Text>
      <Text>Email: {detailUser.email}</Text>

      {isAdmin && (
        <View style={{ marginTop: 20 }}>
          <Button title="Edit" onPress={handleEdit} />
          <View style={{ height: 10 }} />
          <Button title="Delete" color="red" onPress={handleDelete} />
        </View>
      )}
    </View>
  )
}

