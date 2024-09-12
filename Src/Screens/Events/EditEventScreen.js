import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import {useNavigation} from '@react-navigation/native';
import {
  dateConvectTime,
  emailCheck,
  errorToast,
  FontStyle,
  mobileNumberCheck,
  successToast,
} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {screenName} from '../../Navigation/ScreenConstants';
import {SCREEN_WIDTH, wp} from '../../Themes/Fonts';
import {Icons} from '../../Themes/Icons';
import CommonButton from '../../Components/CommonButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Input from '../../Components/Input';
import {currenciesArray} from '../../utils/constants';
import {IS_LOADING, SET_ACTIVE_EVENT} from '../../Redux/ActionTypes';
import {dispatchAction, formDataApiCall} from '../../utils/apiGlobal';
import {api} from '../../utils/apiConstants';
import moment from 'moment';
import { getDetailsListAction } from '../../Services/PostServices';

export default function EditEventScreen() {
  const navigation = useNavigation();
  const {activeEvent, user, getCurrenciesList} = useSelector(e => e.common);

  const dispatch = useDispatch();
  const [image, setimage] = useState(null);
  const [eventTitle, seteventTitle] = useState('');
  const [contact, setcontact] = useState('');
  const [discription, setdiscription] = useState('');
  const [link, setlink] = useState('');
  const [starts, setstarts] = useState({date: '', start: '', end: ''});
  const [ends, setends] = useState({date: '', start: '', end: ''});
  const [currency, setcurrency] = useState(undefined);
  const [price, setprice] = useState('');
  const [available, setavailable] = useState('');

  useEffect(() => {
    seteventTitle(activeEvent?.title);
    setcontact(activeEvent?.mobile);
    setdiscription(activeEvent?.description);
    setlink(activeEvent?.address);
    setstarts({
      date: activeEvent?.start_time,
      start: activeEvent?.start_time,
      end: activeEvent?.start_time,
    });
    setends({
      date: activeEvent?.end_time,
      start: activeEvent?.end_time,
      end: activeEvent?.end_time,
    });
    setcurrency(activeEvent?.currency);
    setprice(activeEvent?.event_fee.toString());
    setavailable(activeEvent?.no_of_tickets.toString());
  }, [activeEvent]);

  const onSelectImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
    })
      .then(image => {
        setimage(image);
      })
      .catch(error => {
        console.log('err---', error);
      });
  };

  const onNextPress = () => {
    if (eventTitle.trim() == '') {
      errorToast('Please enter your event title');
    } else if (contact.trim() == '') {
      errorToast('Please enter a valid mobile number');
    } else if (discription.trim() == '') {
      errorToast('Please enter your Description');
    } else if (starts.date == '') {
      errorToast('Please select starts date');
    }  else if (ends.date == '') {
      errorToast('Please select ends date');
    }  else if (link.trim() == '') {
      errorToast('Please enter your address');
    } else if (currency == '') {
      errorToast('Please enter select currency');
    } else if (price == '') {
      errorToast('Please enter your price');
    } else if (available == '') {
      errorToast('Please enter your tickets available');
    } else {
      let startTime = dateConvectTime(
        `${moment(starts.date).format('DD-MM-YYYY')} ${moment(
          starts.start,
        ).format('hh')}:${moment(starts.end).format('mm a')}`,
      );
      let endTime = dateConvectTime(
        `${moment(ends.date).format('DD-MM-YYYY')} ${moment(ends.start).format(
          'hh',
        )}:${moment(ends.end).format('mm a')}`,
      );
      let data = {};
      if (image) {
        data['file'] = {
          uri: image.path,
          type: image.mime, // or photo.type image/jpg
          name: 'image_' + moment().unix() + '_' + image.path.split('/').pop(),
        };
      }
      data.event_id = activeEvent?._id;
      data.title = eventTitle;
      data.description = discription;
      data.mobile = contact;
      data.address = link;
      data.currency = currency;
      data.event_fee = price;
      data.no_of_tickets = available;
      data.start_time = startTime;
      data.end_time = endTime;

      dispatchAction(dispatch, IS_LOADING, true);
      formDataApiCall(
        api.eventUpdate,
        data,
        res => {
          successToast(res?.msg);
          // dispatchAction(dispatch, SET_ACTIVE_EVENT, res?.data);
          getEventList()
          dispatchAction(dispatch, IS_LOADING, false);
        },
        () => {
          dispatchAction(dispatch, IS_LOADING, false);
        },
      );
    }
  };

  const getEventList = page => {
    let obj = {
      data: activeEvent?._id,
      onSuccess: res => {
    
      },
    };
    dispatch(getDetailsListAction(obj));
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        onRightPress={() => navigation.navigate(screenName.EditEventScreen)}
        title={''}
        onlyLabel={'Edit Event'}
        showLeft={true}
        onLeftPress={() => {
          navigation.pop(1);
        }}
      />
      <KeyboardAwareScrollView
        extraScrollHeight={50}
        style={{paddingHorizontal: wp(16)}}>
        <TouchableOpacity onPress={() => onSelectImage()}>
          {activeEvent?.event_image?.location ? (
            <Image
              source={{
                uri: activeEvent?.event_image?.location
                  ? activeEvent?.event_image?.location
                  : image.path,
              }}
              style={styles.uploadImage}
            />
          ) : (
            <View style={styles.uploadView}>
              <Image source={Icons.photoUpload} style={styles.photoUpload} />
              <Text style={styles.addText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        <Input
          label={'Event Title'}
          extraStyle={styles.input}
          value={eventTitle}
          placeholder={'Your Event Title'}
          onChangeText={text => seteventTitle(text)}
        />
        <Input
          label={'Contact Details'}
          keyboardType={'phone-pad'}
          extraStyle={styles.input}
          value={contact}
          placeholder={'Mobile No./Email ID'}
          onChangeText={text => setcontact(text)}
        />
        <Text style={styles.labelText}>{"Event's Description"}</Text>
        <TextInput
          placeholder={'Description'}
          style={[
            styles.inputText,
            {height: 192, textAlignVertical: 'top', paddingTop: 10},
          ]}
          multiline={true}
          placeholderTextColor={colors.neutral_500}
          value={discription}
          onChangeText={text => setdiscription(text)}
        />
        <Input
          label={"Event's  Venue"}
          value={link}
          placeholder={'Venue / URL Link'}
          onChangeText={text => setlink(text)}
        />
        <Text style={styles.labelText}>Starts</Text>
        <View style={styles.rowViewDate}>
          <Input
            extraStyle={{flex: 1}}
            showCalenderIcon={false}
            type={'dob'}
            mode='datetime'
            date={starts.date}
            value={
              starts.date !== ''
                ? moment(starts.date).format('MMM,DD YYYY hh:mm A')
                : ''
            }
            onChangeText={text => setstarts({...starts, date: text})}
            placeholder={'Choose Date'}
          />
          {/* <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={starts.start !== '' ? moment(starts.start).format('hh') : ''}
            onChangeText={text => setstarts({...starts, start: text})}
            placeholder={'Time'}
          />
          <Text style={{textAlign: 'center'}}>:</Text>
          <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={starts.end !== '' ? moment(starts.end).format('mm A') : ''}
            onChangeText={text => setstarts({...starts, end: text})}
            placeholder={'Time'}
          /> */}
        </View>
        <Text style={[styles.labelText]}>Ends</Text>
        <View style={styles.rowViewDate}>
          <Input
            extraStyle={{flex: 1}}
            showCalenderIcon={false}
            type={'dob'}
            mode='datetime'
            date={ends.date}
            value={
              ends.date !== '' ?  moment(ends.date).format('MMM,DD YYYY hh:mm A') : ''
            }
            onChangeText={text => setends({...ends, date: text})}
            placeholder={'Choose Date'}
          />
          {/* <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={ends.start !== '' ? moment(ends.start).format('hh') : ''}
            onChangeText={text => setends({...ends, start: text})}
            placeholder={'Time'}
          />
          <Text style={{textAlign: 'center'}}>:</Text>
          <Input
            extraStyle={{width: '25%'}}
            showCalenderIcon={false}
            mode={'time'}
            type={'dob'}
            value={ends.end !== '' ? moment(ends.end).format('mm A') : ''}
            onChangeText={text => setends({...ends, end: text})}
            placeholder={'Time'}
          /> */}
        </View>
        <Text style={styles.labelText}>Event fee</Text>
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
          title={'Save'}
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
  uploadView: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    borderRadius: 4,
    height: 169,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoUpload: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: colors.neutral_500,
  },
  addText: {
    ...FontStyle(15, colors.neutral_500),
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
    height: 56,
  },
  uploadImage: {
    height: 169,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
  },
  labelText: {
    ...FontStyle(15, colors.neutral_900),
    // marginHorizontal: wp(20),
    marginBottom: 4,
    marginTop: 8,
  },
  rowViewDate: {
    flexDirection: 'row',
    gap: wp(6),
    alignItems: 'center',
  },
});
