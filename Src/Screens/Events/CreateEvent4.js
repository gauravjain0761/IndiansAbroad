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
import {errorToast, FontStyle, ImageStyle} from '../../utils/commonFunction';
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
import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal';
import { IS_LOADING } from '../../Redux/ActionTypes';
import { api } from '../../utils/apiConstants';

export default function CreateEvent4() {
  const navigation = useNavigation();
  const {user} = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [name, setname] = useState('');
  const [image, setimage] = useState(null);
  const [termsCheckbox, settermsCheckbox] = useState(false);
  const {params} = useRoute();

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
    if (name.trim() == null) {
      errorToast('Please enter your name');
    } else if (image == null) {
      errorToast('Please select upload your Passport ID*');
    } else {
      let data = {};
      data['file'] = {
        uri: image.path,
        type: image.mime, // or photo.type image/jpg
        name: 'image_' + moment().unix() + '_' + image.path.split('/').pop(),
      };
      data.page_owner = name;
      data.step = 4;
      data.event_id = params?.createId;

      dispatchAction(dispatch, IS_LOADING, true);
      formDataApiCall(
        api.eventCreate,
        data,
        res => {
          console.log('formDataApiCall', res);
          dispatchAction(dispatch, IS_LOADING, false);
          navigation.navigate(screenName.homeScreen)
          setname('');
          setimage(null)
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
      <KeyboardAwareScrollView extraScrollHeight={50}>
        <View style={{paddingHorizontal: wp(16)}}>
          <RenderSteps totalStep={4} currentStep={4} />
          <Text style={styles.titleDes}>
            Please provide the name of the responsible person. In case of any
            fraudulent or illegitimate activities, they will be held accountable
            person.
          </Text>
          <Text style={styles.title}>Responsible person*</Text>
          <Input
            value={name}
            placeholder={'Name'}
            onChangeText={text => setname(text)}
          />
          <Text style={styles.titleDes}>
            To ensure the legitimacy of our events and protect our community
            from fraud, we require a passport ID for event submissions. Rest
            assured, your personal information will remain confidential and will
            not be shared with anyone for any other purposes.
          </Text>
          <Text style={[styles.title, {marginTop: 0, textAlign: 'center'}]}>
            Upload your Passport ID*
          </Text>
          <TouchableOpacity onPress={() => onSelectImage()}>
            {image ? (
              <Image source={{uri: image.path}} style={styles.uploadImage} />
            ) : (
              <View style={styles.uploadView}>
                <Image source={Icons.photoUpload} style={styles.photoUpload} />
                <Text style={styles.addText}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => settermsCheckbox(!termsCheckbox)}>
              <Image
                source={termsCheckbox ? Icons.checkbox1 : Icons.checkbox}
                style={[ImageStyle(20, 20)]}
              />
            </TouchableOpacity>
            <Text style={[styles.des]}>
              I agree{' '}
              <Text style={{color: colors.primary_500}}>Event Guidelines</Text>{' '}
              of IndiansAbroad.
            </Text>
          </View>
        </View>
        <View style={[styles.blueView]}>
          <CommonButton
            onPress={() => onNextPress()}
            title={'Create'}
            extraStyle={{width: 140, height: 45}}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FontStyle(14, colors.neutral_900, '700'),
    marginTop: 40,
    marginBottom: 5,
  },
  titleDes: {
    ...FontStyle(14, colors.neutral_900),
    marginTop: 40,
    marginBottom: 5,
  },
  uploadView: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    borderRadius: 4,
    height: 123,
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH / 1.3,
    alignSelf: 'center',
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
  uploadImage: {
    height: 123,
    width: SCREEN_WIDTH / 1.3,
    resizeMode: 'cover',
    borderRadius: 4,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  des: {...FontStyle(14, colors.neutral_900)},
  blueView: {
    backgroundColor: colors.secondary_500,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 3,
    justifyContent: 'center',
  },
});
