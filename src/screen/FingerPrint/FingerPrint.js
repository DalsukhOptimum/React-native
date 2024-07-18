import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from 'react-native';
import {styles} from './Stylefp';
import PopUp from '../../component/PopUp';
import TouchID from 'react-native-touch-id';
import React, {useState, useEffect} from 'react';
import {data} from 'jquery';

const FingerPrint = ({route, navigation}) => {
  const [biometryType, setBiometryType] = useState('');
  const [optionalConfigObject, setoptionalConfigObject] = useState('');
  const [Data, setData] = useState('');

  useEffect(() => {
    setData({
      title: 'HRMS_React_Native',
      imageColor: '#B69377', // Android
      imageErrorColor: '#B69377', // Android
      sensorDescription: 'Touch sensor', // Android
      sensorErrorDescription: 'Failed', // Android
      cancelText: 'Cancel', // Android
      fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: true, // iOS: allows the device to fall back to using the passcode if faceid or touch is not available. This does not mean that if touchid or faceid fails the first few times, it will revert to a passcode; rather, if the former are not enrolled, then it will use the passcode.
    });

    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        console.log(biometryType);

        // Success code
        if (biometryType === 'FaceID') {
          console.log('Hello from Face');
          setBiometryType('FaceID');
        } else {
          console.log('Hello FingerPrint');
          setBiometryType('TouchID');
        }
      })
      .catch(error => {
        // Failure code
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (biometryType === 'FaceID' || biometryType === 'TouchID') {
      authenticate();
    }
  }, [biometryType]);

  const authenticate = () => {
    TouchID.authenticate(
      'HRMS Require TouchID for Verification ',
      optionalConfigObject,
    )
      .then(async data => {
        console.log('this is the data: ');
        console.log(data);
        if (success) {
          console.log('this is working');
          try {
            const value = await AsyncStorage.getItem('@Data');

            if (value !== null) {
              let data = await JSON.parse(value);
              setData(data);
            }
          } catch (error) {
            console.log('i am in catch block ', error);
          }
          setTimeout(() => {
            navigation.navigate('HRMS', {Data: Data}); /// login with logic
          }, 100);
        } else {
          navigation.navigate('Mpin');
        }
      })
      .catch(error => {});
  };

  return (
    <View style={styles.root}>
      <View>
        <View>
          <Text style={styles.AnotherText}>
            <Text style={styles.AnotherTextDesign}> Welcome to HRMS</Text>
          </Text>
        </View>
        <Text style={styles.Description}>
          <Text
            onPress={() => {
              if (biometryType === 'FaceID' || biometryType === 'TouchID') {
                authenticate();
              }
            }}
            style={styles.DescriptionDesign}>
            {' '}
            Use Biometric to Login In HRMS
          </Text>
        </Text>
      </View>
      <View style={styles.nextButton}>
        <Text
          style={styles.nextButtonText}
          onPress={() => navigation.navigate('Mpin')}>
          Use Pin
        </Text>
      </View>
    </View>
  );
};

export default FingerPrint;
