import { useContext } from "react"
import { styles } from "../styles"
import { View, Text, TouchableOpacity } from "react-native"
import { AuthContext } from "../context/authContext"

export default function HomeScreen({ navigation }) {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext)

  if (!isAuthenticated) {
    navigation.replace("Login")
    return null
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.buttonWrapper, styles.button]}
        onPress={() => navigation.navigate("CustomerStack")}
      >
        <Text style={styles.buttonText}>Customers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonWrapper, styles.button]}
        onPress={() => navigation.navigate("Orders")}
      >
        <Text style={styles.buttonText}>Orders</Text>
      </TouchableOpacity>

      {isAdmin && (
         <TouchableOpacity
            style={[styles.buttonWrapper, styles.button]}
            onPress={() => navigation.navigate("Users")}
          >
            <Text style={styles.buttonText}>Users</Text>
          </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.buttonWrapper, styles.button]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
