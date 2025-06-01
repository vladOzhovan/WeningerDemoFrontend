import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native'
import { styles } from '../../theme/styles'
import { updateCustomer } from '../../api'
import Toast from 'react-native-toast-message'

export default function EditCustomerScreen({ route, navigation }) {
  const { customer } = route.params

  const [fieldErrors, setFieldErrors] = useState({})

  const [customerNumber, setCustomerNumber] = useState(customer.customerNumber.toString())
  const [firstName, setFirstName] = useState(customer.firstName)
  const [secondName, setSecondName] = useState(customer.secondName)
  const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber || '')
  const [email, setEmail] = useState(customer.email || '')

  const [address, setAddress] = useState({
    zipCode: customer?.address?.zipCode?.toString() || '',
    country: customer?.address?.country || '',
    city: customer?.address?.city || '',
    street: customer?.address?.street || '',
    houseNumber: customer?.address?.houseNumber || '',
    apartment: customer?.address?.apartment || '',
  })

  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => {
      const copy = { ...prev }
      delete copy[`Address.${capitalize(field)}`]
      return copy
    })
  }

  const renderErrors = key =>
    Array.isArray(fieldErrors[key])
      ? fieldErrors[key].map(msg => (
          <Text key={msg} style={styles.error}>
            {msg}
          </Text>
        ))
      : null

  const onSubmit = async () => {
    setFieldErrors({})

    const errs = {}

    const num = parseInt(customerNumber, 10)
    if (isNaN(num)) {
      errs.CustomerNumber = ['Customer number is required and must be a number.']
    } else if (num < 10000 || num > 99999) {
      errs.CustomerNumber = ['Customer number must be a 5-digit number.']
    }

    if (!firstName.trim()) {
      errs.FirstName = ['First name is required.']
    }

    if (!secondName.trim()) {
      errs.SecondName = ['Second name is required.']
    }

    const trimmedEmail = email.trim()
    if (trimmedEmail.length > 0) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(trimmedEmail)) {
        errs.Email = ['Invalid email address.']
      }
    }

    if (phoneNumber.trim()) {
      const phonePattern = /^\+?[0-9\s\-\(\)]{7,25}$/
      if (!phonePattern.test(phoneNumber.trim())) {
        errs.PhoneNumber = ['Invalid phone number format.']
      }
    }

    const hasAddressData = Object.values(address).some(v => v.trim() !== '')
    if (hasAddressData) {
      if (address.zipCode.trim()) {
        const zip = parseInt(address.zipCode, 10)
        if (isNaN(zip)) {
          errs['Address.ZipCode'] = ['Zip code must be a number.']
        }
      }
    }

    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }

    const payload = {
      customerNumber: num,
      firstName: firstName.trim(),
      secondName: secondName.trim(),
      email: trimmedEmail || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    }

    if (hasAddressData) {
      const addr = {}
      if (address.zipCode.trim()) {
        addr.zipCode = parseInt(address.zipCode, 10) || 0
      }
      ;['country', 'city', 'street', 'houseNumber', 'apartment'].forEach(fld => {
        if (address[fld].trim()) {
          addr[fld] = address[fld].trim()
        }
      })
      payload.address = addr
    }

    try {
      await updateCustomer(customer.id, payload)
      Toast.show({ type: 'success', text1: 'Customer updated' })
      navigation.goBack()
    } catch (e) {
      const srvErrs = e.response?.data?.errors
      if (srvErrs) {
        setFieldErrors(srvErrs)
      } else {
        Alert.alert('Error', e.response?.data?.title || 'Failed to update customer')
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 50 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Edit Customer</Text>

          <Text style={styles.label}>
            Customer Number <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="5-digit number"
            keyboardType="numeric"
            value={customerNumber}
            onChangeText={text => {
              setCustomerNumber(text)
              setFieldErrors(prev => ({ ...prev, CustomerNumber: undefined }))
            }}
          />
          {renderErrors('CustomerNumber')}

          <Text style={styles.label}>
            First Name <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="First name"
            value={firstName}
            onChangeText={text => {
              setFirstName(text)
              setFieldErrors(prev => ({ ...prev, FirstName: undefined }))
            }}
          />
          {renderErrors('FirstName')}

          <Text style={styles.label}>
            Second Name <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="Second name"
            value={secondName}
            onChangeText={text => {
              setSecondName(text)
              setFieldErrors(prev => ({ ...prev, SecondName: undefined }))
            }}
          />
          {renderErrors('SecondName')}

          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={text => {
              setEmail(text)
              setFieldErrors(prev => ({ ...prev, Email: undefined }))
            }}
          />
          {renderErrors('Email')}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="Phone"
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={text => {
              setPhoneNumber(text)
              setFieldErrors(prev => ({ ...prev, PhoneNumber: undefined }))
            }}
          />
          {renderErrors('PhoneNumber')}

          <Text style={[styles.label, { marginTop: 20 }]}>Zip Code</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="Zip code"
            keyboardType="numeric"
            value={address.zipCode}
            onChangeText={text => handleAddressChange('zipCode', text)}
          />
          {renderErrors('Address.ZipCode')}

          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="Country"
            value={address.country}
            onChangeText={text => handleAddressChange('country', text)}
          />
          {renderErrors('Address.Country')}

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="City"
            value={address.city}
            onChangeText={text => handleAddressChange('city', text)}
          />
          {renderErrors('Address.City')}

          <Text style={styles.label}>Street</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="Street"
            value={address.street}
            onChangeText={text => handleAddressChange('street', text)}
          />
          {renderErrors('Address.Street')}

          <Text style={styles.label}>House Number</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="House number"
            value={address.houseNumber}
            onChangeText={text => handleAddressChange('houseNumber', text)}
          />
          {renderErrors('Address.HouseNumber')}

          <Text style={styles.label}>Apartment</Text>
          <TextInput
            style={styles.inputLogginEditCreate}
            placeholder="Apartment"
            value={address.apartment}
            onChangeText={text => handleAddressChange('apartment', text)}
          />
          {renderErrors('Address.Apartment')}

          <View style={{ paddingTop: 20, paddingBottom: 15 }}>
            <Button title="Save Changes" onPress={onSubmit} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
