import { Image, ImageBackground, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle, ImageStyle } from '../../utils/commonFunction'
import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts'
import Input from '../../Components/Input'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../../Navigation/ScreenConstants'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import Header from '../../Components/Header'
import Modal from 'react-native-modal';
import ActionSheet from '../../Components/ActionSheet'
import ImageCropPicker from 'react-native-image-crop-picker'
import moment from 'moment'
import PagerView from 'react-native-pager-view';

export default function PaymentModalScreen() {
    const navigation = useNavigation()
    return (
        <View style={ApplicationStyles.applicationView}>
            <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}>
                <SafeAreaView style={ApplicationStyles.flex}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.closeStyle}>
                        <Image source={Icons.closeRound} style={[ImageStyle(30, 30), { tintColor: colors.white }]} />
                    </TouchableOpacity>
                    <View style={styles.whiteView}>
                        <Text style={styles.des}>The ultimate community app designed to support, connect, and empower Indians living abroad.</Text>
                        <Text></Text>
                        <Text style={[styles.des, { color: colors.primary_500 }]}>An app for Indians by Indians.</Text>
                        <Text></Text>
                        <Text style={styles.des}>Per Month</Text>
                        <View style={styles.middleView}>
                            <Text style={styles.rsText}>Only $1</Text>
                        </View>
                        <Text style={styles.des}>
                            {'\n'}{'\n'}Our mission is to create a support network and form a huge Indian community online.
                            {'\n'}{'\n'}
                            Therefore we are providing a boat load of services only for $1 a month.
                            {'\n'}{'\n'}
                            With your support we can make this mission successful, so let's thrive together.
                        </Text>
                    </View>
                    <CommonButton title={'Pay'} onPress={() => navigation.navigate('Home')} extraStyle={{ marginBottom: 10, marginHorizontal: 10 }} />
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    closeStyle: {
        alignSelf: 'flex-end',
        padding: 10
    },
    whiteView: {
        flex: 1,
        backgroundColor: colors.white,
        marginHorizontal: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    des: {
        ...FontStyle(14, colors.neutral_900),
        textAlign: 'center',
        lineHeight: 22
    },
    middleView: {
        borderWidth: 1,
        borderColor: colors.neutral_800,
        alignSelf: 'center',
        height: hp(160),
        width: hp(160),
        borderRadius: 4,
        backgroundColor: colors.neutral_300,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rsText: {
        ...FontStyle(32, colors.neutral_900, '700'),
    }
})