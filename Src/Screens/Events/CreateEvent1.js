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
import {useNavigation} from '@react-navigation/native';
import {
  emailCheck,
  errorToast,
  FontStyle,
  ImageStyle,
  mobileNumberCheck,
  successToast,
} from '../../utils/commonFunction';
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
import {getalluserEventCreate} from '../../Services/PostServices';
import moment from 'moment';
import {dispatchAction, formDataApiCall} from '../../utils/apiGlobal';
import {api} from '../../utils/apiConstants';
import {IS_LOADING} from '../../Redux/ActionTypes';
export default function CreateEvent1() {
  const navigation = useNavigation();
  const {user} = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [image, setimage] = useState(null);
  const [eventTitle, seteventTitle] = useState('');
  const [contact, setcontact] = useState('');
  const [phone, setphone] = useState('');
  const [discription, setdiscription] = useState('');

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

  console.log('image', image);

  const onNextPress = () => {
    if (image == null) {
      errorToast('Please select image');
    } else if (eventTitle.trim() == '') {
      errorToast('Please enter your event title');
    } else if (!emailCheck(contact.trim())) {
      errorToast('Please enter a valid email');
    } else if (!mobileNumberCheck(phone.trim())) {
      errorToast('Please enter a valid mobile number');
    } else if (discription.trim() == '') {
      errorToast('Please enter your Description');
    } else {
      let data = {};
      data['file'] = {
        uri: image.path,
        type: image.mime, // or photo.type image/jpg
        name: 'image_' + moment().unix() + '_' + image.path.split('/').pop(),
      };
      data.title = eventTitle;
      data.description = discription;
      data.email = contact.trim();
      data.step = 1;

      dispatchAction(dispatch, IS_LOADING, true);
      formDataApiCall(
        api.eventCreate,
        data,
        res => {
          console.log('formDataApiCall', res);
          dispatchAction(dispatch, IS_LOADING, false);
          navigation.navigate(screenName.CreateEvent2, {
            createId: res?.event_id,
          });
          setcontact('');
          setdiscription('');
          seteventTitle('');
          setphone('');
          setimage(null);
          successToast(res.msg);
        },
        () => {
          dispatchAction(dispatch, IS_LOADING, false);
        },
      );
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
        <RenderSteps totalStep={4} currentStep={1} />
        <Text style={styles.title}>
          Please note that once an event is listed, cancellations are not
          permitted, so ensure your event details and confirmation are final
          before submission.
        </Text>
        <TouchableOpacity onPress={() => onSelectImage()}>
          {image ? (
            <Image source={{uri: image.path}} style={styles.uploadImage} />
          ) : (
            <View style={styles.uploadView}>
              <Image source={Icons.photoUpload} style={styles.photoUpload} />
              <Text style={styles.addText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        <Input
          extraStyle={styles.input}
          value={eventTitle}
          placeholder={'Your Event Title'}
          onChangeText={text => seteventTitle(text)}
        />
        <Input
          extraStyle={styles.input}
          value={contact}
          placeholder={'Email ID'}
          onChangeText={text => setcontact(text)}
        />
        <Input
          extraStyle={styles.input}
          value={phone}
          placeholder={'Mobile No.'}
          keyboardType="phone-pad"
          onChangeText={text => setphone(text)}
        />
        <Text style={styles.title}>
          Provide detailed information about event
        </Text>
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
  title: {
    ...FontStyle(15, colors.neutral_900, '700'),
    marginTop: wp(20),
  },
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
  input: {
    marginTop: wp(16),
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
});
