import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { SCREEN_WIDTH, wp } from '../Themes/Fonts'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'

export default function ChatMessageMedia({ data }) {
    return (
        <View>
            <FastImage
                source={data?.file[0]?.location == '' ? Icons.logo : { uri: data?.file[0]?.location }}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.imageView}
            />
            {data?.file[0]?.metadata?.contentType?.includes('video') && <View style={styles.mainViewPlayBtn}>
                <View style={styles.videoPlayIcon}>
                    <Image source={Icons.playVideo} style={styles.playBtn} />
                </View>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    imageView: {
        width: wp(250),
        height: wp(250),
        marginVertical: 5
    },
    videoPlayIcon: {
        backgroundColor: colors.white,
        width: 50,
        borderRadius: 50 / 2,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainViewPlayBtn: {
        position: 'absolute',
        zIndex: 11,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
    playBtn: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        tintColor: colors.primary_500
    }
})