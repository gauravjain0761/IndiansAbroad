import { ScrollView, StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity } from 'react-native'
import React, { } from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { hp, wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import CommonButton from '../../Components/CommonButton';
import RenderUserIcon from '../../Components/RenderUserIcon';
import RenderText from '../../Components/RenderText';

export default function EventDetailScreen() {
    const navigation = useNavigation()
    const { user } = useSelector(e => e.common)
    const dispatch = useDispatch()

    const RenderRowList = ({ icon, title }) => {
        return (
            <View style={[ApplicationStyles.row, { marginTop: 10 }]}>
                <Image source={icon} style={styles.iconRow} />
                <Text style={styles.titleDes}>{title}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={''} onlyLabel={'Event Details'} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <ScrollView>
                <View style={styles.postImage}>
                    <Image source={require('../../assets/Icons/eventImage.jpg')} style={styles.image} />
                </View>
                <View style={styles.postDescriptionView}>
                    <Text style={styles.title} >Indian Festival Guide for November 2024</Text>
                    <RenderRowList icon={Icons.clock} title={'21:00 PM - 03:00 AM'} />
                    <RenderRowList icon={Icons.calenderDate} title={'Thursday, 6/14/2024'} />
                    <RenderRowList icon={Icons.map} title={'1930 Park lane, GB04SH'} />
                    <RenderRowList icon={Icons.tickets} title={'£15.00'} />
                    <RenderRowList icon={Icons.contacts} title={'+44 7899653486'} />
                    <View style={styles.bottomRow}>
                        <Text style={[styles.titleDes, { marginBottom: 10 }]}>1.1K</Text>
                        <Image source={Icons.group} style={styles.usersIcon} />
                        <TouchableOpacity style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Image source={Icons.starOutline} style={ImageStyle(20, 20)} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Image source={Icons.share} style={ImageStyle(24, 24)} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.blueView}>
                    <RenderUserIcon url={''} height={40} />
                    <View style={ApplicationStyles.flex}>
                        <Text style={styles.name}>By IndiansAbroad</Text>
                        <Text style={styles.address}>Community page,London</Text>
                    </View>
                    <CommonButton title={'Connect'} extraStyle={{ width: 110, height: 50 }} />
                </View>
                <View style={styles.postDescriptionView}>
                    <Text style={FontStyle(14, colors.neutral_900, '700')}>Description</Text>
                    <RenderText style={[FontStyle(12, colors.neutral_900), { marginVertical: hp(8) }]} text={'Any music fans of KS Chitra ji, don’t miss this opportunity. Click on the video for the dates and location of the event. I am the official photographer for this event happening at the O2, Glasgow. There is also a discount for folks who book more than 4 tickets. Check @UKEVENTLIFE instagram for details. Cheers,'} />
                </View>
                <View style={[styles.blueView, { marginVertical: hp(30) }]}>
                    <CommonButton onPress={() => navigation.navigate(screenName.AttendanceRequestScreen)} title={'Attend'} extraStyle={{ width: 110, height: 50 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        height: 236,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.neutral_800
    },
    postImage: {
        backgroundColor: colors.secondary_500,
        padding: 3
    },
    postDescriptionView: {
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: colors.neutral_900,
        padding: 5,
    },
    title: {
        ...FontStyle(20, colors.neutral_900, '700')
    },
    iconRow: {
        height: 20, width: 20, resizeMode: 'contain',
        marginRight: 10
    },
    titleDes: {
        ...FontStyle(14, colors.neutral_900)
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    usersIcon: {
        height: 23, width: 23, resizeMode: 'contain', marginLeft: 5,
        marginRight: 10,
        marginBottom: 10
    },
    blueView: {
        backgroundColor: colors.secondary_500,
        paddingHorizontal: wp(20),
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginVertical: 3,
        justifyContent: 'center'
    },
    name: {
        ...FontStyle(16, colors.neutral_900, '700')
    },
    address: {
        ...FontStyle(11, colors.neutral_900)
    }
})