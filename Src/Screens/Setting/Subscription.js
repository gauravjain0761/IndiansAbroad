import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import colors from '../../Themes/Colors';
import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts';
import { FontStyle, getLocalTime } from '../../utils/commonFunction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { screenName } from '../../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../Components/CommonButton';
import { useDispatch, useSelector } from 'react-redux';
import { onGetPlanList } from '../../Services/PaymentService';

export default function Subscription() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const [selectTab, setSelectTab] = useState(0);
  const { user, planList } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const [selectedPlan, setselectedPlan] = useState(undefined)

  useEffect(() => {
    dispatch(onGetPlanList())
  }, [])

  useEffect(() => {
    if (planList && planList.length > 0) {
      setselectedPlan(planList.filter(obj => obj?._id == user?.subscriptionPlanId)[0])
    }
  }, [planList])



  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={''} showLeft onLeftPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView extraScrollHeight={50} style={{ marginHorizontal: wp(16), flex: 1 }}>
        <Text style={styles.headerText}>Subscription</Text>
        {/* <CommonButton title={'Change payment method'} onPress={() => {
          navigation.navigate(screenName.ChangePhoneVerify);
        }} extraStyle={styles.btnView} /> */}

        <Text style={styles.text2}>Plan period</Text>
        <Text style={styles.text1}>
          {selectedPlan?.title}
        </Text>
        <Text style={styles.text2}>Plan price</Text>
        <Text style={styles.text1}>
          $ {selectedPlan?.sell_price}
        </Text>
        <Text style={styles.text2}>Plan purchased date & time</Text>
        <Text style={styles.text1}>
          {getLocalTime(user?.planExpiryDate).subtract(selectedPlan?.duration, 'months').format('DD/MM/YYYY hh:mm a')}
        </Text>
        <Text style={styles.text2}>Plan expiry date & time</Text>
        <Text style={styles.text1}>
          {getLocalTime(user?.planExpiryDate).format('DD/MM/YYYY hh:mm a')}
        </Text>

        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
        </View> */}
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
    marginBottom: hp(20)
  },
  headerText1: {
    marginTop: 50,
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
    marginTop: 10,
    width: SCREEN_WIDTH * 0.76,
  },
  codeText: {
    ...FontStyle(14, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    marginRight: 15,
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
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
    ...FontStyle(16, colors.white),
    paddingVertical: 12,
  },
  btnText1: {
    textAlign: 'center',
    ...FontStyle(16, colors.white),
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
    backgroundColor: colors.buttonBlue,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 5,
    width: '25%',
    marginTop: 53,
    marginLeft: 10
  },
  text1: {
    ...FontStyle(16, colors.neutral_900, '400'),
    marginBottom: 20
  },
  text2: {
    ...FontStyle(18, colors.neutral_900, '700'),

  },
});
