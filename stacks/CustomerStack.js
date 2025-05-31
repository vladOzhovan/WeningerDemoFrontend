import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomerScreen from '../screens/customer/CustomerScreen'
import AddCustomerScreen from '../screens/customer/AddCustomerScreen'
import CustomerDetailScreen from '../screens/customer/CustomerDetailScreen'
import OrderDetailScreen from '../screens/order/OrderDetailScreen'
import EditCustomerScreen from '../screens/customer/EditCustomerScreen'

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
      <Stack.Screen
       name="OrderDetail"
       component={OrderDetailScreen}
       options={{ title: 'Order Details' }}
     />
     <Stack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        options={{ title: 'Edit Customer' }}
     />
    </Stack.Navigator>
  )
}
