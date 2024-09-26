import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import ChatHeader from '../../Components/ChatHeader';
import ReciverMsg from '../../Components/ReceiverMsg';
import colors from '../../Themes/Colors';
import SenderMsg from '../../Components/SenderMsg';
import ChatInput from '../../Components/ChatInput';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { screenName } from '../../Navigation/ScreenConstants';
import { sendData, socket } from '../../Socket/Socket';
import { getChatMessage, onGetUnreadMsgCount } from '../../Services/ChatServices';
import { SET_CHAT_DETAIL } from '../../Redux/ActionTypes';
import { dispatchAction } from '../../utils/apiGlobal';
import { errorToast } from '../../utils/commonFunction';


export default function PageMessaging() {
    const { chatMessageList, user, followerList, activeChatRoomUser, allChatMessageCount } = useSelector(e => e.common);
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [message, setmessage] = useState('')
    const isFocused = useIsFocused()
    const [loading, setloading] = useState(false)
    const [page, setpage] = useState(1)
    useFocusEffect(
        React.useCallback(() => {
            getData(1)
        }, [])
    );
    const getData = (page) => {
        let obj = {
            data: {
                search: '',
                chatId: activeChatRoomUser?.chatId,
                currUser: user._id,
                page: page,
                userId: user._id,
            },
            onSuccess: () => {
                setloading(false)
                setpage(page)
            },
        };
        dispatch(getChatMessage(obj));
    }

    useEffect(() => {
        socket.emit('joinRoom', activeChatRoomUser?.chatId)
        socket.emit('messgeReadAll', { receivedBy: user?._id, chatId: activeChatRoomUser?.chatId })
        dispatch(onGetUnreadMsgCount({ data: { userId: user?._id } }))
    }, []);
    const onSendMessage = () => {
        if (message.trim() !== '' && message.trim().length <= 2000) {
            let messageData = {
                chatId: activeChatRoomUser?.chatId,
                content: message.trim(),
                content_type: 'text/plain',
                createdBy: user?._id,
                readBy: [user?._id]
            }
            socket.emit('msgSendText', { message: messageData, room: activeChatRoomUser?.chatId })
            setmessage('')
        } else {
            errorToast('Message should be less than or equal to 2000 characters.')
        }
    }
    const fetchMoreData = () => {
        if (chatMessageList) {
            if (chatMessageList.length < allChatMessageCount) {
                setloading(true);
                getData(page + 1);
            }
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <ChatHeader
                url={activeChatRoomUser?.currentUser?.chatLogo[0]?.cdnlocation}
                name={
                    activeChatRoomUser?.currentUser?.chatName
                }
                isPage={true}
                onPressName={() => { dispatchAction(dispatch, SET_CHAT_DETAIL, undefined), navigation.navigate(screenName.PersonalUserDetailScreen, { user: activeChatRoomUser?.currentUser, isPage: true }) }}
            />
            <FlatList
                inverted
                data={chatMessageList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    if (item?.createdBy?._id !== user._id) {
                        return <ReciverMsg isPage={true} data={item} />;
                    } else {
                        return <SenderMsg data={item} />;
                    }
                }}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => {
                    return (
                        <View>
                            {chatMessageList && loading && (
                                <ActivityIndicator size={'large'} color={colors.black} />
                            )}
                            <View style={{ height: 50 }} />
                        </View>
                    );
                }}
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <ChatInput message={message} setmessage={setmessage} onSend={() => onSendMessage()} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});