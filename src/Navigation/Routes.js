import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Mpin from '../screen/Mpin.js/Mpin';
import Home from '../screen/Home.js/Home';
import Webview from '../screen/WebView/Webview';
import SetPin from '../screen/SetPin/SetPin';
import VerifyOTP from '../screen/OTP/VerifyOTP';
import FingerPrint from '../screen/FingerPrint/FingerPrint';

const Stack = createStackNavigator();

const Routes = (stack, Flag) => {
  return (
    <>
      {Flag ? (
        <>
          <Stack.Screen name="Mpin" component={Mpin} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen name="HRMS" component={Webview} />
          <Stack.Screen name="SetPin" component={SetPin} />
          <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
          <Stack.Screen name="FingerPrint" component={FingerPrint} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Mpin" component={Mpin} />
          <Stack.Screen name="HRMS" component={Webview} />
          <Stack.Screen name="SetPin" component={SetPin} />
          <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
          <Stack.Screen name="FingerPrint" component={FingerPrint} />
        </>
      )}
    </>
  );
};

export default Routes;
