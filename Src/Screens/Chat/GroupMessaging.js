import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import ChatHeader from '../../Components/ChatHeader';
import ReciverMsg from '../../Components/ReceiverMsg';
import colors from '../../Themes/Colors';
import SenderMsg from '../../Components/SenderMsg';
import ChatInput from '../../Components/ChatInput';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { screenName } from '../../Navigation/ScreenConstants';
import { sendData } from '../../Socket/Socket';
export default function GroupMessaging() {
    const { chatMessageList, user, activeChatRoomUser } = useSelector(e => e.common);
    const navigation = useNavigation()

    useEffect(() => {
        sendData('joinRoom', activeChatRoomUser?.chatId)
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <ChatHeader
                isGroup={true}
                url={activeChatRoomUser?.currentUser?.chatLogo[0]?.location}
                name={activeChatRoomUser?.currentUser?.chatName}
                subscribedMember={false}
                onPressName={() => navigation.navigate(screenName.GroupDetailScreen)}
            />
            <FlatList
                inverted
                data={chatMessageList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    if (item?.createdBy?._id !== user._id) {
                        return <ReciverMsg data={item} />;
                    } else {
                        return <SenderMsg data={item} />;
                    }
                }}
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <ChatInput />
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
})