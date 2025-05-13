import { useContext } from "react"
import { styles } from "../../styles"
import { View, Text, TouchableOpacity } from "react-native"
import { AuthContext } from "../../context/authContext"

export default function CustomerScreen({ route, navigation }) {
  const { isAdmin } = useContext(AuthContext)

  return (
     <View style={styles.container}>
      {isAdmin && (
        <TouchableOpacity
          style={[styles.buttonWrapper, styles.button]}
          onPress={() => navigation.navigate('AddCustomer')}
        >
          <Text style={styles.buttonText}>Add Customer</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.buttonWrapper, styles.button]}
        onPress={() => navigation.navigate('CustomerList')}
      >
        <Text style={styles.buttonText}>Customer List</Text>
      </TouchableOpacity>
    </View>
  )
}

