import {
  View,
  Text,
  Platform,
  BackHandler,
  StatusBar,
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {useRef, useState} from 'react';

// import CryptoJS from "react-native-crypto-js";
import CryptoJS from 'crypto-js';

const Webview = ({route, navigation}) => {
  const ResponseData = route.params.Data;
  console.log('this is before stringify ', ResponseData);
  let FinalData = JSON.stringify(ResponseData);
  console.log('stringified Data: ', FinalData);
  const webView = useRef(null);
  const [NavUrl, setNavUrl] = useState();
  const [cameraPermission, setCameraPermission] = useState(false);
  const [MobileNo, setMobileNo] = useState(null);
  const [interNetConnection, setinterNetConnection] = useState(false);

  const INJECTED_JAVASCRIPT = `
    (function() {
        const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
      })();`;

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', HandleBackPressed);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', HandleBackPressed);
      };
    }
  }, []);

  const HandleBackPressed = () => {
    if (true) {
      webView.current.goBack();
      return true;
    }
    return false;
  };

  const handlePermissionRequest = async permissionRequest => {
    const {resources} = permissionRequest;

    if (resources.includes('camera') || resources.includes('microphone')) {
      permissionRequest.grant(resources);
    } else {
      permissionRequest.deny();
    }
  };

  const injectedJavaScript = `
    (function() {
      const meta = document.createElement('meta');
      meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      meta.setAttribute('name', 'viewport');
      document.getElementsByTagName('head')[0].appendChild(meta);
  
      document.addEventListener('gesturestart', function(event) {
        window.ReactNativeWebView.postMessage('zoom');
      });
    })();
  `;

  const handleMessage = event => {
    if (event.nativeEvent.data === 'zoom') {
      handleZoomEvent(event);
    }
  };

  const handleZoomEvent = event => {
    console.log('Zoom event occurred:', event.nativeEvent.data);
  };

  const MyStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  const keys = '345Nspb#$#479KJN';
  let key = CryptoJS.enc.Utf8.parse(keys);
  let iv = CryptoJS.enc.Utf8.parse(keys);
  let encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(FinalData),
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  FinalData = encrypted.toString();

  let decrypted = CryptoJS.AES.decrypt(FinalData, key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  console.log(
    'encrepted: ',
    encrypted,
    ' Decrypted: ',
    decrypted.toString(CryptoJS.enc.Utf8),
  );

  //let Base_Url=`https://localhost:4200/login/React?Data=${FinalData}`
  let Base_Url = `http://192.168.1.23:8090?Data=${FinalData}`;
  // let Base_Url=`https://192.168.1.24:4200/`
  console.log('final link ', Base_Url);
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <WebView
          allowFileAccess
          ref={webView}
          incognito={true}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          javaScriptEnabled={true}
          source={{uri: Base_Url}}
          style={{flex: 1}}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottm: 100,
  },
  appBar: {
    backgroundColor: '#F26522',
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});

export default Webview;
