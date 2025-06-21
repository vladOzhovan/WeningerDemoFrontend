import { useState, useContext } from 'react'
import { styles } from '../theme/styles'
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native'
import { AuthContext } from '../context/authContext'
import { Ionicons } from '@expo/vector-icons'

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext)
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async () => {
    // Remove all whitespace from inputs
    const trimmedUserName = userName.replace(/\s+/g, '')
    const trimmedPassword = password.replace(/\s+/g, '')

    try {
      // Use trimmed values for login
      await login(trimmedUserName, trimmedPassword)
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingBottom: 20 }}>
        <Text style={styles.title}>Mini CRM</Text>
      </View>

      <TextInput
        style={styles.inputLogginEditCreate}
        placeholder="Username"
        onChangeText={text => setUserName(text)}
        value={userName}
        autoCapitalize="none"
      />

      <View style={{ position: 'relative', width: '100%' }}>
        <TextInput
          style={styles.inputLogginEditCreate}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            top: '8%',
            padding: 5,
          }}
          onPress={() => setShowPassword(prev => !prev)}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.loginButton}>
        <Button title="Login" onPress={onSubmit} />
      </View>
      
      <TouchableOpacity
        style={{ marginTop: 10 }}
        onPress={() => navigation.navigate('RegisterUser')}
      >
        <Text style={{ color: '#007bff', textAlign: 'center' }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  )
}
