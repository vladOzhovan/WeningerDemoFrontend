import { View, Text } from 'react-native'
import { styles } from '../../styles'

export default function EditUserScreen({ route }) {
  const { user } = route.params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <Text>User ID: {user.id}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
    </View>
  )
}

