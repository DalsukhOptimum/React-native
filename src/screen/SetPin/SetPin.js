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



const CELL_COUNT = 4;

export default function SetPin({route, navigation}) {
  const [enableMask, setEnableMask] = useState(true);

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

  useFocusEffect(
    React.useCallback(() => {
      if (!Pin) {
        SetErrors('Please Enter Pin');
      } else if (!Pin.match('^[0-9]+$')) {
        SetErrors('only Digit is valid');
      } else if (!Pin.match('^[0-9]{4}$')) {
        SetErrors('please Enter 4 digit');
      } else {
        SetErrors('');
        setTimeout(() => {
          submit();
        }, 5);
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
    console.log("Idhar aaya subit me: ",Errors," Submitetd: ",Submmited);
    Keyboard.dismiss();
    setSubmmited(true);
    if (Errors) {
      setpopupDataFunc('rgb(247, 45, 45)', 'Warning', Errors);
      setpopup(true);
      return;
    }
    setloader(true);

    fetch('http://62.171.164.201:8088/api/PINOperation/GeneratePin', {
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
          setpopup(false);
          setpopupDataFunc('rgb(247, 45, 45)', 'Error', json?.Message);

          setloader(false);
          setPin('');
          setSubmmited(false);
        }
        if (json?.Code == '200') {
          try {
            await AsyncStorage.clear();
            await AsyncStorage.setItem(
              '@Data',
              JSON.stringify(json.ArrayOfResponse[0]),
            );
          } catch (error) {
            console.log('error aaya ', error);
          }

          

          setTimeout(() => {
            setPin('');
            setSubmmited(false);
            setloader(false);
            navigation.navigate('Mpin', {
              Email: json.ArrayOfResponse[0].Official_EmaildID,
            });
          }, 2000);
        }

        console.log(json);
      })
      .catch(error => {
        setloader(false);
        setPin('');
        setSubmmited(false);
        console.error(error);
      })
      .finally(() => {
        setPin('');
        setSubmmited(false);
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
