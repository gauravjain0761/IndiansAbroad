import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import colors from '../../Themes/Colors';
import {fontname, hp, wp} from '../../Themes/Fonts';
import {FontStyle} from '../../utils/commonFunction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {screenName} from '../../Navigation/ScreenConstants';

export default function ChangePasswordEmail() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  return (
    <View style={ApplicationStyles.applicationView}>
      <Header title={''} showLeft onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView style={{marginHorizontal: wp(16), flex: 1}}>
        <Text style={styles.headerText}>Change Password</Text>
        <Text style={styles.headerText1}>
          To change your password please enter your email address.
        </Text>
        <TextInput
          placeholder={'Email Address'}
          style={styles.inputText}
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity
          style={[styles.btnView, {}]}
          onPress={() => {
            navigation.navigate(screenName.ChangePasswordVerify);
          }}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
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
    transform: [{rotate: '180deg'}],
    paddingHorizontal: hp(10),
  },
  headerText: {
    ...FontStyle(fontname.abeezee, 20, colors.neutral_900, '700'),
  },
  headerText1: {
    marginTop: 3,
    ...FontStyle(fontname.abeezee, 13, colors.neutral_600, '400'),
  },
  itemText: {
    ...FontStyle(fontname.abeezee, 20, colors.neutral_900, '700'),
  },
  inputText: {
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingLeft: 12,
    paddingVertical: 6,
    marginTop: 20,
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
    ...FontStyle(fontname.actor_regular, 15, colors.white),
    paddingVertical: 12,
  },
});
