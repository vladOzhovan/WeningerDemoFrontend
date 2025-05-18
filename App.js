import { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider, AuthContext } from './context/authContext'
import { ActivityIndicator, View } from 'react-native'
import LoginScreen from './screens/LoginScreen'
import UserStack from './stacks/UserStack'
import CustomerStack from './stacks/CustomerStack'
import HomeScreen from './screens/HomeScreen'
import OrderScreen from './screens/order/OrderScreen'
import OrderDetailScreen from './screens/order/OrderDtailScreen'
import AddCustomerScreen from './screens/customer/AddCustomerScreen'
import AddOrderScreen from './screens/order/AddOrderScreen'
import CustomerDetailScreen from './screens/customer/CustomerDetailScreen'
import EditOrderScreen from './screens/order/EditOrderScreen'
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
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}

function AppStack() {
  const { isAdmin } = useContext(AuthContext)

  if (isAdmin === undefined || isAdmin === null) {
    return <LoaderScreen />
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen
        name="CustomerStack"
        component={CustomerStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Orders" component={OrderScreen} />

      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />

      {isAdmin && (
        <Stack.Screen
          name="AddOrder"
          component={AddOrderScreen}
          options={{ title: 'New Order' }}
        />
      )}

      {isAdmin && (
        <Stack.Screen
          name="Users"
          component={UserStack}
          options={{ headerShown: false }}
        />
      )}

      {isAdmin && (
        <Stack.Screen 
          name="EditOrder" 
          component={EditOrderScreen} 
        />
      )}

      {isAdmin && (
        <>
          <Stack.Screen
            name="AddCustomer"
            component={AddCustomerScreen}
            options={{ title: 'Add Customer' }}
          />
          <Stack.Screen
            name="CustomerDetail"
            component={CustomerDetailScreen}
            options={({ route }) => ({
              title: `Customer #${route.params.customer.customerNumber}`,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  )
}

function Root() {
  const { isAuthenticated } = useContext(AuthContext)

  return isAuthenticated ? <AppStack /> : <AuthStack />
}
