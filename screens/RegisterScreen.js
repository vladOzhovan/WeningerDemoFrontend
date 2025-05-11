import { useState } from 'react'
import { styles } from '../styles'
import { View, TextInput, Button, Text } from 'react-native'
import { register } from '../api'

export default function RegisterScreen({ navigation }) {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async () => {
    try {
      await register(userName, email, password)
      navigation.replace('Home')
    } catch {
      setError('Registration failed')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register User</Text>
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUserName}/>
      <TextInput style={styles.input} placeholder="Email"    onChangeText={setEmail}/>
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword}/>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Add new User" onPress={onSubmit}/>
    </View>
  )
}

