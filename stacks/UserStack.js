import { createNativeStackNavigator } from "@react-navigation/native-stack"
import UserScreen from "../screens/User/UserScreen"
import RegisterScreen from "../screens/User/RegisterScreen"
import UserListScreen from "../screens/User/UserListScreen"
import EditUserScreen from "../screens/User/EditUserScreen"

const Stack = createNativeStackNavigator()

export default function UserStack() {
  return (
    <Stack.Navigator
      initialRouteName="UsersHome"
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name="UsersHome"
        component={UserScreen}
        options={{ title: "Users"}}
      />

      <Stack.Screen
        name="RegisterUser"
        component={RegisterScreen}
        options={{ title: 'Register new User' }}
      />

      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{ title: 'All Users' }}
      />

      <Stack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ title: 'Edit User' }}
      />
    </Stack.Navigator>
  )
}
