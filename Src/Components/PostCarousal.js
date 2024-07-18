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

export default function PostCarousal({ images, isDetailScreen, poster }) {
    const [currentIndex, setindex] = useState(0)
    const [thumbnail, setthumbnail] = useState(undefined)
    useEffect(() => {
        images.forEach(element => {
            if (element.contentType.includes('video')) {
                createThumbnail({
                    url: element?.location,
                    timeStamp: 1000,
                }).then(response => {
                    element.thumbnail = response.path
                }).catch(err => console.log({ err }));
            }
        });

    }, [])

    return (
        <View>
            {images.length == 1 ?
                <View>
                    {images[0]?.contentType.includes('video') ?
                        <Video
                            // Can be a URL or a local file.
                            source={{ uri: images[0].location }}
                            playInBackground={false}
                            paused={true}
                            muted={false}
                            controls={true}
                            resizeMode={'contain'}
                            poster={poster?.location}
                            // posterResizeMode='cover'
                            onError={(err) => console.log(err)}
                            style={styles.backgroundVideo}
                        />
                        :
                        <FastImage resizeMode={isDetailScreen ? FastImage.resizeMode.contain : FastImage.resizeMode.cover} source={{ uri: images[0].location }} style={styles.postImage} />
                    }
                </View>
                :
                <View>
                    <View style={styles.indexView}>
                        <Text style={styles.indexText}>{currentIndex + 1 + '/' + images.length}</Text>
                    </View>
                    <Carousel
                        style={{ alignSelf: 'center' }}
                        width={SCREEN_WIDTH - 5}
                        height={SCREEN_WIDTH - 5}
                        windowSize={SCREEN_WIDTH - 5}
                        data={images}
                        onSnapToItem={(index) => setindex(index)}
                        pagingEnabled={true}
                        snapEnabled={true}
                        renderItem={({ item, index }) => (
                            <View>
                                {item?.contentType.includes('video') ?
                                    <Video
                                        // Can be a URL or a local file.
                                        source={{ uri: item.location }}
                                        playInBackground={false}
                                        paused={true}
                                        muted={false}
                                        controls={true}
                                        resizeMode={'contain'}
                                        poster={poster?.location}
                                        // posterResizeMode='cover'
                                        onError={(err) => console.log(err)}
                                        style={styles.backgroundVideo}
                                    />
                                    :
                                    <FastImage resizeMode={isDetailScreen ? FastImage.resizeMode.contain : FastImage.resizeMode.cover} source={{ uri: item.location }} style={styles.postImage} />
                                }

                                {/* <FastImage resizeMode={isDetailScreen ? FastImage.resizeMode.contain : FastImage.resizeMode.cover} source={{ uri: item.location }} style={styles.postImage} /> */}
                            </View>
                        )}
                        loop={false}
                        panGestureHandlerProps={{
                            activeOffsetX: [-10, 10],
                        }}
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    postImage: {
        height: SCREEN_WIDTH - 5,
        resizeMode: 'cover',
        width: SCREEN_WIDTH - 5,
        // borderRadius: 4,
        alignSelf: 'center'
    },
    indexText: {
        ...FontStyle(12, colors.neutral_900)
    },
    indexView: {
        backgroundColor: colors.neutral_200,
        position: 'absolute',
        zIndex: 1,
        top: hp(10),
        right: hp(10),
        paddingHorizontal: 13,
        borderRadius: 50,
        paddingVertical: 3
    },
    backgroundVideo: {
        height: SCREEN_WIDTH - 5,
        // resizeMode: 'cover',
        width: SCREEN_WIDTH - 5,
        backgroundColor: 'black',
        alignSelf: 'center'
    },
})