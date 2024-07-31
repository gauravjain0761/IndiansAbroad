import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Icons } from '../Themes/Icons'
import { SCREEN_WIDTH, wp } from '../Themes/Fonts'
import colors from '../Themes/Colors'

export default function RenderChatMedia({ item, index }) {
    return (
        <View key={index} style={styles.mainView}>
            <Image source={Icons.userImage} style={styles.userImage} />
            {index == 1 && <View style={styles.mainViewPlayBtn}>
                <View style={styles.videoPlayIcon}>
                    <Image source={Icons.playVideo} style={styles.playBtn} />
                </View>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    userImage: {

    },
    mainView: {
        width: (SCREEN_WIDTH - wp(40)) / 3,
        height: (SCREEN_WIDTH - wp(40)) / 3
    },
    userImage: {
        width: (SCREEN_WIDTH - wp(40)) / 3,
        height: (SCREEN_WIDTH - wp(40)) / 3,
        resizeMode: 'cover'
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