import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import { useNavigation } from '@react-navigation/native';
import colors from '../Themes/Colors';
import { Icons } from '../Themes/Icons';
import { errorToast, FontStyle, ImageStyle, successToast } from '../utils/commonFunction';
import { SCREEN_HEIGHT, SCREEN_WIDTH, wp } from '../Themes/Fonts';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import ReactNativeModal from 'react-native-modal';
import CommonButton from '../Components/CommonButton';
import { dispatchAction, formDataApiCall } from '../utils/apiGlobal';
import { IS_LOADING } from '../Redux/ActionTypes';
import { api } from '../utils/apiConstants';
import { onGetThreadList } from '../Services/DiscussionServices';


export default function CreateDiscussion() {
  const { navigate, goBack } = useNavigation();
  const { discussionCountry, threadList, user } = useSelector(e => e.common)
  const [selectedType, setselectedType] = useState('')
  const [postText, setpostText] = useState('');
  const [postDes, setpostDes] = useState('');
  const [imageArray, setimageArray] = useState([])
  const dispatch = useDispatch()
  const [previewModal, setpreviewModal] = useState(false)
  const insets = useSafeAreaInsets();
  const [selectedImage, setselectedImage] = useState(undefined)
  const [selectedImageIndex, setselectedImageIndex] = useState(undefined)

  useEffect(() => {
    setpreviewModal(false)
    // setselectedImageIndex(undefined)
    // setselectedImage(undefined)
    // setpostText('')
    // setpostDes('')
    // setimageArray([])
  }, [])
  const openDocPicker = async (type) => {
    if (imageArray.length < 9) {
      ImageCropPicker.openPicker({ maxFiles: 9 - imageArray.length, multiple: type == 'video' ? false : true, mediaType: type, freeStyleCropEnabled: true, })
        .then(image => {
          if (type == 'video') {
            let temp = []
            if (image.duration <= 90000) {
              createThumbnail({
                url: image.path,
                timeStamp: 1000,
              }).then(response => {
                image.thumbnail = response
                temp.push(image)
                setimageArray([...imageArray, ...temp])
              }).catch(err => console.log('err---', err));
            } else {
              errorToast('Video should be less than 90 seconds')
            }
          } else {
            setimageArray([...imageArray, ...image])
          }
        })
        .catch(err => {
          console.log('err---', err)
        });
    } else {
      errorToast('You can select maximum 9 files')
    }
  };
  const onDelete = (index) => {
    let temp = Object.assign([], imageArray)
    temp.splice(index, 1)
    setimageArray(temp)
  }

  useEffect(() => {
    if (discussionCountry) {
      let temp = discussionCountry.filter(obj => obj.isSelected)
      setselectedType(temp[0])
    }
  }, [discussionCountry])

  const onPressRotate = () => {
    ImageCropPicker.openCropper({
      path: selectedImage.path,
      freeStyleCropEnabled: true,
      compressImageQuality: 1,
    }).then(image => {
      setselectedImage(image)
    });
  }
  const onPressSet = () => {
    let temp = Object.assign([], imageArray)
    temp.splice(selectedImageIndex, 1, selectedImage)
    setpreviewModal(false)
    setimageArray(temp)
  }

  const onPublish = () => {
    if (postText.trim().length > 0) {
      if (postDes.trim().length > 0) {
        let data = {}
        if (imageArray.length > 0) {
          if (imageArray.length > 9) {
            errorToast('You can select maximum 9 files')
          } else {
            imageArray.forEach((element, index) => {
              let time = new Date().getTime() + index
              data['mediaFiles' + "[" + time + "]"] = {
                uri: imageArray[index].path,
                type: imageArray[index].mime, // or photo.type image/jpg
                name: imageArray[index]?.mime.includes('image') ? 'image_[' + time + '].' + imageArray[index].path.split('.').pop() : 'video_[' + time + '].' + imageArray[index].path.split('.').pop(),
              }
            });
          }
        }

        data.title = postText.trim()
        data.createdBy = user._id
        data.message = postDes.trim()
        data.countryId = selectedType._id
        dispatchAction(dispatch, IS_LOADING, true)
        formDataApiCall(api.createThread, data, (res) => {
          dispatchAction(dispatch, IS_LOADING, false)
          let obj1 = {
            data: {
              page: 0,
              searchText: '',
              countryId: selectedType._id,
              userId: user?._id
            }
          }
          dispatch(onGetThreadList(obj1))
          goBack()
          successToast(res.msg)
        }, () => {
          dispatchAction(dispatch, IS_LOADING, false)
        })
      } else {
        errorToast('Please enter discription')
      }
    } else {
      errorToast('Please enter title')
    }
  }

  return (
    <View style={ApplicationStyles.flex}>
      <SafeAreaView
        style={[
          ApplicationStyles.applicationView,
          { backgroundColor: colors.secondary_500 },
        ]}>
        <Header
          title={''}
          logoShow={false}
          titleStyle={{ color: colors.primary_6a7e }}
          showLeft={true}
          onLeftPress={() => {
            goBack();
          }}
        />
        <Text style={styles.startText}>Start writing</Text>
        <Text style={styles.startText1}>
          Your thread will be posted in the {selectedType.countryName !== 'World Wide' ? 'Local' : selectedType.countryName} discussion forum
        </Text>
        <TextInput
          onChangeText={text => setpostText(text)}
          value={postText}
          style={styles.inputTitle}
          placeholder="Title"
          placeholderTextColor={colors.neutral_500}
          multiline={true}
        />
        <View style={styles.inputBox}>
          <TextInput
            onChangeText={text => setpostDes(text)}
            value={postDes}
            style={styles.input}
            placeholder="Write Here"
            multiline={true}
            placeholderTextColor={colors.neutral_500}
          />
          <View style={styles.rowView}>
            <TouchableOpacity onPress={() => openDocPicker('photo')} style={styles.button}>
              <Image source={Icons.photoUpload} style={styles.photoUpload} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openDocPicker('video')} style={styles.button}>
              <Image source={Icons.videoUpload} style={[styles.photoUpload, { bottom: 5.5, height: 34, width: 40 },]} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {imageArray.length > 0 &&
            <View style={styles.imageView}>
              {imageArray.map((item, index) => {
                return (
                  <TouchableOpacity onPress={() => {
                    if (item?.mime.includes('image')) { setpreviewModal(true), setselectedImage(item), setselectedImageIndex(index) }
                  }}>
                    {item?.mime.includes('image') ?
                      <Image source={{ uri: item.path }} style={styles.imageStyles} />
                      :
                      <Image source={{ uri: item.thumbnail.path }} style={styles.imageStyles} />
                    }
                    <TouchableOpacity onPress={() => onDelete(index)} style={styles.closeIconStyle}>
                      <Image source={Icons.closeRound} style={styles.closeIcon} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )
              })}
            </View>
          }
        </View>
        <TouchableOpacity onPress={() => onPublish()} style={styles.blueButton}>
          <Text style={styles.publishText}>Publish</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {selectedImage && previewModal && <ReactNativeModal onBackButtonPress={() => setpreviewModal(false)} onBackdropPress={() => setpreviewModal(false)} avoidKeyboard isVisible={previewModal} backdropOpacity={0}
        style={{ justifyContent: 'flex-end', margin: 0, }} >
        <View style={[styles.modalView, { height: SCREEN_HEIGHT - insets.top - 50, backgroundColor: colors.white, borderTopEndRadius: 15, borderTopStartRadius: 15, borderWidth: 1, borderColor: colors.neutral_900 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: wp(20), paddingTop: 20, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => setpreviewModal(false)} style={styles.backView}>
              <Image source={Icons.left_arrow} style={ImageStyle(15, 15)} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: wp(20) }}>
              <TouchableOpacity onPress={() => onPressRotate()} >
                <Text style={{ ...FontStyle(18, colors.neutral_900, '400'), }}>Rotate</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPressRotate()} >
                <Text style={{ ...FontStyle(18, colors.neutral_900, '400'), }}>Crop</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, marginVertical: 20 }}>
            {selectedImage?.mime.includes('image') ?
              <Image source={{ uri: selectedImage.path }} style={styles.imageStyles2} />
              :
              <Image source={{ uri: selectedImage.thumbnail.path }} style={styles.imageStyles2} />
            }
          </View>
          <CommonButton onPress={() => onPressSet()} title={'Set'} extraStyle={{ marginHorizontal: wp(20) }} />
          <View style={{ marginBottom: Platform.OS == 'android' ? 20 : insets.bottom }} />
        </View>
      </ReactNativeModal>}
    </View>

  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary_8091ba,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 5,
  },
  btnStyle: {
    width: SCREEN_WIDTH * 0.24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 2,
  },
  startText: {
    top: -12,
    textAlign: 'center',
    ...FontStyle(15, colors.neutral_900, '700'),
  },
  startText1: {
    textAlign: 'center',
    ...FontStyle(15, colors.primary_4574ca, '400'),
    marginHorizontal: 20
  },
  inputBox: {
    backgroundColor: colors.white,
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 5,
    borderWidth: 1
  },
  input: {
    height: 160,
    textAlignVertical: 'top',
    padding: 15,
    paddingLeft: 20,
    ...FontStyle(14, colors.neutral_900),
  },
  inputTitle: {
    ...FontStyle(14, colors.neutral_900),
    backgroundColor: colors.white,
    marginHorizontal: wp(20),
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    paddingLeft: 20,
    minHeight: 47
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  photoUpload: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  publishText: {
    ...FontStyle(14, colors.white),
  },
  blueButton: {
    backgroundColor: colors.buttonBlue,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    width: 87,
    alignItems: 'center',
    borderRadius: 4,
  },
  imageView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginHorizontal: wp(14),
    gap: 10
  },
  imageStyles: { height: 60, width: (SCREEN_WIDTH - wp(28) - 50) / 5 },
  imageStyles2: {
    flex: 1, width: SCREEN_WIDTH - 10, resizeMode: 'contain', marginHorizontal: 5
  },
  closeIconStyle: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 50,
    right: -8,
    top: -8,
    padding: 3
  },
  closeIcon: {
    height: 20,
    width: 20,
  }
});
