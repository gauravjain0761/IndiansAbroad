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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { io } from 'socket.io-client';
import { screenName } from '../../Navigation/ScreenConstants';
import { sendData, socket } from '../../Socket/Socket';
import { getChatMessage, onGetUnreadMsgCount } from '../../Services/ChatServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { SET_CHAT_DETAIL } from '../../Redux/ActionTypes';
import moment from 'moment';
import { errorToast, FontStyle } from '../../utils/commonFunction';
import { hp } from '../../Themes/Fonts';
import { replaceTriggerValues } from 'react-native-controlled-mentions';
export default function GroupMessaging() {
  const { chatMessageList, user, tagPart, activeChatRoomUser, allChatMessageCount } =
    useSelector(e => e.common);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [message, setmessage] = useState('');
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      getData(1);
    }, []),
  );
  const getData = page => {
    let obj = {
      data: {
        search: '',
        chatId: activeChatRoomUser?.chatId,
        currUser: user._id,
        page: page,
        userId: user._id,
      },
      onSuccess: () => {
        setloading(false);
        setpage(page);
      },
    };
    dispatch(getChatMessage(obj));
  };

  useEffect(() => {
    socket.emit('joinRoom', activeChatRoomUser?.chatId);
    socket.emit('messgeReadAll', {
      receivedBy: user?._id,
      chatId: activeChatRoomUser?.chatId,
    });
    dispatch(onGetUnreadMsgCount({ data: { userId: user?._id } }));
  }, []);

  const onSendMessage = () => {
    if (message.trim() !== '' && message.trim().length <= 2000) {
      let messageData = {
        chatId: activeChatRoomUser?.chatId,
        content: replaceTriggerValues(message.trim(), ({ id }) => `@${id}`),
        content_type: 'text/plain',
        createdBy: user?._id,
        readBy: [user?._id],
      };
      socket.emit('msgSendText', {
        message: messageData,
        room: activeChatRoomUser?.chatId,
      });
      setmessage('');
    } else {
      errorToast('Message should be less than or equal to 2000 characters.')
    }
  };

  const fetchMoreData = () => {
    if (chatMessageList) {
      if (chatMessageList.length < allChatMessageCount) {
        setloading(true);
        getData(page + 1);
      }
    }
  };

  const checkDate = (item, index) => {
    let dateFormat = 'DD MMMM YYYY';
    let today = moment().format(dateFormat);
    let yesterday = moment().subtract(1, 'days').format(dateFormat);
    let currentDate = moment(item?.createdAt).format(dateFormat);
    if (index == chatMessageList.length - 1) {
      return (
        <View style={styles.datesContainer}>
          <View style={styles.textLine} />
          <View>
            <Text style={styles.dateText}>
              {today === currentDate
                ? 'Today'
                : yesterday === currentDate
                  ? 'Yesterday'
                  : currentDate}
            </Text>
          </View>
          <View style={styles.textLine} />
        </View>
      );
    } else if (index + 1 <= chatMessageList.length - 1) {
      let prevDate = moment(chatMessageList[index + 1].createdAt).format(
        dateFormat,
      );
      if (currentDate !== prevDate) {
        return (
          <View style={styles.datesContainer}>
            <View style={styles.textLine} />
            <View>
              <Text style={styles.dateText}>
                {today === currentDate
                  ? 'Today'
                  : yesterday === currentDate
                    ? 'Yesterday'
                    : currentDate}
              </Text>
            </View>
            <View style={styles.textLine} />
          </View>
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        isGroup={true}
        url={activeChatRoomUser?.currentUser?.chatLogo[0]?.cdnlocation}
        name={activeChatRoomUser?.currentUser?.chatName}
        subscribedMember={false}
        onPressName={() => {
          dispatchAction(dispatch, SET_CHAT_DETAIL, undefined),
            navigation.navigate(screenName.GroupDetailScreen);
        }}
      />
      <FlatList
        inverted
        data={chatMessageList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View>
              {checkDate(item, index)}
              {item?.createdBy?._id !== user._id ? (
                <ReciverMsg data={item} />
              ) : (
                <SenderMsg data={item} />
              )}
            </View>
          );
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
        <ChatInput
          message={message}
          setmessage={setmessage}
          onSend={() => onSendMessage()}
          isGroup={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(10),
  },
  textLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral_400,
  },
  dateText: {
    textAlign: 'center',
    marginHorizontal: hp(10),
    ...FontStyle(11, colors.neutral_900),
  },
});
