import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { emailCheck, errorToast, FontStyle } from '../../utils/commonFunction'
import { hp, wp } from '../../Themes/Fonts'
import Input from '../../Components/Input'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../../Navigation/ScreenConstants'
import Header from '../../Components/Header'
import { useDispatch } from 'react-redux'
import { onForgotPass } from '../../Services/AuthServices'

export default function ForgotPassword() {
    const [email, setemail] = useState(__DEV__ ? 'jadhavharshal.510@gmail.com' : '')
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const onSend = () => {
        if (!emailCheck(email.trim())) {
            errorToast('Please enter a valid email')
        } else {
            let obj = {
                data: {
                    email: email.trim(),
                },
                onSuccess: async (response) => {
                    // navigation.navigate(screenName.NewPassword)
                    navigation.goBack()
                }
            }
            dispatch(onForgotPass(obj))
        }
    }

    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <Header showLeft logoShow={false} />
                <View style={{ marginHorizontal: wp(20) }}>
                    <Text style={styles.title}>Verification</Text>
                    <Text style={styles.des}>Please enter your mobile number or email address to receive verification code.</Text>
                    <Input keyboardType={'email-address'} value={email} placeholder={'Email Address'} onChangeText={(text) => setemail(text)} />
                    <CommonButton title={'Send'} onPress={() => onSend()} extraStyle={styles.btn} />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { ...FontStyle(24, colors.white, '700'), marginBottom: hp(20) },
    des: { ...FontStyle(14, colors.white), marginBottom: hp(70) },
    btn: {
        marginTop: hp(50)
    }

})