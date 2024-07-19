import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontStyle, successToast } from '../utils/commonFunction'
import { SCREEN_WIDTH, fontname, wp } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import SearchBar from '../Components/SearchBar'
import RenderUserIcon from '../Components/RenderUserIcon'
import { useDispatch, useSelector } from 'react-redux'
import { onDeletePostMedia, onGetLikedUserList } from '../Services/PostServices'
import { api } from '../utils/apiConstants'
import NoDataFound from '../Components/NoDataFound'
import { Icons } from '../Themes/Icons'
import { createThumbnail } from "react-native-create-thumbnail";
import FastImage from 'react-native-fast-image'
import ImageCropPicker from 'react-native-image-crop-picker'
import { dispatchAction, formDataApiCall } from '../utils/apiGlobal'
import { IS_LOADING } from '../Redux/ActionTypes'

export default function UpdatePostScreen() {
    const { goBack } = useNavigation()
    const [searchText, setSearchText] = useState('');
    const { likedUserList } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const { params } = useRoute()
    const [postText, setpostText] = useState('');
    const [imageArray, setimageArray] = useState([])
    const [deletedArray, setdeletedArray] = useState([])
    const { user } = useSelector(e => e.common)

    useEffect(() => {
        // setimageArray(params?.item?.mediaFiles)
        let temp = Object.assign([], params?.item?.mediaFiles)
        setpostText(params?.item?.message ? params?.item?.message : '')
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

    console.log(' params?.item---', params?.item)

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
                            }).catch(err => console.log({ err }));
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
        if (temp[index].location) {
            let deletArr = Object.assign([], deletedArray)
            deletArr.push(temp[index])
            setdeletedArray(deletArr)
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
                        console.log('element---', element)
                        let time = new Date().getTime() + index
                        if (imageArray[index].mime) {
                            data['mediaFiles' + "[" + time + "]"] = {
                                uri: imageArray[index].path,
                                type: imageArray[index].mime, // or photo.type image/jpg
                                name: imageArray[index]?.mime.includes('image') ? 'image_[' + time + '].' + imageArray[index].path.split('.').pop() : 'video_[' + time + '].' + imageArray[index].path.split('.').pop(),
                            }
                        }
                    });
                    // imageArray.forEach((element, index) => {
                    //     let time = new Date().getTime() + index
                    //     if (imageArray[index].mime) {
                    //         tempArray.push('mediaFiles' + "[" + time + "]");
                    //         tempArray.push({
                    //             uri: imageArray[index].path,
                    //             type: imageArray[index].mime, // or photo.type image/jpg
                    //             name: imageArray[index]?.mime.includes('image') ? 'image_[' + time + '].' + imageArray[index].path.split('.').pop() : 'video_[' + time + '].' + imageArray[index].path.split('.').pop(),
                    //         });
                    //     }
                    // });
                    // var ob2 = {};
                    // for (var i = 0; i < tempArray.length; i += 2) {
                    //     ob2[tempArray[i]] = tempArray[i + 1];
                    // }
                    // data = { ...data, ...ob2 }
                }
            }
            data.postId = params?.item?._id
            data.message = postText.trim()
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

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header
                title={'IndiansAbroad'}
                showLeft={true}
                showRight={false}
                onLeftPress={() => goBack()}
            />
            <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500, }}>
                <Text style={styles.chatText}>Update</Text>

            </View>
            <View style={{ paddingHorizontal: 0, marginTop: 8, }}>

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
    }
})