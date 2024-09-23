import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { SCREEN_WIDTH, wp } from '../Themes/Fonts'
import { Icons } from '../Themes/Icons'
import colors from '../Themes/Colors'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../Navigation/ScreenConstants'
import { createThumbnail } from 'react-native-create-thumbnail'

export default function ChatMessageMedia({ data, onPress, type }) {
    const navigation = useNavigation()

    useEffect(() => {
        if (data?.metadata?.contentType.includes('video')) {
            createThumbnail({
                url: data?.location,
                timeStamp: 1000,
            }).then(response => {
                data.thumbnail = response.path
            }).catch(err => console.log('err==', err));
        }
    }, [data])

    return (
        <TouchableOpacity onPress={() => onPress ? onPress() : navigation.navigate(screenName.MediaPreviewScreen, { url: data })} onLongPress={() => { }} >
            <FastImage source={data?.metadata?.contentType?.includes('video') ? data?.thumbnail : data?.location == '' ? Icons.logo : { uri: data?.location }} resizeMode={FastImage.resizeMode.cover} style={[styles.imageView, { backgroundColor: data?.location == '' ? colors.secondary_500 : undefined }]} />
            {data?.metadata?.contentType?.includes('video') && <View style={styles.mainViewPlayBtn}>
                <View style={styles.videoPlayIcon}>
                    <Image source={Icons.playVideo} style={styles.playBtn} />
                </View>
            </View>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    imageView: {
        width: wp(250),
        height: wp(250),
        marginVertical: 5,
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