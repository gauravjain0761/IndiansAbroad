import {
    StyleSheet, Text, View, ViewStyle, TouchableOpacity, SafeAreaView, Image, Switch,
} from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { Icons } from '../Themes/Icons';
import { SCREEN_HEIGHT, defaultFontStyle, fontname, hp } from '../Themes/Fonts';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { useSelector } from 'react-redux';
import { clearAsync } from '../utils/AsyncStorage';
import { resetNavigation } from '../utils/Global';
import ConfirmationModal from './ConfirmationModal';
import RenderUserIcon from './RenderUserIcon';

export default function CustomDrawer() {
    const navigation = useNavigation();
    const { user } = useSelector(e => e.common)
    const [logoutModal, setlogoutModal] = useState(false)
    let data = [
        // { name: 'Live tracking', screen: screenName.LiveTrackingScreen, image: Icons.liveTracking },
        {
            name: 'My Page',
            screen: screenName.MyPageScreen,
        },
        {
            name: 'Invite Friends',
            screen: screenName.InviteFriendScreen,
        },
        {
            name: 'Feedback Form',
            screen: screenName.FeedBackForum,
        },
        {
            name: 'Enquiry',
            screen: screenName.Enquiry,
        },
        {
            name: 'Terms & Conditions',
            screen: screenName.Terms,
        },
        {
            name: 'Privacy Policy',
            screen: screenName.Privacy,
        }

        // { name: 'Support', screen: screenName.SupportScreen, image: Icons.support },
    ];

    const onPressLogout = async () => {
        setlogoutModal(false)
        await clearAsync()
        resetNavigation(screenName.LoginScreen)
    }

    return (
        <View style={styles.mainView}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate(screenName.profileScreen)}>
                        <RenderUserIcon url={user?.avtar} height={63} isBorder={user?.subscribedMember} />
                        {/* <Image source={Icons.userImage} style={styles.userImage} /> */}
                    </TouchableOpacity>
                    <View style={[ApplicationStyles.flex, { marginHorizontal: 5 }]}>
                        <Text numberOfLines={1} style={styles.username}>
                            {user?.first_Name} {user?.last_Name}
                        </Text>
                        <Text numberOfLines={1} style={styles.username}>
                            {user?.email}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
            <View style={styles.middleView}>
                {data.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate(item.screen)}>
                            <View style={styles.drawerItem}>
                                <Text style={styles.drawerItemText}>{item.name}</Text>
                                <Image source={Icons.Arrow_circle_right} style={styles.drawerItemImage} />

                            </View>
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity
                    onPress={() => {
                        // navigation.toggleDrawer()
                        setTimeout(() => {
                            setlogoutModal(true)
                        }, 500);
                    }}
                    style={styles.drawerItem}
                >
                    <Text style={styles.drawerItemText}>{'Logout'}</Text>
                </TouchableOpacity>
            </View>

            {logoutModal && <ConfirmationModal
                visible={logoutModal}
                onClose={() => setlogoutModal(false)}
                title={`Are you sure you want to logout?`}
                successBtn={'Logout'}
                canselBtn={'No'}
                onPressCancel={() => setlogoutModal(false)}
                onPressSuccess={() => onPressLogout()}
            />}

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: hp(15),
        paddingVertical: hp(15),
    },
    container: {
        backgroundColor: colors.white,

    },
    userImage: {
        height: 63,
        width: 63,
        borderRadius: 63 / 2,
    },
    username: {
        ...FontStyle(15, colors.neutral_900),
        marginRight: 5,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hp(15),
        paddingVertical: hp(10),
    },
    drawerItemImage: {
        height: 26,
        width: 26,
        // marginRight: hp(20),
    },
    drawerItemText: {
        ...FontStyle(15, colors.neutral_900),
    },
})