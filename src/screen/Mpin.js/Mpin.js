import { View, Text,SafeAreaView,TextInput,Pressable,AsyncStorage } from 'react-native'
//  import {AsyncStorage} from '@react-native-async-storage/async-storage'
import React, {useState} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';



// submit = () => {
//   console.log("Hello")
// }
const Mpin = ({route,navigation}) => {
  const [loader, setloader] = useState(false);
  const [pin, setpin] = useState('');


      const  Email = route.params.Email  ;
      console.log("This is Verify pin dataL: ",Email)


      LoginPgae = () => {
        navigation.navigate('Home',);
      }

       submit  =  () =>{
    fetch('http://localhost:3446/api/PINOperation/VerifyPin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Official_EmaildID: Email, Pin:pin}),
      })
        .then(resp => resp.json())
        .then(async json => {
          if(json?.Code == "400" || json?.Code == "500"){
              alert(json?.Message)
          }
          if(json?.Code == "200"){
           
            try{
              await  AsyncStorage.setItem('@Data',JSON.stringify(json.ArrayOfResponse[0]));
              
            }
            catch(error)
            {
              console.log("error aaya ",error);
            }
            alert(json?.Message)
            navigation.navigate('Webview', {Data: json.ArrayOfResponse[0]});
          
       
          
          }
          else{
            alert(json?.Message);
          }
  
          console.log(json);
          setloader(false)
        })
        .catch(error => {
          setloader(true)
          console.error(error)
      })
        .finally(() => {});
   
}



 
    // const {Data} = route.params.Data

    // console.log(Email);
    console.log("Data: ",route.params.Data );
  return (
    <SafeAreaView style={styles.container}>
    <Loder Start={loader}/>
  <Text style={styles.title}>Verify Pin</Text>
  <View style={styles.inputView}>
  
    <TextInput
      style={[styles.input,{marginTop: 10}]}
      placeholder="PIN"
      secureTextEntry
      value={pin}
      onChangeText={setpin}
      autoCorrect={false}
      autoCapitalize="none"
    />
  </View>

  <View style={styles.buttonView}>
    <Pressable style={styles.button} onPress={() => submit()}>
      <Text style={styles.buttonText}>LOGIN</Text>
    </Pressable>
    <Text style={styles.footerText}>
       Forget Pin?<Text onPress={() => LoginPgae()}  style={styles.signup}> Set Up Pin</Text>
    </Text>
  </View>


</SafeAreaView>
  )
}

export default Mpin