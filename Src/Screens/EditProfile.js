import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '../Components/Header'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { useNavigation } from '@react-navigation/native'
import colors from '../Themes/Colors'
import { Icons } from '../Themes/Icons'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import { fontname, hp } from '../Themes/Fonts'
import RenderUserIcon from '../Components/RenderUserIcon'

export default function EditProfile() {
    const navigation = useNavigation()
    return (
        <View style={ApplicationStyles.applicationView}>
            <Header
                title={'Update Profile'}
                showLeft
                onLeftPress={() => navigation.goBack()}
                logoShow={false}
            />
            <View style={styles.userIcon}>
                <RenderUserIcon height={100} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userIcon: {
        alignSelf: 'center',

    }
})