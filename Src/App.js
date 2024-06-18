import './Config';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import RootContainer from './Navigation/RootContainer';
import { View, Text, TextInput, SafeAreaView, StyleSheet, LogBox } from 'react-native';
import ApplicationStyles from './Themes/ApplicationStyles';
import { setAuthorization } from './utils/apiGlobal';
import { setAsyncToken, setAsyncUserInfo } from './utils/AsyncStorage';
import { Provider } from 'react-redux';
import store from './Redux';
import Toast from 'react-native-toast-message';
import { SCREEN_WIDTH, fontname } from './Themes/Fonts';
import colors from './Themes/Colors';
import { FontStyle } from './utils/commonFunction';

function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      'Cannot update a component from inside the function',
      'You specified `onScroll` on a <ScrollView> but not `scrollEventThrottle`.',
    ]);
    if (!__DEV__) {
      console.log = () => { };
    }
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
  }, []);

  useEffect(() => {
    setAsyncUserInfo(JSON.stringify({
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzMzMWVjZGQyNzMwNGU1YzM5MzE2NyIsInR5cGUiOiJhcHB1c2VyIiwiaWF0IjoxNzE4NzA1MTQ4LCJleHAiOjE3MjA3Nzg3NDh9.KcqAcnemPMYjFGjSIr-XghGto59K7RDUHPMzXP-4Hlc",
      "err": 200,
      "msg": "Logged in successfully",
      "data": {
        "_id": "663331ecdd27304e5c393167",
        "avtar": "",
        "userAvatar": {
          "key": "",
          "metadata": "",
          "location": "",
          "contentType": "",
          "cdnlocation": ""
        },
        "first_Name": "Abhishek",
        "last_Name": "Harshe",
        "email": "abhiharshe1191@gmail.com",
        "gender": "male",
        "birthDate": "01/01/1993",
        "city": "Kolhapur",
        "district": "Kolhapur",
        "state": "Maharastra",
        "country": "Canada",
        "countryId": {
          "_id": "651ba7da115e1b0accdf8129",
          "countryName": "Canada"
        },
        "region": "Brampton",
        "universityORcompany": "207-Feet Cakes and Chocolates",
        "phonenumber": "+918983185204",
        "language": [],
        "isVerified": false,
        "otp": 0,
        "catchLine": "",
        "passCode": "$2a$10$DStlsbngwRR7DZ1Rqd/wFO7ifThOmecqSw9c/8RT8m/jaIr33s0by",
        "step": "2",
        "followers": 0,
        "following": 0,
        "key": "",
        "isOnline": "0",
        "subscribedMember": true,
        "subscriptionPlanId": "64d3767d313efe85449595d7",
        "plan": "basic",
        "planExpiryDate": "2024-05-02T06:23:01.676Z",
        "firebaseToken": "",
        "accountDeleted": false,
        "deletedAt": "",
        "createdAt": "2024-05-02T06:25:48.962Z",
        "updatedAt": "2024-06-18T10:05:21.897Z",
        "__v": 0,
        "app_features": {
          "signin": true,
          "signup": true,
          "browsing": true,
          "post": true,
          "chat": true,
          "discussion_thread": {
            "browse": true,
            "crud": true
          },
          "community_pages": {
            "browse": true,
            "join": true,
            "crud": true
          }
        }
      }
    }))
    setAsyncToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzMzMWVjZGQyNzMwNGU1YzM5MzE2NyIsInR5cGUiOiJhcHB1c2VyIiwiaWF0IjoxNzE4NzA1MTQ4LCJleHAiOjE3MjA3Nzg3NDh9.KcqAcnemPMYjFGjSIr-XghGto59K7RDUHPMzXP-4Hlc')
    setAuthorization('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzMzMWVjZGQyNzMwNGU1YzM5MzE2NyIsInR5cGUiOiJhcHB1c2VyIiwiaWF0IjoxNzE4NzA1MTQ4LCJleHAiOjE3MjA3Nzg3NDh9.KcqAcnemPMYjFGjSIr-XghGto59K7RDUHPMzXP-4Hlc')
  }, [])

  const toastConfig = {
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
  return (
    <Provider store={store}>
      <View style={ApplicationStyles.applicationView}>
        <RootContainer />
        <Toast
          config={toastConfig}
          position="top"
          topOffset={0}
        />
      </View>
    </Provider>

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
    ...FontStyle(fontname.actor_regular, 16, colors.white),
    textAlign: 'center'
  },
});