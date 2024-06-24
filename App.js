
import React from 'react';
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
} from 'react-native';
import Home from './src/screen/Home.js/Home';
import Mpin from './src/screen/Mpin.js/Mpin';
import Webview from './src/screen/WebView/Webview';

const stack = createStackNavigator();


const  App = ()=> {

  return (
  <NavigationContainer>
    <stack.Navigator>
    <stack.Screen name="Home" component={Home}   options={{headerShown: false}}/>
    <stack.Screen name="Mpin" component={Mpin} />
    <stack.Screen name="Webview" component={Webview} />
    {/* <stack.Screen name="Another" component={Another} /> */}
    </stack.Navigator>
  </NavigationContainer>

   
  );
}

export default App;