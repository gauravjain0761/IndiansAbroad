import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
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
import { getChatMessage, onCheckMessageRequest, onGetUnreadMsgCount } from '../../Services/ChatServices';
import { SET_CHAT_DETAIL } from '../../Redux/ActionTypes';
import { dispatchAction } from '../../utils/apiGlobal';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { FontStyle } from '../../utils/commonFunction';
import { hp, wp } from '../../Themes/Fonts';
import moment from 'moment';
import MessageRequestModal from '../../Components/MessageRequestModal';
import { onAcceptRejectRequest, onGetNotification } from '../../Services/AuthServices';
import { getFollowerList } from '../../Services/PostServices';

const Messaging = () => {
  const { chatMessageList, user, followerList, activeChatRoomUser, allChatMessageCount } = useSelector(e => e.common);
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [message, setmessage] = useState('')
  const isFocused = useIsFocused()
  const [loading, setloading] = useState(false)
  const [page, setpage] = useState(1)
  const [messageRequestModal, setmessageRequestModal] = useState(false)
  const { params } = useRoute()

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
            <Text style={styles.dateText}>{today === currentDate ? 'Today' : yesterday === currentDate ? 'Yesterday' : currentDate}</Text>
          </View>
          <View style={styles.textLine} />
        </View>
      )
    } else if (index + 1 <= chatMessageList.length - 1) {
      let prevDate = moment(chatMessageList[index + 1].createdAt).format(dateFormat);
      if (currentDate !== prevDate) {
        return <View style={styles.datesContainer}>
          <View style={styles.textLine} />
          <View>
            <Text style={styles.dateText}>{today === currentDate ? 'Today' : yesterday === currentDate ? 'Yesterday' : currentDate}</Text>
          </View>
          <View style={styles.textLine} />
        </View>
      }
    }
  }

  const checkRequest = () => {

    if (params?.notification) {
      Alert.alert('To begin chatting with this user, please accept their connection request first.')
    } else {
      let obj = {
        data: {
          receiverId: activeChatRoomUser?.currentUser?._id
        },
        onSuccess: (res) => {
          if (res?.msgCount == 0) {
            setmessageRequestModal(true);
          } else {
            dispatch(getFollowerList({
              data: { userId: user?._id, search: '' },
              onSuccess: (res) => {
                if (res?.data?.length > 0) {
                  let temp = res?.data?.filter(obj => obj?.followingId?._id == activeChatRoomUser?.currentUser?._id)
                  if (temp.length > 0) {
                    // Alert.alert('You have already requested to this user');
                  } else {
                    Alert.alert('You already requested to this user');
                  }
                }
              }
            }));
            // 
          }
        },
      };
      dispatch(onCheckMessageRequest(obj));
    }


  }

  const onPressReq = (type) => {
    let obj = {
      data: {
        userId: user?._id,
        requestedId: params?.notification?.sender?._id,
        action: type,
        notificationId: params?.notification?._id,
      },
      onSuccess: () => {
        navigation.setParams({ notification: undefined })
        dispatch(getFollowerList({ data: { userId: user?._id, search: '' } }));
        dispatch(onGetNotification({ data: { loginUserId: user?._id } }));
      },
    };
    dispatch(onAcceptRejectRequest(obj));
  };

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
      {params?.notification ? <View style={ApplicationStyles.flex}>
        <View style={styles.requestView}>
          <Text style={styles.title}>Message request to connect</Text>
          <View style={styles.whiteView}>
            <Text style={styles.des}>Hi {user?.first_Name},{'\n'}{params?.notification?.content}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => onPressReq('accept')} style={styles.button}>
            <Text style={styles.buttonText}>{'Accept'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPre('reject')} style={styles.button}>
            <Text style={styles.buttonText}>{'Ignore'}</Text>
          </TouchableOpacity>
        </View>
      </View> :
        <FlatList
          inverted
          data={chatMessageList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View>
                {checkDate(item, index)}
                {item?.createdBy?._id !== user._id ?
                  <ReciverMsg data={item} />
                  :
                  <SenderMsg data={item} />}
              </View>
            )
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
        />}
      {followerList?.filter(obj => obj?.followingId?._id == activeChatRoomUser?.currentUser?._id).length > 0 ?
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ChatInput message={message} setmessage={setmessage} onSend={() => onSendMessage()} />
        </KeyboardAvoidingView>
        :
        <View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <ChatInput message={message} setmessage={setmessage} onSend={() => onSendMessage()} />
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={() => checkRequest()} style={{ position: 'absolute', zIndex: 1, left: 0, right: 0, bottom: 0, top: 0 }}>
          </TouchableOpacity>
        </View>
      }
      {messageRequestModal &&
        <MessageRequestModal userId={activeChatRoomUser?.currentUser?._id} visible={messageRequestModal} onClose={() => setmessageRequestModal(false)} />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  requestView: {
    backgroundColor: colors.info_700,
    marginTop: 10,
    borderRadius: 4
  },
  title: {
    ...FontStyle(14, colors.white, '700'),
    textAlign: 'center',
    paddingVertical: 5
  },
  whiteView: {
    backgroundColor: colors.white,
    padding: 5,
    marginHorizontal: wp(16),
    marginBottom: 10,
    borderRadius: 4
  },
  des: {
    ...FontStyle(14, colors.neutral_700),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
    alignSelf: 'center',
    marginTop: 15
  },
  centerContainer: {
    flex: 1
  },
  button: {
    backgroundColor: colors.primary_500,
    // paddingHorizontal: wp(15),
    borderRadius: 3,
    marginTop: hp(1),
    height: 30,
    justifyContent: 'center',
    width: 80,
    alignItems: 'center'
  },
  buttonText: {
    ...FontStyle(13, colors.white, '400'),
    // lineHeight: hp(20),
  },

  datesContainer: {
    flexDirection: 'row', alignItems: 'center', marginVertical: hp(10),
  },
  textLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral_400
  },
  dateText: {
    textAlign: 'center',
    marginHorizontal: hp(10),
    ...FontStyle(11, colors.neutral_900),

  },
});
export default Messaging;
