import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { SCREEN_WIDTH, wp } from '../Themes/Fonts'
import { Icons } from '../Themes/Icons'

export default function ChatMessageMedia({ data }) {
    console.log('hereee', Icons.logo, data?.file[0]?.location == '' ? Icons.logo : { uri: data?.file[0]?.location })
    return (
        <View>
            <FastImage
                source={data?.file[0]?.location == '' ? Icons.logo : { uri: data?.file[0]?.location }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.imageView}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageView: {
        width: wp(250),
        height: wp(250),
        // backgroundColor: 'red'
    }
})