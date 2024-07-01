import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
// import LOGOSVG from "../../assets/OptimumLogo.svg";
// import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';



const logo = require("../../assets/logo1.png")

const Home = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setloader] = useState(false);
  const [Role, setRole] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [Errors, setErrors] = useState({Email: '', Password: ''});

  const [Submmited, setSubmmited] = useState(false);

  const data = [
    {label: 'Employee', value: '0'},
    {label: 'Admin', value: '1'},
  ];

  // useEffect(() => {
  //   validation();
  // }, [username, password]);

  function validation(username,password) {
    let RecordError = Errors;

    if (username == "") {
      console.log('this is here');
      RecordError.Email = 'Please Enter Email';
    } else if (!username?.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')) {
      RecordError.Email = 'Please Enter Valid Email';
    } else {
      RecordError.Email = "";
    }

    if (password == "") {
      RecordError.Password = 'Please Enter Password';
    } else {
      RecordError.Password = "";
    }

    setErrors(RecordError);
  }

  function submit() {
    setSubmmited(true);
    console.log('before going ', Submmited);
    validation(username,password);

    if (Errors.Email != '' || Errors.Password != '') {
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
          alert("No User Found");
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

            navigation.navigate('Mpin', {
              Email: json.ArrayOfResponse[0].Official_EmaildID,
            });
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
        setSubmmited(false);
      })
      .catch(error => {
        setloader(false);
        console.error(error);
      })
      .finally(() => {
        setPassword('');
        setUsername('');
        setErrors({Email: '', Password: ''});
       
        setloader(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loder Start={loader} />

       <Text style={styles.title}>HRMS</Text> 

    <View style={styles.Form}>
    
   {/* <Image source={logo} style={styles.image} resizeMode='contain' />   */}

      <Dropdown 
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        // optionsTextStyle={styles.optionsTextStyle}
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

      <View style={styles.placeholderStyle}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            value={username}
             onChangeText={(value)   =>{
              setUsername(value);
              validation(value,password);

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
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(value)=>{
              setPassword(value);
              validation(username,value);
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
        <Pressable style={styles.button} onPress={() => submit()}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </View>
   </View>
    </SafeAreaView>
  );
};

export default Home;
