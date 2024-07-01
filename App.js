
import React,{useEffect,useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  AsyncStorage
} from 'react-native';
import Home from './src/screen/Home.js/Home';
import Mpin from './src/screen/Mpin.js/Mpin';
import Webview from './src/screen/WebView/Webview';
import SetPin from './src/screen/SetPin/SetPin';
import Routes from './src/Navigation/Routes';

const Stack = createStackNavigator();


const  App = (props)=> {


  const [mpinCheck, setmpinCheck] = useState(false)
  // useEffect(() => {

  //   (async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('@Data');
  //       console.log('i am printing the values: ', value);
  //       setmpinCheck(value ? true: false)
  //       if (value !== null) {
          
  //         console.log('i am redirecting');
  //         let data = await JSON.parse(value);
  //         console.log('this is last ', data);
  //         navigation.navigate('Mpin', {
  //           Email: data.Official_EmaildID,
  //         });
  //       }
  //     } catch (error) {
  //       console.log('i am in catch block ', error);
  //     }
  //   })();
  //   return;
  // }, []);

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ animation: 'none' }}>
            <>
            {
                    (Routes(Stack,props.Flag))
            }
            </>
          </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;