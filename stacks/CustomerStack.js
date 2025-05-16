import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomerScreen from '../screens/customer/CustomerScreen'
import AddCustomerScreen from '../screens/customer/AddCustomerScreen'
//import CustomerListScreen from '../screens/customer/CustomerListScreen'
import CustomerDetailScreen from '../screens/customer/CustomerDetailScreen'

const Stack = createNativeStackNavigator()

export default function CustomerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Customers"
        component={CustomerScreen}
        options={{ title: 'Customers' }}
      />
      {/* <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{ title: 'Customer List' }}
      /> */}
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
