import {View, Text, Modal, ActivityIndicator, Pressable} from 'react-native';
import React, {useState} from 'react';

const PopUp = ({Start, Func, Message, color, Type}) => {
  return (
    <Modal animationType="slide" visible={Start} transparent={true}>
      <View
      // style={{
      //   filter: 'blur(10)',
      //  backgroundColor:'rgba(0,0,0,0.6)',
      //  height:'100%',
      //  width:'100%'
      // }}
      >
        <View
          style={{
            flex: 1.5,
            opacity: 1,
            backgroundColor: 'white',
            justifyContent: 'space-around',
            alignItems: 'center',
            alignSelf: 'center',
            maxWidth: 400,
            width: '80%',
            minHeight: 250,
            borderRadius: 24,
            paddingHorizontal: 12,
            paddingTop: 50,
            paddingBottom: 24,
            position: 'absolute',
            marginTop: 220,
            marginBottom: 220,
            marginRight: 30,
            marginLeft: 30,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: 25,
          }}>
          <Text
            style={{
              flex: 1,
              fontWeight: 'bold',
              // fontSize: 20,
              color: color,
              // fontSize: 25,
              justifyContent: 'flex-start',
              alignItems: 'center',
              fontSize: 35,
            }}>
            {Type}
          </Text>

          <Text
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              color: color,
              fontWeight: 'bold',
              fontSize: 16,
              alignItems: 'center',
              fontSize: 15,
            }}>
            {Message}
          </Text>

          <Pressable
            style={{
              flex: 0.4,

              borderRadius: 60,
              borderRadius: 50,
              height: 40,
              width: 130,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 12,
              // height: 45,
              // backgroundColor: '#3557b7',
              backgroundColor: color,
              justifyContent: 'center',
              minWidth: 120,
              heigh: 10,
              marginBottom: 10,
            }}
            onPress={() => Func()}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: '#fff',
                fontWeight: '700',
              }}>
              Ok
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default PopUp;
