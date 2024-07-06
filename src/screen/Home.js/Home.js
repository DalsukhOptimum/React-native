import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from 'react-native';
// import LOGOSVG from "../../assets/OptimumLogo.svg";
// import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../../assets/logo1.png');

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const Home = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setloader] = useState(false);
  const [Role, setRole] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [Errors, setErrors] = useState({Email: '', Password: ''});

  const [Submmited, setSubmmited] = useState(false);
  const colorScheme = useColorScheme();

  const data = [
    {label: 'Employee', value: '0'},
    {label: 'Admin', value: '1'},
  ];

  function validation(username, password) {
    let RecordError = Errors;

    if (username == '') {
      console.log('this is here');
      RecordError.Email = 'Please Enter Email';
    } else if (!username?.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')) {
      RecordError.Email = 'Please Enter Valid Email';
    } else {
      RecordError.Email = '';
    }

    if (password == '') {
      RecordError.Password = 'Please Enter Password';
    } else {
      RecordError.Password = '';
    }

    setErrors(RecordError);
  }

  function submit() {
    setSubmmited(true);
    console.log('before going ', Submmited);
    validation(username, password);

    if (Errors.Email != '' || Errors.Password != '') {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning',
        textBody: "Please Enter Valid Details",
      });

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
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: 'Incorrect username or Password',
            button: 'close',
          });
          setPassword('');
          setUsername('');
          setErrors({Email: '', Password: ''});

          setloader(false);

          setSubmmited(false);
        }
        if (json?.status == 'success') {
          let Data = json?.ArrayOfResponse[0];
          fetch('http://localhost:3446/api/OTPController/GenerateOTP', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Official_EmaildID: json?.ArrayOfResponse[0].Official_EmaildID,
            }),
          })
            .then(resp => resp.json())
            .then(async json => {
              let value;
              if (json?.Code == '400') {
                Toast.show({
                  type: ALERT_TYPE.DANGER,
                  title: 'Warning',
                  textBody: json?.Message,
                });
              } else if (json?.Code == '500') {
                Toast.show({
                  type: ALERT_TYPE.DANGER, 
                  title: 'Warning',
                  textBody: json?.Message,
                });
              } else {
                navigation.navigate('VerifyOTP', {
                  Data: Data,
                });
              }

              setPassword('');
              setUsername('');
              setErrors({Email: '', Password: ''});

              setloader(false);

              setSubmmited(false);
            })
            .catch(error => {
              setPassword('');
              setUsername('');
              setErrors({Email: '', Password: ''});
              setloader(false);

              setSubmmited(false);
            })
            .finally(() => {});
        }
      })
      .catch(error => {
        setloader(false);
        console.error(error);
      })
      .finally(() => {});
  }

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.container}>
        <Loder Start={loader} />

        <Text style={styles.title}>HRMS</Text>

        <View style={styles.Form}>
          {/* <Image source={logo} style={styles.image} resizeMode='contain' />   */}
          <View style={styles.placeholderStyle}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={styles.ContainerStyle}
              itemTextStyle={styles.ItemStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="Role"
              placeholder={
                !isFocus ? (Role == 0 ? 'Employee' : 'Admin') : '...'
              }
              searchPlaceholder="Search..."
              value={Role}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setRole(item.value);
                setIsFocus(false);
              }}
            />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={styles.input}
                placeholderTextColor="black"
                placeholder="EMAIL"
                value={username}
                onChangeText={value => {
                  setUsername(value);
                  validation(value, password);
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </TouchableWithoutFeedback>
            <Text style={{color: 'red'}}>
              {Errors.Email && Submmited ? Errors.Email : ''}
            </Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={styles.input}
                placeholderTextColor="black"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  validation(username, value);
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </TouchableWithoutFeedback>
            <Text style={{color: 'red'}}>
              {Errors.Password && Submmited ? Errors.Password : ''}
            </Text>
          </View>
          <View style={styles.rememberView}></View>

          <View style={styles.placeholderStyle}>
            <Pressable style={styles.nextButton} onPress={() => submit()}>
              <Text style={styles.nextButtonText}>LOGIN</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default Home;
