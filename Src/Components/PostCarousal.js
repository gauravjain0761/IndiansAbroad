import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SCREEN_WIDTH, fontname, hp } from '../Themes/Fonts'
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';

export default function PostCarousal({ images }) {
    const [currentIndex, setindex] = useState(0)
    return (
        <View>
            {images.length == 1 ?
                <View>
                    <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: images[0].location }} style={styles.postImage} />
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
                                <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: item.location }} style={styles.postImage} />
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
        borderRadius: 4,
        alignSelf: 'center'
    },
    indexText: {
        ...FontStyle(fontname.actor_regular, 12, colors.neutral_900)
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
    }
})