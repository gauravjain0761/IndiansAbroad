import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SCREEN_WIDTH } from '../Themes/Fonts'
import Carousel from 'react-native-reanimated-carousel';

export default function PostCarousal({ images }) {
    const width = Dimensions.get('window').width;
    return (
        <View>
            {images.length == 1 ?
                <View>
                    <Image source={{ uri: images[0].location }} style={styles.postImage} />
                </View>
                :
                // <Carousel
                //     loop
                //     width={width}
                //     height={width / 2}
                //     autoPlay={true}
                //     data={[...new Array(6).keys()]}
                //     scrollAnimationDuration={1000}
                //     onSnapToItem={(index) => console.log('current index:', index)}
                //     renderItem={({ index }) => (
                //         <View
                //             style={{
                //                 flex: 1,
                //                 borderWidth: 1,
                //                 justifyContent: 'center',
                //             }}
                //         >
                //             <Text style={{ textAlign: 'center', fontSize: 30 }}>
                //                 {index}
                //             </Text>
                //         </View>
                //     )}
                // />
                null
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
})