import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { FontStyle } from '../../utils/commonFunction';
import { fontname, hp, wp } from '../../Themes/Fonts';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import { Icons } from '../../Themes/Icons';
import RenderUserIcon from '../../Components/RenderUserIcon';
import ConnectCard from '../../Components/ConnectCard';
import { screenName } from '../../Navigation/ScreenConstants';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import ChatCard from '../../Components/ChatCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessage, getChatRooms, getGroupRooms, onOpemMyChatRoom } from '../../Services/ChatServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { GET_CHAT_MESSAGES, SET_ACTIVE_CHAT_ROOM_USER } from '../../Redux/ActionTypes';
import PagerView from 'react-native-pager-view';
import NoDataFound from '../../Components/NoDataFound';
import FastImage from 'react-native-fast-image';
import Video, { VideoRef } from 'react-native-video';

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
                            // Can be a URL or a local file.
                            source={{ uri: params?.url?.location }}
                            playInBackground={false}
                            paused={true}
                            muted={false}
                            controls={true}
                            resizeMode={'contain'}
                            // poster={poster?.location}
                            // posterResizeMode='cover'
                            onError={(err) => console.log(err)}
                            style={styles.backgroundVideo}
                        />
                        :
                        <FastImage resizeMode={FastImage.resizeMode.contain} source={{ uri: params?.url.location }} style={styles.postImage} />

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
    }
})