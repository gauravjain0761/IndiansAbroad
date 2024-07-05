import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SCREEN_WIDTH, fontname, hp } from '../Themes/Fonts'
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
// import VideoPlayer from 'react-native-video-player';
import Video, { VideoRef } from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import { useRoute } from '@react-navigation/native'

export default function MediaScreen() {
    const { params } = useRoute()
    return (
        <View>
            <Text>MediaScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({})