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
import PopUp from '../../component/PopUp';

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

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
  const [popup, setpopup] = useState(false);
  const [PopupData, setPopupData] = useState({
    color: '',
    Type: '',
    Message: '',
  });
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (value == '') {
      SetErrors('Please Enter Pin');
    } else if (!value.match('^[0-9]+$')) {
      SetErrors('only Digit is valid');
    } else if (!value.match('^[0-9]{4}$')) {
      SetErrors('Please Enter 4 digit');
    } else {
      SetErrors('');
       setTimeout(() => {
        Submit();
       }, 100);
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

  ResendOTP = () => {
    setloader(true);

    console.log('this is email: ', Dataobj.Official_EmaildID);
    fetch('http://192.168.1.29:8090/api/OTPController/GenerateOTP', {
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
        if (json?.Code == '400') {
          setloader(false);
          setpopupDataFunc('rgb(247, 45, 45)', 'Error', json?.Message);
          setpopup(true);

          setValue('');
          setSubmmited(false);
        } else if (json?.Code == '500') {
          setloader(false);
          setpopupDataFunc('rgb(247, 45, 45)', 'Error', 'Something went wrong');
          setpopup(true);
        } else {
          setloader(false);
          setpopupDataFunc('green', 'Success', 'OTP sended successfully');
          setpopup(true);
        }

        setSubmmited(false);
        setValue('');
      })
      .catch(error => {
        setloader(false);
        setSubmmited(false);
        setValue('');
      })
      .finally(() => {});
  };
  function setpopupDataFunc(color, Type, Message) {
    setPopupData({color: color, Type: Type, Message: Message});
  }

  Submit = () => {
    Keyboard.dismiss();
    setSubmmited(true);
    console.log("Erros is: ",Errors);
    if (Errors) {
      setpopupDataFunc('rgb(247, 45, 45)', 'Warning', Errors);
      setpopup(true);
      return;
    }

    setloader(true);

    fetch('http://192.168.1.29:8090/api/OTPController/VerifyOTP', {
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
          setloader(false);
          setpopupDataFunc('rgb(247, 45, 45)', 'Incorrect', json?.Message);
          setpopup(true);

          setSubmmited(false);
          setValue('');
        } else if (json?.Code == '500') {
          setpopupDataFunc('rgb(247, 45, 45)', 'Error', 'something went wrong');
          setpopup(true);
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

  function Ok() {
    setpopup(false);
  }

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.root}>
        <Loder Start={loader} />
        <PopUp
          Start={popup}
          Func={() => Ok()}
          Message={PopupData.Message}
          color={PopupData.color}
          Type={PopupData.Type}
        />
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
          <Text style={{color: 'red'}}>
            {Errors && Submmited ? Errors : ''}
          </Text>
        </View>
        <View style={styles.nextButton}>
          <Text onPress={() => Submit()} style={styles.nextButtonText}>
            Verify
          </Text>
        </View>
        <Text style={styles.footerText}>
          <Text onPress={() => ResendOTP()} style={{color: 'blue'}}>
            Resend OTP
          </Text>
        </Text>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
}
