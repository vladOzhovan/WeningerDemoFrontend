import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'

export default function UserScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.buttonWrapper, styles.button]}
        onPress={() => navigation.navigate('RegisterUser')}
      >
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonWrapper, styles.button]}
        onPress={() => navigation.navigate('UserList')}
      >
        <Text style={styles.buttonText}>User List</Text>
      </TouchableOpacity>
    </View>
  )
}
