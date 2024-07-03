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
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Header from '../Components/Header'

const CELL_COUNT = 6;
export default function OTPScreen() {
    const navigation = useNavigation()
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <Header showLeft logoShow={false} />
                <View style={{ marginHorizontal: wp(20) }}>
                    <Text style={styles.title}>OTP Verification</Text>
                    <Text style={styles.des}>We have sent a verification code to</Text>
                    <Text style={styles.des}>+1-9876543214</Text>
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
                    <CommonButton title={'Verify'} onPress={() => navigation.navigate(screenName.CompleteProfile)} />
                    <TouchableOpacity onPress={() => { }} style={styles.signUpView}>
                        <Text style={styles.signUpText}>Didn't receive the code? <Text style={{ color: colors.primary_500 }}>Resend</Text></Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    title: { ...FontStyle(fontname.abeezee, 24, colors.white, '700'), marginBottom: hp(20) },
    des: { ...FontStyle(fontname.abeezee, 14, colors.white), },
    codeFieldRoot: { marginVertical: 30, },
    cell: { width: 45, height: 45, borderWidth: 5, borderColor: colors.white, textAlign: 'center', ...FontStyle(fontname.abeezee, 20, colors.white, '700'), textAlignVertical: 'center' },
    focusCell: { borderColor: '#fff', },
    signUpView: {
        marginTop: 10,
        alignSelf: 'center'
    },
    signUpText: {
        ...FontStyle(fontname.abeezee, 14, colors.white),
        marginVertical: 10
    }
})