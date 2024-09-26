import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Image, Alert, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
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



export default function UpdatePostScreen() {
    const { goBack } = useNavigation()
    const [searchText, setSearchText] = useState('');
    const { likedUserList } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const { params } = useRoute()
    const [postText, setpostText] = useState('');
    const [imageArray, setimageArray] = useState([])
    const [deletedArray, setdeletedArray] = useState([])
    const { user, groupCreateAllUsers } = useSelector(e => e.common)
    const [previewModal, setpreviewModal] = useState(false)
    const insets = useSafeAreaInsets();
    const [selectedImage, setselectedImage] = useState(undefined)

    useEffect(() => {
        // setimageArray(params?.item?.mediaFiles)
        let temp = Object.assign([], params?.item?.mediaFiles)
        let text = params?.item?.message ? params?.item?.message : ''
        if (text !== '') {
            text = params?.item?.message.replace(/(?<=\s|^\s?)@[A-z0-9]+(?=\s|\s?$)/g, (match) => {
                return `{@}[${groupCreateAllUsers.filter(obj => obj._id == match.replace('@', ''))[0]?.first_Name} ${groupCreateAllUsers.filter(obj => obj._id == match.replace('@', ''))[0]?.last_Name}](${match.replace('@', '')})`
            });
        }
        setpostText(text)

        if (temp.length > 0) {
            temp.forEach(element => {
                if (element?.contentType.includes('video')) {
                    createThumbnail({
                        url: element.location,
                        timeStamp: 1000,
                    }).then(response => {
                        element.thumbnail = response.path
                    }).catch(err => console.log('er---', { err }));
                }
            });
        }
        setimageArray(temp)
    }, [])

    const openDocPicker = async (type) => {
        if (imageArray.length < 9) {
            ImageCropPicker.openPicker({ cropping: type == 'video' ? false : true, maxFiles: 9 - imageArray.length, multiple: false, mediaType: type, freeStyleCropEnabled: true, })
                .then(image => {
                    if (type == 'video') {
                        let temp = []
                        if (image.duration <= 120000 && image.size <= 300000000) {
                            createThumbnail({
                                url: image.path,
                                timeStamp: 1000,
                            }).then(response => {
                                image.thumbnail = response
                                temp.push(image)
                                setpreviewModal(true)
                                setselectedImage(image)
                            }).catch(err => console.log('err---', err));
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
        if (temp[index].location) {
            let deletArr = Object.assign([], deletedArray)
            deletArr.push(temp[index])
            setdeletedArray(deletArr)

            // let tempObj = {
            //     data: {
            //         postId: params?.item?._id,
            //         mediaPath: temp[index].path
            //     }
            // }
            // dispatch(onDeletePostMedia(tempObj))


        }
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
                        if (imageArray[index].mime) {
                            data['mediaFiles' + "[" + time + "]"] = {
                                uri: imageArray[index].path,
                                type: imageArray[index].mime, // or photo.type image/jpg
                                name: imageArray[index]?.mime.includes('image') ? 'image_[' + time + '].' + imageArray[index].path.split('.').pop() : 'video_[' + time + '].' + imageArray[index].path.split('.').pop(),
                            }
                        }
                    });

                }
            }
            data.postId = params?.item?._id
            data.message = replaceTriggerValues(postText.trim(), ({ id }) => `@${id}`)
            data.createdBy = user._id
            data.shareType = params?.item?.shareType
            data.type = params?.item?.type
            let formData = new FormData()
            if (data) {
                Object.keys(data).map((element) => {
                    if (data[element] !== undefined) {
                        formData.append(element, data[element]);
                    }
                });
            }
            if (deletedArray.length > 0) {
                deletedArray.forEach(element => {
                    let tempObj = {
                        data: {
                            postId: params?.item?._id,
                            mediaPath: element.path
                        }
                    }
                    dispatch(onDeletePostMedia(tempObj))
                });
            }
            dispatchAction(dispatch, IS_LOADING, true)
            formDataApiCall(api.updatePost, data, (res) => {
                dispatchAction(dispatch, IS_LOADING, false)
                goBack()
                successToast(res.msg)
            }, () => {
                dispatchAction(dispatch, IS_LOADING, false)
            })
        } else {
            errorToast('Please enter post text or select image')
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
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={'IndiansAbroad'} showLeft={true} showRight={false} onLeftPress={() => goBack()} />
            <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500, }}>
                <Text style={styles.chatText}>Update</Text>
            </View>
            <KeyboardAvoidingView
                {...(Platform.OS === 'ios'
                    ? {
                        behavior: 'padding',
                    }
                    : {})}>
                <ScrollView>
                    <View style={{ paddingHorizontal: 0, marginTop: 8, }}>
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
                    <TouchableOpacity onPress={() => onPressPublish()} style={styles.blueButton}>
                        <Text style={styles.publishText}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>



            </KeyboardAvoidingView>
            {selectedImage && previewModal && <ReactNativeModal onBackButtonPress={() => setpreviewModal(false)} onBackdropPress={() => setpreviewModal(false)} avoidKeyboard isVisible={previewModal} backdropOpacity={0}
                style={{ justifyContent: 'flex-end', margin: 0, }} >
                <View style={[styles.modalView, { height: SCREEN_HEIGHT - insets.top, backgroundColor: colors.white, borderTopEndRadius: 15, borderTopStartRadius: 15, borderWidth: 1, borderColor: colors.neutral_900, }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: wp(20), paddingTop: 20, justifyContent: 'space-between', marginTop: 10 }}>
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
        marginHorizontal: wp(14),
        marginBottom: 20,
        marginTop: 30,
        elevation: 1,
        borderWidth: 1,
        borderColor: colors.placeHolderColor
    },
    input: {
        height: 170,
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
})