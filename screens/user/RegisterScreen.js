import { useState } from 'react'
import { styles } from '../../theme/styles'
import { View, TextInput, Button, Text } from 'react-native'
import { registerUser } from '../../api'

export default function RegisterScreen({ navigation }) {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async () => {
    try {
      await registerUser(userName, email, password)
      navigation.goBack()
    } catch {
      setError('Registration failed')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register User</Text>
      <TextInput style={styles.inputLogginEditCreate} placeholder="Username" onChangeText={setUserName}/>
      <TextInput style={styles.inputLogginEditCreate} placeholder="Email"    onChangeText={setEmail}/>
      <TextInput style={styles.inputLogginEditCreate} placeholder="Password" secureTextEntry onChangeText={setPassword}/>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Add new User" onPress={onSubmit}/>
    </View>
  )
}

