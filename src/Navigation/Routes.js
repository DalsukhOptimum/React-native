import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Mpin from '../screen/Mpin.js/Mpin';
import Home from '../screen/Home.js/Home';
import Webview from '../screen/WebView/Webview';
import SetPin from '../screen/SetPin/SetPin';

const Stack = createStackNavigator();

const Routes = (stack,Flag) => {
  return (
    <>
   {Flag ? 
   <>
     <Stack.Screen name="Mpin" component={Mpin} />
     <Stack.Screen name="Home" component={Home}   options={{headerShown: false}}/>
     <Stack.Screen name="Webview" component={Webview} />
     <Stack.Screen name="SetPin" component={SetPin} />
     </>
     :
     <>
     <Stack.Screen name="Home" component={Home}   options={{headerShown: false}}/>
     <Stack.Screen name="Mpin" component={Mpin} />
     <Stack.Screen name="Webview" component={Webview} />
     <Stack.Screen name="SetPin" component={SetPin} />
     </>}
    </>
  )
}

export default Routes