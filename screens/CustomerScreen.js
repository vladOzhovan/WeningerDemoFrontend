import { useState } from 'react';
import { styles } from '../styles';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { getCustomers } from '../api';

export default function CustomerScreen({ route, navigation }) {
  const { userName } = route.params || {};
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleInfo = (customer) => {
    console.log('Info about:', customer);
    // Here you can navigate to another screen or show a modal
  };

  return (
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 1 }]}>
      <Text style={styles.title}>Customers</Text>
      {/* <Text>{userName ? ` for ${userName}` : ''}</Text> */}

      <View style={[styles.buttonWrapper, { marginTop: 1 }]}>
        <Button title="Load Customers" onPress={loadCustomers} />
      </View>

      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={customers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text>- {item.firstName} {item.secondName} ({item.overallStatus})</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <TouchableOpacity style={{ marginRight: 10 }} onPress={() => handleInfo(item)}>
                <Text style={{ color: 'orange' }}>Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 55,
          alignSelf: 'center',
          width: '50%',
        }}
      >
        <Button title="Back to home" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

