import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '../Components/Header'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { useNavigation } from '@react-navigation/native'
import colors from '../Themes/Colors'
import { Icons } from '../Themes/Icons'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import { fontname, hp } from '../Themes/Fonts'
import { screenName } from '../Navigation/ScreenConstants'

export default function Setting() {
    const navigation = useNavigation()
    let data = [
        { title: 'Edit Profile', onPress: () => { navigation.navigate('EditProfile') } },
        { title: 'Change Phone Number', onPress: () => {navigation.navigate(screenName.ChangePhone) } },
        { title: 'Change Password', onPress: () => {navigation.navigate(screenName.ChangePasswordEmail) } },
        { title: 'Subscription', onPress: () => {navigation.navigate(screenName.Subscription) } },
        { title: 'Blocked Users', onPress: () => { navigation.navigate(screenName.BlockedUsers)} },

    ]
    return (
        <View style={ApplicationStyles.applicationView}>
            <Header
                title={'IndiansAbroad'}
                showLeft
                onLeftPress={() => navigation.goBack()}
            />
            <View style={styles.mainView}>
                {data.map((data, index) => {
                    return (
                        <View key={index} style={styles.itemView}>
                            <TouchableOpacity onPress={() => data?.onPress()} style={styles.row}>
                                <Text style={styles.itemText}>{data.title}</Text>
                                <View style={styles.imageArrow}>
                                    <Image source={Icons.left_arrow} style={ImageStyle(18, 18)} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: colors.secondary_500
    },
    itemView: {
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral_400
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: hp(12)
    },
    imageArrow: {
        transform: [{ rotate: '180deg' }],
        paddingHorizontal: hp(10)
    },
    itemText: {
        ...FontStyle(fontname.abeezee, 20, colors.neutral_900, '700')
    }
})