import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {dateConvectTime, errorToast, FontStyle, ImageStyle} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {screenName} from '../../Navigation/ScreenConstants';
import {SCREEN_WIDTH, wp} from '../../Themes/Fonts';
import {Icons} from '../../Themes/Icons';
import CommonButton from '../../Components/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Input from '../../Components/Input';
import RenderSteps from '../../Components/RenderSteps';
import ImageCropPicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {currenciesArray} from '../../utils/constants';
import {getalluserEventCreate} from '../../Services/PostServices';
export default function CreateEvent2() {
  const navigation = useNavigation();
  const {user,getCurrenciesList} = useSelector(e => e.common);
  const dispatch = useDispatch();
  const {params} = useRoute();
  const [type, settype] = useState('Onsite');
  const [link, setlink] = useState('');
  const [starts, setstarts] = useState({date: '', start: '', end: ''});
  const [ends, setends] = useState({date: '', start: '', end: ''});
  const [currency, setcurrency] = useState(null);
  const [price, setprice] = useState('');
  const [available, setavailable] = useState('');
  const [address, setaddress] = useState('');
console.log('currency ',starts);



  const onNextPress = () => {
    if (starts.date == '') {
      errorToast('Please select starts date');
    } else if (starts.start == '') {
      errorToast('Please select start time');
    } else if (starts.end == '') {
      errorToast('Please select end time');
    } else if (ends.date == '') {
      errorToast('Please select ends date');
    } else if (ends.start == '') {
      errorToast('Please select start time');
    } else if (ends.end == '') {
      errorToast('Please select end time');
    } else if (address.trim() == '') {
      errorToast('Please enter your address');
    } else if (currency.trim() == '') {
      errorToast('Please enter select currency');
    } else if (price.trim() == '') {
      errorToast('Please enter your price');
    } else if (available.trim() == '') {
      errorToast('Please enter your tickets available');
    } else {
      let startTime=dateConvectTime(`${moment(starts.date).format('DD-MM-YYYY')} ${moment(starts.start).format('HH')}:${moment(starts.end).format('mm')}`)
      let endTime=dateConvectTime(`${moment(ends.date).format('DD-MM-YYYY')} ${moment(ends.start).format('HH')}:${moment(ends.end).format('mm')}`)
      let obj = {
        data: {
          step: 2,
          event_id: params?.createId,
          event_type: type,
          address: address,
          start_time: startTime,
          end_time: endTime,
          event_fee: price,
          no_of_tickets: available,
          currency:currency
        },
        onSuccess: (res) => {
          navigation.navigate(screenName.CreateEvent3, {
            createId: params?.createId,
          });
          setaddress("")
          setavailable("")
          setprice("")
          setcurrency(null)
          setstarts({date: '', start: '', end: ''})
          setends({date: '', start: '', end: ''})
        },
      };
      dispatch(getalluserEventCreate(obj));
    }
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        onlyLabel={'Create Event'}
        showLeft={true}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        extraScrollHeight={50}
        style={{paddingHorizontal: wp(16)}}>
        <RenderSteps totalStep={4} currentStep={2} />
        <View style={[ApplicationStyles.row, {gap: 20}]}>
          <TouchableOpacity
            onPress={() => settype('Onsite')}
            style={styles.radioView}>
            {type == 'Onsite' ? (
              <Image source={Icons.check} style={ImageStyle(20, 20)} />
            ) : (
              <View style={styles.unSelected} />
            )}
            <Text style={styles.radioText}>On site</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => settype('Online')}
            style={styles.radioView}>
            {type == 'Online' ? (
              <Image source={Icons.check} style={ImageStyle(20, 20)} />
            ) : (
              <View style={styles.unSelected} />
            )}
            <Text style={styles.radioText}>Online</Text>
          </TouchableOpacity>
        </View>
        <Input
          extraStyle={{marginTop: 5}}
          value={link}
          placeholder={'Venue / URL Link'}
          onChangeText={text => setlink(text)}
        />
        <Text style={styles.title}>Starts</Text>
        <View style={styles.rowViewDate}>
          <Input
            extraStyle={{flex: 1}}
            showCalenderIcon={false}
            type={'dob'}
            value={
              starts.date !== ''
                ? moment(starts.date).format('MMM,DD YYYY')
                : ''
            }
            onChangeText={text => setstarts({...starts, date: text})}
            placeholder={'Choose Date'}
          />

          <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={
              starts.start !== '' ? moment(starts.start).format('HH') : ''
            }
            onChangeText={text => setstarts({...starts, start: text})}
            placeholder={'Time'}
          />
          <Text style={{textAlign:'center'}}>:</Text>
          <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={starts.end !== '' ? moment(starts.end).format('mm') : ''}
            onChangeText={text => setstarts({...starts, end: text})}
            placeholder={'Time'}
          />
        </View>
        <Text style={[styles.title, {marginTop: 20}]}>Ends</Text>
        <View style={styles.rowViewDate}>
          <Input
            extraStyle={{flex: 1}}
            showCalenderIcon={false}
            type={'dob'}
            value={
              ends.date !== '' ? moment(ends.date).format('MMM,DD YYYY') : ''
            }
            onChangeText={text => setends({...ends, date: text})}
            placeholder={'Choose Date'}
          />
          <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={ends.start !== '' ? moment(ends.start).format('HH') : ''}
            onChangeText={text => setends({...ends, start: text})}
            placeholder={'Time'}
          />
          <Text style={{textAlign:'center'}}>:</Text>
          <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={ends.end !== '' ? moment(ends.end).format('mm') : ''}
            onChangeText={text => setends({...ends, end: text})}
            placeholder={'Time'}
          />
        </View>
        <Text style={styles.title}>Address</Text>
        <Input
          extraStyle={{marginTop: 5}}
          value={address}
          placeholder={'address'}
          onChangeText={text => setaddress(text)}
        />
        <Text style={styles.title}>Event fee</Text>
        <View style={styles.rowViewDate}>
          <Input
            extraStyle={{width: '35%'}}
            value={currency ? currency : ''}
            onChangeText={text => {
              setcurrency(text.currencyCode);
            }}
            placeholder={'Currency'}
            type={'dropdown'}
            data={getCurrenciesList}
            labelField={'currencyCode'}
            valueField={'currencyCode'}
          />
          <Input
            keyboardType="number-pad"
            extraStyle={{flex: 1}}
            value={price}
            placeholder={'Price per ticket'}
            onChangeText={text => setprice(text)}
          />
        </View>
        <Input
          keyboardType="number-pad"
          extraStyle={{flex: 1, marginTop: wp(10)}}
          value={available}
          placeholder={'Number of tickets available'}
          onChangeText={text => setavailable(text)}
        />
        <CommonButton
          onPress={() => onNextPress()}
          title={'Next'}
          extraStyle={{
            width: 140,
            height: 45,
            alignSelf: 'center',
            marginTop: 20,
          }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  radioView: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  unSelected: {
    height: 20,
    width: 20,
    borderColor: colors.neutral_500,
    borderWidth: 1,
    borderRadius: 10,
  },
  radioText: {
    ...FontStyle(14, colors.neutral_900, '700'),
  },
  title: {
    ...FontStyle(14, colors.neutral_900, '700'),
    marginTop: 40,
    marginBottom: 5,
  },
  rowViewDate: {
    flexDirection: 'row',
    gap: wp(10),
    alignItems:'center'
  },
});
