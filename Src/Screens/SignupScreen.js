import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import { fontname, wp } from '../Themes/Fonts'
import Input from '../Components/Input'
import CommonButton from '../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'

export default function SignupScreen() {
    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [email, setemail] = useState('')
    const [mobile, setmobile] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [password, setpassword] = useState('')
    const navigation = useNavigation()

    const onLogin = () => {
        navigation.navigate(screenName.OTPScreen)
    }
    const onPressGoogle = () => {

    }

    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <View style={styles.transparent}>
                    <Image source={Icons.logo} style={ImageStyle(75, 75)} />
                    <Text style={styles.titleText2}>IndiansAbroad</Text>
                </View>
                <View style={{ marginHorizontal: wp(20) }}>
                    <Text style={styles.loginText}>Sign Up</Text>
                    <TouchableOpacity onPress={() => onPressGoogle()} style={[styles.blueButton]}>
                        <Image source={Icons.googlePlus} style={styles.googleLogo} />
                        <Text style={styles.publishText}>{'Sign up with google'}</Text>
                    </TouchableOpacity>
                    <View style={styles.orView}>
                        <View style={styles.line} />
                        <Text style={styles.des}>Or</Text>
                        <View style={styles.line} />
                    </View>
                    <Text style={styles.des}>Please fill the details to create an account.</Text>
                    <View style={styles.hightView} />
                    <View style={styles.inputrow}>
                        <Input extraStyle={{ flex: 1 }} keyboardType={'email-address'} value={firstName} placeholder={'First Name'} onChangeText={(text) => setfirstName(text)} />
                        <Input extraStyle={{ flex: 1 }} keyboardType={'email-address'} value={lastName} placeholder={'Last Name'} onChangeText={(text) => setlastName(text)} />
                    </View>
                    <Input keyboardType={'email-address'} value={email} placeholder={'Email Address'} onChangeText={(text) => setemail(text)} />
                    <View style={styles.hightView} />
                    <Input keyboardType={'phone-pad'} value={mobile} placeholder={'Mobile Number'} onChangeText={(text) => setmobile(text)} />
                    <View style={styles.hightView} />
                    <Input value={password} placeholder={'Password'} onChangeText={(text) => setpassword(text)} isPassword />
                    <View style={styles.hightView} />
                    <Input value={confirmPassword} placeholder={'Confirm Password'} onChangeText={(text) => setconfirmPassword(text)} isPassword />
                    <View style={styles.hightView} />
                    <CommonButton title={'Next'} onPress={() => onLogin()} />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    transparent: {
        paddingVertical: 10,
        backgroundColor: colors.whiteOpacity,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginText: {
        ...FontStyle(fontname.abeezee, 18, colors.white, '700'),
        alignSelf: 'center',
        marginVertical: 10
    },
    titleText2: {
        ...FontStyle(fontname.abeezee, 20, colors.neutral_900, '700',),
    },
    des: {
        ...FontStyle(fontname.abeezee, 12, colors.white),
        alignSelf: 'center',
    },
    hightView: {
        marginTop: 20
    },
    forotView: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        ...FontStyle(fontname.abeezee, 14, colors.white),
        paddingVertical: 15
    },
    signUpView: {
        marginTop: 10,
        alignSelf: 'center'
    },
    signUpText: {
        ...FontStyle(fontname.abeezee, 14, colors.white),
        marginVertical: 10
    },
    publishText: {
        ...FontStyle(fontname.abeezee, 14, colors.white),
    },
    blueButton: {
        backgroundColor: colors.buttonBlue,
        paddingVertical: 10,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    googleLogo: {
        position: 'absolute',
        height: 24,
        width: 24,
        tintColor: colors.white,
        borderRadius: 100,
        left: 20
    },
    orView: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    line: {
        height: 1,
        backgroundColor: colors.neutral_400,
        flex: 1
    },
    inputrow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 20
    }
})