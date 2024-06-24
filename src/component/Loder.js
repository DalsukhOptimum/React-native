import { View, Text, Modal, ActivityIndicator } from 'react-native'
import React from 'react'

const Loder = ({Start}) => {
  return (
    <Modal visible={Start}  transparent={true}>
            <View style={{
                 flex: 1,
                 justifyContent: 'center',
                 alignItems : "center",
                 backgroundColor:'rgba(0,0,0,0.3)'
            }}>
                 <ActivityIndicator size="large" color="#00ff00" />
            </View>
    </Modal>
  )
}

export default Loder