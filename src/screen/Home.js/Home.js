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
import {Dropdown} from 'react-native-element-dropdown';

const Home = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setloader] = useState(false);
  const [Role, setRole] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    {label: 'Employee', value: '0'},
    {label: 'Admin', value: '1'},
  ];

  useEffect(() => {
    // retrieveData = async () => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('@Data');
        console.log('i am printing the values: ', value);
        if (value !== null) {
          console.log('i am redirecting');
          let data = await JSON.parse(value);
          console.log('this is last ', data);
          navigation.navigate('Mpin', {
            Email: data.Official_EmaildID,
          });
        }
      } catch (error) {
        console.log('i am in catch block ', error);
      }
    })();
    return;
  }, []);

  function submit() {

    // let EmailRegex ="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" ;
    if(username == "")
      {
        alert("Please enter Valid Email");
        return ;
      }
    setloader(true);
    console.log(username, password);
    fetch('http://localhost:3446/api/Login/LoginHrms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({role:Role , username: username, password: password}),
    })
      .then(resp => resp.json())
      .then(async json => {
        let value;
        if (json?.status == 'Error') {
          alert(json?.message);
        }
        if (json?.status == 'success') {
          try {
            value = await AsyncStorage.getItem('@Data');
            console.log('i am printing the values: ', value);
          } catch (error) {
            console.log('i am in catch block ', error);
          }

          if (json?.ArrayOfResponse[0].PinStatus != null && value == null) {
            navigation.navigate('Mpin');
          } else if (
            json?.ArrayOfResponse[0].PinStatus != null &&
            value != null
          ) {
            navigation.navigate('SetPin', {
              Employee_Code: json.ArrayOfResponse[0].Employee_Code,
              Email: json.ArrayOfResponse[0].Official_EmaildID,
            });
          }
          else{
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
        setloader(false);
        console.error(error);
      })
      .finally(() => {
        setPassword("");
        setUsername("");
        setloader(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loder Start={loader} />


      <Text style={styles.title}>HRMS</Text>

      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="Role"
        placeholder={!isFocus ? (Role == 0)?'Employee':'Admin' : '...'}
        searchPlaceholder="Search..."
        value={Role}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setRole(item.value);
          setIsFocus(false);
        }}
      />


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
