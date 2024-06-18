import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Icons } from '../Themes/Icons'

export default function RenderUserIcon({ height, isBorder = false }) {
    let styles = StyleSheet.create({
        userImage: {
            height: height,
            width: height,
            borderRadius: height / 2,
        }
    })
    return (
        <View style={{
            height: height + 4,
            width: height + 4,
            borderWidth: 2,
            borderRadius: height + 4 / 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: isBorder ? '#C5B80F' : 'transparent',
        }}>
            <Image source={Icons.userImage} style={styles.userImage} />
        </View>
    )
}