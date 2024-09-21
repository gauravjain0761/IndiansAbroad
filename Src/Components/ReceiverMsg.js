import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SCREEN_WIDTH, hp, wp } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import { FontStyle } from '../utils/commonFunction';
import { Menu } from 'react-native-material-menu';
import { api } from '../utils/apiConstants';
import moment from 'moment';
import RenderUserIcon from './RenderUserIcon';
import RenderText from './RenderText';
import ChatMessageMedia from './ChatMessageMedia';
import { useDispatch, useSelector } from 'react-redux';
import { StackActions, useNavigation } from '@react-navigation/native';
import { dispatchAction } from '../utils/apiGlobal';
import { GET_CHAT_MESSAGES, IS_LOADING, SET_ACTIVE_CHAT_ROOM_USER, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS } from '../Redux/ActionTypes';
import { onGetSinglePost } from '../Services/PostServices';
import { screenName } from '../Navigation/ScreenConstants';
import { onDeleteMessageForUser, onJoinGroupChat } from '../Services/ChatServices';
import RenderFileMessageView from './RenderFileMessageView';
import ConfirmationModal from './ConfirmationModal';


const ReciverMsg = ({ data, isPage = false }) => {
  const [visible, setVisible] = useState(false);
  const { user } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [deletePostModal, setdeletePostModal] = useState(false)

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);


  const onOpenPostDetail = () => {
    dispatchAction(dispatch, IS_LOADING, true);
    dispatch(onGetSinglePost({
      data: {
        postId: data?.sharePostId,
        loginUserId: user._id
      },
      onSuccess: (res) => {
        if (res.data?.type == 'cppost') {
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          dispatchAction(dispatch, SET_ACTIVE_POST, { _id: data?.sharePostId });
          navigation.navigate(screenName.PagesPostDetail);
        } else {
          dispatchAction(dispatch, SET_ACTIVE_POST, { _id: data?.sharePostId });
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          navigation.navigate(screenName.PostDetail);
        }
      }
    }))
  }

  const onPressJoinNowBtn = () => {
    let obj = {
      data: {
        curruntUser: user._id,
        groupId: data?.invitedGroupId?._id,
        messageId: data?._id,
        notificationId: ''
      },
      onSuccess: (res) => {
        dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
        dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser: res?.data, chatId: res?.data?._id })
        navigation.dispatch(
          StackActions.replace(screenName.GroupMessaging)
        );
      }
    }
    dispatch(onJoinGroupChat(obj))
  }

  const onOpenThreadDetail = () => {
    dispatchAction(dispatch, SET_ACTIVE_POST, { ...data?.shareThreadId });
    dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
    navigation.navigate(screenName.DiscussionForumDetail)
  }

  const onDeleteMessgaeForMe = () => {
    setdeletePostModal(false)
    let obj = {
      data: {
        messageId: data?._id,
        deleted_for: user?._id
      }
    }
    dispatch(onDeleteMessageForUser(obj))
  }
  const onOpenOtherUserDetail = (id) => {
    navigation.navigate(screenName.indiansDetails, { userId: id });
  }

  return (
    <View>
      <View style={styles.conatiner}>
        <View style={{ marginTop: 3 }}>
          <RenderUserIcon type='user' url={data?.createdBy?.avtar} height={31} isBorder={data?.createdBy?.subscribedMember} />
        </View>
        {/* <Image
          resizeMode="cover"
          style={styles.imgStyle}
          source={{ uri: api.IMAGE_URL + data?.createdBy?.avtar }}
        /> */}
        <View style={styles.columnContainer}>
          <Menu
            style={styles.menuStyle}
            visible={visible}
            anchor={
              <TouchableOpacity
                onLongPress={showMenu}
                style={styles.boxContainer}>

                {data?.shareContentType == 'group-invitation' ?
                  <Text style={styles.sharedNAme}>{'Group Invite'}</Text>
                  :

                  <View style={styles.nameView}>
                    <Text style={styles.nameTextStyle}>
                      {isPage ? 'Page Owner' : data?.createdBy?.first_Name +
                        ' ' +
                        data?.createdBy?.last_Name}
                    </Text>
                    {data?.shareContentType == 'thread' && <Text style={styles.sharedNAme}>{'Shared Thread'}</Text>}
                    {(data?.shareContentType == 'post' || data?.shareContentType == 'cppost') && <Text style={styles.sharedNAme}>{'Shared Post'}</Text>}
                  </View>}
                {data?.shareContentType == 'group-invitation' &&
                  (data?.invitedGroupId && Object.keys(data?.invitedGroupId).length > 0 ?
                    <View style={{ marginBottom: 15, }}>
                      <View style={styles.groupView}>
                        <RenderUserIcon type='user' url={data?.invitedGroupId?.chatLogo[0]?.cdnlocation} height={30} />
                        <Text style={styles.groupName}>{data?.invitedGroupId?.chatName}</Text>
                      </View>
                      {!data?.joinedGroup && <TouchableOpacity onPress={() => onPressJoinNowBtn()} style={styles.joinNowBtn}>
                        <Text style={styles.joinNowText}>Join Now</Text>
                      </TouchableOpacity>}
                    </View>
                    :
                    <View style={{ marginBottom: 15, }}>
                      <View style={styles.groupView}>
                        <Text style={styles.groupName}>Group Deleted</Text>
                      </View>
                    </View>
                  )
                }
                {data?.shareContentType == 'post' &&
                  <TouchableOpacity onPress={() => onOpenPostDetail()} >
                    {data?.file?.length > 0 && < ChatMessageMedia onPress={() => onOpenPostDetail()} data={data.file[0]} />}
                    <RenderText style={[styles.msgTextStyle]} text={data?.content}></RenderText>
                  </TouchableOpacity>
                }
                {data?.shareContentType == 'thread' &&
                  <TouchableOpacity onPress={() => onOpenThreadDetail()} >
                    {data?.file?.length > 0 && < ChatMessageMedia onPress={() => onOpenThreadDetail()} data={data.file[0]} />}
                    <RenderText style={[styles.msgTextStyle]} text={data?.content}></RenderText>
                  </TouchableOpacity>
                }
                {data?.shareContentType == 'user' &&
                  <TouchableOpacity onPress={() => onOpenOtherUserDetail(JSON.parse(data?.content)._id)} style={styles.userView}>
                    <RenderUserIcon type='user' url={JSON.parse(data?.content).profileImage} height={60} />
                    <Text style={styles.userName}>{JSON.parse(data?.content).name}</Text>
                  </TouchableOpacity>
                }
                {data?.shareContentType == 'cppost' &&
                  <TouchableOpacity onPress={() => onOpenPostDetail()} >
                    {data?.file?.length > 0 && < ChatMessageMedia onPress={() => onOpenPostDetail()} data={data.file[0]} />}
                    <RenderText style={[styles.msgTextStyle]} text={data?.content}></RenderText>
                  </TouchableOpacity>
                }
                {data?.shareContentType == 'normalmessage' ?
                  data?.content_type == 'text/plain' || data?.content_type == 'link' ?
                    <View style={{ flexDirection: 'row' }}>
                      <RenderText style={styles.msgTextStyle} text={data?.content}></RenderText>
                      <Text style={[styles.timeTextStyle, { color: colors.neutral_300 }]}>  {moment(data?.createdAt).format('hh:mm A')}</Text>
                    </View>
                    : data?.content_type == 'file/*' ?
                      <View>
                        <RenderFileMessageView data={data} />
                      </View>
                      : data?.content_type == 'image/*' ?
                        <View>
                          {data?.file?.length > 0 && <ChatMessageMedia data={data.file[0]} />}
                          <RenderText style={[styles.msgTextStyle]} text={data?.content}></RenderText>
                        </View>
                        : data?.content_type == 'video/*' ?
                          <View>
                            {data?.file?.length > 0 && <ChatMessageMedia data={data.file[0]} />}
                            <RenderText style={[styles.msgTextStyle]} text={data?.content}></RenderText>
                          </View>
                          : <View style={{ height: 10 }} />
                  :
                  <View style={{ height: 10 }} />
                }

                {!data?.shareContentType &&
                  <View style={{ flexDirection: 'row' }}>
                    <RenderText style={styles.msgTextStyle} text={data?.content}></RenderText>
                    <Text style={[styles.timeTextStyle, { color: colors.neutral_300 }]}>  {moment(data?.createdAt).format('hh:mm A')}</Text>
                  </View>
                }
                {/* <Text style={styles.msgTextStyle}>{data?.content}<Text style={[styles.timeTextStyle, { color: colors.neutral_300 }]}>  {moment(data?.createdAt).format('hh:mm A')}</Text></Text> */}
                <Text style={[styles.timeTextStyle, {
                  marginTop: -13,
                }]}>
                  {moment(data?.createdAt).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            }
            onRequestClose={hideMenu}>
            <View style={styles.menuChildrenContainer}>
              {/* <TouchableOpacity onPress={hideMenu}>
                <Text style={styles.itemMenuTextStyle}>{'Forward'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={hideMenu}>
                <Text style={styles.itemMenuTextStyle}>{'Copy'}</Text>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => {
                hideMenu(), setTimeout(() => {
                  setdeletePostModal(true)
                }, 500)
              }}>
                <Text style={styles.itemMenuTextStyle}>{'Delete for me'}</Text>
              </TouchableOpacity>
            </View>
          </Menu>
        </View>
      </View>
      {deletePostModal && (
        <ConfirmationModal
          visible={deletePostModal}
          onClose={() => setdeletePostModal(false)}
          title={`Are you sure you want to delete this message?`}
          successBtn={'Delete'}
          canselBtn={'No'}
          onPressCancel={() => setdeletePostModal(false)}
          onPressSuccess={() => onDeleteMessgaeForMe()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    // maxWidth: SCREEN_WIDTH - wp(100),
    marginHorizontal: wp(10),
    marginBottom: hp(10),
    // alignItems: 'center'
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sharedNAme: {
    ...FontStyle(12, colors.neutral_900),
    paddingHorizontal: wp(10),
    paddingTop: wp(5)
  },
  imgStyle: {
    height: wp(35),
    width: wp(35),
    borderRadius: wp(35 / 2),
  },
  boxContainer: {
    borderRadius: wp(5),
    backgroundColor: colors.neutral_300,
    // flexDirection: 'row'
  },
  nameTextStyle: {
    ...FontStyle(14, colors.neutral_900, '700'),
    paddingHorizontal: wp(10),
    paddingTop: wp(5)
  },
  msgTextStyle: {
    ...FontStyle(14, colors.neutral_900, '400'),
    paddingLeft: wp(5),
    paddingBottom: wp(5),
    maxWidth: SCREEN_WIDTH - wp(170),
  },
  columnContainer: {
    marginLeft: wp(10),
  },
  timeTextStyle: {
    ...FontStyle(10, colors.neutral_900, '400'),
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingHorizontal: 4,
    paddingBottom: 3,

  },
  menuStyle: {
    backgroundColor: colors.neutral_400,
  },
  menuChildrenContainer: {
    padding: wp(10),
    // borderWidth: 1,
    borderColor: colors.neutral_150,
    // width: 150
  },
  itemMenuTextStyle: {
    ...FontStyle(14, colors.neutral_900, '600'),
    marginVertical: hp(1),
  },
  groupView: {
    backgroundColor: colors.white,
    marginHorizontal: 10,
    marginTop: 5,

    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10
  },
  groupName: {
    ...FontStyle(13, colors.neutral_900),
  },
  userName: {
    ...FontStyle(13, colors.neutral_900, '700'),
  },
  userView: {
    backgroundColor: colors.secondary_500,
    marginTop: 5,
    marginBottom: 15,
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 30
  },
  joinNowBtn: {

    alignSelf: 'center',
    backgroundColor: colors.primary_500,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
    marginTop: 8
  },
  joinNowText: {
    ...FontStyle(14, colors.white, '600'),
  },
});

export default ReciverMsg;
