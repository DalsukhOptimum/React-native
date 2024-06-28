import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
// import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setloader] = useState(false);
  const [Role, setRole] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [Errors, setErrors] = useState({Email: '', Password: ''});
  const [IsErrors, setIsErrors] = useState(false);
  const [Submmited, setSubmmited] = useState(false);

  const data = [
    {label: 'Employee', value: '0'},
    {label: 'Admin', value: '1'},
  ];

  useEffect(() => {
    validation();
  }, [username, password]);

  function validation() {
    setIsErrors(false);
    let RecordError = Errors;
    console.log('my username ', username);
    console.log(Submmited);

    let cnt = 0;

    if (username == '') {
      console.log('this is here');
      RecordError.Email = 'Please Enter Email';
      setIsErrors(true);
    } else if (!username.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')) {
      RecordError.Email = 'Please Enter Valid Email';
      setIsErrors(true);
    } else {
      RecordError.Email = '';
      cnt++;
    }

    if (password == '') {
      RecordError.Password = 'Please Enter Password';
      setIsErrors(true);
    } else {
      RecordError.Password = '';
      cnt++;
    }
    if (cnt == 2) {
      setIsErrors(false);
    }

    setErrors(RecordError);
    console.log(IsErrors);
  }

  function submit() {
    setSubmmited(true);
    console.log('before going ', Submmited);
    validation();
    console.log('after coming, ', IsErrors);
    if (IsErrors == true) {
      alert('Enter valid');
      return;
    }

    setloader(true);
    console.log(username, password);
    fetch('http://localhost:3446/api/Login/LoginHrms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: Role,
        username: username,
        password: password,
      }),
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
            try {
              AsyncStorage.clear();
              await AsyncStorage.setItem(
                '@Data',
                JSON.stringify(json.ArrayOfResponse[0]),
              );
            } catch (error) {
              console.log('error aaya ', error);
            }

            navigation.navigate('Mpin',{Email:json.ArrayOfResponse[0].Official_EmaildID});
          } else if (
            json?.ArrayOfResponse[0].PinStatus != null &&
            value != null
          ) {
            navigation.navigate('SetPin', {
              Employee_Code: json.ArrayOfResponse[0].Employee_Code,
              Email: json.ArrayOfResponse[0].Official_EmaildID,
            });
          } else {
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
        setPassword('');
        setUsername('');
        setErrors({Email: '', Password: ''});
        setSubmmited(false);
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
        placeholder={!isFocus ? (Role == 0 ? 'Employee' : 'Admin') : '...'}
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
          onChange={() => {}}
          onChangeText={value => {
            setUsername(value);
          }}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Text style={{color: 'red'}}>
          {Errors.Email && Submmited ? Errors.Email : ''}
        </Text>
        <TextInput
          style={[styles.input, {marginTop: 10}]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChange={() => {}}
          onChangeText={value => {
            setPassword(value);
          }}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Text style={{color: 'red'}}>
          {Errors.Password && Submmited ? Errors.Password : ''}
        </Text>
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
