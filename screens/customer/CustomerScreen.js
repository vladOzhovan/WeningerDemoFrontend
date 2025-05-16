import { useState, useEffect, useContext } from "react";
import { styles } from "../../styles";
import { View, Text, TextInput, Modal, FlatList,TouchableOpacity, Button} from "react-native";
import { AuthContext } from "../../context/authContext";
import { getCustomers, generateCustomers } from "../../api";
import Toast from "react-native-toast-message"

export default function CustomerScreen({ navigation }) {
  const { isAdmin } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [customerCount, setCustomerCount] = useState("10");
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function for loading clients
  const loadCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Function for handling client click
  const handleInfo = (customer) => {
    navigation.navigate("CustomerDetail", { customer });
  };

  return (
    <View style={styles.container}>
      {isAdmin && (
        <>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.button]}
            onPress={() => navigation.navigate("AddCustomer")}
          >
            <Text style={styles.buttonText}>Add Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonWrapper,
              styles.button,
              { backgroundColor: "#6c5ce7" },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Generate Customers</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: 300,
            }}
          >
            <Text style={{ marginBottom: 10 }}>
              How many customers to generate?
            </Text>
            <TextInput
              keyboardType="numeric"
              value={customerCount}
              onChangeText={setCustomerCount}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />
            <Button
              title="Generate"
              onPress={async () => {
                try {
                  const count = parseInt(customerCount);
                  if (isNaN(count) || count <= 0) {
                    Toast.show({
                      type: "error",
                      text1: "Enter a valid number",
                    });
                    return;
                  }
                  await generateCustomers(count);
                  Toast.show({
                    type: "success",
                    text1: `Generated ${count} customers`,
                  });
                  setModalVisible(false);
                  loadCustomers();
                } catch (e) {
                  console.error(e);
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: e.message,
                  });
                }
              }}
            />
            <Button
              title="Cancel"
              color="gray"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, borderBottomWidth: 1 }}
            onPress={() => handleInfo(item)}
          >
            <Text>
              {item.customerNumber} - {item.firstName} {item.secondName} (
              {item.overallStatus})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
