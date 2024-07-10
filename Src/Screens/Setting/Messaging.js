import React, {useEffect} from 'react';
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
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import {io} from 'socket.io-client';

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
  const {chatMessageList, user} = useSelector(e => e.common);
  const {params} = useRoute();

  useEffect(() => {
    const mSocket = io('https://express.indiansabroad.online/');
    mSocket.emit('joinRoom', params?.chatId);

    mSocket.on('msgReceive', data => {
      console.log('msgReceive', data);
    });
    mSocket.on('msgReceiveSelf', data => {
      console.log('damsgReceiveSelfta', data);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        url={params?.currentUser?.avtar}
        name={
          params?.currentUser?.first_Name + ' ' + params?.currentUser?.last_Name
        }
      />
      <FlatList
        inverted
        data={chatMessageList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
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
