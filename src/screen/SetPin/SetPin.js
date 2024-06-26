import { View, Text, SafeAreaView,TextInput,Pressable } from 'react-native'
import React, {useState} from 'react';
import {styles} from './Style';
import Loder from '../../component/Loder';


export default function SetPin({route,navigation}) {

    const [click, setClick] = useState(false);
    const [username, setUsername] = useState('');
    const [pin, setpin] = useState('');
    const [loader, setloader] = useState(false);
    const Employee_Code = route.params.Employee_Code ;
    const Email = route.params.Email ;

    console.log("set pin: ",Email)

    submit =() => {

        fetch('http://localhost:3446/api/PINOperation/GeneratePin', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({Employee_Code: Employee_Code, Pin: pin}),
          })
            .then(resp => resp.json())
            .then(json => {
              if (json?.Code == '400' || json?.Code == '500' ) {
                alert(json?.Message);
              }
              if (json?.Code == '200') {
                alert(json?.Message);

                navigation.navigate('Mpin', {
                    Email: Email,
                  });
              
              }
      
              console.log(json);
              setloader(false);
            })
            .catch(error => {
              setloader(false);
              console.error(error);
            })
            .finally(() => {
              setloader(false);
            });



    }

   console.log("this is Employee Code: ", Employee_Code )
  return (
    <SafeAreaView style={styles.container}>
     <Loder Start={loader}/>
  <Text style={styles.title}>Set Pin</Text>
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
      <Text style={styles.buttonText}>SUBMIT</Text>
    </Pressable>
  </View> 


</SafeAreaView>
  )
}