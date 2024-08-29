import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_HEIGHT, SCREEN_WIDTH, fontname, hp, wp } from '../Themes/Fonts';
import { FontStyle, ImageStyle, errorToast, successToast } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import PostCard from '../Components/PostCard';
import ModalContainer from '../Components/ModalContainer';
import { Icons } from '../Themes/Icons';
import { openImagePickerForMultiple } from '../utils/Global';
import ImageCropPicker from 'react-native-image-crop-picker';
import { createThumbnail } from "react-native-create-thumbnail";
import { getalluserposts, onCreatePost } from '../Services/PostServices';
import { api } from '../utils/apiConstants';
import { dispatchAction, formDataApiCall } from '../utils/apiGlobal';
import { IS_LOADING } from '../Redux/ActionTypes';
import ReactNativeModal from 'react-native-modal';
import { navigationRef } from '../Navigation/RootContainer';
import { screenName } from '../Navigation/ScreenConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonButton from './CommonButton';
import { getAllPagePost } from '../Services/OtherUserServices';


export default function CreatePost({ createPostModal, setcreatePostModal, isMyPage = false, page }) {
  const [postText, setpostText] = useState('');
  const [imageArray, setimageArray] = useState([])
  const { user } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const [previewModal, setpreviewModal] = useState(false)
  const insets = useSafeAreaInsets();
  const [selectedImage, setselectedImage] = useState(undefined)
  const [selectedImageIndex, setselectedImageIndex] = useState(undefined)

  useEffect(() => {
    setpreviewModal(false)
    setselectedImageIndex(undefined)
    setselectedImage(undefined)
    setpostText('')
    setimageArray([])
  }, [])
  const openDocPicker = async (type) => {
    console.log('type',type);
    
    if (imageArray.length < 9) {
      ImageCropPicker.openPicker({ cropping:  type == 'video' ? false : true, maxFiles: 9 - imageArray.length, multiple: type == 'video' ? false : true, mediaType: type, freeStyleCropEnabled: true, })
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
  const onPressPublish = () => {
    if (postText.trim().length > 0 || imageArray.length > 0) {
      let data = {}
      let tempArray = [];
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
      data.message = postText.trim()
      data.createdBy = user._id
      data.shareType = 'public'
      data.type = isMyPage ? 'cppost' : 'post'
      if (page) {
        data.cpId = page._id
      }
      setcreatePostModal(false)
      dispatchAction(dispatch, IS_LOADING, true)
      formDataApiCall(api.createPost, data, (res) => {
        dispatchAction(dispatch, IS_LOADING, false)
        let obj1 = {
          data: {
            createdBy: user?._id,
            page: 1,
            limit: 0,
          },
        };
        setimageArray([])
        setpostText('')
        if (isMyPage) {
          let obj = {
            params: {
              userId: user?._id,
            },
            pageId: page._id,
          };
          dispatch(getAllPagePost(obj));
        } else {
          dispatch(getalluserposts(obj1));
        }
        successToast(res.msg)
      }, () => {
        dispatchAction(dispatch, IS_LOADING, false)
      })
      // }, 5000);
    } else {
      errorToast('Please enter post text or select image')
    }
  }
  const onCloseModal = () => {
    Alert.alert('Do you really want to discard the post ?', '', [
      {
        text: 'NO',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'YES', onPress: () => setcreatePostModal(false) },
    ]);
  }
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

  return (
    <ReactNativeModal onBackButtonPress={() => Keyboard.dismiss()} onBackdropPress={() => Keyboard.dismiss()} avoidKeyboard isVisible={createPostModal} backdropOpacity={0}
      style={{ justifyContent: 'flex-end', margin: 0 }} >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={styles.modalView}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: wp(20), paddingTop: 28, }}>
            <TouchableOpacity onPress={() => onCloseModal()} style={styles.backView}>
              <Image source={Icons.left_arrow} style={ImageStyle(15, 15)} />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Create Post</Text>
            </View>
          </View>
          <View style={styles.inputBox}>
            <TextInput onChangeText={text => setpostText(text)} value={postText} style={styles.input} placeholder="Write Here" multiline={true} placeholderTextColor={colors.neutral_500} />
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
          <TouchableOpacity onPress={() => onPressPublish()} style={styles.blueButton}>
            <Text style={styles.publishText}>Publish</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
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
    </ReactNativeModal>

  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  title: {
    ...FontStyle(18, colors.neutral_900, '400'),
    right: 18,
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: colors.inputBg,
  },
  backView: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderColor: colors.primary_500,
    backgroundColor: colors.btnBg,
  },
  inputBox: {
    backgroundColor: colors.white,
    borderRadius: 4,
    marginHorizontal: wp(14),
    marginBottom: 20,
    marginTop: 30,
    elevation: 1,
  },
  input: {
    height: hp(170),
    textAlignVertical: 'top',
    padding: 15,
    ...FontStyle(14, colors.neutral_900),
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
  publishText: {
    ...FontStyle(14, colors.white),
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
