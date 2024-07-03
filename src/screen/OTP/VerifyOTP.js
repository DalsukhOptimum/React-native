import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  View,
  Keyboard,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Loder from '../../component/Loder';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './style';

const {Value, Text: AnimatedText} = Animated;

const CELL_COUNT = 4;
const source = {
  uri: 'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

export default function VerifyOTP({route, navigation}) {
  const [value, setValue] = useState('');
  const [loader, setloader] = useState(false);
  const [Errors, SetErrors] = useState('');
  const [Submmited, setSubmmited] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (!value) {
      SetErrors('Please Enter Pin');
    } else if (!value.match('^[0-9]{4}$')) {
      SetErrors('only 4 Digit is valid');
    } else {
      SetErrors('');
    }
  }, [value]);

  const Dataobj = route.params?.Data;

  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };


  ResendOTP = ()=>{

   setloader(true);
    fetch('http://localhost:3446/api/OTPController/GenerateOTP', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Official_EmaildID: Dataobj.Official_EmaildID,
      }),
    })
      .then(resp => resp.json())
      .then(async json => {
        let value;
        if (json?.Code == '400') {
          alert(json?.Message);
          setValue('');
          setSubmmited(false);
        }
        else if(json?.Code == '500')
          {
            alert("Something went wrong");
          }
        else {
          alert("Otp Sended Successfully..");
        }

        setloader(false);
        setSubmmited(false);
        setValue('');
      })
      .catch(error => {
        setloader(false);
        setSubmmited(false);
        setValue('');
      })
      .finally(() => {});

  }

  Submit = () => {
    Keyboard.dismiss();
    setSubmmited(true);
    if (Errors) {
      alert('Please Enter valid pin');
      return;
    }

    setloader(true);

    fetch('http://localhost:3446/api/OTPController/VerifyOTP', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Official_EmaildID: Dataobj.Official_EmaildID,
        OTP: value,
      }),
    })
      .then(resp => resp.json())
      .then(async json => {
        let Stoargevalue;
        if (json?.Code == '400') {
          alert(json?.Message);
          setloader(false);
          setSubmmited(false);
          setValue('');
        } else if (json?.Code == '500') {
          alert('something went wrong');
        } else {
          try {
            Stoargevalue = await AsyncStorage.getItem('@Data');
            console.log('i am printing the values: ', Stoargevalue);
          } catch (error) {
            console.log('i am in catch block ', error);
          }

          if (Dataobj.PinStatus != null && Stoargevalue == null) {
            try {
              AsyncStorage.clear();
              await AsyncStorage.setItem('@Data', JSON.stringify(Dataobj));
            } catch (error) {
              console.log('error aaya ', error);
            }

            navigation.navigate('Mpin', {
              Email: Dataobj.Official_EmaildID,
            });
          } else if (Dataobj.PinStatus != null && Stoargevalue != null) {
            navigation.navigate('SetPin', {
              Employee_Code: Dataobj.Employee_Code,
              Email: Dataobj.Official_EmaildID,
            });
          } else {
            navigation.navigate('SetPin', {
              Employee_Code: Dataobj.Employee_Code,
              Email: Dataobj.Official_EmaildID,
            });
          }
        }

        console.log(json);
        setloader(false);
        setSubmmited(false);
        setValue('');
      })
      .catch(error => {
        setloader(false);
        setSubmmited(false);
        setValue('');
        console.error(error);
      })
      .finally(() => {});
  };

  return (
    <SafeAreaView style={styles.root}>
      <Loder Start={loader} />
      <Text style={styles.title}>Verification</Text>
      {/* <Image style={styles.icon} source={source} /> */}
      <Text style={styles.subTitle}>
        Please enter the verification code{'\n'}
        we send to your email address
      </Text>

      <CodeField
        onSubmitEditing={event => {
          Keyboard.dismiss();
          Submit();
        }}
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      <View style={{marginTop: 10, marginLeft: 100}}>
        <Text style={{color: 'red'}}>{Errors && Submmited ? Errors : ''}</Text>
      </View>
      <View style={styles.nextButton}>
        <Text onPress={() => Submit()} style={styles.nextButtonText}>
          Verify
        </Text>
      </View>
      <Text style={styles.footerText}>
        <Text onPress={() => ResendOTP()} style={{color:'blue'}}>
   
          Resend OTP
        </Text>
      </Text>
    </SafeAreaView>
  );
}
