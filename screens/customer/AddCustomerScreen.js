import { useState} from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { styles } from '../../styles'
import { createCustomer } from '../../api'
import Toast from 'react-native-toast-message'

export default function AddCustomerScreen({ navigation }) {
  const [number, setNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async () => {
    setError('')
    try {
      await createCustomer({
        customerNumber: parseInt(number, 10),
        firstName,
        secondName
      })
      Toast.show({ type: 'success', text1: 'Customer added' })
      navigation.goBack()
    } catch (e) {
      setError(e.response?.data || 'Failed to add customer')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Customer Number"
        keyboardType="number-pad"
        onChangeText={setNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Second Name"
        onChangeText={setSecondName}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Create" onPress={onSubmit} />
    </View>
  )
}

