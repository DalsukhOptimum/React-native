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
import PopUp from '../../component/PopUp';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
// import LOGOSVG from "../../assets/OptimumLogo.svg";
// import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const logo = require('../../assets/logo1.png');

const Home = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setloader] = useState(false);
  const [Role, setRole] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [Errors, setErrors] = useState({Email: '', Password: ''});
  const [popup, setpopup] = useState(false);
  const [PopupData, setPopupData] = useState({
    color: '',
    Type: '',
    Message: '',
  });

  const [Submmited, setSubmmited] = useState(false);
  // const colorScheme = useColorScheme();

  const data = [
    {label: 'Employee', value: '0'},
    {label: 'Admin', value: '1'},
  ];

  function setpopupDataFunc(color, Type, Message) {
    setPopupData({color: color, Type: Type, Message: Message});
  }

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
      setpopupDataFunc('rgb(247, 45, 45)', 'warning', 'Please Fill The valid Data');
      setpopup(true);

      return;
    }

    setloader(true);
    console.log(username, password);
    fetch('http://62.171.164.201:8088/api/Login/LoginHrms', {
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
          setloader(false);
          setpopupDataFunc('rgb(247, 45, 45)', 'Login Failed', 'Incorrect Username or Password');
          setpopup(true);
          setPassword('');
          setUsername('');
          setErrors({Email: '', Password: ''});

          setSubmmited(false);
        }
        if (json?.status == 'success') {
          let Data = json?.ArrayOfResponse[0];
          fetch('http://62.171.164.201:8088/api/OTPController/GenerateOTP', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Official_EmaildID: ((json?.ArrayOfResponse[0].Official_EmaildID) =='admin@optimumfintech.co.in')?'santosh.n@optimumfintech.com':json?.ArrayOfResponse[0].Official_EmaildID,
            }),
          })
            .then(resp => resp.json())
            .then(async json => {
              let value;
              if (json?.Code == '400') {
              
                setpopupDataFunc('rgb(247, 45, 45)', 'Error', 'Something went wrong');
                setpopup(true);
                setPassword('');
                setUsername('');
                setErrors({Email: '', Password: ''});

                setloader(false);

                setSubmmited(false);
              } else if (json?.Code == '500') {
                setloader(false);
                setPassword('');
                setUsername('');
                setpopupDataFunc('rgb(247, 45, 45)', 'Error', 'Something went wrong');
                setpopup(true);

               
                setErrors({Email: '', Password: ''});

               

                setSubmmited(false);
              } else {
                setPassword('');
                setUsername('');
                setErrors({Email: '', Password: ''});

                setloader(false);

                setSubmmited(false);

                navigation.navigate('VerifyOTP', {
                  Data: Data,
                });
              }
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

  function Ok() {
    setpopup(false);
  }

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
  );
};

export default Home;
