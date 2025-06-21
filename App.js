import { useContext } from 'react'
import * as Linking from 'expo-linking'
import RegisterScreen from './screens/user/RegisterScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider, AuthContext } from './context/authContext'
import { ActivityIndicator, View } from 'react-native'
import LoginScreen from './screens/LoginScreen'
import UserStack from './stacks/UserStack'
import CustomerStack from './stacks/CustomerStack'
import OrderStack from './stacks/OrderStack'
import HomeScreen from './screens/HomeScreen'
import Toast from 'react-native-toast-message'

const Stack = createNativeStackNavigator()

function LoaderScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="RegisterUser"
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Register' }}
      />
    </Stack.Navigator>
  )
}

function AppStack() {
  const { isAdmin } = useContext(AuthContext)

  if (isAdmin === undefined || isAdmin === null) {
    return <LoaderScreen />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CustomerStack" component={CustomerStack} />
      <Stack.Screen name="OrderStack" component={OrderStack} />
      {isAdmin && <Stack.Screen name="UserStack" component={UserStack} />}
    </Stack.Navigator>
  )
}

const prefix = Linking.createURL('/')

const linking = {
  prefixes: [Linking.createURL('/'), 'https://weningerdemobackend.onrender.com'],
  config: {
    screens: {
      Login: 'login',
      RegisterUser: 'register',
      Home: 'home',
      CustomerStack: {
        screens: {
          Customers: 'customers',
          AddCustomer: 'add-customer',
          CustomerDetail: 'customer/:id',
        },
      },
      OrderStack: {
        screens: {
          Orders: 'orders',
          OrderDetail: 'order/:id',
          AddOrder: 'order/add/:customerNumber',
          EditOrder: 'order/edit/:id',
        },
      },
      UserStack: {
        screens: {
          UsersHome: 'users',
          RegisterUser: 'register',
          UserList: 'users/list',
          UserDetail: 'user/:id',
          EditUser: 'user/edit/:id',
        },
      },
    },
  },
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toast />
    </AuthProvider>
  )
}

function MainApp() {
  const { isAuthenticated } = useContext(AuthContext)

  if (isAuthenticated === null) {
    return <LoaderScreen />
  }

  return (
    <NavigationContainer linking={linking} fallback={<LoaderScreen />}>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

function Root() {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <AppStack /> : <AuthStack />
}
