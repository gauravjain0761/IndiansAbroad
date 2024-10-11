import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Image, Alert, Keyboard, TouchableWithoutFeedback, Platform, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SCREEN_HEIGHT, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle, errorToast, renameKey, successToast } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { Icons } from '../../Themes/Icons';
import ImageCropPicker from 'react-native-image-crop-picker';
import { createThumbnail } from "react-native-create-thumbnail";
import { getalluserposts, onDeletePostMedia } from '../../Services/PostServices';
import { api } from '../../utils/apiConstants';
import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal';
import { IS_LOADING } from '../../Redux/ActionTypes';
import ReactNativeModal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAllPagePost } from '../../Services/OtherUserServices';
import Video from 'react-native-video';
import { replaceTriggerValues, useMentions } from 'react-native-controlled-mentions';
import TagUserInput from '../../Components/TagUserInput';
import CommonButton from '../../Components/CommonButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../Components/Header';
import FastImage from 'react-native-fast-image';
import { onGetThreadList } from '../../Services/DiscussionServices';



export default function CreateDiscussion() {
  const { goBack } = useNavigation()
  const [searchText, setSearchText] = useState('');
  const { discussionCountry, threadList, user, groupCreateAllUsers } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const { params } = useRoute()
  const [postText, setpostText] = useState('');
  const [imageArray, setimageArray] = useState([])
  const [deletedArray, setdeletedArray] = useState([])
  const [previewModal, setpreviewModal] = useState(false)
  const insets = useSafeAreaInsets();
  const [selectedImage, setselectedImage] = useState(undefined)
  const [postTitle, setpostTitle] = useState('');
  const [selectedType, setselectedType] = useState('')

  const openDocPicker = async (type) => {
    if (imageArray.length < 9) {
      await ImageCropPicker.openPicker({ cropping: type == 'video' ? false : true, maxFiles: 9 - imageArray.length, multiple: false, mediaType: type, freeStyleCropEnabled: true, })
        .then(async (image) => {
          if (type == 'video') {
            let temp = []
            if (image.duration <= 120000 && image.size <= 300000000) {
              dispatchAction(dispatch, IS_LOADING, true)
              await createThumbnail({
                url: image.path,
                timeStamp: 1000,
              }).then(response => {
                dispatchAction(dispatch, IS_LOADING, false)
                image.thumbnail = response
                temp.push(image)
                setpreviewModal(true)
                setselectedImage(image)
              }).catch(err => {
                dispatchAction(dispatch, IS_LOADING, false)
                console.log('err---', err)
              });
            } else {
              errorToast('Video should be less than 120 seconds and 300 MB ')
            }

          } else {
            if (image.size <= 20000000) {
              setimageArray([...imageArray, image])
            } else {
              errorToast('Image should be less than 20 MB')
            }
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

  const onPublish = () => {
    if (postTitle.trim().length > 0) {
      if (postText.trim().length > 0) {
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
        data.title = postTitle.trim()
        data.createdBy = user._id
        data.message = replaceTriggerValues(postText.trim(), ({ id }) => `@${id}`)
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
  const onPressAdd = () => {
    setimageArray([...imageArray, selectedImage])
    setpreviewModal(false)
    setselectedImage(undefined)
  }

  const triggersConfig = {
    mention: {
      trigger: '@',
      textStyle: { ...FontStyle(15, colors.primary_4574ca, '700') },
      isInsertSpaceAfterMention: true
    },
  };

  const { textInputProps, triggers } = useMentions({
    value: postText,
    onChange: setpostText,
    triggersConfig,
  });

  return (
    <SafeAreaView style={[ApplicationStyles.applicationView, { backgroundColor: colors.secondary_500 }]}>
      <Header showLeft={true} title={''} showRight={false} onLeftPress={() => goBack()} />
      <KeyboardAvoidingView
        {...(Platform.OS === 'ios'
          ? {
            behavior: 'padding',
          }
          : {})}>
        <ScrollView>
          <Text style={styles.startText}>Start writing</Text>
          <Text style={styles.startText1}>
            Your thread will be posted in the {selectedType.countryName !== 'World Wide' ? 'Local' : selectedType.countryName} discussion forum
          </Text>
          <View style={{ paddingHorizontal: 0, marginTop: 8, }}>

            <TextInput
              onChangeText={text => setpostTitle(text)}
              value={postTitle}
              style={styles.inputTitle}
              placeholder="Title"
              placeholderTextColor={colors.neutral_500}
              multiline={true}
              maxLength={100}
            />
            <View style={styles.inputBox}>
              <TextInput maxLength={2000}  {...textInputProps} style={styles.input} placeholder="Write Here" multiline={true} placeholderTextColor={colors.neutral_500} />
              <TagUserInput {...triggers.mention} data={!groupCreateAllUsers ? [] : renameKey(groupCreateAllUsers.filter(obj => obj._id !== user._id))} />
              <View style={styles.rowView}>
                <TouchableOpacity onPress={() => openDocPicker('photo')} style={styles.button}>
                  <Image source={Icons.photoUpload} style={styles.photoUpload} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openDocPicker('video')} style={styles.button}>
                  <Image source={Icons.videoUpload} style={[styles.photoUpload, { bottom: 5.5, height: 34, width: 40 },]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {imageArray.length > 0 &&
            <View style={styles.imageView}>
              {imageArray.map((elem, index) => {
                return (
                  <View >
                    {elem?.location ?
                      elem?.contentType.includes('image') ?
                        <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: elem.location }} style={styles.imageStyles} />
                        :
                        <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: elem.thumbnail ? elem.thumbnail : params?.item?.thumbNail?.location }} style={styles.imageStyles} />
                      :
                      elem?.mime.includes('image') ?
                        <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: elem.path }} style={styles.imageStyles} />
                        :
                        <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: elem.thumbnail?.path }} style={styles.imageStyles} />
                    }
                    <TouchableOpacity onPress={() => onDelete(index)} style={styles.closeIconStyle}>
                      <Image source={Icons.closeRound} style={styles.closeIcon} />
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          }
          <TouchableOpacity onPress={() => onPublish()} style={styles.blueButton}>
            <Text style={styles.publishText}>Publish</Text>
          </TouchableOpacity>
        </ScrollView>



      </KeyboardAvoidingView>
      {selectedImage && previewModal && <ReactNativeModal onBackButtonPress={() => setpreviewModal(false)} onBackdropPress={() => setpreviewModal(false)} avoidKeyboard isVisible={previewModal} backdropOpacity={0}
        style={{ justifyContent: 'flex-end', margin: 0, }} >
        <View style={[styles.modalView, { height: SCREEN_HEIGHT - insets.top, backgroundColor: colors.white, borderTopEndRadius: 15, borderTopStartRadius: 15, borderWidth: 1, borderColor: colors.neutral_900, }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: wp(20), paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight + 10 : 20, justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity onPress={() => setpreviewModal(false)} style={styles.backView}>
              <Image source={Icons.left_arrow} style={ImageStyle(15, 15)} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginVertical: 20 }}>
            <Video
              source={{ uri: selectedImage.path }}
              playInBackground={false}
              paused={true}
              muted={false}
              controls={true}
              resizeMode={'contain'}
              poster={selectedImage.thumbnail}
              onError={(err) => console.log(err)}
              style={styles.imageStyles2}
            />

          </View>
          <CommonButton onPress={() => onPressAdd()} title={'Add'} extraStyle={{ marginHorizontal: wp(20) }} />
          <View style={{ marginBottom: Platform.OS == 'android' ? 20 : insets.bottom }} />
        </View>
      </ReactNativeModal>}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  chatText: {
    // top: -19,
    textAlign: 'center',
    ...FontStyle(18, colors.secondary_600, '700'),
    marginVertical: 5
  },
  listText: {
    ...FontStyle(14, colors.neutral_900),
    marginLeft: 15,
    flex: 1
  },
  listView: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: colors.neutral_400,
    backgroundColor: colors.inputBg,
    marginHorizontal: 8
  },
  lineStyle: {
    borderWidth: 0.6,
    marginVertical: 6,
    borderColor: colors.secondary_500
  },
  inputBox: {
    backgroundColor: colors.white,
    borderRadius: 4,
    marginHorizontal: wp(20),
    marginBottom: 20,
    marginTop: 10,
    elevation: 1,
    borderWidth: 1,

  },
  input: {
    height: 100,
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
  imageStyles: {
    height: 60,
    width: (SCREEN_WIDTH - wp(28) - 50) / 5,
    resizeMode: 'cover',
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
  },
  backView: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderColor: colors.primary_500,
    backgroundColor: colors.btnBg,
  },
  modalView: {
    backgroundColor: colors.inputBg,
  },
  imageStyles2: {
    flex: 1, width: SCREEN_WIDTH - 10, resizeMode: 'contain', marginHorizontal: 5
  },
  startText: {
    // top: -12,
    textAlign: 'center',
    ...FontStyle(15, colors.neutral_900, '700'),
  },
  startText1: {
    textAlign: 'center',
    ...FontStyle(15, colors.primary_4574ca, '400'),
    marginHorizontal: 20
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
    minHeight: 47,
  },
})






// import {
//   Alert,
//   Image,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   KeyboardAvoidingView,
//   ScrollView,
//   StatusBar
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import ApplicationStyles from '../../Themes/ApplicationStyles';
// import Header from '../../Components/Header';
// import { useNavigation } from '@react-navigation/native';
// import colors from '../../Themes/Colors';
// import { Icons } from '../../Themes/Icons';
// import { errorToast, FontStyle, ImageStyle, renameKey, successToast } from '../../utils/commonFunction';
// import { SCREEN_HEIGHT, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import ImageCropPicker from 'react-native-image-crop-picker';
// import { createThumbnail } from 'react-native-create-thumbnail';
// import ReactNativeModal from 'react-native-modal';
// import CommonButton from '../../Components/CommonButton';
// import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal';
// import { IS_LOADING } from '../../Redux/ActionTypes';
// import { api } from '../../utils/apiConstants';
// import { onGetThreadList } from '../../Services/DiscussionServices';
// import Video, { VideoRef } from 'react-native-video';
// import { replaceTriggerValues, useMentions } from 'react-native-controlled-mentions';
// import TagUserInput from '../../Components/TagUserInput';

// export default function CreateDiscussion() {
//   const { navigate, goBack } = useNavigation();
//   const { discussionCountry, threadList, user, groupCreateAllUsers } = useSelector(e => e.common)
//   const [selectedType, setselectedType] = useState('')
//   const [postText, setpostText] = useState('');
//   const [postDes, setpostDes] = useState('');
//   const [imageArray, setimageArray] = useState([])
//   const dispatch = useDispatch()
//   const [previewModal, setpreviewModal] = useState(false)
//   const insets = useSafeAreaInsets();
//   const [selectedImage, setselectedImage] = useState(undefined)
//   const [selectedImageIndex, setselectedImageIndex] = useState(undefined)

//   const triggersConfig = {
//     mention: {
//       trigger: '@',
//       textStyle: { ...FontStyle(15, colors.primary_4574ca, '700') },
//       isInsertSpaceAfterMention: true,
//     },
//   };

//   const { textInputProps, triggers } = useMentions({
//     value: postDes,
//     onChange: setpostDes,
//     triggersConfig
//   });


//   useEffect(() => {
//     setpreviewModal(false)
//     // setselectedImageIndex(undefined)
//     // setselectedImage(undefined)
//     // setpostText('')
//     // setpostDes('')
//     // setimageArray([])
//   }, [])
//   const openDocPicker = async (type) => {
//     if (imageArray.length < 9) {
//       await ImageCropPicker.openPicker({ cropping: type == 'video' ? false : true, maxFiles: 9 - imageArray.length, multiple: false, mediaType: type, freeStyleCropEnabled: true, })
//         .then(async (image) => {

//           if (type == 'video') {
//             let temp = []
//             if (image.duration <= 120000 && image.size <= 300000000) {
//               dispatchAction(dispatch, IS_LOADING, true)
//               await createThumbnail({
//                 url: image.path,
//                 timeStamp: 1000,
//               }).then(response => {
//                 dispatchAction(dispatch, IS_LOADING, false)
//                 setTimeout(() => {
//                   image.thumbnail = response
//                   temp.push(image)
//                   setpreviewModal(true)
//                   setselectedImage(image)
//                 }, 1000);

//               }).catch(err => {
//                 dispatchAction(dispatch, IS_LOADING, false)
//                 console.log('err---', err)
//               });
//             } else {
//               errorToast('Video should be less than 120 seconds and 300 MB ')
//             }
//           } else {
//             if (image.size <= 20000000) {
//               setTimeout(() => {
//                 let temp = Object.assign([], imageArray)
//                 temp.push(image)
//                 setimageArray(temp)
//               }, 1000);

//             } else {
//               errorToast('Image should be less than 20 MB')
//             }
//           }
//         })
//         .catch(err => {
//           console.log('err---', err)
//         });
//     } else {
//       errorToast('You can select maximum 9 files')
//     }
//   };
//   const onDelete = (index) => {
//     let temp = Object.assign([], imageArray)
//     temp.splice(index, 1)
//     setimageArray(temp)
//   }

//   useEffect(() => {
//     if (discussionCountry) {
//       let temp = discussionCountry.filter(obj => obj.isSelected)
//       setselectedType(temp[0])
//     }
//   }, [discussionCountry])

//   const onPressAdd = () => {
//     let temp = Object.assign([], imageArray)
//     temp.push(selectedImage)
//     setimageArray(temp)
//     // setimageArray([...imageArray, selectedImage])
//     setpreviewModal(false)
//     setselectedImage(undefined)
//   }

//   const onPublish = () => {
//     if (postText.trim().length > 0) {
//       if (postDes.trim().length > 0) {
//         let data = {}
//         if (imageArray.length > 0) {
//           if (imageArray.length > 9) {
//             errorToast('You can select maximum 9 files')
//           } else {
//             imageArray.forEach((element, index) => {
//               let time = new Date().getTime() + index
//               data['mediaFiles' + "[" + time + "]"] = {
//                 uri: imageArray[index].path,
//                 type: imageArray[index].mime, // or photo.type image/jpg
//                 name: imageArray[index]?.mime.includes('image') ? 'image_[' + time + '].' + imageArray[index].path.split('.').pop() : 'video_[' + time + '].' + imageArray[index].path.split('.').pop(),
//               }
//             });
//           }
//         }
//         data.title = postText.trim()
//         data.createdBy = user._id
//         data.message = replaceTriggerValues(postDes.trim(), ({ id }) => `@${id}`)
//         data.countryId = selectedType._id
//         dispatchAction(dispatch, IS_LOADING, true)
//         formDataApiCall(api.createThread, data, (res) => {
//           dispatchAction(dispatch, IS_LOADING, false)
//           let obj1 = {
//             data: {
//               page: 0,
//               searchText: '',
//               countryId: selectedType._id,
//               userId: user?._id
//             }
//           }
//           dispatch(onGetThreadList(obj1))
//           goBack()
//           successToast(res.msg)
//         }, () => {
//           dispatchAction(dispatch, IS_LOADING, false)
//         })
//       } else {
//         errorToast('Please enter discription')
//       }
//     } else {
//       errorToast('Please enter title')
//     }
//   }

//   return (
//     <SafeAreaView style={[
//       ApplicationStyles.applicationView,
//       { backgroundColor: colors.secondary_500 },
//     ]}>

//       <Header
//         title={''}
//         logoShow={false}
//         titleStyle={{ color: colors.primary_6a7e }}
//         showLeft={true}
//         onLeftPress={() => {
//           goBack();
//         }}
//       />
//       <KeyboardAvoidingView {...(Platform.OS === 'ios' ? { behavior: 'padding', } : {})}>
//         {/* <ScrollView nestedScrollEnabled> */}
//         <Text style={styles.startText}>Start writing</Text>
//         <Text style={styles.startText1}>
//           Your thread will be posted in the {selectedType.countryName !== 'World Wide' ? 'Local' : selectedType.countryName} discussion forum
//         </Text>
//         <TextInput
//           onChangeText={text => setpostText(text)}
//           value={postText}
//           style={styles.inputTitle}
//           placeholder="Title"
//           placeholderTextColor={colors.neutral_500}
//           multiline={true}
//           maxLength={100}
//         />
//         <View style={styles.inputBox}>
//           <TextInput
//             // onChangeText={text => setpostDes(text)}
//             // value={postDes}
//             {...textInputProps}
//             style={styles.input}
//             placeholder="Write Here"
//             multiline={true}
//             maxLength={2000}
//             placeholderTextColor={colors.neutral_500}
//           />
//           <TagUserInput {...triggers.mention} data={!groupCreateAllUsers ? [] : renameKey(groupCreateAllUsers.filter(obj => obj._id !== user._id))} />
//           <View style={styles.rowView}>
//             <TouchableOpacity onPress={() => openDocPicker('photo')} style={styles.button}>
//               <Image source={Icons.photoUpload} style={styles.photoUpload} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => openDocPicker('video')} style={styles.button}>
//               <Image source={Icons.videoUpload} style={[styles.photoUpload, { bottom: 5.5, height: 34, width: 40 },]} />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View>
//           <Text>{imageArray?.length}</Text>

//           {imageArray?.length > 0 &&
//             <View style={styles.imageView}>
//               {imageArray?.map((item, index) => {
//                 return (
//                   <View key={index} >
//                     <Text>{index}</Text>
//                     {/* {item?.mime.includes('image') ?
//                         <Image source={{ uri: item.path }} style={styles.imageStyles} />
//                         :
//                         <Image source={{ uri: item.thumbnail.path }} style={styles.imageStyles} />
//                       } */}
//                     <TouchableOpacity onPress={() => onDelete(index)} style={styles.closeIconStyle}>
//                       <Image source={Icons.closeRound} style={styles.closeIcon} />
//                     </TouchableOpacity>
//                   </View>
//                 )
//               })}
//             </View>
//           }
//           {/* {imageArray.length > 0 &&
//               <View style={styles.imageView}>
//                 {imageArray.map((item, index) => {
//                   return (
//                     <View
//                     //  onPress={() => {
//                     //   if (item?.mime.includes('image')) { setpreviewModal(true), setselectedImage(item), setselectedImageIndex(index) }
//                     // }}
//                     >
//                       {item?.mime.includes('image') ?
//                         <Image source={{ uri: item.path }} style={styles.imageStyles} />
//                         :
//                         <Image source={{ uri: item.thumbnail.path }} style={styles.imageStyles} />
//                       }
//                       <TouchableOpacity onPress={() => onDelete(index)} style={styles.closeIconStyle}>
//                         <Image source={Icons.closeRound} style={styles.closeIcon} />
//                       </TouchableOpacity>
//                     </View>
//                   )
//                 })}
//               </View>
//             } */}
//         </View>
//         <TouchableOpacity onPress={() => onPublish()} style={styles.blueButton}>
//           <Text style={styles.publishText}>Publish</Text>
//         </TouchableOpacity>
//         {/* </ScrollView> */}
//       </KeyboardAvoidingView>
//       {selectedImage && previewModal && <ReactNativeModal onBackButtonPress={() => setpreviewModal(false)} onBackdropPress={() => setpreviewModal(false)} avoidKeyboard isVisible={previewModal} backdropOpacity={0}
//         style={{ justifyContent: 'flex-end', margin: 0, }} >
//         <View style={[styles.modalView, { height: SCREEN_HEIGHT - insets.top, backgroundColor: colors.white, borderTopEndRadius: 15, borderTopStartRadius: 15, borderWidth: 1, borderColor: colors.neutral_900 }]}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: wp(20), paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight + 10 : 20, justifyContent: 'space-between' }}>
//             <TouchableOpacity onPress={() => setpreviewModal(false)} style={styles.backView}>
//               <Image source={Icons.left_arrow} style={ImageStyle(15, 15)} />
//             </TouchableOpacity>
//             {/* <View style={{ flexDirection: 'row', gap: wp(20) }}>
//               <TouchableOpacity onPress={() => onPressRotate()} >
//                 <Text style={{ ...FontStyle(18, colors.neutral_900, '400'), }}>Rotate</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => onPressRotate()} >
//                 <Text style={{ ...FontStyle(18, colors.neutral_900, '400'), }}>Crop</Text>
//               </TouchableOpacity>
//             </View> */}
//           </View>
//           <View style={{ flex: 1, marginVertical: 20 }}>
//             {/* {selectedImage?.mime.includes('image') ?
//               <Image source={{ uri: selectedImage.path }} style={styles.imageStyles2} />
//               :
//               <Image source={{ uri: selectedImage.thumbnail.path }} style={styles.imageStyles2} />
//             } */}

//             <Video
//               // Can be a URL or a local file.
//               source={{ uri: selectedImage.path }}
//               playInBackground={false}
//               paused={true}
//               muted={false}
//               controls={true}
//               resizeMode={'contain'}
//               poster={selectedImage.thumbnail}
//               // posterResizeMode='cover'
//               onError={(err) => console.log(err)}
//               style={styles.imageStyles2}
//             />

//           </View>
//           <CommonButton onPress={() => onPressAdd()} title={'Add'} extraStyle={{ marginHorizontal: wp(20) }} />
//           <View style={{ marginBottom: Platform.OS == 'android' ? 20 : insets.bottom }} />
//         </View>
//       </ReactNativeModal>}
//     </SafeAreaView>

//   );
// }

// const styles = StyleSheet.create({
//   topHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.primary_8091ba,
//     paddingHorizontal: 3,
//     paddingVertical: 3,
//     borderRadius: 5,
//   },
//   btnStyle: {
//     width: SCREEN_WIDTH * 0.24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//     paddingVertical: 2,
//   },
//   startText: {
//     // top: -12,
//     textAlign: 'center',
//     ...FontStyle(15, colors.neutral_900, '700'),
//   },
//   startText1: {
//     textAlign: 'center',
//     ...FontStyle(15, colors.primary_4574ca, '400'),
//     marginHorizontal: 20
//   },
//   inputBox: {
//     backgroundColor: colors.white,
//     borderRadius: 4,
//     marginHorizontal: 20,
//     marginBottom: 18,
//     borderRadius: 5,
//     borderWidth: 1
//   },
//   input: {
//     height: 100,
//     textAlignVertical: 'top',
//     padding: 15,
//     paddingLeft: 20,
//     ...FontStyle(14, colors.neutral_900),
//   },
//   inputTitle: {
//     ...FontStyle(14, colors.neutral_900),
//     backgroundColor: colors.white,
//     marginHorizontal: wp(20),
//     marginBottom: 10,
//     borderWidth: 1,
//     borderRadius: 5,
//     marginTop: 20,
//     paddingLeft: 20,
//     minHeight: 47,
//   },
//   rowView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   button: {
//     padding: 10,
//   },
//   photoUpload: {
//     height: 40,
//     width: 40,
//     resizeMode: 'contain',
//   },
//   publishText: {
//     ...FontStyle(14, colors.white),
//   },
//   blueButton: {
//     backgroundColor: colors.buttonBlue,
//     alignSelf: 'flex-end',
//     marginHorizontal: 20,
//     marginBottom: 20,
//     paddingVertical: 10,
//     width: 87,
//     alignItems: 'center',
//     borderRadius: 4,
//   },
//   imageView: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//     marginHorizontal: wp(14),
//     gap: 10
//   },
//   imageStyles: { height: 60, width: (SCREEN_WIDTH - wp(28) - 50) / 5 },
//   imageStyles2: {
//     flex: 1, width: SCREEN_WIDTH - 10, resizeMode: 'contain', marginHorizontal: 5
//   },
//   closeIconStyle: {
//     position: 'absolute',
//     backgroundColor: colors.white,
//     borderRadius: 50,
//     right: -8,
//     top: -8,
//     padding: 3
//   },
//   closeIcon: {
//     height: 20,
//     width: 20,
//   },
//   backView: {
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//     borderColor: colors.primary_500,
//     backgroundColor: colors.btnBg,
//   },
// });
