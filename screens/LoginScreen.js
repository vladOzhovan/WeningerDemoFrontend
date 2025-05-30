import { useState, useContext } from 'react'
import { styles } from '../theme/styles'
import { View, TextInput, Button, Text } from 'react-native'
import { AuthContext } from '../context/authContext'

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext)
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async () => {
    try {
      await login(userName, password)
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.inputLogginEditCreate} placeholder="Username"    onChangeText={setUserName}/>
      <TextInput style={styles.inputLogginEditCreate} placeholder="Password" secureTextEntry onChangeText={setPassword}/>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Login" onPress={onSubmit}/>
    </View>
  )
}

