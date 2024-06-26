import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icons } from '../Themes/Icons'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'
import colors from '../Themes/Colors'
import { api } from '../utils/apiConstants'
import FastImage from 'react-native-fast-image'

export default function RenderUserIcon({ height, isBorder = false, url, activeOpacity }) {
    const navigation = useNavigation()
    let styles = StyleSheet.create({
        userImage: {
            height: height - (isBorder ? 6 : 0),
            width: height - (isBorder ? 6 : 0),
            borderRadius: height / 2,
        }
    })
    return (
        <TouchableOpacity activeOpacity={activeOpacity} onPress={() => navigation.navigate(screenName.indiansDetails)} style={{
            height: height,
            width: height,
            borderWidth: 2,
            borderRadius: 200,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: isBorder ? '#C5B80F' : 'transparent',
            backgroundColor: colors.white
        }}>
            <FastImage resizeMode={FastImage.resizeMode.cover} source={(url !== undefined && url !== '') ? { uri: api.IMAGE_URL + url, priority: FastImage.priority.normal } : Icons.logo} style={styles.userImage} />
        </TouchableOpacity>
    )
}