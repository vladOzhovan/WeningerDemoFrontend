import { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { updateOrder } from '../../api'
import { styles } from '../../theme/styles'
import Toast from 'react-native-toast-message'

export default function EditOrderScreen({ route, navigation }) {
  const { order } = route.params

  const [title, setTitle] = useState(order.title || '')
  const [description, setDescription] = useState(order.description || '')

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required')
      return
    }

    try {
      await updateOrder(order.id, { title, description })

      Toast.show({
        type: 'success',
        text1: 'Order updated'
      })

      navigation.goBack()
    } catch (e) {
      console.error(e)
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: e.response?.data || e.message
      })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
      <TextInput style={styles.detailText} value={title} onChangeText={setTitle} placeholder="Enter title" />

      <Text style={styles.title}>Description</Text>
      <TextInput
        style={[styles.detailText, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Enter description"
      />
      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  )
}

