import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
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

  function submit() {
    setloader(true);
    console.log(username, password);
    fetch('http://10.0.2.2:3000/api/Login/LoginHrms', {
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
          alert(json?.message);
          if (json?.Pin != null) {
            navigation.navigate('Mpin', {
              Data: json.ArryOfResponse[o].Official_EmilId,
            });
          } else {
            navigation.navigate('Mpin', {
              Data: json.ArryOfResponse[o].Official_EmilId,
            });
            navigation.navigate('Mpin', {
              Data: json.ArryOfResponse[o].Official_EmilId,
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
      .finally(() => {});
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
      <View style={styles.rememberView}>
        {/* <View style={styles.switch}>
              <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
              <Text style={styles.rememberText}>Remember Me</Text>
          </View> */}
        <View>
          <Pressable onPress={() => Alert.alert('Forget Password!')}>
            <Text style={styles.forgetText}>Forgot Pin?</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={() => submit()}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </View>

      <Text style={styles.footerText}>
        Don't Haven't set the Pin?<Text style={styles.signup}> Set Up Pin</Text>
      </Text>
    </SafeAreaView>
  );
};

export default Home;
