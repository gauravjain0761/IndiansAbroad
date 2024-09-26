import { Image, ImageBackground, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle, ImageStyle, errorToast, successToast } from '../../utils/commonFunction'
import { fontname, hp, SCREEN_WIDTH, wp } from '../../Themes/Fonts'
import Input from '../../Components/Input'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../../Navigation/ScreenConstants'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import Header from '../../Components/Header'
import Modal from 'react-native-modal';
import ActionSheet from '../../Components/ActionSheet'
import ImageCropPicker from 'react-native-image-crop-picker'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal'
import { IS_LOADING, SET_USER } from '../../Redux/ActionTypes'
import { api } from '../../utils/apiConstants'
import { setAsyncUserInfo } from '../../utils/AsyncStorage'
import RNFS from 'react-native-fs';

export default function CompleteProfile() {
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
    const [actionSheet, setActionSheet] = useState(false);
    const closeActionSheet = () => setActionSheet(false);
    const [image, setimage] = useState(undefined)
    const [gender, setgender] = useState('')
    const [dob, setdob] = useState('')
    const { user, googleUser } = useSelector(e => e.common)
    const [googleUrlImage, setgoogleUrlImage] = useState('')
    const dispatch = useDispatch()
    let data = [
        { title: 'Male', icon: Icons.maleGender },
        { title: 'Female', icon: Icons.femenine },
        { title: 'Other', icon: Icons.star }
    ]

    useEffect(() => {
        if (googleUser) {
            setgender(googleUser?.gender ? googleUser?.gender : '')
            // setimage({ path: googleUser?.photo })
            getImage()
        }
    }, [])

    const getImage = async () => {

        const newPath = `${RNFS.DocumentDirectoryPath}/google_user_${moment().unix()}.png`;
        setgoogleUrlImage(newPath)
        const downloadResult = await RNFS.downloadFile({
            fromUrl: googleUser?.photo,
            toFile: newPath,
        }).promise;

        // Check if the download was successful
        if (downloadResult.statusCode !== 200) {
            throw new Error('Failed to download image');
        }


        setimage({
            path: `file://${newPath}`,
            mime: 'image/png',
        })


    }
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
                if (image.size <= 20000000) {
                    setimage(image)
                } else {
                    errorToast('Image should be less than 20 MB')
                }
            }).catch(error => { console.log('err---', error); });
        }, 500);

    };

    const onNext = () => {
        if (gender == '') {
            errorToast('Please select gender')
        } else if (dob == '') {
            errorToast('Please select date of birth')
        } else {
            let data = {}
            if (image) {
                let time = new Date().getTime()
                data['avtar'] = {
                    uri: image.path,
                    type: image.mime, // or photo.type image/jpg
                    name: 'avtar_[' + time + '].' + image.path.split('.').pop()
                }

            }
            data.birthDate = moment(dob).format('DD/MM/YYYY')
            data.first_Name = user?.first_Name
            data.last_Name = user?.last_Name
            data.phonenumber = user?.phonenumber
            data.email = user?.email
            data.gender = gender.toLowerCase()
            console.log(data)
            dispatchAction(dispatch, IS_LOADING, true)
            formDataApiCall(api.registerstepone, data, (res) => {
                dispatchAction(dispatch, IS_LOADING, false)
                setAsyncUserInfo(res?.data)
                dispatchAction(dispatch, SET_USER, res?.data)
                navigation.navigate(screenName.CompleteProfile2)
                successToast(res.msg)
                if (googleUser) {
                    var path = googleUrlImage

                    return RNFS.unlink(path)
                        .then(() => {
                            console.log('FILE DELETED');
                        })
                        // `unlink` will throw an error, if the item to unlink does not exist
                        .catch((err) => {
                            console.log(err.message);
                        });
                }
            }, () => {
                dispatchAction(dispatch, IS_LOADING, false)
            })
        }
        // navigation.navigate(screenName.CompleteProfile2)
    }

    return (
        <View style={ApplicationStyles.applicationView}>
            {/* <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}> */}
            <SafeAreaView style={{ flex: 1 }}>
                <Header showLeft logoShow={false} />
                <View style={{ marginHorizontal: wp(20) }}>
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.des}>To proceed, please complete your profile</Text>
                    <Text style={styles.des}>information</Text>
                    <TouchableOpacity style={styles.uploadPhotoView}>
                        <View>
                            <TouchableOpacity onPress={() => setActionSheet(true)} style={styles.innerUploadView}>
                                {image ?
                                    <Image style={styles.uploadImage} source={image ? { uri: image.path } : Icons.camera} />
                                    :
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={styles.cameraIcon} source={image ? { uri: image.path } : Icons.camera} />
                                        <Text style={styles.uploadText}>{'Upload Photo'}</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                            <Modal
                                onBackdropPress={() => closeActionSheet()}
                                isVisible={actionSheet}
                                style={{ margin: 0, justifyContent: 'flex-end', }}>
                                <ActionSheet actionItems={actionItems} onCancel={closeActionSheet} />
                            </Modal>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.des}>What is your gender?*</Text>
                        <View style={styles.row}>
                            {data.map((item, index) => (
                                <TouchableOpacity key={index} style={[styles.genderOption, { backgroundColor: gender !== item?.title ? colors.white : colors.neutral_900 }]} onPress={() => setgender(item.title)}>
                                    <Image style={[ImageStyle(20, 20), { tintColor: gender == item?.title ? colors.white : colors.neutral_900 }]} source={item.icon} />
                                    <Text style={[styles.des, { color: gender == item?.title ? colors.white : colors.neutral_900 }]}>{item.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.des, { marginBottom: 10 }]}>What is your Birthdate ?*</Text>
                        <Input type={'dob'} value={dob !== '' ? moment(dob).format('MMMM,DD YYYY') : ''} onChangeText={(text) => setdob(text)} placeholder={'Select your Birthdate'} />
                    </View>
                    <CommonButton title={'Next'} onPress={() => onNext()} extraStyle={styles.btn} />

                </View>
            </SafeAreaView>
            {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    title: { ...FontStyle(24, colors.neutral_900, '700'), },
    des: { ...FontStyle(14, colors.neutral_900) },
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
    row: {
        flexDirection: 'row',
        alignContent: 'center',
        gap: 5,
        marginVertical: 10,
        marginBottom: 20
    },
    genderOption: {
        backgroundColor: colors.white,
        borderColor: colors.neutral_900,
        borderWidth: 1,
        height: 33,
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        paddingLeft: 8, paddingRight: 20, borderRadius: 50
    },
    btn: {
        marginTop: 40
    }
})