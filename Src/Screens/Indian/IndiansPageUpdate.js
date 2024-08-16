import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Platform, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { errorToast, FontStyle, ImageStyle, successToast } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { Icons } from '../../Themes/Icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onGetMyPage, onGetSignupCountry } from '../../Services/AuthServices';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from '../../Components/ActionSheet';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import CommonButton from '../../Components/CommonButton';
import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal';
import { api } from '../../utils/apiConstants';
import { IS_LOADING } from '../../Redux/ActionTypes';

const TextInputView = ({ value, onChangeText, placeholder, label }) => {
  return (
    <View style={styles.inputStyle}>
      <Text style={styles.labelText}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.neutral_500}
      />
    </View>
  );
};



export default function IndiansPageUpdate() {
  const { params } = useRoute();
  const [tabType, setTabType] = useState('All');
  const navigation = useNavigation()
  const actionItems = [
    {
      id: 1,
      label: 'Open Camera',
      onPress: () => {
        openPicker();
      },
    },
    {
      id: 2,
      label: 'Open Gallery',
      onPress: () => {
        openGallery();
      },
    },
  ];
  const [searchText, setSearchText] = useState('');
  const [image, setimage] = useState(undefined)
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [catchLine, setCatchLine] = useState('')
  const [website, setwebsite] = useState('')
  const { countries, user, myPage } = useSelector(e => e.common)
  const [city, setcity] = useState('')
  const [country, setcountry] = useState(undefined)
  const dispatch = useDispatch()
  const [region, setregion] = useState('')
  const [actionSheet, setActionSheet] = useState(false);
  const closeActionSheet = () => setActionSheet(false);
  useEffect(() => {
    dispatch(onGetMyPage({ id: user?._id }))
    dispatch(onGetSignupCountry({}))
  }, [])
  useEffect(() => {
    if (myPage) {
      setAbout(myPage[0]?.about)
      setTitle(myPage[0]?.title)
      setCatchLine(myPage[0]?.catchline)
      setwebsite(myPage[0]?.websitelink)
      setcity(myPage[0]?.city)
      // setregion(myPage[0]?.region)
      setcountry(myPage[0]?.countryId?._id)
      setimage(myPage[0]?.logoData?.location)
    }
  }, [myPage])
  const openPicker = () => {
    closeActionSheet();
    setTimeout(() => {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
        multiple: false,
        cropping: true,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
      }).then(image => {
        setimage(image)
      }).catch(error => { console.log('err---', error); });
    }, 500);

  };
  const openGallery = () => {
    closeActionSheet()
    setTimeout(() => {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        multiple: false,
        cropping: true,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
      }).then(image => {
        setimage(image)
      }).catch(error => { console.log('err---', error); });
    }, 500);

  };
  const DropView = ({ value, onChangeText, placeholder, label }) => {
    return (
      <View style={styles.rowStyle}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.selectedTextStyle}
          // itemContainerStyle={styles.itemContainerStyle}
          // iconStyle={styles.iconStyle}
          data={countries}
          search
          maxHeight={200}
          labelField={'countryName'}
          valueField={'_id'}
          placeholder={placeholder}
          searchPlaceholder="Search..."
          value={value}
          onChange={item => {
            onChangeText(item);
          }}
          // renderLeftIcon={() => (
          //   <Image source={Icons.down_arrow} style={ImageStyle(10, 10)} />
          // )}
          renderItem={(item) => {
            return (
              <View style={styles.itemContainerStyle}>
                <Text style={styles.selectedTextStyle}>{item.countryName}</Text>
              </View>
            );
          }}
          iconColor={colors.neutral_900}
        />
      </View>
    );
  };

  const onPressUpdate = () => {
    if (title.trim() == '') {
      errorToast('Please enter title')
    } else if (about.trim() == '') {
      errorToast('Please enter about')
    } else if (!country) {
      errorToast('Please select country')
    }
    //  else if (region.trim() == '') {
    //   errorToast('Please enter region')
    // } 
    else if (city.trim() == '') {
      errorToast('Please enter an city')
    } else {
      let data = {}
      if (image?.path) {
        let time = new Date().getTime()
        data['logo'] = {
          uri: image.path,
          type: image.mime, // or photo.type image/jpg
          name: 'logo_[' + time + '].' + image.path.split('.').pop()
        }
      }
      data.title = title.trim()
      data.countryId = country
      // data.region = region.trim()
      data.city = city.trim()
      data.createdBy = user._id
      data.about = about.trim()
      data.cpId = myPage[0]._id
      if (website.trim() !== '') { data.websitelink = website.trim() }
      if (catchLine.trim() !== '') { data.catchline = catchLine.trim() }
      dispatchAction(dispatch, IS_LOADING, true)
      formDataApiCall(api.updatePage, data, (res) => {
        dispatchAction(dispatch, IS_LOADING, false)
        dispatch(onGetMyPage({ id: user?._id }))
        navigation.goBack()
        successToast(res.msg)
      }, () => {
        dispatchAction(dispatch, IS_LOADING, false)
      })
    }
  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={''} showRight={false} showLeft={true} onLeftPress={() => navigation.goBack()} />
      <KeyboardAvoidingView
        {...(Platform.OS === 'ios'
          ? {
            behavior: 'padding',
          }
          : {})}>

        <ScrollView>
          <TouchableOpacity style={styles.uploadPhotoView}>
            <View>
              <TouchableOpacity onPress={() => setActionSheet(true)} style={styles.innerUploadView}>
                {image ?
                  <Image style={styles.uploadImage} source={image?.path ? { uri: image.path } : { uri: image }} />
                  :
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={styles.cameraIcon} source={image ? { uri: image.path } : Icons.camera} />
                    <Text style={styles.uploadText}>{'Upload Photo'}</Text>
                  </View>
                }
                <Image source={Icons.plusHome} style={[ImageStyle(24, 24), { position: 'absolute', bottom: 5, right: 5, resizeMode: 'cover', borderRadius: 24 / 2 }]} />
              </TouchableOpacity>
              <Modal
                onBackdropPress={() => closeActionSheet()}
                isVisible={actionSheet}
                style={{ margin: 0, justifyContent: 'flex-end', }}>
                <ActionSheet actionItems={actionItems} onCancel={closeActionSheet} />
              </Modal>
            </View>
          </TouchableOpacity>

          <TextInputView onChangeText={(text) => setTitle(text)} value={title} label="Title" placeholder={'Title*'} />
          <TextInputView onChangeText={(text) => setAbout(text)} value={about} label="About" placeholder={'About*'} />
          <TextInputView onChangeText={(text) => setCatchLine(text)} value={catchLine} label="Catchline" placeholder={'Catchline'} />
          <TextInputView onChangeText={(text) => setwebsite(text)} value={website} label="Website" placeholder={'Website'} />
          <Text style={styles.locationText}>Location</Text>
          {countries &&
            <DropView value={country} onChangeText={(text) => { setcountry(text?._id) }} label="India" placeholder={'City*'} />
          }
          {/* <TextInputView onChangeText={(text) => setregion(text)} value={region} placeholder={'Region*'} label="Region*" /> */}
          <TextInputView onChangeText={(text) => setcity(text)} value={city} label="City" placeholder={'City*'} />
          {/* <TouchableOpacity style={[styles.btnView, {}]} onPress={() => { }}>
            <Text style={styles.btnText}>Update Page</Text>
          </TouchableOpacity> */}

          <CommonButton title={'Update Page'} onPress={() => onPressUpdate()} extraStyle={{ width: SCREEN_WIDTH - wp(40), alignSelf: 'center', marginTop: 20, marginBottom: 50, }} />

        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
  },
  tabItemView: {
    flex: 1,
    padding: wp(15),
    borderRadius: 50,
    alignItems: 'center',
  },
  lineView: {
    width: SCREEN_WIDTH * 0.34,
    borderWidth: 0.5,
    borderColor: colors.neutral_400,
  },
  seeBtn: {
    backgroundColor: colors.secondary_d9e2,
    paddingHorizontal: 12,
    borderRadius: 3,
    marginHorizontal: wp(7),
  },
  seeBtnText: {
    // lineHeight: 18,
    paddingVertical: 2,
    ...FontStyle(11, colors.neutral_900, '400'),
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    marginHorizontal: wp(20),
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  inputText: {
    ...FontStyle(15, colors.neutral_900),
    // height:35,
    padding: 0,
  },
  labelText: {
    ...FontStyle(12, colors.neutral_900, '700'),
  },
  locationText: {
    marginHorizontal: wp(20),
    marginVertical: 22,
    ...FontStyle(16, colors.secondary_800),
  },
  downArrowStyle: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    marginHorizontal: wp(20),
    borderRadius: 5,
    // paddingLeft: 12,
    paddingVertical: 6,
    marginBottom: 10,
    height: 55,
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    // width: '48%',
    marginHorizontal: wp(20),
    marginTop: 20,
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(15, colors.white),
    paddingVertical: 15,
  },
  uploadPhotoView: {
    height: 126,
    width: 126,
    backgroundColor: colors.white,
    borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5
  },
  innerUploadView: {
    backgroundColor: colors.inputBg,
    height: 110,
    width: 110,
    borderColor: colors.placeHolderColor,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 120 / 2,
    alignItems: 'center', justifyContent: 'center'
  },
  cameraIcon: {
    height: 25,
    width: 25,
    tintColor: colors.primary_500,
    marginBottom: 5
  },
  uploadText: {
    ...FontStyle(12, colors.neutral_900)
  },
  uploadImage: {
    height: 110,
    width: 110,
    borderRadius: 120 / 2,
    resizeMode: 'cover',
  },

  selectedTextStyle: {
    ...FontStyle(15, colors.neutral_900),
  },
  itemContainerStyle: {
    height: 30,
    paddingHorizontal: 20
    // backgroundColor: 'red',
    // paddingVertical: 0
  },
  placeholderStyle: {
    ...FontStyle(15, colors.neutral_500),
  },
  inputSearchStyle: {
    ...FontStyle(15, colors.neutral_500),
    height: 40
  },
  dropdown: {
    height: 55,
    width: '100%',
    paddingHorizontal: 12,
    // paddingHorizontal: 12,
  },
});
