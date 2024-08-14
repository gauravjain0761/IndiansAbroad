import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import {
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
} from '../../Services/PostServices';

export default function AttendanceRequestScreen() {
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  const dispatch = useDispatch();
  const { activeEvent } = useSelector(e => e.common);

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
    if (inputData.firstName.trim() == '') {
      errorToast('Please enter your first Name');
    } else if (inputData.lastName.trim() == '') {
      errorToast('Please enter your last Name');
    } else if (!mobileNumberCheck(inputData.phone.trim())) {
      errorToast('Please enter a valid mobile number');
    } else if (!emailCheck(inputData.email.trim())) {
      errorToast('Please enter a valid email');
    } else {
      let obj = {
        data: {
          first_name: inputData.firstName,
          last_name: inputData.lastName,
          phone_no: inputData.phone,
          email: inputData.email,
          no_of_tickets: inputData.numberOfTickets,
          event_fees: activeEvent?.event_fee,
          plateform_fees: activeEvent?.platformFees || 0,
          total_amount: totalAmount,
          event_id: activeEvent?._id,
        },
        onSuccess: res => {
          console.log('res?._id', res?.data?._id);

          // navigation.navigate(screenName.EventPaymentScreen);
          let obj = {
            data: {
              amount: totalAmount,
              attendeeId: res?.data?._id,
              currency: 'USD',
            },
            onSuccess: res => {
              setInputData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                numberOfTickets: 1,
              });
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
          <Text style={styles.title}>
            Indian Festival Guide for November 2024{' '}
          </Text>
          <Input
            value={inputData?.firstName}
            label={'Your first name *'}
            placeholder={''}
            onChangeText={text => setInputData({ ...inputData, firstName: text })}
          />
          <Input
            value={inputData?.lastName}
            label={'Your last name *'}
            placeholder={''}
            onChangeText={text => setInputData({ ...inputData, lastName: text })}
          />
          <Input
            value={inputData?.phone}
            label={'Phone No *'}
            placeholder={''}
            maxLength={10}
            onChangeText={text => setInputData({ ...inputData, phone: text })}
          />
          <Input
            value={inputData?.email}
            label={'Your email *'}
            placeholder={''}
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
            <Text
              style={styles.ticketText}>{`£${activeEvent?.event_fee}`}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.leftText}>Platform fee</Text>
            <Text style={styles.ticketText}>{`£${
              activeEvent?.platformFees || 0
            }`}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.leftText}>Total (Price+Tax)</Text>
            <Text style={styles.ticketText}>{`£${totalAmount}`}</Text>
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FontStyle(20, colors.neutral_900, '700'),
    textAlign: 'center',
    marginBottom: 10,
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
});
