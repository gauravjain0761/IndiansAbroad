import { Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'
import { FontStyle, ImageStyle, errorToast, mobileNumberCheck } from '../utils/commonFunction'
import { fontname, hp, wp } from '../Themes/Fonts'
import Input from '../Components/Input'
import CommonButton from '../Components/CommonButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Header from '../Components/Header'
import { onRetryOtp, onVerifyOtp } from '../Services/AuthServices'
import { useDispatch } from 'react-redux'
import { resetNavigation } from '../utils/Global'

const CELL_COUNT = 6;
export default function OTPScreen() {
    const navigation = useNavigation()
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue, });
    const { params } = useRoute()
    const dispatch = useDispatch()

    const onPressVerify = () => {
        if (!mobileNumberCheck(value) || value.length !== 6) {
            errorToast('Please enter valid 6 digit otp')
        } else {
            let obj = {
                data: {
                    phonenumber: params?.code + params?.phone,
                    otp: value,
                },
                onSuccess: async (response) => {
                    resetNavigation(screenName.CompleteProfile)
                    // navigation.navigate(screenName.OTPScreen, { phone: phone, code: code, email: email })
                }
            }
            dispatch(onVerifyOtp(obj))
        }
    }

    const onResendOtp = () => {
        let obj = {
            data: {
                email: params?.email,
                phonenumber: params?.code + params?.phone,
            },
        }
        dispatch(onRetryOtp(obj))
    }

    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <Header showLeft logoShow={false} />
                <View style={{ marginHorizontal: wp(20) }}>
                    <Text style={styles.title}>OTP Verification</Text>
                    <Text style={styles.des}>We have sent a verification code to</Text>
                    <Text style={styles.des}>{params?.code}-{params?.phone}</Text>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                        testID="my-code-input"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <CommonButton title={'Verify'} onPress={() => onPressVerify()} />
                    <TouchableOpacity onPress={() => { onResendOtp() }} style={styles.signUpView}>
                        <Text style={styles.signUpText}>Didn't receive the code? <Text style={{ color: colors.primary_500 }}>Resend</Text></Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { ...FontStyle(24, colors.white, '700'), marginBottom: hp(20) },
    des: { ...FontStyle(14, colors.white), },
    codeFieldRoot: { marginVertical: 30, },
    cell: { width: 45, height: 45, borderWidth: 5, borderColor: colors.white, textAlign: 'center', ...FontStyle(20, colors.white, '700'), textAlignVertical: 'center' },
    focusCell: { borderColor: '#fff', },
    signUpView: {
        marginTop: 10,
        alignSelf: 'center'
    },
    signUpText: {
        ...FontStyle(14, colors.white),
        marginVertical: 10
    }
})