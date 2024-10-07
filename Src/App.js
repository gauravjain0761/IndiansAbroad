import './Config';
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { dispatchAction, setAuthorization } from './utils/apiGlobal';
import {
  getAsyncToken,
  getAsyncUserInfo,
  setAsyncToken,
  setAsyncUserInfo,
} from './utils/AsyncStorage';
import { Provider, useDispatch } from 'react-redux';
import store from './Redux';
import Toast from 'react-native-toast-message';
import { SCREEN_WIDTH, fontname } from './Themes/Fonts';
import colors from './Themes/Colors';
import { FontStyle } from './utils/commonFunction';
import {
  onGetUserInfoApi,
  onLoginApi,
  oncheckSession,
} from './Services/AuthServices';
import Loader from './Components/Loader';
import { SET_USER } from './Redux/ActionTypes';
import { StripeProvider } from '@stripe/stripe-react-native';
import { api } from './utils/apiConstants';
import { withIAPContext } from 'react-native-iap';


export const toastConfig = {
  success: ({ text1, text2, type, props, ...rest }) =>
    type === 'success' && (
      <SafeAreaView>
        <View style={styles.textStyleToastSuccess}>
          <Text style={styles.textStyleToast}>{text1}</Text>
        </View>
      </SafeAreaView>
    ),
  error: ({ text1, text2, type, props, ...rest }) => {
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

function App() {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    if (!__DEV__) {
      console.log = () => { };
    }
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
  }, []);

  return (
    <StripeProvider
      publishableKey={api.PUBLIC_KEY_STRIPE}
      merchantIdentifier="merchant.online.indiansabroad" // required for Apple Pay
    >
      <View style={ApplicationStyles.applicationView}>
        <RootContainer />
        <Toast config={toastConfig} position="top" topOffset={0} />
      </View>
    </StripeProvider>
  );
}
export default withIAPContext(App);

const styles = StyleSheet.create({
  toastStyle: {
    backgroundColor: colors.red_ED7C7C,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
  },
  textStyleToastSuccess: {
    backgroundColor: colors.green_20CA60,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: SCREEN_WIDTH,
  },
  textStyleToast: {
    ...FontStyle(16, colors.white),
    textAlign: 'center',
  },
});
