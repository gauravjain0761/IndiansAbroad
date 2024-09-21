import { Image, ImageBackground, StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle, ImageStyle } from '../../utils/commonFunction'
import { hp, wp } from '../../Themes/Fonts'
import Input from '../../Components/Input'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../../Navigation/ScreenConstants'
import Header from '../../Components/Header'
import { useDispatch } from 'react-redux'
export default function PasswordChangeSuccess() {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const onSend = () => {
        navigation.navigate(screenName.LoginScreen)
    }
    return (
        <View style={ApplicationStyles.applicationView}>
            {/* <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}> */}
            <SafeAreaView>
                <Header showLeft logoShow={false} />
            </SafeAreaView>
            <View style={styles.hightView}>
                <Image source={Icons.checkCircle} style={ImageStyle(130, 130)} />
                <Text style={styles.des}>Paasword changed successfully</Text>
                <CommonButton title={'Done'} onPress={() => onSend()} extraStyle={styles.btn} />
            </View>
            {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    title: { ...FontStyle(24, colors.neutral_900, '700'), marginBottom: hp(20) },
    des: { ...FontStyle(20, colors.neutral_900, '700'), marginTop: hp(40) },
    btn: {
        marginTop: hp(20),
        width: '100%'
    },
    hightView: {
        marginHorizontal: wp(20),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})