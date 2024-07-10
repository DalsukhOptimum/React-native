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
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import {useFocusEffect, useNavigationState} from '@react-navigation/native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const CELL_COUNT = 4;

const Mpin = ({route, navigation}) => {
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
      if (pin == '') {
        SetErrors('Please Enter Pin');
      } else if (!pin.match('^[0-9]{4}$')) {
        SetErrors('only 4 Digit is valid');
      } else {
        SetErrors('');
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
        console.log('i am printing the values: ', value);
        if (value !== null) {
          let data = await JSON.parse(value);
          console.log('this is final data object: ', data);
          setEmail(data.Official_EmaildID);

          console.log('this is Email ', Email);
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
    //Keyboard.dismiss();

    setSubmmited(true);

    if (Errors) {
      //alert('Error hai');
      // Toast.show({
      //   type: ALERT_TYPE.DANGER,
      //   title: 'Warning',
      //   textBody: Errors,
      // });
      setpopupDataFunc('red', 'warning', Errors);
      console.log('this is object ', PopupData);
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
          // Dialog.show({
          //   type: ALERT_TYPE.WARNING,
          //   title: 'Error',
          //   textBody: json?.Message,
          //   button: 'close',
          // });
          // alert("incorrect")
          setpopupDataFunc('red', 'warning', json?.Message);
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

          // setpopupDataFunc('blue','success',"Pin is correct");
          // setpopup(true);

          navigation.navigate('HRMS', {Data: json.ArrayOfResponse[0]});
        } else {
          alert('something went wrong');
          setpin('');
          setloader(false);
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
        </View>
      </SafeAreaView>
   
  );
};

export default Mpin;
