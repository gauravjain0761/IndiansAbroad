import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { Icons } from '../../Themes/Icons';
import colors from '../../Themes/Colors';
import {
  FontStyle,
  ImageStyle,
  emailCheck,
  errorToast,
} from '../../utils/commonFunction';
import { fontname, wp } from '../../Themes/Fonts';
import Input from '../../Components/Input';
import CommonButton from '../../Components/CommonButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { onLoginApi } from '../../Services/AuthServices';
import { resetNavigation } from '../../utils/Global';
import Header from '../../Components/Header';
import { requestNotificationUserPermission } from '../../Config/firebaseConfig';

export default function LoginScreen() {
  const [email, setemail] = useState(
    __DEV__ ? 'jadhavharshal.510@gmail.com' : '',
  );
  const [password, setpassword] = useState(__DEV__ ? 'Trtr#789' : '');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    requestNotificationUserPermission();
  }, []);

  const onLogin = () => {
    if (!emailCheck(email.trim())) {
      errorToast('Please enter a valid email');
    } else if (password == '') {
      errorToast('Please enter password');
    } else {
      let obj = {
        data: {
          email: email.trim(),
          passCode: password,
        },
        onSuccess: async response => { },
      };
      dispatch(onLoginApi(obj));
    }
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header title={''} />
          <View style={styles.transparent}>
            <Image source={Icons.logo} style={ImageStyle(90, 90)} />
            <Text style={ApplicationStyles.titleText}>IndiansAbroad</Text>
          </View>
          <View style={{ marginHorizontal: wp(20) }}>
            <Text style={styles.loginText}>Login</Text>
            <Text style={styles.des}>Enter email address for login</Text>
            <Input
              keyboardType={'email-address'}
              value={email}
              placeholder={'Email Address'}
              onChangeText={text => setemail(text)}
            />
            <View style={styles.hightView} />
            <Input
              value={password}
              placeholder={'Password'}
              onChangeText={text => setpassword(text)}
              isPassword
            />
            <TouchableOpacity
              onPress={() => navigation.navigate(screenName.ForgotPassword)}
              style={styles.forotView}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
            <CommonButton title={'Login'} onPress={() => onLogin()} />
            <TouchableOpacity
              onPress={() => navigation.navigate(screenName.SecurityScreen)}
              style={styles.signUpView}>
              <Text style={styles.signUpText}>
                Not a member yet?{' '}
                <Text style={{ color: colors.primary_500 }}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  transparent: {
    // paddingTop: 15,
    // backgroundColor: colors.whiteOpacity,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  loginText: {
    ...FontStyle(24, colors.white, '700'),
    alignSelf: 'center',
    marginVertical: 10,
  },
  des: {
    ...FontStyle(16, colors.white),
    alignSelf: 'center',
    marginBottom: 20,
  },
  hightView: {
    marginTop: 20,
  },
  forotView: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    ...FontStyle(14, colors.white),
    paddingVertical: 15,
  },
  signUpView: {
    marginTop: 10,
    alignSelf: 'center',
  },
  signUpText: {
    ...FontStyle(14, colors.white),
    marginVertical: 10,
  },
});
