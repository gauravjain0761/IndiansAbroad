import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'
import { errorToast, FontStyle, passwordCheck } from '../utils/commonFunction'
import { hp, wp } from '../Themes/Fonts'
import Input from '../Components/Input'
import CommonButton from '../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'
import Header from '../Components/Header'
import { useDispatch } from 'react-redux'
import { onResetPass } from '../Services/AuthServices'


export default function NewPassword() {
    const [confirmPassword, setconfirmPassword] = useState('')
    const [password, setpassword] = useState('')
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const onSend = () => {
        if (!passwordCheck(password)) {
            errorToast('Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        } else if (password !== confirmPassword) {
            errorToast('Password and Confirm Password should be same')
        } else {
            let obj = {
                data: {
                    passCode: password
                },
                onSuccess: async (response) => {
                    navigation.navigate(screenName.PasswordChangeSuccess)
                }
            }
            dispatch(onResetPass(obj))
        }
    }

    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <Header showLeft logoShow={false} />
                <View style={{ marginHorizontal: wp(20) }}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.des}>Set your new password</Text>
                    <Input value={password} placeholder={'New Password'} onChangeText={(text) => setpassword(text)} isPassword />
                    <View style={styles.hightView} />
                    <Input value={confirmPassword} placeholder={'Confirm Password'} onChangeText={(text) => setconfirmPassword(text)} isPassword />
                    <CommonButton title={'Continue'} onPress={() => onSend()} extraStyle={styles.btn} />
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
    },
    hightView: {
        marginTop: hp(50)
    }

})