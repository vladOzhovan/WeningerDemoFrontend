import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
// In future EditUserScreen, UserListScreen...

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RegisterUser"
        component={RegisterScreen}
        options={{ title: 'Register new User' }}
      />
      {/*
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{ title: 'Users' }}
      />
      <Stack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ title: 'Edit User' }}
      />
      */}
    </Stack.Navigator>
  );
}
