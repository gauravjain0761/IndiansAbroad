import { Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
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
    const [state, setstate] = useState('')
    const [country, setcountry] = useState('')
    const [unversity, setunversity] = useState('')
    const [profession, setprofession] = useState('')
    const [termsCheckbox, settermsCheckbox] = useState(false)

    const onNext = () => {
        navigation.navigate(screenName.Walkthrough)
    }

    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <Header showLeft logoShow={false} />
                <View style={{ marginHorizontal: wp(20) }}>
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.des}>To proceed, please complete your profile</Text>
                    <Text style={styles.des}>information</Text>
                    <View style={styles.inputView}>
                        <Text style={styles.des}>Where are you from in India ?*</Text>
                        <Input extraStyle={styles.input} value={state} onChangeText={(text) => setstate(text)} placeholder={'State'} />
                        <Input extraStyle={styles.input} value={state} onChangeText={(text) => setstate(text)} placeholder={'State'} />

                    </View>
                    <View style={styles.inputView}>
                        <Text style={styles.des}>Abroad information*</Text>
                        <Input extraStyle={styles.input} value={country} onChangeText={(text) => setcountry(text)} placeholder={'Country'} type={'dropdown'} data={data} />
                        <Input extraStyle={styles.input} value={country} onChangeText={(text) => setcountry(text)} placeholder={'Country'} type={'dropdown'} data={data} />
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
                    <CommonButton title={'Finish'} onPress={() => onNext()} />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { ...FontStyle(fontname.abeezee, 24, colors.white, '700'), },
    des: { ...FontStyle(fontname.abeezee, 14, colors.white) },
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
        ...FontStyle(fontname.actor_regular, 12, colors.neutral_900)
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