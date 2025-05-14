import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomerScreen from '../screens/Customer/CustomerScreen'
import AddCustomerScreen from '../screens/Customer/AddCustomerScreen'
import CustomerListScreen from '../screens/Customer/CustomerListScreen'
import CustomerDetailScreen from '../screens/Customer/CustomerDetailScreen'

const Stack = createNativeStackNavigator()

export default function CustomerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Customers"
        component={CustomerScreen}
        options={{ title: 'Customers' }}
      />
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{ title: 'Customer List' }}
      />
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
    </Stack.Navigator>
  )
}
