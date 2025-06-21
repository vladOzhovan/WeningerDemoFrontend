import { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { styles } from '../../theme/styles'
import { inviteUser } from '../../api'
import Toast from 'react-native-toast-message'

export default function InviteScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [validDays, setValidDays] = useState('1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onInvite = async () => {
    setError(null)
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    const days = parseInt(validDays, 10)
    if (isNaN(days) || days < 1 || days > 365) {
      setError('Valid days must be a number between 1 and 365')
      return
    }
    setLoading(true)
    try {
      await inviteUser(email.trim(), days)
      Toast.show({ type: 'success', text1: 'Invitation sent' })
      navigation.goBack()
    } catch (e) {
      setError(e.response?.data || e.message || 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite User</Text>

      <TextInput
        style={styles.inputLogginEditCreate}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.inputLogginEditCreate}
        placeholder="Token Valid Days (1-365)"
        value={validDays}
        onChangeText={setValidDays}
        keyboardType="numeric"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title={loading ? 'Inviting...' : 'Invite'} onPress={onInvite} disabled={loading} />
    </View>
  )
}
