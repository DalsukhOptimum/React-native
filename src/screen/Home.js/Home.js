import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  AsyncStorage,
} from 'react-native';
// import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';

const Home = ({navigation}) => {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setloader] = useState(false);
  const submiaat = () => {
    navigation.navigate('Webview', {id: 'asasasas'});
  };

  useEffect(() => {
    // retrieveData = async () => {
    ( async () => {
      try {
        const value = await AsyncStorage.getItem('@Data');
        console.log("i am printing the values: ",value)
        if (value !== null) {
          console.log('i am redirecting');
          let data = await JSON.parse(value);
         console.log('this is last ', data);
          navigation.navigate('Mpin', {
            Email:data.Official_EmaildID,
          });
        }
      } catch (error) {
     console.log("i am in catch block ",error)
      }
    } ) ()
    return
  }, []);

  function submit() {
    setloader(true);
    console.log(username, password);
    fetch('http://localhost:3446/api/Login/LoginHrms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({role: 0, username: username, password: password}),
    })
      .then(resp => resp.json())
      .then(json => {
        if (json?.status == 'Error') {
          alert(json?.message);
        }
        if (json?.status == 'success') {
          if (json?.ArrayOfResponse[0].PinStatus != null) {
            navigation.navigate('Mpin', {
              Email: json.ArrayOfResponse[0].Official_EmaildID,
            });
          } else {
            console.log(
              'From Home component: ',
              json.ArrayOfResponse[0].Official_EmaildID,
            );
            navigation.navigate('SetPin', {
              Employee_Code: json.ArrayOfResponse[0].Employee_Code,
              Email: json.ArrayOfResponse[0].Official_EmaildID,
            });
          }
        }

        console.log(json);
        setloader(false);
      })
      .catch(error => {
        setloader(true);
        console.error(error);
      })
      .finally(() => {
        setloader(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loder Start={loader} />
      <Text style={styles.title}>HRMS</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          value={username}
          onChangeText={setUsername}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, {marginTop: 10}]}
          placeholder="PIN"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.rememberView}></View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={() => submit()}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </View>

     
    </SafeAreaView>
  );
};

export default Home;
