import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle, ImageStyle, emailCheck, errorToast } from '../../utils/commonFunction'
import { fontname, hp, wp } from '../../Themes/Fonts'
import Input from '../../Components/Input'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { screenName } from '../../Navigation/ScreenConstants'
import { onLoginApi } from '../../Services/AuthServices'
import { resetNavigation } from '../../utils/Global'
import Header from '../../Components/Header'


export default function SecurityScreen() {
    const { navigate } = useNavigation()
    return (
        <View style={ApplicationStyles.applicationView}>
            {/* <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}> */}
            <SafeAreaView style={ApplicationStyles.flex}>
                <Header showLeft title={''} />
                <View style={styles.transparent}>
                    <Image source={Icons.logo} style={ImageStyle(90, 90)} />
                    <Text style={ApplicationStyles.titleTextBlack}>IndiansAbroad</Text>
                    <Text style={styles.title2}>Dear IndiansAbroad Member</Text>
                    <View style={styles.rowView}>
                        <Image source={Icons.Verified_user} style={[ImageStyle(28, 28), { tintColor: colors.neutral_900 }]} />
                        <Text style={styles.des2}>Your privacy is our priority</Text>
                    </View>
                    <Text style={styles.des}>We are requesting your information solely to help you join our platform and deliver exceptional services. We guarantee that your information will not be shared with anyone for any other purpose.</Text>
                    <CommonButton title={"Let's go"} onPress={() => navigate(screenName.SignupScreen)} extraStyle={styles.btn} />
                </View>
            </SafeAreaView>
            <SafeAreaView>
                <Text style={[FontStyle(20, colors.neutral_900, '700'), { textAlign: 'center' }]}>Connecting Indian Expats Worldwide</Text>
                <Text style={[FontStyle(18, colors.primary_500, '700'), { textAlign: 'center' }]}>An app for Indians by Indians </Text>
            </SafeAreaView>

            {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    transparent: {
        // paddingTop: 15,
        // backgroundColor: colors.neutral_900Opacity,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30,
        paddingHorizontal: 10,
        // flex: 1
    },
    loginText: {
        ...FontStyle(24, colors.neutral_900, '700'),
        alignSelf: 'center',
        marginVertical: 10
    },
    des: {
        ...FontStyle(16, colors.neutral_900),
        alignSelf: 'center',
        marginBottom: 20
    },
    hightView: {
        marginTop: 20
    },
    forotView: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        ...FontStyle(14, colors.neutral_900),
        paddingVertical: 15
    },
    signUpView: {
        marginTop: 10,
        alignSelf: 'center'
    },
    signUpText: {
        ...FontStyle(14, colors.neutral_900),
        marginVertical: 10
    },
    title2: {
        ...FontStyle(28, colors.neutral_900, '700'),
        textAlign: 'center',
        marginTop: 30,
        lineHeight: 30
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
        gap: 5
    },
    des2: {
        ...FontStyle(18, colors.neutral_900, '700'),
    },
    btn: {
        marginTop: hp(50),
        width: '100%'
    }
})