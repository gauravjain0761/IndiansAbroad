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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ChatCard from '../../Components/ChatCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessage, getChatRooms, getGroupRooms, onOpemMyChatRoom } from '../../Services/ChatServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { GET_CHAT_MESSAGES, SET_ACTIVE_CHAT_ROOM_USER } from '../../Redux/ActionTypes';
import PagerView from 'react-native-pager-view';
import NoDataFound from '../../Components/NoDataFound';
export default function ChatRoomUsersScreen() {
    const dispatch = useDispatch();
    const { navigate } = useNavigation();
    const { myPageChatUsers, myPage } = useSelector(e => e.common)
    console.log('myPageChatUsers---', myPageChatUsers)
    const isFocuse = useIsFocused();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        let obj = {
            data: {
                communityPageId: myPage[0]._id,
                searchText: '',
                page: 1
            },
            isPage: true,
            onSuccess: () => {
                setRefreshing(false);
            }
        }
        dispatch(onOpemMyChatRoom(obj))

    }, []);

    useEffect(() => {
        if (isFocuse) {
            let obj = {
                data: {
                    communityPageId: myPage[0]._id,
                    searchText: '',
                    page: 1
                },
                isPage: true,
            }
            dispatch(onOpemMyChatRoom(obj))
        }
    }, [isFocuse])

    const onPressItem = (item, currentUser) => {
        dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
        dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser, chatId: item._id })
        navigate(screenName.Messaging);
    };


    return (
        <View style={ApplicationStyles.applicationView}>
            <SafeAreaView style={ApplicationStyles.applicationView}>
                <Header
                    title={''}
                    showLeft={true}
                    showRight={false}
                    onLeftPress={() => goBack()}
                />
                {myPageChatUsers && <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={styles.flatlist}
                    columnWrapperStyle={styles.column}
                    numColumns={2}
                    bounces={false}
                    data={myPageChatUsers}
                    renderItem={({ item }) => {
                        return (
                            <ChatCard
                                data={item}
                                cardPress={currentUser => onPressItem(item, currentUser)}
                            />
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<NoDataFound />}
                />}
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({})