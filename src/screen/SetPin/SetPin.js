import {View, Text, SafeAreaView, TextInput, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SetPin({route, navigation}) {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [pin, setpin] = useState('');
  const [loader, setloader] = useState(false);
  const Employee_Code = route.params.Employee_Code;
  const Email = route.params.Email;
  const [Errors, SetErrors] = useState('');
  const [Submmited, setSubmmited] = useState(false);

  console.log('set pin: ', Email);

  useEffect(() => {
    if (!pin) {
      SetErrors('Please Enter Pin');
    } else if (!pin.match('^[0-9]{4}$')) {
      SetErrors('only 4 Digit is valid');
    } else {
      SetErrors('');
    }
  }, [pin]);

  submit = () => {
    setSubmmited(true);
    if (Errors) {
      alert('Please Enter valid pin');
      return;
    }

    fetch('http://localhost:3446/api/PINOperation/GeneratePin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({Employee_Code: Employee_Code, Pin: pin}),
    })
      .then(resp => resp.json())
      .then(async json => {
        if (json?.Code == '400' || json?.Code == '500') {
          alert(json?.Message);
        }
        if (json?.Code == '200') {
          console.log('i am in set pin page: ');
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

          alert(json?.Message);

          navigation.navigate('Mpin', {
            Email: json.ArrayOfResponse[0].Official_EmaildID,
          });
        }

        console.log(json);
        setloader(false);
        setpin('');
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
      <Text style={styles.title}>Set Pin</Text>
      <View style={styles.inputView}>
        <TextInput
          style={[styles.input, {marginTop: 10}]}
          placeholder="PIN"
          secureTextEntry
          value={pin}
          onChangeText={setpin}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="numeric"
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
