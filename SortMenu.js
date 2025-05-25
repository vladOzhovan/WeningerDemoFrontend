import { useState } from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'

export default function SortMenu({ sortBy, setSortBy, isDescending, setIsDescending, onChange }) {
  const [modalVisible, setModalVisible] = useState(false)

  const handleLongPress = () => {
    setModalVisible(true)
  }

  const handleSelect = value => {
    setSortBy(value)
    setModalVisible(false)
    if (onChange) {
      onChange()
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setIsDescending(prev => {
            const newValue = !prev
            if (onChange) onChange()
            return newValue
          })
        }}
        onLongPress={handleLongPress}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 6,
          backgroundColor: '#636e72',
          alignSelf: 'center'
        }}
      >
        <Text style={{ color: 'white' }}>
          {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Number'} {isDescending ? '↓' : '↑'}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 15,
              width: 200,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5
            }}
          >
            {[
              { label: 'date', value: 'date' },
              { label: 'name', value: 'name' },
              { label: 'number', value: 'number' }
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option.value)}
                style={{ paddingVertical: 10 }}
              >
                <Text style={{ fontWeight: sortBy === option.value ? 'bold' : 'normal' }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}  

