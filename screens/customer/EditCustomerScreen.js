import { useState } from 'react'
import { View, TextInput, Button, Text, Alert } from 'react-native'
import { styles } from '../../styles'
import { updateCustomer } from '../../api'
import Toast from 'react-native-toast-message'

export default function EditCustomerScreen({ route, navigation }) {
  const { customer } = route.params
  const [customerNumber, setCustomerNumber] = useState(customer.customerNumber.toString())
  const [firstName, setFirstName] = useState(customer.firstName)
  const [secondName, setSecondName] = useState(customer.secondName)
  const [error, setError] = useState('')

  const onSubmit = async () => {
    // Basic validation
    if (!customerNumber.trim() || isNaN(parseInt(customerNumber, 10))) {
      Alert.alert('Validation', 'Customer number must be a valid number')
      return
    }
    if (!firstName.trim() || !secondName.trim()) {
      Alert.alert('Validation', 'First and second names are required')
      return
    }

    try {
      const updated = await updateCustomer(customer.id, {
        customerNumber: parseInt(customerNumber, 10),
        firstName,
        secondName
      })
      Toast.show({ type: 'success', text1: 'Customer updated' })
      navigation.goBack()
    } catch (e) {
      console.error(e)
      setError(e.response?.data || 'Update failed')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Customer</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer Number"
        keyboardType="number-pad"
        value={customerNumber}
        onChangeText={setCustomerNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Second Name"
        value={secondName}
        onChangeText={setSecondName}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Save Changes" onPress={onSubmit} />
    </View>
  )
}
