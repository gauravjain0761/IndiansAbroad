import './Config';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import RootContainer from './Navigation/RootContainer';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  LogBox,
} from 'react-native';
import ApplicationStyles from './Themes/ApplicationStyles';
import {dispatchAction, setAuthorization} from './utils/apiGlobal';
import {
  getAsyncToken,
  getAsyncUserInfo,
  setAsyncToken,
  setAsyncUserInfo,
} from './utils/AsyncStorage';
import {Provider, useDispatch} from 'react-redux';
import store from './Redux';
import Toast from 'react-native-toast-message';
import {SCREEN_WIDTH, fontname} from './Themes/Fonts';
import colors from './Themes/Colors';
import {FontStyle} from './utils/commonFunction';
import {
  onGetUserInfoApi,
  onLoginApi,
  oncheckSession,
} from './Services/AuthServices';
import Loader from './Components/Loader';
import {SET_USER} from './Redux/ActionTypes';

function App() {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    if (!__DEV__) {
      console.log = () => {};
    }
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
  }, []);

  // useEffect(() => {

  //   checkSession()
  // }, [])

  // const checkSession = async () => {
  //   let token = await getAsyncToken()
  //   console.log(token)
  //   if (token) {
  //     let obj = {
  //       params: {
  //         token: token
  //       },
  //       onSuccess: async (response) => {
  //         await setAuthorization(token)
  //         let user = await getAsyncUserInfo()
  //         console.log('user--', user)
  //         dispatchAction(dispatch, SET_USER, user)
  //         if (user && user._id) {
  //           dispatch(onGetUserInfoApi({
  //             params: {
  //               userId: user._id
  //             }
  //           }))
  //           setTimeout(() => {
  //             setloading(false)
  //           }, 500);
  //         } else {
  //           doLogin()
  //         }
  //       },
  //       onFailure: (error) => {
  //         doLogin()
  //       }
  //     }
  //     dispatch(oncheckSession(obj))
  //   } else {
  //     doLogin()
  //   }
  // }

  // const doLogin = async () => {
  //   let obj = {
  //     data: {
  //       email: 'jadhavharshal.510@gmail.com',
  //       passCode: 'Trtr#789'
  //     },
  //     onSuccess: async (response) => {
  //       setTimeout(() => {
  //         setloading(false)
  //       }, 500);
  //     },
  //     onFailure: (error) => {
  //       setloading(false)
  //     }
  //   }
  //   dispatch(onLoginApi(obj))
  // }

  const toastConfig = {
    success: ({text1, text2, type, props, ...rest}) =>
      type === 'success' && (
        <SafeAreaView>
          <View style={styles.textStyleToastSuccess}>
            <Text style={styles.textStyleToast}>{text1}</Text>
          </View>
        </SafeAreaView>
      ),
    error: ({text1, text2, type, props, ...rest}) => {
      if (type === 'error') {
        return (
          <SafeAreaView>
            <View style={styles.toastStyle}>
              <Text style={styles.textStyleToast}>{text1}</Text>
            </View>
          </SafeAreaView>
        );
      }
    },
  };
  return (
    <View style={ApplicationStyles.applicationView}>
      <RootContainer />
      <Toast config={toastConfig} position="top" topOffset={0} />
    </View>
  );
}
export default App;

const styles = StyleSheet.create({
  toastStyle: {
    backgroundColor: colors.red_ED7C7C,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
    // paddingRight: 50,
    // borderRadius: 5,
    // borderLeftWidth: 6,
    // borderLeftColor: colors.red_ED7C7C,
    // borderWidth: 1.5,
    // borderColor: colors.red_ED7C7C,
  },
  textStyleToastSuccess: {
    backgroundColor: colors.green_20CA60,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
    // paddingRight: 50,
    // borderRadius: 5,
    // borderLeftWidth: 6,
    // borderLeftColor: colors.green_20CA60,
    // borderWidth: 1.5,
    // borderColor: colors.green_20CA60,
  },
  textStyleToast: {
    // marginLeft: hp(2)
    ...FontStyle(16, colors.white),
    textAlign: 'center',
  },
});
