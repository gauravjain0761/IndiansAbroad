import { StyleSheet, View, Text } from 'react-native';
import React, { } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Pdf from 'react-native-pdf'
export default function MediaPreviewScreen() {
    const { params } = useRoute()
    const navigation = useNavigation()
    console.log(params)
    return (
        <View style={ApplicationStyles.applicationView}>
            <SafeAreaView style={ApplicationStyles.applicationView}>
                <Header
                    title={''}
                    showLeft={true}
                    showRight={false}
                    onLeftPress={() => goBack()}
                />
                <View style={ApplicationStyles.flex}>
                    {params?.url?.metadata?.contentType.includes('video') ?
                        <Video
                            source={{ uri: params?.url?.location }}
                            playInBackground={false}
                            paused={true}
                            muted={false}
                            controls={true}
                            resizeMode={'contain'}
                            onError={(err) => console.log(err)}
                            style={styles.backgroundVideo}
                        />
                        : params?.url?.metadata?.contentType.includes('image') ?
                            <FastImage resizeMode={FastImage.resizeMode.contain} source={{ uri: params?.url.location }} style={styles.postImage} />
                            :
                            <Pdf
                                trustAllCerts={false}
                                source={{ uri: params?.url?.location }}
                                onLoadComplete={(numberOfPages, filePath) => {
                                    console.log(`Number of pages: ${numberOfPages}`);
                                }}
                                onPageChanged={(page, numberOfPages) => {
                                    console.log(`Current page: ${page}`);
                                }}
                                onError={(error) => {
                                    console.log('error---', error);
                                }}
                                onPressLink={(uri) => {
                                    console.log(`Link pressed: ${uri}`);
                                }}
                                style={styles.pdf} />
                    }
                </View>
            </SafeAreaView>
        </View>

    )
}

const styles = StyleSheet.create({
    postImage: {
        height: '100%',
        width: '100%'
    },
    backgroundVideo: {
        backgroundColor: 'black',
        height: '100%',
        width: '100%'
    },
    pdf: {
        flex: 1
    }
})