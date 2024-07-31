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

let data = [
  {
    id: 1,
    name: 'Sager khot',
    message: 'Welcome Nikita',
    time: '02:51',
    type: 'receiver',
  },
  {
    id: 2,
    name: 'Kalyani Kadam',
    message: 'Hi',
    time: '02:51',
    type: 'receiver',
  },
  {
    id: 3,
    name: 'Sager khot',
    message: 'Welcome',
    time: '02:51',
    type: 'receiver',
  },
  {
    id: 4,
    name: 'Kalyani Kadam',
    message: 'Thank u',
    time: '02:51',
    type: 'receiver',
  },
  {
    id: 5,
    name: 'You',
    message: 'Hello',
    time: '02:51',
    type: 'sender',
  },
  {
    id: 6,
    name: 'Sager khot',
    message: 'Tula nhi welcome',
    time: '02:51',
    type: 'receiver',
  },
  {
    id: 7,
    name: 'You',
    message: 'jato mg',
    time: '02:51',
    type: 'sender',
  },
  {
    id: 8,
    name: 'Sager khot',
    message: 'Hahaha',
    time: '02:51',
    type: 'receiver',
  },
];

const Messaging = () => {
  const { chatMessageList, user, activeChatRoomUser } = useSelector(e => e.common);
  const navigation = useNavigation()

  useEffect(() => {
    sendData('joinRoom', activeChatRoomUser?.chatId)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        url={activeChatRoomUser?.currentUser?.avtar}
        name={
          activeChatRoomUser?.currentUser?.first_Name + ' ' + activeChatRoomUser?.currentUser?.last_Name
        }
        subscribedMember={activeChatRoomUser?.currentUser?.subscribedMember}
        onPressName={() => navigation.navigate(screenName.PersonalUserDetailScreen, { user: activeChatRoomUser?.currentUser })}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
export default Messaging;
