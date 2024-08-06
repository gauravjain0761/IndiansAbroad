import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icons } from '../Themes/Icons'
import { SCREEN_WIDTH, wp } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import { createThumbnail } from 'react-native-create-thumbnail'

export default function RenderChatMedia({ item, index, noOfItem }) {
    let size = (SCREEN_WIDTH - wp(noOfItem ? 50 : 40)) / (noOfItem ? noOfItem : 3)
    const [thumbnail, setthumbnail] = useState(undefined)

    useEffect(() => {

        createThumbnail({
            url: item?.location,
            timeStamp: 1000,
        }).then(response => {
            setthumbnail(response.path)
        }).catch(err => console.log('err==', err));
    }, [])



    return (
        <View key={index} style={{
            width: size,
            height: size,
        }}>
            {item?.contentType?.includes('image') ?
                <Image source={{ uri: item?.location }} style={[styles.userImage, {
                    width: size,
                    height: size
                }]} />
                :
                <Image source={{ uri: thumbnail }} style={[styles.userImage, {
                    width: size,
                    height: size
                }]} />
            }

            {item?.contentType?.includes('video') && <View style={styles.mainViewPlayBtn}>
                <View style={styles.videoPlayIcon}>
                    <Image source={Icons.playVideo} style={styles.playBtn} />
                </View>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    userImage: {
        resizeMode: 'cover',
        borderRadius: 4,
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