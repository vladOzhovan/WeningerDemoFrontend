import { useState } from 'react'
import { View, Text, TextInput, Button,Platform, Keyboard, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, } from 'react-native'
import { styles } from '../../theme/styles'
import { createCustomer } from '../../api'
import Toast from 'react-native-toast-message'

export default function AddCustomerScreen({ navigation }) {
  const [fieldErrors, setFieldErrors] = useState({})
  const [customerNumber, setCustomerNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState({
    zipCode: '',
    country: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: '',
  })

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => {
      const copy = { ...prev }
      delete copy[`Address.${capitalize(field)}`]
      return copy
    })
  }

  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

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

    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }

    const payload = {
      customerNumber: num,
      firstName: firstName.trim(),
      secondName: secondName.trim(),
      email: email.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    }

    const hasAddressData = Object.values(address).some(v => v.trim() !== '')
    if (hasAddressData) {
      const addr = {}
      if (address.zipCode.trim()) {
        addr.zipCode = parseInt(address.zipCode, 10) || 0
      }
      ['country', 'city', 'street', 'houseNumber', 'apartment'].forEach(fld => {
        if (address[fld].trim()) {
          addr[fld] = address[fld].trim()
        }
      })
      payload.address = addr
    }

    try {
      const newCustomer = await createCustomer(payload)
      Toast.show({ type: 'success', text1: 'Customer added' })
      navigation.replace('CustomerDetail', { customer: newCustomer })
    } catch (e) {
      const srvErrs = e.response?.data?.errors
      if (srvErrs) {
        setFieldErrors(srvErrs)
      } else {
        Toast.show({ type: 'error', text1: e.response?.data?.title || 'Failed to add customer' })
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
        <ScrollView contentContainerStyle={{ padding: 90, alignItems: 'stretch' }} keyboardShouldPersistTaps="handled">
          {/* Required */}
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

          {/* Optional */}
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

          <Text style={styles.label}>Zip Code</Text>
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

          <View style={{ marginTop: 30 }}>
            <Button title="Create Customer" onPress={onSubmit} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

