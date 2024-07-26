import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import colors from '../../Themes/Colors';
import { Icons } from '../../Themes/Icons';
import { errorToast, FontStyle, ImageStyle, successToast } from '../../utils/commonFunction';
import { fontname, hp, wp } from '../../Themes/Fonts';
import RenderUserIcon from '../../Components/RenderUserIcon';
import Input from '../../Components/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DeleteModal from '../../Components/DeleteModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { onGetSignupCountry, onGetUserInfoApi } from '../../Services/AuthServices';
import ImageCropPicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import ActionSheet from '../../Components/ActionSheet';
import { api } from '../../utils/apiConstants';
import moment from 'moment';
import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal';
import { IS_LOADING, SET_USER } from '../../Redux/ActionTypes';

export default function EditProfile() {
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
  const [actionSheet, setActionSheet] = useState(false);
  const closeActionSheet = () => setActionSheet(false);
  const navigation = useNavigation();
  const { user, countries } = useSelector(e => e.common)
  const [image, setimage] = useState(undefined)
  const [inputData, setInputData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    city: '',
    state: '',
    country: undefined,
    cityAbroad: '',
    university: '',
    profession: '',
    link: '',
    catchLine: '',
    district: ''
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onGetSignupCountry({}))
    dispatch(onGetUserInfoApi({ params: { userId: user._id, }, }),);
  }, [])

  useEffect(() => {
    setimage(user?.avtar)
    setInputData({
      firstName: user?.first_Name,
      lastName: user?.last_Name,
      dob: moment(user?.birthDate, 'DD MMMM YYYY'),
      city: user?.city,
      state: user?.state,
      district: user?.district,
      country: user?.countryId,
      cityAbroad: user?.region,
      university: user?.universityORcompany,
      profession: user?.profession,
      link: user?.websitelink,
      catchLine: user?.catchLine
    })
  }, [user])

  const openPicker = () => {
    closeActionSheet();
    ImageCropPicker.openCamera({
      mediaType: 'photo',
    }).then(image => {
      setimage(image)
    }).catch(error => { console.log('err---', error); });
  };
  const openGallery = () => {
    closeActionSheet()
    ImageCropPicker.openPicker({
      mediaType: 'photo',
    }).then(image => {
      setimage(image)
    }).catch(error => { console.log('err---', error); });
  };

  const onSave = () => {
    if (inputData.firstName.trim() == '') {
      errorToast('Please enter your first name')
    } else if (inputData.lastName.trim() == '') {
      errorToast('Please enter your last name')
    } else if (inputData.dob == '') {
      errorToast('Please select date of birth')
    } else if (inputData.city.trim() == '') {
      errorToast('Please enter a city')
    } else if (inputData.district.trim() == '') {
      errorToast('Please enter a district')
    } else if (inputData.state.trim() == '') {
      errorToast('Please enter a state')
    } else if (!inputData.country) {
      errorToast('Please select a country(in abroad)')
    } else if (inputData.cityAbroad.trim() == '') {
      errorToast('Please enter a city(in abroad)')
    } else if (inputData.university.trim() == '') {
      errorToast('Please enter an unversity/company')
    }
    // else if (profession.trim() == '') {
    //   errorToast('Please enter profession')
    // }
    else {

      let data = {}
      if (image?.path) {
        let time = new Date().getTime()
        data['avtar'] = {
          uri: image.path,
          type: image.mime, // or photo.type image/jpg
          name: 'avtar_[' + time + '].' + image.path.split('.').pop()
        }

      }
      if (user.first_Name !== inputData.firstName) { data.first_Name = inputData.firstName.trim() }
      if (user.last_Name !== inputData.lastName) { data.last_Name = inputData.lastName.trim() }
      if (user.catchLine !== inputData.catchLine) { data.catchLine = inputData.catchLine.trim() }
      if (moment(user?.birthDate, 'DD MMMM YYYY').format('DD/MM/YYYY') !== moment(inputData.dob).format('DD/MM/YYYY')) { data.birthDate = moment(inputData.dob).format('DD/MM/YYYY') }
      if (user.city !== inputData.city) { data.city = inputData.city }
      if (user.district !== inputData.district) { data.district = inputData.district }
      if (user.state !== inputData.state) { data.state = inputData.state }
      if (user?.countryId?._id !== inputData.country?._id) { data.countryId = inputData.country?._id }
      if (user.region !== inputData.cityAbroad) { data.region = inputData.cityAbroad }
      if (user.universityORcompany !== inputData.university) { data.universityORcompany = inputData.university }
      if (user?.profession !== inputData.profession) { data.profession = inputData.profession }
      if (user?.websitelink !== inputData.link) { data.websitelink = inputData.link }
      if (Object.keys(data).length > 0) {
        data.userId = user?._id
        dispatchAction(dispatch, IS_LOADING, true)
        formDataApiCall(api.updateProfile, data, (res) => {
          dispatchAction(dispatch, IS_LOADING, false)
          dispatchAction(dispatch, SET_USER, res?.data)
          navigation.goBack()
          successToast(res.msg)
        }, () => {
          dispatchAction(dispatch, IS_LOADING, false)
        })
      } else {
        navigation.goBack()
      }
    }
  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={'Update Profile'} showLeft onLeftPress={() => navigation.goBack()} logoShow={false} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: wp(20) }}>
        <TouchableOpacity style={styles.uploadPhotoView}>
          <View>
            <TouchableOpacity onPress={() => setActionSheet(true)} style={styles.innerUploadView}>
              {image ?
                <Image style={styles.uploadImage} source={image?.path ? { uri: image.path } : { uri: api.IMAGE_URL + image }} />
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
        {user?.catchLine && <View style={styles.cardView}>
          <Text style={styles.cardText}>{user?.catchLine}</Text>
        </View>}
        <Input value={inputData?.firstName} label={'First Name'} placeholder={'First Name'} onChangeText={(text) => setInputData({ ...inputData, firstName: text })} />
        <Input value={inputData?.lastName} label={'Last Name'} placeholder={'Last Name'} onChangeText={(text) => setInputData({ ...inputData, lastName: text })} />
        <Input value={inputData?.catchLine} label={'Catchline'} placeholder={'Catchline'} onChangeText={(text) => setInputData({ ...inputData, catchLine: text })} />
        <Input label={'Your birthday'} type={'dob'} value={inputData.dob !== '' ? moment(inputData.dob).format('DD MMMM YYYY') : ''} onChangeText={(text) => setInputData({ ...inputData, dob: text })} placeholder={'Select your Birthdate'} />
        <Input placeholder={'City'} onChangeText={(text) => setInputData({ ...inputData, city: text })} value={inputData?.city} label={'City'} />
        <Input placeholder={'District'} onChangeText={(text) => setInputData({ ...inputData, district: text })} value={inputData?.district} label={'District'} />
        <Input placeholder={'State'} value={inputData?.state} label={'State'} onChangeText={(text) => setInputData({ ...inputData, state: text })} />
        {countries && <Input label={'Country (In Abroad)'} extraStyle={styles.input} value={inputData.country ? inputData.country?._id : ''} onChangeText={(text) => setInputData({ ...inputData, country: text })} placeholder={'Country'} type={'dropdown'} data={countries} labelField={'countryName'} valueField={'_id'} />}
        <Input value={inputData?.cityAbroad} label={'City (In Abroad)'} placeholder={'City (In Abroad)'} onChangeText={(text) => setInputData({ ...inputData, cityAbroad: text })} />
        <Input value={inputData?.university} label={'University/Company'} placeholder={'University/Company'} onChangeText={(text) => setInputData({ ...inputData, university: text })} />
        <Input value={inputData?.profession} label={'Profession'} placeholder={'Profession'} onChangeText={(text) => setInputData({ ...inputData, profession: text })} />
        <Input value={inputData?.link} label={'Link(If Any)'} placeholder={'Link'} onChangeText={(text) => setInputData({ ...inputData, link: text })} />
        <TouchableOpacity onPress={() => onSave()} style={[styles.btnView, { marginTop: 20 }]}>
          <Text style={styles.btnText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeleteModal(true)}
          style={[styles.btnView, { backgroundColor: colors.danger_500 }]}>
          <Text style={styles.btnText}>Delete Account</Text>
        </TouchableOpacity>
        <DeleteModal
          isVisible={deleteModal}
          onClose={() => {
            setDeleteModal(false);
          }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userIcon: {
    alignSelf: 'center',
  },
  cardView: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 12,
    marginBottom: 14,
    paddingHorizontal: 10
  },
  cardText: {
    textAlign: 'center',
    ...FontStyle(11, colors.neutral_500),
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    // marginHorizontal: wp(20),
    marginBottom: 10,
    borderRadius: 5,
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(15, colors.white),
    paddingVertical: 16,
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

});
