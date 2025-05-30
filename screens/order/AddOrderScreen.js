import { useState } from 'react'
import { View, TextInput, Button, Text, Alert } from 'react-native'
import { styles } from '../../theme/styles'
import { createOrder } from '../../api'
import Toast from 'react-native-toast-message'

export default function AddOrderScreen({ route, navigation }) {
  const { customerNumber } = route.params

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Pending')
  const [error, setError] = useState('')

  const onSubmit = async () => {
    if (title.length < 2 || title.length > 25) {
      Alert.alert('Title must be 2–25 characters')
      return
    }
    if (description.length < 10 || description.length > 300) {
      Alert.alert('Description must be 10–300 characters')
      return
    }

    setError('')
    try {
      await createOrder(customerNumber, {
        title,
        description,
        status // 'Pending' | 'Taken' | 'Completed'
      })
      Toast.show({ type: 'success', text1: 'Order created' })
      navigation.goBack()
    } catch (e) {
      console.error(e)
      setError(e.response?.data || 'Failed to create order')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Order for #{customerNumber}</Text>

      <TextInput style={styles.inputLogginEditCreate} placeholder="Title" value={title} onChangeText={setTitle} />

      <TextInput
        style={[styles.inputLogginEditCreate, { height: 100 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <Button title="Create Order" onPress={onSubmit} />
    </View>
  )
}

