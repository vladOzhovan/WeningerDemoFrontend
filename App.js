import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext  } from './context/authContext'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CustomerScreen from './screens/CustomerScreen';
import OrderScreen from './screens/OrderScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen}/>
    </Stack.Navigator>
  );
}

function AppStack() {
  const { isAdmin } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Customers" component={CustomerScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
      {isAdmin && (
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register User' }}
        />
      )}
    </Stack.Navigator>
  );
}

function RootNavigation() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation/>
      <Toast/>
    </AuthProvider>
  );
}

