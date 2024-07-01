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
  const PassesEmail = route.params?.Email;

  const ref = useBlurOnFulfill({pin, cellCount: CELL_COUNT});
  //const [props, getCellOnLayoutHandler] = useClearByFocusCell({
  //   pin,
  //   setpin,
  // });

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
    if (!pin) {
      SetErrors('Please Enter Pin');
    } else if (!pin.match('^[0-9]{4}$')) {
      SetErrors('only 4 Digit is valid');
    } else {
      SetErrors('');
    }
  }, [pin]);

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
    navigation.navigate('Home');
  };

  submit = async () => {
    setSubmmited(true);
    if (Errors) {
      alert('Please Enter valid pin');
      return;
    }

    fetch('http://localhost:3446/api/PINOperation/VerifyPin', {
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
          alert('PIn is incorrect');
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
          alert(json?.Message);
          navigation.navigate('HRMS', {Data: json.ArrayOfResponse[0]});
        } else {
          alert('something went wrong');
        }

        console.log(json);
        setpin('');
        setloader(false);
        setSubmmited(false);
      })
      .catch(error => {
        setloader(true);
        console.error(error);
      })
      .finally(() => {
        // setpin('');
        // setEmail('');
      });
  };

  return (
    <SafeAreaView onclick={Keyboard.dismiss} style={styles.container}>
      <Loder Start={loader} />
      <Text style={styles.title}>Verify Pin </Text>
      <View style={styles.inputView}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <TextInput
          keyboardType="numeric"
          style={[styles.input, {marginTop: 10}]}
          placeholder="PIN"
          secureTextEntry
          value={pin}
          onChangeText={setpin}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardState
        />
      </TouchableWithoutFeedback> */}

        <CodeField
          ref={ref}
          // {...props}
          value={pin}
          onChangeText={setpin}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
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
