import { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { styles } from '../../theme/styles'
import { updateUser } from '../../api'

export default function EditUserScreen({ route, navigation }) {
  const { user } = route.params

  const [userName, setUserName] = useState(user.userName)
  const [email, setEmail] = useState(user.email)

  const handleUpdate = async () => {
    try {
      await updateUser(user.id, { userName, email })
      Alert.alert('Success', 'User updated successfully.')
      navigation.goBack()
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Failed to update user.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.inputLogginEditCreate} value={userName} onChangeText={setUserName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.inputLogginEditCreate} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Button title="Save" onPress={handleUpdate} />
    </View>
  )
}

