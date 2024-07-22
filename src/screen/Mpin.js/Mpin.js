import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
//  import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopUp from '../../component/PopUp';
import TouchID from 'react-native-touch-id';

import {
  useFocusEffect,
  useNavigationState,
  useIsFocused,
} from '@react-navigation/native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const CELL_COUNT = 4;

const Mpin = ({route, navigation}) => {
  const [biometryType, setBiometryType] = useState('');
  const [optionalConfigObject, setoptionalConfigObject] = useState('');
  const [Data, setData] = useState('');
  const isFocused = useIsFocused();
  const [Count, setCount] = useState(0);

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
      !PassesEmail ? authenticate() : console.log('Pehli bar nai hai');
    }
  }, [biometryType]);

  const authenticate = () => {
    TouchID.authenticate(
      'HRMS Require FingerPrint for Verification ',
      optionalConfigObject,
    )
      .then(async success => {
        if (success) {
          console.log('how it is');
          console.log(success);
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
        }
      })
      .catch(error => {});
  };

  const [enableMask, setEnableMask] = useState(true);

  const [loader, setloader] = useState(false);
  const [pin, setpin] = useState('');
  const [Errors, SetErrors] = useState('');
  const [Submmited, setSubmmited] = useState(false);
  const [Email, setEmail] = useState('');
  const [popup, setpopup] = useState(false);
  const PassesEmail = route.params?.Email;
  const [PopupData, setPopupData] = useState({
    color: '',
    Type: '',
    Message: '',
  });

  function setpopupDataFunc(color, Type, Message) {
    setPopupData({color: color, Type: Type, Message: Message});
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('this is the pin in this: ', pin);
      if (pin == '') {
        SetErrors('Please Enter Pin');
      } else if (!pin.match('^[0-9]+$')) {
        SetErrors('only Digit is valid');
      } else if (!pin.match('^[0-9]{4}$')) {
        SetErrors('Please Enter 4 digits');
      } else {
        SetErrors('');
        setTimeout(() => {
          submit();
        }, 5);
      }
      console.log('this is Erors: ', Errors);
    }, [pin]),
  );

  const ref = useBlurOnFulfill({pin, cellCount: CELL_COUNT});

  const toggleMask = () => setEnableMask(f => !f);
  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMask ? '•' : symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
    }
    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        // onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('@Data');

        if (value !== null) {
          let data = await JSON.parse(value);

          setEmail(data.Official_EmaildID);
        }
      } catch (error) {
        console.log('i am in catch block ', error);
      }
    })();
    return;
  }, []);

  console.log('This is Verify pin data: ', Email);

  LoginPgae = () => {
    setpin('');
    setloader(false);
    setSubmmited(false);

    navigation.navigate('Home');
  };

  submit = async () => {
    setSubmmited(true);

    if (Errors) {
      console.log('this is pin: in submit: ', pin);
      setpopupDataFunc('rgb(247, 45, 45)', 'warning', Errors);
      setpopup(true);
      return;
    }

    setloader(true);
    console.log('bahar aa gaya');
    fetch('http://192.168.1.29:8090/api/PINOperation/VerifyPin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Official_EmaildID: PassesEmail ? PassesEmail : Email,
        Pin: pin,
      }),
    })
      .then(resp => resp.json())
      .then(async json => {
        if (json?.Code == '400') {
          setpopupDataFunc('rgb(247, 45, 45)', 'Login Failed', 'Incorrect Pin');
          setpopup(true);
          console.log('this is object ', PopupData);

          setpin('');
          setloader(false);
          setSubmmited(false);
          // alert('PIn is incorrect');
        } else if (json?.Code == '200') {
          try {
            AsyncStorage.clear();
            await AsyncStorage.setItem(
              '@Data',
              JSON.stringify(json.ArrayOfResponse[0]),
            );
          } catch (error) {
            console.log('error aaya ', error);
          }

          setpin('');
          setloader(false);
          setSubmmited(false);

          navigation.navigate('HRMS', {Data: json.ArrayOfResponse[0]});
        } else {
          alert('something went wrong');
          setpin('');
          setloader(false);
          setpopupDataFunc(
            'rgb(247, 45, 45)',
            'Something went wrong',
            'Incorrect Pin',
          );
          setpopup(true);
          setSubmmited(false);
        }

        console.log(json);
      })
      .catch(error => {
        setloader(false);
        console.error(error);
      })
      .finally(() => {});
  };

  function Ok() {
    setpopup(false);
  }

  return (
    <SafeAreaView onclick={Keyboard.dismiss} style={styles.container}>
      <Loder Start={loader} />
      <PopUp
        Start={popup}
        Func={() => Ok()}
        Message={PopupData.Message}
        color={PopupData.color}
        Type={PopupData.Type}
      />
      <Text style={styles.title}>Verify Pin </Text>
      <View style={styles.inputView}>
        <CodeField
          onSubmitEditing={event => {
            Keyboard.dismiss();
            submit();
          }}
          ref={ref}
          value={pin}
          onChangeText={setpin}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
          textInputStyle={styles.InnerDot}
        />
      </View>
      <Text style={{color: 'red'}}>{Errors && Submmited ? Errors : ''}</Text>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={() => submit()}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
        <Text style={styles.footerText}>
          Forget Pin?
          <Text onPress={() => LoginPgae()} style={styles.signup}>
            {' '}
            Set Up Pin
          </Text>
        </Text>
        <Text style={styles.AnotherText}>
          <Text
            onPress={() => {
              if (biometryType === 'FaceID' || biometryType === 'TouchID') {
                authenticate();
              }
              else{
                alert("No Face or fingerPrint");
              }
            }}
            style={styles.AnotherTextDesign}>
            {' '}
            Use Biometric
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Mpin;
