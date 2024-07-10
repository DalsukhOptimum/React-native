import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import PopUp from '../../component/PopUp';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const CELL_COUNT = 4;

export default function SetPin({route, navigation}) {
  const [enableMask, setEnableMask] = useState(true);

  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [Pin, setPin] = useState('');
  const [loader, setloader] = useState(false);
  const Employee_Code = route.params.Employee_Code;
  const Email = route.params.Email;
  const [Errors, SetErrors] = useState('');
  const [Submmited, setSubmmited] = useState(false);
  const [popup, setpopup] = useState(false);
  const [PopupData, setPopupData] = useState({
    color: '',
    Type: '',
    Message: '',
  });

  const ref = useBlurOnFulfill({Pin, cellCount: CELL_COUNT});

  console.log('set pin: ', Email);

  function setpopupDataFunc(color, Type, Message) {
    setPopupData({color: color, Type: Type, Message: Message});
  }

  function Ok() {
    setpopup(false);
  }

  // useFocusEffect(() => {
  //   if (!Pin) {
  //     SetErrors('Please Enter Pin');
  //   } else if (!Pin.match('^[0-9]{4}$')) {
  //     SetErrors('only 4 Digit is valid');
  //   } else {
  //     SetErrors('');
  //   }
  // }, [Pin]);

  useFocusEffect(
    React.useCallback(() => {
      if (!Pin) {
        SetErrors('Please Enter Pin');
      } else if (!Pin.match('^[0-9]{4}$')) {
        SetErrors('only 4 Digit is valid');
      } else {
        SetErrors('');
      }
    }, [Pin]),
  );

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

  submit = () => {
    Keyboard.dismiss();
    setSubmmited(true);
    if (Errors) {
      setpopupDataFunc('red', 'Error', Errors);
      setpopup(true);
      return;
    }

    fetch('http://192.168.1.29:8090/api/PINOperation/GeneratePin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({Employee_Code: Employee_Code, Pin: Pin}),
    })
      .then(resp => resp.json())
      .then(async json => {
        if (json?.Code == '400' || json?.Code == '500') {
          setpopupDataFunc('red', 'Error', json?.Message);
          setpopup(true);
        }
        if (json?.Code == '200') {
          try {
            await AsyncStorage.clear();
            console.log('1 am in set pin page: ');
            console.log(
              'this is data ',
              JSON.stringify(json.ArrayOfResponse[0]),
            );
            console.log('2 am in set pin page: ');
            await AsyncStorage.setItem(
              '@Data',
              JSON.stringify(json.ArrayOfResponse[0]),
            );
            console.log('3 am in set pin page: ');
          } catch (error) {
            console.log('error aaya ', error);
          }

          navigation.navigate('Mpin', {
            Email: json.ArrayOfResponse[0].Official_EmaildID,
          });
        }

        console.log(json);
        setloader(false);
        setPin('');
        setSubmmited(false);
      })
      .catch(error => {
        setloader(false);
        console.error(error);
      })
      .finally(() => {
        setloader(false);
      });
  };

  console.log('this is Employee Code: ', Employee_Code);
  return (
    <SafeAreaView style={styles.container}>
      <Loder Start={loader} />
      <PopUp
        Start={popup}
        Func={() => Ok()}
        Message={PopupData.Message}
        color={PopupData.color}
        Type={PopupData.Type}
      />
      <Text style={styles.title}>Set Pin</Text>
      <View style={styles.inputView}>
        <CodeField
          ref={ref}
          onSubmitEditing={event => {
            Keyboard.dismiss();
            submit();
          }}
          value={Pin}
          onChangeText={setPin}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
      </View>
      <Text style={{color: 'red'}}>{Errors && Submmited ? Errors : ''}</Text>
      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={() => submit()}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
