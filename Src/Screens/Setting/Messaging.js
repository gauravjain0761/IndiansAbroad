import React from 'react';
import {View, Text, SafeAreaView, FlatList, StyleSheet} from 'react-native';
import RenderUserIcon from '../../Components/RenderUserIcon';
import ChatHeader from '../../Components/ChatHeader';
import ReciverMsg from '../../Components/ReceiverMsg';
import colors from '../../Themes/Colors';
import SenderMsg from '../../Components/SenderMsg';

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
  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader />
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          if (item.type === 'receiver') {
            return <ReciverMsg data={item} />;
          } else {
            return <SenderMsg data={item} />;
          }
        }}
      />
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
