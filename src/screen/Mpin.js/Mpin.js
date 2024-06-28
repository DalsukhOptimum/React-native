import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  
} from 'react-native';
//  import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import AsyncStorage from '@react-native-async-storage/async-storage';
// submit = () => {
//   console.log("Hello")
// }
const Mpin = ({route, navigation}) => {
  const [loader, setloader] = useState(false);
  const [pin, setpin] = useState('');
  const [Errors,SetErrors] = useState("");
  const [Submmited, setSubmmited] = useState(false);

  const [Email, setEmail] = useState('');
  // const PassedEmail = route.params?.Email ;


  useEffect(() => {
  if(!pin)
    {
      SetErrors("Please Enter Pin");
    }
    else if(pin.match("^(?!(.)\\1{3})(?!19|20)\d{4}$"))
    {
        SetErrors("Please Enter Pin");
    }
    else{
      SetErrors("");
    }
  }, [pin])
  

  useEffect(() => {
    // retrieveData = async () => {
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

  console.log('This is Verify pin dataL: ', Email);

  LoginPgae = () => {
    navigation.navigate('Home');
  };

  submit = () => {

    setSubmmited(true);
    if(Errors)
      {
        alert("Please Enter valid pin");
        return;
      }

    fetch('http://localhost:3446/api/PINOperation/VerifyPin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({Official_EmaildID: Email, Pin: pin}),
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
          navigation.navigate('Webview', {Data: json.ArrayOfResponse[0]});
        } else {
          alert('something went wrong');
        }

        console.log(json);
        setloader(false);
      })
      .catch(error => {
        setloader(true);
        console.error(error);
      })
      .finally(() => {});
  };

  // const {Data} = route.params.Data

  // console.log(Email);
  // console.log('Data: ', route.params.Data);
  return (
    <SafeAreaView style={styles.container}>
      <Loder Start={loader} />
      <Text style={styles.title}>Verify Pin</Text>
      <View style={styles.inputView}>
        <TextInput
        keyboardType='numeric'
          style={[styles.input, {marginTop: 10}]}
          placeholder="PIN"
          secureTextEntry
          value={pin}
          onChangeText={setpin}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <Text style = {{color:'red'}}>{(Errors && Submmited) ?Errors:""}</Text>

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
