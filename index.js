/**
 * @format
 */
import React from 'react'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';


const index = () =>{

}
    AppRegistry.registerRunnable(appName, async initialProps => {
        try {  
            const value = await AsyncStorage.getItem('@Data');
            const props = {Flag:value?true:false };
            const MyComponent = () => <App {...props} />;
              AppRegistry.registerComponent(appName, () => MyComponent);
             AppRegistry.runApplication(appName, initialProps);
        } catch (err) {
          console.log(err);
        }
      });


export default index;

// AppRegistry.registerComponent(appName, () => App);
