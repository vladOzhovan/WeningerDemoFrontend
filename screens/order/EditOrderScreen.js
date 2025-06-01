import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 50 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Edit Order</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.inputLogginEditCreate, { height: 100 }]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Enter description"
          />

          <View style={{ paddingTop: 20, paddingBottom: 15 }}>
            <Button title="Save Changes" onPress={handleUpdate} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

