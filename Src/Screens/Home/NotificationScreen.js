import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { FontStyle } from '../../utils/commonFunction';
import { hp, wp } from '../../Themes/Fonts';
import colors from '../../Themes/Colors';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAcceptRejectRequest,
  onGetNotification,
} from '../../Services/AuthServices';
import NoDataFound from '../../Components/NoDataFound';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { dispatchAction } from '../../utils/apiGlobal';
import { GET_CHAT_MESSAGES, IS_LOADING, SET_ACTIVE_CHAT_ROOM_USER, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS } from '../../Redux/ActionTypes';
import moment from 'moment';
import { onGetSinglePost } from '../../Services/PostServices';
import { screenName } from '../../Navigation/ScreenConstants';
import { onOpenNewChatForUser } from '../../Services/ChatServices';

const NotificationScreen = () => {
  const [categories, setCategories] = useState('All');
  const { goBack } = useNavigation();
  const { user, notificationList } = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [notiArray, setnotiArray] = useState(undefined);
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!notificationList) {
      dispatchAction(dispatch, IS_LOADING, true);
    }
    dispatch(onGetNotification({ data: { loginUserId: user?._id } }));
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(onGetNotification({
      data: { loginUserId: user?._id }, onSuccess: () => {
        setRefreshing(false)
      }
    }));

  }, []);

  const onPressBack = () => {
    goBack();
  };

  const onPressReq = (item, type) => {
    let obj = {
      data: {
        userId: user?._id,
        requestedId: item?.createdBy?._id,
        action: type,
        notificationId: item?._id,
      },
      onSuccess: () => {
        if (type == 'accept') {
          navigation.navigate(screenName.indiansDetails, { userId: item?.createdBy?._id });
        }
        dispatch(onGetNotification({ data: { loginUserId: user?._id } }));
      },
    };
    dispatch(onAcceptRejectRequest(obj));
  };

  const openPost = (item) => {
    dispatchAction(dispatch, IS_LOADING, true);
    dispatch(onGetSinglePost({
      data: { postId: item?.postId, loginUserId: user._id },
      onSuccess: (res) => {
        if (res.data?.type == 'cppost') {
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          dispatchAction(dispatch, SET_ACTIVE_POST, { _id: item?.postId });
          navigation.navigate(screenName.PagesPostDetail);
        } else {
          dispatchAction(dispatch, SET_ACTIVE_POST, { _id: item?.postId });
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          navigation.navigate(screenName.PostDetail);
        }
      }
    }))
  }

  const openThread = (item) => {
    dispatchAction(dispatch, SET_ACTIVE_POST, { _id: item?.threadId });
    dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
    navigation.navigate(screenName.DiscussionForumDetail)
  }

  const openMessageScreen = (item) => {
    if (item?.groupId?.isGroupChat) {
      dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
      dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser: item?.groupId, chatId: item?.groupId?._id })
      navigation.navigate(screenName.GroupMessaging);
    } else {
      dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
      dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser: item?.groupId?.users?.filter(item => item._id !== user?._id)?.[0], chatId: item?.groupId._id })
      navigation.navigate(screenName.Messaging);
    }
  }

  const onPressNotification = (type, item) => {
    if (type.includes('post') || type == 'commentTag' || type == 'mention') {
      openPost(item)
    } else if (type.includes('thread') || type == 'threadCommentTagged' || type == 'mentionthread') {
      openThread(item)
    } else if (type.includes('connect')) {
      navigation.navigate(screenName.indiansDetails, { userId: item?.createdBy?._id });
    } else if (type == 'message') {
      openMessageScreen(item)
    }
  }

  const openChat = (item) => {
    let obj = {
      data: {
        CpUserId: item?.sender?._id,
        userId: user?._id,
        communityPageId: 'NA',
      },
      onSuccess: () => {
        navigation.navigate(screenName.Messaging, { notification: item });
      },
    };
    dispatch(onOpenNewChatForUser(obj));
  }

  const renderItem = ({ item, index }) => {

    return (
      <>
        {item?.type == 'follow-request' ? (
          <View key={item?._id} style={styles.requestContainer}>
            <TouchableOpacity onPress={() => navigation.navigate(screenName.indiansDetails, { userId: item?.createdBy?._id })} style={styles.leftSide}>
              <RenderUserIcon isBorder={item?.createdBy?.subscribedMember} type='user' url={item?.createdBy?.avtar} height={45} />
              <View style={styles.centerContainer}>
                <Text style={styles.name}>{item?.createdBy?.first_Name} {item?.createdBy?.last_Name}{' '}{item?.title?.trim()}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => onPressReq(item, 'accept')} style={styles.button}>
                    <Text style={styles.buttonText}>{'Accept'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onPressReq(item, 'reject')} style={styles.button}>
                    <Text style={styles.buttonText}>{'Ignore'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.time}>{item?.createdAt}</Text>
            </TouchableOpacity>
          </View>
        ) :
          item?.type == 'message-request' ? (
            <View key={item?._id} style={styles.Container}>
              <TouchableOpacity onPress={() => openChat(item)} style={styles.leftSide}>
                <RenderUserIcon isBorder={item?.sender?.subscribedMember} type='user' url={item?.sender?.avtar} height={45} />
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{item?.sender?.first_Name} {item?.sender?.last_Name}{' '}{'has sent you a one time message request.'}</Text>
                </View>
                <Text style={styles.time}>{item?.createdAt}</Text>
              </TouchableOpacity>
            </View>
          )
            : (
              <View key={item?._id} style={styles.Container}>
                <TouchableOpacity onPress={() => onPressNotification(item?.type, item)} style={styles.leftSide}>
                  <RenderUserIcon isBorder={item?.createdBy?.subscribedMember} type='user' url={item?.createdBy?.avtar} height={45} />
                  <View style={styles.nameContainer}>
                    {/* <Text>{item.type}</Text> */}
                    <Text style={styles.name}>{item?.createdBy?.first_Name} {item?.createdBy?.last_Name}{' '}{item?.type == 'message' ? 'has sent you a message' : item?.title?.trim()}</Text>
                  </View>
                  <Text style={styles.time}>{item?.createdAt}</Text>
                </TouchableOpacity>
              </View>
            )}
      </>
    );
  };

  const RenderFlatList = ({ data }) => {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={data}
        ItemSeparatorComponent={() => (
          <View style={styles.separator}></View>
        )}
        renderItem={renderItem}
      />
    )
  }
  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header logoShow={false} onLeftPress={onPressBack} showLeft />
      <Text style={styles.title}>{'Notifications'}</Text>
      {notificationList && (
        <View style={styles.categoriesContainer}>
          <TouchableOpacity style={styles.btnView} onPress={() => setCategories('All')}>
            <Text style={[styles.categoriesTitle, { color: categories == 'All' ? colors?.tertiary1_500 : colors?.black, },]}>
              {`All`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnView} onPress={() => setCategories('Requests')}>
            <Text style={[styles.categoriesTitle, { color: categories == 'Requests' ? colors?.tertiary1_500 : colors?.black, },]}>
              {`Connection Invite(${notificationList.filter(obj => (obj?.type == 'follow-request' || obj?.type == 'message-request')).length})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {notificationList && (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } style={{ marginTop: 0 }}>
          {notificationList?.length > 0 ? (
            <View style={ApplicationStyles.flex}>
              {categories == 'All' ? (
                notificationList?.filter(obj => moment(obj?.createdDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY'),).length > 0 ? (
                  <View>
                    <View style={styles.newHeader}>
                      <Text style={styles.HeaderTitle}>{'New'}</Text>
                    </View>
                    <View style={styles.notificationcontainer}>
                      <RenderFlatList data={notificationList?.filter(obj => moment(obj?.createdDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY'),)} />
                    </View>
                    {notificationList?.filter(obj => moment(obj?.createdDate).format('DD/MM/YYYY') !== moment().format('DD/MM/YYYY'),).length > 0 &&
                      <View>
                        <View style={styles.newHeader}>
                          <Text style={styles.HeaderTitle}>{'Older'}</Text>
                        </View>
                        <View style={styles.notificationcontainer}>
                          <RenderFlatList data={notificationList?.filter(obj => moment(obj?.createdDate).format('DD/MM/YYYY') !== moment().format('DD/MM/YYYY'),)} />
                        </View>
                      </View>
                    }
                  </View>
                ) : (
                  <View style={styles.notificationcontainer}>
                    <RenderFlatList data={notificationList} />
                  </View>
                )
              ) : notificationList?.filter(obj => (obj?.type == 'follow-request' || obj?.type == 'message-request') && moment(obj?.createdDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')).length > 0 ? (
                <>
                  <View style={styles.newHeader}>
                    <Text style={styles.HeaderTitle}>{'New'}</Text>
                  </View>
                  <View style={styles.notificationcontainer}>
                    <RenderFlatList data={notificationList?.filter(obj => (obj?.type == 'follow-request' || obj?.type == 'message-request') && moment(obj?.createdDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY'))} />
                  </View>
                  <View style={styles.newHeader}>
                    <Text style={styles.HeaderTitle}>{'Older'}</Text>
                  </View>
                  <View style={styles.notificationcontainer}>
                    <RenderFlatList data={notificationList?.filter(obj => (obj?.type == 'follow-request' || obj?.type == 'message-request') && moment(obj?.createdDate).format('DD/MM/YYYY') !== moment().format('DD/MM/YYYY'))} />
                  </View>
                </>
              ) : (
                <View style={styles.notificationcontainer}>
                  <RenderFlatList data={notificationList?.filter(obj => obj?.type == 'follow-request' || obj?.type == 'message-request',)} />
                </View>
              )}
            </View>
          ) : (
            <NoDataFound text={'No notifications yet – exciting updates coming soon!'} />
          )}
        </ScrollView>
      )}
      {categories !== 'All' && (
        <Text style={styles.bottomText}>
          Go to Indians page to connect more people
        </Text>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  title: {
    ...FontStyle(18, colors.black, '700'),
    paddingLeft: wp(14),
    lineHeight: hp(26),
    marginTop: -5,
  },
  categoriesTitle: {
    ...FontStyle(14, colors.black, '700'),
    // lineHeight: hp(22),
  },
  categoriesContainer: {
    flexDirection: 'row',
    // marginHorizontal: wp(17),
    marginVertical: hp(12),
    backgroundColor: colors.white,
    justifyContent: 'space-evenly',
  },
  btnView: {
    borderWidth: 1,
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderColor: colors.borderColor
  },
  newHeader: {
    backgroundColor: colors.secondary_500,
    marginTop: hp(3),
  },
  HeaderTitle: {
    ...FontStyle(14, colors.black, '400'),
    lineHeight: hp(22),
    paddingVertical: hp(4),
    paddingLeft: wp(15),
  },
  notificationcontainer: {
    flex: 1,
  },
  Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  name: {
    ...FontStyle(14, colors.black, '400'),
  },
  nameContainer: {
    flex: 1,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    ...FontStyle(11, colors.neutral_500, '400'),
  },
  separator: {
    backgroundColor: colors.secondary_500,
    height: 1,
  },
  requestContainer: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    margin: 5,
    borderWidth: 1,
    borderColor: colors.neutral_400,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
  },
  centerContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary_500,
    borderRadius: 3,
    marginTop: hp(1),
    height: 30,
    justifyContent: 'center',
    width: 80,
    alignItems: 'center',
  },
  buttonText: {
    ...FontStyle(13, colors.white, '400'),
  },
  footerTitle: {
    ...FontStyle(14, colors.black, '400'),
    alignSelf: 'center',
  },
  bottomText: {
    ...FontStyle(14, colors.neutral_900),
    textAlign: 'center',
    margin: wp(14),
  },
});
