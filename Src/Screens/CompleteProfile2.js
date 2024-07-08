import { Image, ImageBackground, Platform, StyleSheet, ScrollView, Text, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'
import { FontStyle, ImageStyle, errorToast } from '../utils/commonFunction'
import { fontname, hp, wp } from '../Themes/Fonts'
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
import { onGetSignupCountry, onStepTwoSignUp } from '../Services/AuthServices'

const data = [
    { label: 'Country 1', value: '1' },
    { label: 'Country 2', value: '2' },
    { label: 'Country 3', value: '3' },
    { label: 'Country 4', value: '4' },
    { label: 'Country 5', value: '5' },
    { label: 'Country 6', value: '6' },
    { label: 'Country 7', value: '7' },
    { label: 'Country 8', value: '8' },
];
export default function CompleteProfile2() {
    const navigation = useNavigation()
    const [city, setcity] = useState('')
    const [state, setstate] = useState('')
    const [district, setdistrict] = useState('')
    const [country, setcountry] = useState(undefined)
    const [rigion, setrigion] = useState('')
    const [unversity, setunversity] = useState('')
    const [profession, setprofession] = useState('')
    const [termsCheckbox, settermsCheckbox] = useState(false)
    const dispatch = useDispatch()
    const { countries, user } = useSelector(e => e.common)

    useEffect(() => {
        dispatch(onGetSignupCountry({}))
    }, [])


    const onNext = () => {

        if (city.trim() == '') {
            errorToast('Please enter a city')
        } else if (district.trim() == '') {
            errorToast('Please enter a district')
        } else if (state.trim() == '') {
            errorToast('Please enter a state')
        } else if (!country) {
            errorToast('Please select a country')
        } else if (rigion.trim() == '') {
            errorToast('Please enter a region')
        } else if (unversity.trim() == '') {
            errorToast('Please enter an unversity/company')
        } else if (profession.trim() == '') {
            errorToast('Please enter profession')
        } else if (!termsCheckbox) {
            errorToast('Please agree terms and conditions of IndiansAbroad')
        } else {
            let obj = {
                data: {
                    phonenumber: user?.phonenumber,
                    city: city.trim(),
                    district: district.trim(),
                    state: state.trim(),
                    countryId: country?._id,
                    region: rigion.trim(),
                    universityORcompany: unversity.trim(),
                    profession: profession.trim(),
                },
                onSuccess: () => {
                    navigation.navigate(screenName.Walkthrough)
                }
            }
            dispatch(onStepTwoSignUp(obj))
        }
        // navigation.navigate(screenName.Walkthrough)
    }
    console.log(country)
    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <SafeAreaView style={{ flex: 1, }}>
                    <Header showLeft logoShow={false} />

                    <KeyboardAvoidingView
                        {...(Platform.OS === 'ios'
                            ? {
                                behavior: 'padding',
                            }
                            : {})}>
                        <ScrollView style={{ paddingHorizontal: wp(20), }}>
                            <Text style={styles.title}>Complete Your Profile</Text>
                            <Text style={styles.des}>To proceed, please complete your profile</Text>
                            <Text style={styles.des}>information</Text>
                            <View style={styles.inputView}>
                                <Text style={styles.des}>Where are you from in India ?*</Text>
                                <Input extraStyle={styles.input} value={city} onChangeText={(text) => setcity(text)} placeholder={'City'} />

                                <Input extraStyle={styles.input} value={district} onChangeText={(text) => setdistrict(text)} placeholder={'District'} />
                                <Input extraStyle={styles.input} value={state} onChangeText={(text) => setstate(text)} placeholder={'State'} />

                            </View>
                            <View style={styles.inputView}>
                                <Text style={styles.des}>Abroad information*</Text>
                                {countries && <Input extraStyle={styles.input} value={country ? country?._id : ''} onChangeText={(text) => { setcountry(text) }} placeholder={'Country'} type={'dropdown'} data={countries} labelField={'countryName'} valueField={'_id'} />}
                                <Input extraStyle={styles.input} value={rigion} onChangeText={(text) => setrigion(text)} placeholder={'Region'} />
                                <Input extraStyle={styles.input} value={unversity} onChangeText={(text) => setunversity(text)} placeholder={'University/Company'} />
                                <Input extraStyle={styles.input} value={profession} onChangeText={(text) => setprofession(text)} placeholder={'Profession'} />
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity onPress={() => settermsCheckbox(!termsCheckbox)}>
                                    <Image
                                        source={termsCheckbox ? Icons.checkbox1 : Icons.checkbox}
                                        style={[ImageStyle(20, 20)]}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.des, { flex: 1 }]}>I agree terms and conditions of IndiansAbroad</Text>
                            </View>
                            <CommonButton extraStyle={{ marginBottom: hp(100) }} title={'Finish'} onPress={() => onNext()} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { ...FontStyle(24, colors.white, '700'), },
    des: { ...FontStyle(14, colors.white) },
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
        alignItems: 'center',
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
    },
    inputView: {
        marginTop: 20
    },
    input: { marginTop: 5, marginBottom: 10 }
})