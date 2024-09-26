import { Image, ImageBackground, SafeAreaView, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle, ImageStyle, emailCheck, errorToast, mobileNumberCheck, passwordCheck } from '../../utils/commonFunction'
import { fontname, wp } from '../../Themes/Fonts'
import Input from '../../Components/Input'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../../Navigation/ScreenConstants'
import CountryPicker from 'react-native-country-picker-modal'
import { onGetOtp } from '../../Services/AuthServices'
import { useDispatch } from 'react-redux'
import Header from '../../Components/Header'
import { GoogleSignin, } from '@react-native-google-signin/google-signin';
import { api } from '../../utils/apiConstants'
import axios from 'axios'
import { dispatchAction } from '../../utils/apiGlobal'
import { IS_LOADING, SET_GOOGLE_USER } from '../../Redux/ActionTypes'

export default function SignupScreen() {
    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [email, setemail] = useState('')
    const [mobile, setmobile] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [code, setcode] = useState('+1')
    const [password, setpassword] = useState('')
    const navigation = useNavigation()
    const [show, setShow] = useState(false);
    const dispatch = useDispatch()
    const onLogin = () => {
        if (firstName.trim() == '') {
            errorToast('Please enter your first name')
        } else if (lastName.trim() == '') {
            errorToast('Please enter your last name')
        } else if (!emailCheck(email.trim())) {
            errorToast('Please enter a valid email')
        } else if (!mobileNumberCheck(mobile.trim())) {
            errorToast('Please enter a valid mobile number')
        } else if (!passwordCheck(password)) {
            errorToast('Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        } else if (password !== confirmPassword) {
            errorToast('Password and Confirm Password should be same')
        } else {
            let obj = {
                data: {
                    phonenumber: code + mobile.trim(),
                    email: email.trim(),
                    first_Name: firstName.trim(),
                    last_Name: lastName.trim(),
                    passCode: password
                },
                onSuccess: async (response) => {
                    navigation.navigate(screenName.OTPScreen, { phone: mobile.trim(), code: code, email: email.trim() })
                }
            }
            dispatch(onGetOtp(obj))
        }
        // navigation.navigate(screenName.OTPScreen)
    }
    const onPressGoogle = async () => {
        GoogleSignin.configure({
            webClientId: api.WEB_CLIENT_ID, scopes: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ]
        });
        try {
            await GoogleSignin.hasPlayServices();
            const currentUser = GoogleSignin.getCurrentUser()
            if (currentUser !== null) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            const userInfo = await GoogleSignin.signIn();
            if (userInfo) {
                setfirstName(userInfo?.data?.user?.givenName)
                setlastName(userInfo?.data?.user?.familyName)
                setemail(userInfo?.data?.user?.email)

                dispatchAction(dispatch, IS_LOADING, true)
                const { accessToken } = await GoogleSignin.getTokens();
                axios({
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `https://people.googleapis.com/v1/people/${userInfo.data.user.id}?personFields=genders,phoneNumbers,birthdays`
                })
                    .then(function (response) {
                        // console.log(response.data.genders[0].formattedValue)
                        // console.log(response.data.birthdays[0]);
                        console.log('-----', {
                            gender: response.data.genders ? response.data.genders[0].formattedValue : undefined,
                            // birthday: response.data.birthdays[0].date,
                            ...userInfo?.data?.user
                        })
                        dispatchAction(dispatch, SET_GOOGLE_USER, {
                            gender: response.data.genders[0].formattedValue,
                            // birthday: response.data.birthdays[0].date,
                            ...userInfo?.data?.user
                        })
                        dispatchAction(dispatch, IS_LOADING, false)
                    })
                    .catch(function (error) {
                        dispatchAction(dispatch, IS_LOADING, false)
                    });
            }


        } catch (error) {
            console.log(error)
        }
    };

    return (
        <View style={ApplicationStyles.applicationView}>
            {/* <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}> */}
            <SafeAreaView>
                <Header showLeft title={''} />
                <KeyboardAvoidingView
                    {...(Platform.OS === 'ios'
                        ? {
                            behavior: 'padding',
                        }
                        : {})}>
                    <ScrollView>
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
                                <Input maxLength={25} extraStyle={{ flex: 1 }} keyboardType={'email-address'} value={firstName} placeholder={'First Name'} onChangeText={(text) => setfirstName(text)} />
                                <Input maxLength={25} extraStyle={{ flex: 1 }} keyboardType={'email-address'} value={lastName} placeholder={'Last Name'} onChangeText={(text) => setlastName(text)} />
                            </View>
                            <Input keyboardType={'email-address'} value={email} placeholder={'Email Address'} onChangeText={(text) => setemail(text)} />
                            <View style={styles.hightView} />
                            <View style={[styles.inputrow, { marginBottom: 0 }]}>
                                <TouchableOpacity
                                    style={styles.inputContainer}
                                    onPress={() => setShow(true)}>
                                    <Text style={styles.inputText}>{code}</Text>
                                    <Image source={Icons.down_arrow} style={ImageStyle(15, 15)} />
                                </TouchableOpacity>
                                <Input extraStyle={{ flex: 1 }} keyboardType={'phone-pad'} value={mobile} placeholder={'Mobile Number'} onChangeText={(text) => setmobile(text)} />
                            </View>
                            {/* <Input type={'dob'} value={dob !== '' ? moment(dob).format('MMMM,DD YYYY') : ''} onChangeText={(text) => setdob(text)} placeholder={'Select your Birthdate'} /> */}

                            <View style={styles.hightView} />
                            <Input value={password} placeholder={'Password'} onChangeText={(text) => setpassword(text)} isPassword />
                            <View style={styles.hightView} />
                            <Input value={confirmPassword} placeholder={'Confirm Password'} onChangeText={(text) => setconfirmPassword(text)} isPassword />
                            <View style={styles.hightView} />
                            <CommonButton title={'Next'} onPress={() => onLogin()} />
                            <CountryPicker
                                // countryCode={code.replace('+', '')}
                                visible={show}
                                onClose={() => setShow(false)}
                                withCallingCode
                                onSelect={(item) => {
                                    setcode('+' + item?.callingCode[0]);
                                    setShow(false);
                                }}
                                withCallingCodeButton
                                withFilter
                                placeholder={''}
                                withEmoji={false}
                            // withFlag
                            />
                        </View>
                        <View style={{ height: 100 }}></View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    transparent: {
        paddingVertical: 10,
        // backgroundColor: colors.whiteOpacity,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginText: {
        ...FontStyle(18, colors.neutral_900, '700'),
        alignSelf: 'center',
        marginVertical: 10
    },
    titleText2: {
        ...FontStyle(20, colors.neutral_900, '700',),
    },
    des: {
        ...FontStyle(12, colors.neutral_900),
        alignSelf: 'center',
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
    publishText: {
        ...FontStyle(14, colors.white),
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
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.neutral_500,
        backgroundColor: colors.inputBg,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 10,
        height: 56
    },
    inputText: {
        ...FontStyle(15, colors.neutral_900),
        // flex: 1,
        // paddingVertical: 4,
        borderRadius: 5,
        paddingRight: 10,
        // paddingVertical: Platform.OS == 'ios' ? 19 : 6,

        // marginTop:12
    },
})