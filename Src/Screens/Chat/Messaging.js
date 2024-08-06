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
  const { chatMessageList, user, activeChatRoomUser, allChatMessageCount } = useSelector(e => e.common);
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
    if (message.trim() !== '') {
      let messageData = {
        chatId: activeChatRoomUser?.chatId,
        content: message.trim(),
        content_type: 'text/plain',
        createdBy: user?._id,
        readBy: [user?._id]
      }
      socket.emit('msgSendText', { message: messageData, room: activeChatRoomUser?.chatId })
      setmessage('')
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
        url={activeChatRoomUser?.currentUser?.avtar}
        name={
          activeChatRoomUser?.currentUser?.first_Name + ' ' + activeChatRoomUser?.currentUser?.last_Name
        }
        subscribedMember={activeChatRoomUser?.currentUser?.subscribedMember}
        onPressName={() => { dispatchAction(dispatch, SET_CHAT_DETAIL, undefined), navigation.navigate(screenName.PersonalUserDetailScreen, { user: activeChatRoomUser?.currentUser }) }}
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
export default Messaging;
