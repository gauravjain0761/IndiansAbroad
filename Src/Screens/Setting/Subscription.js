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
import {SCREEN_WIDTH, fontname, hp, wp} from '../../Themes/Fonts';
import {FontStyle} from '../../utils/commonFunction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {screenName} from '../../Navigation/ScreenConstants';

export default function Subscription() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const [selectTab, setSelectTab] = useState(0);

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header title={''} showLeft onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView style={{marginHorizontal: wp(16), flex: 1}}>
        <Text style={styles.headerText}>Subscription</Text>

        <TouchableOpacity
          style={[styles.btnView, {}]}
          onPress={() => {
            navigation.navigate(screenName.ChangePhoneVerify);
          }}>
          <Text style={styles.btnText}>Change payment method</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={[styles.autoBtn, {}]}
            onPress={() => {
              navigation.navigate(screenName.ChangePhoneVerify);
            }}>
            <Text style={styles.btnText}>Auto renewal</Text>
          </TouchableOpacity>
          <View style={styles.topHeader}>
            <TouchableOpacity
              onPress={() => setSelectTab(0)}
              style={[
                styles.btnStyle1,
                {
                  backgroundColor:
                    selectTab == 0 ? colors.white : colors.buttonBlue,
                },
              ]}>
              <Text
                style={[
                  styles.btnText1,
                  {
                    color:
                      selectTab == 0 ? colors.buttonBlue : colors.white,
                  },
                ]}>
                On
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectTab(1)}
              style={[
                styles.btnStyle1,
                {
                  backgroundColor:
                    selectTab == 1 ? colors.white : colors.primary_6a7e,
                },
              ]}>
              <Text
                style={[
                  styles.btnText1,
                  {
                    color:
                      selectTab == 1 ? colors.primary_4574ca : colors.white,
                  },
                ]}>
                Off
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: 50,
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
    marginTop: 10,
    width: SCREEN_WIDTH * 0.76,
  },
  codeText: {
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingLeft: 12,
    paddingVertical: 6,
    marginTop: 10,
    marginRight: 15,
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    // width: '48%',
    marginTop: 65,
  },
  autoBtn: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    width: '72%',
    marginTop: 64,
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 16, colors.white),
    paddingVertical: 12,
  },
  btnText1: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 16, colors.white),
    paddingVertical: 6,
  },
  btnStyle1: {
    width: SCREEN_WIDTH * 0.24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 2,
    width: '49%',
  },
  topHeader: {
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: colors.buttonBlue,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 5,
    width: '25%',
    marginTop: 53,
    marginLeft:10
  },
});
