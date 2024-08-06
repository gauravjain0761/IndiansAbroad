import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import colors from '../../Themes/Colors';
import { fontname, hp, wp } from '../../Themes/Fonts';
import { FontStyle } from '../../utils/commonFunction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { screenName } from '../../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../Components/CommonButton';
import Input from '../../Components/Input';

export default function ChangePasswordNew() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={''} showLeft onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView extraScrollHeight={50} style={{ marginHorizontal: wp(16), flex: 1 }}>
        <Text style={styles.headerText}>Change Password</Text>
        <Text style={styles.headerText1}>Please enter your new password</Text>
        <Input value={email} placeholder={'Password'} onChangeText={setEmail} />
        <Input extraStyle={{ marginTop: wp(20) }} value={email} placeholder={'Confirm Password'} onChangeText={setEmail} />

        {/* <TextInput
          placeholder={'Confirm Password'}
          style={styles.inputText}
          value={email}
          onChangeText={setEmail}
        /> */}
        <CommonButton title={'Submit'} onPress={() => {
          navigation.navigate(screenName.Setting);
        }} extraStyle={[styles.btnView]} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.secondary_500,
  },
  itemView: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_400,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp(12),
  },
  imageArrow: {
    transform: [{ rotate: '180deg' }],
    paddingHorizontal: hp(10),
  },
  headerText: {
    ...FontStyle(20, colors.neutral_900, '700'),
  },
  headerText1: {
    marginTop: 3,
    marginBottom: 10,
    ...FontStyle(13, colors.neutral_600, '400'),
  },
  itemText: {
    ...FontStyle(20, colors.neutral_900, '700'),
  },
  inputText: {
    ...FontStyle(14, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 20,
    height: 56
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    // width: '48%',
    marginTop: 30,
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(15, colors.white),
    paddingVertical: 12,
  },
});
