import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icons } from '../Themes/Icons'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'
import colors from '../Themes/Colors'

export default function RenderUserIcon({ height, isBorder = false }) {
    const navigation = useNavigation()
    let styles = StyleSheet.create({
        userImage: {
            height: height,
            width: height,
            borderRadius: height / 2,
        }
    })
    return (
        <TouchableOpacity onPress={() => navigation.navigate(screenName.indiansDetails)} style={{
            height: height + (isBorder ? 6 : 0),
            width: height + (isBorder ? 6 : 0),
            borderWidth: 2,
            borderRadius: 200,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: isBorder ? '#C5B80F' : 'transparent',
            backgroundColor: colors.white
        }}>
            <Image source={Icons.userImage} style={styles.userImage} />
        </TouchableOpacity>
    )
}