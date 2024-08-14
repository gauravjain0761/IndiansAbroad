import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import {wp} from '../../Themes/Fonts';
import {FontStyle} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RenderUserIcon from '../../Components/RenderUserIcon';
import RenderOngoingEventTable from '../../Components/RenderOngoingEventTable';
import RenderDebitedTable from '../../Components/RenderDebitedTable';
import RenderScanningTable from '../../Components/RenderScanningTable';
import {screenName} from '../../Navigation/ScreenConstants';
import {getTransactionDashboardAction} from '../../Services/PostServices';

export default function EventDashboard() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [dashBoard, setDashBoard] = useState({});
  const {user} = useSelector(e => e.common);

  useEffect(() => {
    let obj = {
      onSuccess: res => {
        console.log('getTransactionDashboardAction', res);
        setDashBoard(res?.data);
      },
    };
    dispatch(getTransactionDashboardAction(obj));
  }, []);

  console.log('dashBoard', dashBoard);

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView style={[ApplicationStyles.applicationView, {}]}>
        <Header title={'IndiansAbroad'} showLeft />
        <ScrollView style={styles.bottomView}>
          <View style={styles.mainNameView}>
            <RenderUserIcon url={user?.avtar} height={40} isBorder={user?.subscribedMember} />
            <View style={ApplicationStyles.flex}>
              <Text style={FontStyle(16, colors.neutral_900, '700')}>
              {user?.first_Name} {user?.last_Name}
              </Text>
              <Text style={FontStyle(11, colors.neutral_900)}>
                Community page,London
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate(screenName.QRScannerScreen)}>
              <Image
                source={require('../../assets/Icons/qr-scan.png')}
                style={styles.qrImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.boxView}>
            <View style={styles.innerBox}>
              <Text style={FontStyle(16, colors.neutral_900, '700')}>
                Balance
              </Text>
              <Text
                style={FontStyle(
                  14,
                  colors.neutral_900,
                )}>{`£${dashBoard?.balance}`}</Text>
            </View>
            <View style={styles.innerBox}>
              <Text style={FontStyle(16, colors.neutral_900, '700')}>
                Events
              </Text>
              <Text style={FontStyle(14, colors.neutral_900)}>
                {dashBoard?.totalEventCount}
              </Text>
            </View>
          </View>
          <View style={styles.boxView}>
            <View style={styles.innerBox}>
              <Text style={FontStyle(16, colors.neutral_900, '700')}>
                Total Bookings
              </Text>
              <Text style={FontStyle(14, colors.neutral_900)}>
                {dashBoard?.totalBookingCount}
              </Text>
            </View>
            <View style={styles.innerBox}>
              <Text style={FontStyle(16, colors.neutral_900, '700')}>
                Total Transactions
              </Text>
              <Text style={FontStyle(14, colors.neutral_900)}>
                {dashBoard?.totalTransactionCount}
              </Text>
            </View>
          </View>
          <View style={styles.boxView}>
            <Text style={styles.title}>Ongoing Event</Text>
          </View>
          <RenderOngoingEventTable />
          <View style={styles.boxView}>
            <Text style={styles.title}>Completed Event</Text>
          </View>
          <RenderOngoingEventTable showAction={false} />
          <View style={styles.boxView}>
            <Text style={styles.title}>Debited</Text>
          </View>
          <RenderDebitedTable />
          <View style={styles.boxView}>
            <Text style={styles.title}>Scanning Data</Text>
          </View>
          <RenderScanningTable />
        </ScrollView>
        <View style={{paddingHorizontal: 10, marginTop: 10}}>
          <Text style={styles.title}>Withdraw</Text>
          <View style={styles.withdrawView}>
            <View style={{flex: 1, marginVertical: 10, paddingLeft: 5}}>
              <Text style={styles.totalText}>Total balance remaining</Text>
            </View>
            <View style={styles.line} />
            <View
              style={{flex: 1, marginVertical: 10, justifyContent: 'center'}}>
              <View style={styles.priceViewTotal}>
                <Text style={FontStyle(12, colors.primary_500)}>{`£${dashBoard?.balance}`}</Text>
              </View>
            </View>
            <View style={styles.line} />
            <View
              style={{flex: 1, marginVertical: 10, justifyContent: 'center'}}>
              <View style={styles.btn}>
                <Text style={FontStyle(11, colors.white)}>Request Payout</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    // backgroundColor: 'red',
    flex: 1,
  },
  title: {
    ...FontStyle(14, colors.neutral_900, '700'),
    marginBottom: 5,
  },
  withdrawView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    borderColor: colors.neutral_300,
    borderWidth: 1,
  },
  totalText: {
    ...FontStyle(10, colors.neutral_900),
  },
  line: {
    width: 1,
    backgroundColor: colors.neutral_300,
  },
  priceViewTotal: {
    backgroundColor: colors.primary_300,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  btn: {
    backgroundColor: colors.primary_500,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  mainNameView: {
    backgroundColor: colors.secondary_500,
    paddingHorizontal: wp(16),
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  qrImage: {
    width: 38,
    height: 38,
  },
  boxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  innerBox: {
    backgroundColor: colors.neutral_300,
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
});
