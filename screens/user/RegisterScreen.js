import { useState } from 'react'
import { registerUser } from '../../api'
import { styles } from '../../theme/styles'
import Toast from 'react-native-toast-message'
import { View, TextInput, Button, Text } from 'react-native'

export default function RegisterScreen({ route, navigation }) {
  const [token, setToken] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async () => {
    if (!token.trim()) return setError('Token is required')
    if (!userName.trim()) return setError('Username is required')
    
    try {
      await registerUser(userName, email, password, token.trim())
      Toast.show({ type: 'success', text1: 'Registred' })
      navigation.replace('Login')
    } catch (error) {
      setError(error.response?.data?.title || 'Registration failed')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register User</Text>
      <TextInput
        style={styles.inputLogginEditCreate}
        placeholder="Invitation Token"
        onChangeText={setToken}
        value={token}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputLogginEditCreate}
        placeholder="Username"
        onChangeText={setUserName}
        value={userName}
      />
      <TextInput
        style={styles.inputLogginEditCreate}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.inputLogginEditCreate}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {error.length > 0 && <Text style={styles.error}>{error}</Text>}

      <Button title="Register" onPress={onSubmit} />
    </View>
  )
}

