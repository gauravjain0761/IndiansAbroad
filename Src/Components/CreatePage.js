import { Image, ImageBackground, ScrollView, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'
import { FontStyle, ImageStyle, errorToast, successToast } from '../utils/commonFunction'
import { fontname, hp, SCREEN_WIDTH, wp } from '../Themes/Fonts'
import Input from '../Components/Input'
import CommonButton from '../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import Header from '../Components/Header'
import Modal from 'react-native-modal';
import ActionSheet from '../Components/ActionSheet'
import ImageCropPicker from 'react-native-image-crop-picker'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchAction, formDataApiCall } from '../utils/apiGlobal'
import { IS_LOADING, SET_USER } from '../Redux/ActionTypes'
import { api } from '../utils/apiConstants'
import { setAsyncUserInfo } from '../utils/AsyncStorage'
import { onGetMyPage, onGetSignupCountry } from '../Services/AuthServices'

export default function CreatePage({ onSuccessCreate }) {
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
    const [title, setTitle] = useState('')
    const [about, setAbout] = useState('')
    const [catchLine, setCatchLine] = useState('')
    const [website, setwebsite] = useState('')
    const { countries, user } = useSelector(e => e.common)
    const [city, setcity] = useState('')
    const [country, setcountry] = useState(undefined)
    const dispatch = useDispatch()
    // const [region, setregion] = useState('')
    useEffect(() => {
        dispatch(onGetSignupCountry({}))
    }, [])
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

    const onPressCreatePage = () => {
        if (title.trim() == '') {
            errorToast('Please enter title')
        } else if (about.trim() == '') {
            errorToast('Please enter about')
        } else if (!country) {
            errorToast('Please select country')
        }
        // else if (region.trim() == '') {
        //     errorToast('Please enter region')
        // } 
        else if (city.trim() == '') {
            errorToast('Please enter an city')
        } else {
            let data = {}
            if (image) {
                let time = new Date().getTime()
                data['logo'] = {
                    uri: image.path,
                    type: image.mime, // or photo.type image/jpg
                    name: 'logo_[' + time + '].' + image.path.split('.').pop()
                }
            }
            data.title = title.trim()
            data.countryId = country?._id
            // data.region = region.trim()
            data.city = city.trim()
            data.createdBy = user._id
            data.about = about.trim()
            if (website.trim() !== '') {
                data.websitelink = website.trim()
            }
            if (catchLine.trim() !== '') {
                data.catchline = catchLine.trim()
            }
            dispatchAction(dispatch, IS_LOADING, true)
            formDataApiCall(api.createPage, data, (res) => {
                dispatch(onGetMyPage({ id: user?._id }))
                successToast(res.msg)
            }, () => {
                dispatchAction(dispatch, IS_LOADING, false)
            })
        }
    }

    return (
        <View style={[ApplicationStyles.applicationView]}>
            <KeyboardAvoidingView
                {...(Platform.OS === 'ios'
                    ? {
                        behavior: 'padding',
                    }
                    : {})}>
                <ScrollView style={{ paddingHorizontal: wp(20), }}>
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
                    <Input extraStyle={styles.input} value={title}
                        onChangeText={(text) => setTitle(text)}
                        placeholder={'Title*'} />
                    <Input extraStyle={styles.input} value={about}
                        onChangeText={(text) => setAbout(text)}
                        placeholder={'About*'} />
                    <Input extraStyle={styles.input} value={catchLine}
                        onChangeText={(text) => setCatchLine(text)}
                        placeholder={'Catchline'} />
                    <Input extraStyle={styles.input} value={website}
                        onChangeText={(text) => setwebsite(text)}
                        placeholder={'Website'} />
                    <Text style={styles.locationText}>Location</Text>
                    {countries && <Input extraStyle={styles.input} value={country ? country?._id : ''} onChangeText={(text) => { setcountry(text) }} placeholder={'Country*'} type={'dropdown'} data={countries} labelField={'countryName'} valueField={'_id'} />}
                    {/* <Input extraStyle={styles.input} value={region} onChangeText={(text) => setregion(text)} placeholder={'Region*'} /> */}

                    <Input extraStyle={styles.input} value={city} onChangeText={(text) => setcity(text)} placeholder={'City*'} />
                    <CommonButton title={'CREATE PAGE'} onPress={() => onPressCreatePage()} extraStyle={{ width: '50%', alignSelf: 'center', marginTop: 20, marginBottom: 50 }} />
                </ScrollView>
            </KeyboardAvoidingView>

        </View>
    )
}

const styles = StyleSheet.create({
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
    input: { marginTop: 15 },
    locationText: {
        marginTop: 15,
        ...FontStyle(14, '#647BB0FF')
    }
})