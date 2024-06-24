import { View, Text } from 'react-native'
import React from 'react'
import {styles} from './Style';


submit = () =>{
    fetch('api/PINOperation/GeneratePin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Email: Email, Pin:password}),
      })
        .then(resp => resp.json())
        .then(json => {
          if(json?.status == "Error"){
              alert(json?.message)
          }
          if(json?.Code == 1){
            navigation.navigate('Webview', {Data: json});
          }
          else{
            alert(json?.message);
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

const Mpin = ({route,navigation}) => {
    const [password, setPassword] = useState('');
    const {Email} = route.params

    console.log(Email);
  return (
    <SafeAreaView style={styles.container}>
    <Loder Start={loader}/>
  <Text style={styles.title}>Verify Pin</Text>
  <View style={styles.inputView}>
  
    <TextInput
      style={[styles.input,{marginTop: 10}]}
      placeholder="PIN"
      secureTextEntry
      value={password}
      onChangeText={setPassword}
      autoCorrect={false}
      autoCapitalize="none"
    />
  </View>

  <View style={styles.buttonView}>
    <Pressable style={styles.button} onPress={() => submit()}>
      <Text style={styles.buttonText}>LOGIN</Text>
    </Pressable>
  </View>


</SafeAreaView>
  )
}

export default Mpin