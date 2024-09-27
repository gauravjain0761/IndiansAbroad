import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import {
  currencyIcon,
  emailCheck,
  errorToast,
  FontStyle,
  ImageStyle,
  mobileNumberCheck,
} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import CommonButton from '../../Components/CommonButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../Components/Input';
import {
  getAttendeeCreateAction,
  getAttendeePaymentAction,
  getDetailsListAction,
} from '../../Services/PostServices';
import CountryPicker from 'react-native-country-picker-modal';
import { SET_EVENT_ATTENDANT_COUNT } from '../../Redux/ActionTypes';
import { dispatchAction } from '../../utils/apiGlobal';

export default function AttendanceRequestScreen() {
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  const dispatch = useDispatch();
  const { activeEvent } = useSelector(e => e.common);
  const [show, setShow] = useState(false);
  const [code, setcode] = useState('+1');
  const [termsCheckbox, settermsCheckbox] = useState(false);

  const [inputData, setInputData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    numberOfTickets: 1,
  });
  const totalAmount =
    Number(activeEvent?.platformFees || 0) +
    Number(activeEvent?.event_fee) * inputData.numberOfTickets;

  const onNextPress = () => {
    // navigation.navigate(screenName.EventPaymentScreen);
    if (inputData.firstName.trim() == '') {
      errorToast('Please enter your first Name');
    } else if (inputData.lastName.trim() == '') {
      errorToast('Please enter your last Name');
    } else if (!mobileNumberCheck(inputData.phone.trim())) {
      errorToast('Please enter a valid mobile number');
    } else if (inputData.phone.trim().length !== 10) {
      errorToast('Please enter a valid phone number with 10 digits');
    } else if (!emailCheck(inputData.email.trim())) {
      errorToast('Please enter a valid email');
    } else if (termsCheckbox == false) {
      errorToast('Please select agree event guidelines');
    } else {
      let obj = {
        data: {
          first_name: inputData.firstName,
          last_name: inputData.lastName,
          // phone_no: `${inputData.code}${inputData.phone}`,
          phone_no: `${inputData.phone}`,
          email: inputData.email,
          no_of_tickets: inputData.numberOfTickets,
          event_fees: activeEvent?.event_fee,
          plateform_fees: activeEvent?.platformFees || 0,
          total_amount: totalAmount,
          event_id: activeEvent?._id,
        },
        onSuccess: res => {
          let obj = {
            data: { amount: totalAmount, attendeeId: res?.data?._id, currency: activeEvent?.currency, },
            onSuccess: res => {
              dispatchAction(dispatch, SET_EVENT_ATTENDANT_COUNT, {
                id: activeEvent?._id,
              });
              setInputData({ firstName: '', lastName: '', phone: '', email: '', numberOfTickets: 1, });
              getEventList()
              settermsCheckbox(false)
              navigation.goBack();
              // navigation.navigate(screenName.EventPaymentScreen);
            },
          };
          dispatch(getAttendeePaymentAction(obj));
        },
        onFailure: err => {
          errorToast(err.data?.msg);
        },
      };
      dispatch(getAttendeeCreateAction(obj));
    }
  };

  const getEventList = page => {
    let obj = {
      data: activeEvent?._id,
      onSuccess: res => { },
    };
    dispatch(getDetailsListAction(obj));
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        onlyLabel={'Attendance request'}
        showLeft={true}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView extraScrollHeight={50}>
        <View style={styles.topView}>
          <Text style={styles.title}>{activeEvent?.title}</Text>
          <Input
            value={inputData?.firstName}
            label={'Your first name *'}
            placeholder={'Enter your first name'}
            maxLength={25}
            onChangeText={text => setInputData({ ...inputData, firstName: text })}
          />
          <Input
            value={inputData?.lastName}
            label={'Your last name *'}
            placeholder={'Enter your last name'}
            maxLength={25}
            onChangeText={text => setInputData({ ...inputData, lastName: text })}
          />
          <View style={[styles.inputrow, { marginBottom: 0, marginTop: wp(0) }]}>
            <View>
              <Text style={styles.labelText1}>{'Country *'}</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShow(true)}>
                <Text style={styles.inputText1}>{code}</Text>
                <Image source={Icons.down_arrow} style={ImageStyle(15, 15)} />
              </TouchableOpacity>
            </View>
            <Input
              extraStyle={[{ flex: 1, marginTop: wp(0) }]}
              keyboardType={'phone-pad'}
              label={'Phone No *'}
              value={inputData?.phone}
              placeholder={'Mobile Number'}
              maxLength={10}
              onChangeText={text => setInputData({ ...inputData, phone: text })}
            />
          </View>
          {/* <Input
            value={inputData?.phone}
            label={'Phone No *'}
            placeholder={''}
            maxLength={10}
            onChangeText={text => setInputData({ ...inputData, phone: text })}
          /> */}
          <Input
            value={inputData?.email}
            label={'Your email *'}
            placeholder={'Enter your email'}
            maxLength={100}
            onChangeText={text => setInputData({ ...inputData, email: text })}
          />
          <View style={styles.ticketView}>
            <Text style={styles.labelText}>No of tickets *</Text>
            <View style={styles.ticketViewRow}>
              {inputData.numberOfTickets >= 2 && (
                <TouchableOpacity
                  onPress={() => {
                    setInputData({
                      ...inputData,
                      numberOfTickets: inputData.numberOfTickets - 1,
                    });
                  }}
                  style={styles.numberBtn}>
                  <Image
                    source={Icons.minus}
                    style={[ImageStyle(10, 10), { tintColor: colors.white }]}
                  />
                </TouchableOpacity>
              )}
              <Text style={styles.ticketText}>
                {inputData.numberOfTickets < 10
                  ? '0' + inputData.numberOfTickets
                  : inputData.numberOfTickets}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setInputData({
                    ...inputData,
                    numberOfTickets: inputData.numberOfTickets + 1,
                  })
                }
                style={styles.numberBtn}>
                <Image
                  source={Icons.add}
                  style={[ImageStyle(12, 12), { tintColor: colors.white }]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.priceView}>
          <View style={styles.priceRow}>
            <Text style={styles.leftText}>Price</Text>
            <Text style={styles.ticketText}>{`${currencyIcon(
              activeEvent?.currency,
            )}${activeEvent?.event_fee}`}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.leftText}>Platform fee</Text>
            <Text style={styles.ticketText}>{`${currencyIcon(
              activeEvent?.currency,
            )}${activeEvent?.platformFees || 0}`}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.leftText}>Total (Price+Tax)</Text>
            <Text style={styles.ticketText}>{`${currencyIcon(
              activeEvent?.currency,
            )}${totalAmount}`}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => settermsCheckbox(!termsCheckbox)}>
            <Image
              source={termsCheckbox ? Icons.checkbox1 : Icons.checkbox}
              style={[ImageStyle(20, 20)]}
            />
          </TouchableOpacity>
          <Text style={[styles.des]}>
            I agree{' '}
            <Text
              style={{ color: colors.primary_500 }}
              onPress={() => {
                Linking.openURL(
                  'https://www.indiansabroad.online/events_guidelines.html',
                );
              }}>
              Event Guidelines
            </Text>{' '}
            of IndiansAbroad.
          </Text>
        </View>
        <View style={[styles.blueView]}>
          <CommonButton
            onPress={() => onNextPress()}
            title={'Checkout'}
            extraStyle={{ width: 140, height: 45 }}
          />
        </View>
        <Text style={[styles.ticketText, { textAlign: 'center' }]}>
          {'\n'}IndiansAbroad{'\n'}
        </Text>
        <Text style={[styles.leftText, { textAlign: 'center' }]}>
          Secure payments via
        </Text>
        <Text style={[styles.leftText, { textAlign: 'center' }]}>
          We accept Visa
        </Text>
        <Text style={[styles.leftText, { textAlign: 'center' }]}>
          We accept Mastercard
        </Text>
        <Text style={[styles.leftText, { textAlign: 'center' }]}>
          We accept Maestro
        </Text>
        <View style={{ marginBottom: 100 }} />
      </KeyboardAwareScrollView>
      <CountryPicker
        // countryCode={code.replace('+', '')}
        visible={show}
        onClose={() => setShow(false)}
        withCallingCode
        onSelect={item => {
          setcode('+' + item?.callingCode[0]);
          setShow(false);
        }}
        withCallingCodeButton
        withFilter
        placeholder={''}
        withEmoji={false}
      // withFlag
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FontStyle(20, colors.neutral_900, '700'),
    textAlign: 'center',
    marginBottom: 10,
  },
  labelText1: {
    ...FontStyle(15, colors.neutral_900),
    // marginHorizontal: wp(20),
    marginBottom: 4,
    marginTop: 8,
  },
  topView: {
    paddingHorizontal: wp(16),
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: colors.neutral_400,
  },
  ticketView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  labelText: {
    ...FontStyle(15, colors.neutral_900),
  },
  ticketViewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ticketText: {
    ...FontStyle(14, colors.neutral_900, '700'),
  },
  leftText: {
    ...FontStyle(14, colors.neutral_900),
  },
  numberBtn: {
    backgroundColor: colors.neutral_900,
    height: 28,
    width: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceView: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_400,
    borderTopColor: colors.neutral_400,
    marginVertical: 5,
    paddingHorizontal: wp(16),
    paddingVertical: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  blueView: {
    backgroundColor: colors.secondary_500,
    paddingHorizontal: wp(20),
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 3,
    justifyContent: 'center',
  },
  title2: {},
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 56,
  },
  inputText1: {
    ...FontStyle(15, colors.neutral_900),
    // flex: 1,
    // paddingVertical: 4,
    borderRadius: 5,
    paddingRight: 10,
    // paddingVertical: Platform.OS == 'ios' ? 19 : 6,

    // marginTop:12
  },
  inputrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  des: { ...FontStyle(14, colors.neutral_900) },
});
