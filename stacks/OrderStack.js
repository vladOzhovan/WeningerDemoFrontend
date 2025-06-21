import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OrderScreen from '../screens/order/OrderScreen'
import OrderDetailScreen from '../screens/order/OrderDetailScreen'
import AddOrderScreen from '../screens/order/AddOrderScreen'
import EditOrderScreen from '../screens/order/EditOrderScreen'

const Stack = createNativeStackNavigator()

export default function OrderStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Orders"
          component={OrderScreen}
          options={{ title: 'Orders' }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ title: 'Order Details' }}
        />
        <Stack.Screen
          name="AddOrder"
          component={AddOrderScreen}
          options={{ title: 'New Order' }}
        />
        <Stack.Screen
          name="EditOrder"
          component={EditOrderScreen}
          options={{ title: 'Edit Order' }}
        />
      </Stack.Navigator>
    )
  }

