import React from 'react'
import { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { styles } from '../styles'
import { createOrder } from '../api'
import Toast from 'react-native-toast-message'

const AddOrderScreen = ({ route, navigation }) => {
  const { customerNumber } = route.params
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [total, setTotal] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async () => {
    setError('')
    try {
      await createOrder(customerNumber, { date, total: parseFloat(total) })
      Toast.show({ type: 'success', text1: 'Order created' })
      navigation.goBack()
    } catch (e) {
      setError(e.response?.data || 'Failed to create order')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Total"
        keyboardType="decimal-pad"
        onChangeText={setTotal}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Create Order" onPress={onSubmit} />
    </View>
  )
}

export default AddOrderScreen

