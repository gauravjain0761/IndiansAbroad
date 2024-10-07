import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { SCREEN_WIDTH } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import RenderUserIcon from './RenderUserIcon';
import PostMoreModal from './PostMoreModal';
import UpdateDeleteMenu from './UpdateDeleteMenu';
import { useDispatch, useSelector } from 'react-redux';
import PostCarousal from './PostCarousal';
import { screenName } from '../Navigation/ScreenConstants';
import { useNavigation } from '@react-navigation/native';
import { getalluserposts, onDeletePost, onLikePost, } from '../Services/PostServices';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_ACCEPT_REQUEST, SET_CONNECT_REQUEST, SET_LIKED_USER_LIST, SET_LIKE_DISLIKE, SET_PAGE_CONNECT_POST, } from '../Redux/ActionTypes';
import { onBlockUserApi, onCancelRequest, onConnectRequest, onGetOtherUserInfo, onPagesConnectRequest, } from '../Services/OtherUserServices';
import ConfirmationModal from './ConfirmationModal';
import ReportModal from './ReportModal';
import ShareModal from './ShareModal';
import RenderText from './RenderText';
import { onOpenNewChatForUser } from '../Services/ChatServices';
import { onAcceptRejectRequest, onGetNotification } from '../Services/AuthServices';

export default function PostCard({ item, index, isDetailScreen = false, showRequestBtns = true }) {
  const [menuModal, setmenuModal] = useState(false);
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [blockModal, setblockModal] = useState(false);
  const { otherUserInfo } = useSelector(e => e.common);
  const [reportModal, setReportModal] = useState(false);
  const [shareModal, setshareModal] = useState(false);
  const [deletePostModal, setDeletePostModal] = useState(false);

  let isUser = item?.createdBy?._id == user._id;

  const onPostLike = isLiked => {
    const liked = isLiked;
    dispatchAction(dispatch, SET_LIKE_DISLIKE, { postId: item._id, action: liked ? 'unlike' : 'like', });
    let obj = {
      data: { postId: item._id, createdBy: user._id, action: liked ? 'unlike' : 'like', },
      onSuccess: () => { },
      onFailure: () => {
        dispatchAction(dispatch, SET_LIKE_DISLIKE, {
          postId: item._id,
          action: item?.isLiked ? 'unlike' : 'like',
        });
      },
    };
    dispatch(onLikePost(obj));
  };

  const openLikeScreen = () => {
    dispatchAction(dispatch, SET_LIKED_USER_LIST, undefined);
    navigation.navigate(screenName.LikesScreen, {
      postId: item._id,
    });
  };

  const onPressConnect = () => {
    let obj = {
      data: { userId: user._id, followingId: item?.createdBy?._id, },
      onSuccess: () => {
        if (otherUserInfo) {
          dispatch(onGetOtherUserInfo({ params: { userId: otherUserInfo?._id } }));
        } else {
          dispatchAction(dispatch, SET_CONNECT_REQUEST, { followingId: item?.createdBy?._id })
        }
      },
    };
    dispatch(onConnectRequest(obj));
  };

  const onPressPageConnect = () => {
    let obj = {
      data: { cpId: item?.cpId._id, followingId: user._id, },
      onSuccess: () => {
        dispatchAction(dispatch, SET_PAGE_CONNECT_POST, {
          postId: item._id,
        });
      },
      onFailure: () => { },
    };
    dispatch(onPagesConnectRequest(obj));
  }

  const onBlockuser = () => {
    setblockModal(false);
    let obj = {
      data: { userId: item?.createdBy?._id, action: 'block', },
      onSuccess: () => {
        if (otherUserInfo) navigation.goBack();
      },
    };
    dispatch(onBlockUserApi(obj));
  };

  const onDelete = () => {
    setDeletePostModal(false);
    let obj = {
      data: { postId: item._id, createdBy: user._id, },
      onSuccess: () => {
        let obj1 = { data: { createdBy: user?._id, page: 1, limit: 0, }, };
        dispatch(getalluserposts(obj1));
      },
      onFailure: () => { },
    };
    dispatch(onDeletePost(obj));
  };

  const onOpenOtherUserDetail = id => {
    if (!otherUserInfo && !isUser) {
      navigation.navigate(screenName.indiansDetails, { userId: id });
    }
  };

  const onOpenMessage = () => {
    let obj = {
      data: { CpUserId: item?.createdBy?._id, userId: user?._id, communityPageId: 'NA' },
      onSuccess: () => {
        navigation.navigate(screenName.Messaging)
      }
    }
    dispatch(onOpenNewChatForUser(obj))
  }

  const onCancelRequestPress = () => {
    let obj = {
      data: { userId: user._id, followingId: item?.createdBy?._id },
      onSuccess: () => {
        dispatchAction(dispatch, SET_CONNECT_REQUEST, { followingId: item?.createdBy?._id, type: 'remove' })
      },
    };
    dispatch(onCancelRequest(obj));
  }

  const onPressAccept = () => {

    dispatch(onGetNotification({
      data: { loginUserId: user?._id },
      onSuccess: (res) => {
        if (res.data.length > 0) {
          let noti = res.data.filter(obj => obj?.type == 'follow-request' && item?.createdBy?._id == obj?.createdBy?._id)
          if (noti.length > 0) {
            let obj = {
              data: {
                userId: user?._id,
                requestedId: item?.createdBy?._id,
                action: 'accept',
                notificationId: noti?._id,
              },
              onSuccess: () => {
                dispatchAction(dispatch, SET_CONNECT_REQUEST, { followingId: item?.createdBy?._id, type: 'accept' })
              }
            };
            dispatch(onAcceptRejectRequest(obj));
          }
        }
      }
    }))
  }

  const onPressPageMessage = () => {
    if (item[isDetailScreen ? "isFollowing" : "followingCommunityPage"] == 'following') {
      let obj = {
        data: {
          CpUserId: item?.cpId?.createdBy?._id,
          userId: user?._id,
          communityPageId: item?.cpId?._id
        },
        isPage: true,
        onSuccess: () => {
          navigation.navigate(screenName.PageMessaging)
          // navigation.dispatch(
          //   StackActions.replace(screenName.Messaging)
          // );
        }
      }
      dispatch(onOpenNewChatForUser(obj))

    } else {
      Alert.alert('You need to connect to this page to send a message.');
    }
  }

  if (item) {
    return (
      <View key={item?._id}>
        <View style={styles.headerView}>
          <View style={styles.userImage}>
            {item?.type == 'cppost' ?
              <TouchableOpacity onPress={() => navigation.navigate(screenName.pagesDetails, { pageDetail: { isfollowing: item?.followingCommunityPage == 'following' ? true : false, ...item?.cpId } })}>
                <RenderUserIcon
                  // userId={isDetailScreen ? undefined : item?.createdBy?._id}
                  url={item?.cpId?.logo}
                  height={57}
                  type='page'
                // isBorder={item?.createdBy?.subscribedMember}
                />
              </TouchableOpacity>
              :
              <RenderUserIcon type='user' userId={isDetailScreen ? undefined : item?.createdBy?._id} url={item?.createdBy?.avtar} height={57} isBorder={item?.createdBy?.subscribedMember} />
            }

          </View>
          {item?.type == 'cppost' ?
            <TouchableOpacity
              onPress={() => navigation.navigate(screenName.pagesDetails, { pageDetail: { isfollowing: item?.followingCommunityPage == 'following' ? true : false, ...item?.cpId } })}
              style={ApplicationStyles.flex}>
              <View>
                <Text style={styles.username1}>
                  {item?.cpId?.title}
                </Text>
              </View>
              <View>
                <Text style={styles.degreeText1}>Page, {item?.cpId?.countryId?.countryName}</Text>
              </View>
              <Text style={styles.degreeText}>{item?.timeElapsed}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
              onPress={() => onOpenOtherUserDetail(item?.createdBy?._id)}
              style={ApplicationStyles.flex}>
              <View>
                <Text style={styles.username1}>
                  {item?.createdBy?.first_Name} {item?.createdBy?.last_Name}
                </Text>
              </View>
              {/* {!isUser && ( */}
              <View>
                <Text style={styles.degreeText1}>{item?.createdBy?.profession}{item?.createdBy?.profession ? ', ' : ''}{item?.createdBy?.region}</Text>
              </View>
              {/* )} */}
              <Text style={styles.degreeText}>{item?.timeElapsed}</Text>
            </TouchableOpacity>
          }

          {!isUser && showRequestBtns && (
            <View>
              {item.type == 'cppost' ?
                item?.followingCommunityPage == 'not_following' ?
                  <TouchableOpacity
                    onPress={() => onPressPageConnect()}
                    style={styles.messageView}>
                    <Image
                      source={Icons.personAdd}
                      style={ImageStyle(30, 30, 'cover')}
                    />
                    <Text style={styles.degreeText3}>Connect</Text>
                  </TouchableOpacity>
                  :

                  <TouchableOpacity onPress={() => onPressPageMessage()} style={styles.messageView}>
                    <Image
                      source={Icons.messageIcon}
                      style={ImageStyle(30, 30, 'cover')}
                    />
                    <Text style={styles.degreeText3}>Message</Text>
                  </TouchableOpacity>
                :

                item?.requestSent == true ?
                  <TouchableOpacity onPress={() => onPressAccept()} style={styles.messageView}>
                    <Image source={Icons.accept} style={ImageStyle(30, 30, 'cover')} />
                    <Text style={styles.degreeText3}>Accept</Text>
                  </TouchableOpacity>
                  :

                  item?.isFollowing == 'following' ? (
                    <TouchableOpacity onPress={() => onOpenMessage()} style={styles.messageView}>
                      <Image source={Icons.messageIcon} style={ImageStyle(30, 30, 'cover')} />
                      <Text style={styles.degreeText3}>Message</Text>
                    </TouchableOpacity>
                  ) :

                    item?.isFollowing == 'notfollowing' ? (
                      <TouchableOpacity onPress={() => onPressConnect()} style={styles.messageView}>
                        <Image source={Icons.personAdd} style={ImageStyle(30, 30, 'cover')} />
                        <Text style={styles.degreeText3}>Connect</Text>
                      </TouchableOpacity>
                    ) :
                      item?.isFollowing == 'requested' ?

                        <TouchableOpacity onPress={() => onCancelRequestPress()} style={styles.messageView}>
                          <Image source={Icons.cancelRequest} style={ImageStyle(28, 28, 'cover')} />
                          <Text style={[styles.degreeText3, { textAlign: 'center', lineHeight: 16 }]}>Cancel{'\n'}Request</Text>
                        </TouchableOpacity>

                        : null
              }
            </View>
          )
          }

        </View>
        {item?.message && item?.message !== '' && (
          <RenderText
            style={styles.description}
            text={item?.message}
            showReadMore
          />
        )}
        {/* {item?.message && item?.message !== '' &&
          <Text style={styles.description} >
            {item?.message.length > 120 && !textShown ? `${item?.message.substring(0, 120)}...` : item?.message}
          </Text>} */}
        {/* {item?.message && item?.message !== '' && item?.message.length > 120 ? (
          <TouchableOpacity
            onPress={() => {
              setTextShown(!textShown);
            }}>
            <Text style={styles.aboutTextMore}>{`${!textShown ? 'Read more' : 'Read less'
              }`}</Text>
          </TouchableOpacity>
        ) : null} */}
        {item?.mediaFiles?.length > 0 && (
          <PostCarousal poster={item?.thumbNail} isDetailScreen={isDetailScreen} images={item?.mediaFiles} />
        )}
        <View style={styles.bottomRow}>
          <View style={styles.middlerow}>
            <View style={styles.innerRow}>
              <TouchableOpacity style={styles.touchableView} onPress={() => onPostLike(item?.isLiked)}>
                <Image source={item?.isLiked ? Icons.heartFilled : Icons.heart} style={ImageStyle(22, 22)} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableView}
                onPress={() => openLikeScreen()}>
                <Text style={styles.username}>{item?.likeCount} Likes</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.innerRow}>
              <Image source={Icons.chatCircle} style={ImageStyle(22, 22)} />
              <Text style={styles.username}>{item?.commentCount} Comments</Text>
            </View>
            <TouchableOpacity onPress={() => setshareModal(true)} style={styles.innerRow}>
              <Image source={Icons.share} style={ImageStyle(22, 22)} />
              <Text style={styles.username}>Share</Text>
            </TouchableOpacity>
          </View>
          {isUser ? (
            <UpdateDeleteMenu
              onUpdatePress={() => navigation.navigate(screenName.UpdatePostScreen, { item: item })}
              onDeletePress={() => setDeletePostModal(true)}
              icon={<Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setmenuModal(true)}
              style={[styles.innerRow, { ...ApplicationStyles.flex }]}>
              <Image source={Icons.dotMenu} style={ImageStyle(22, 22)} />
            </TouchableOpacity>
          )}
        </View>
        {menuModal && (
          <PostMoreModal
            item={item}
            menuModal={menuModal}
            setmenuModal={() => setmenuModal(false)}
            onPressBlock={() => setblockModal(true)}
            onReportUser={() => setReportModal(true)}
            isPage={item?.type == 'cppost'}
          />
        )}
        {blockModal && (
          <ConfirmationModal
            visible={blockModal}
            onClose={() => setblockModal(false)}
            title={`Do you want to block ${item?.createdBy?.first_Name} ${item?.createdBy?.last_Name}?`}
            successBtn={'Yes'}
            canselBtn={'No'}
            onPressCancel={() => setblockModal(false)}
            onPressSuccess={() => onBlockuser()}
          />
        )}
        {deletePostModal && (
          <ConfirmationModal
            visible={deletePostModal}
            onClose={() => setDeletePostModal(false)}
            title={`Are you sure you want to delete this post?`}
            successBtn={'Delete'}
            canselBtn={'No'}
            onPressCancel={() => setDeletePostModal(false)}
            onPressSuccess={() => onDelete()}
          />
        )}
        {reportModal && (
          <ReportModal visible={reportModal} onClose={() => setReportModal(false)} postId={item._id} />
        )}
        {shareModal && (
          <ShareModal visible={shareModal} postId={item._id} onClose={() => setshareModal(false)} item={item} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userImage: {
    height: 57,
    width: 57,
    borderRadius: 57 / 2,
  },
  username: {
    ...FontStyle(13, colors.neutral_900),
    textTransform: 'capitalize',
  },
  username1: {
    ...FontStyle(14, colors.neutral_900, '700'),
    textTransform: 'capitalize',
  },
  degreeText: {
    ...FontStyle(12, colors.neutral_900),
  },
  degreeText1: {
    marginTop: 2,
    ...FontStyle(12, colors.neutral_900),
  },
  degreeText3: {
    ...FontStyle(11, colors.neutral_900),
  },
  messageView: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  description: {
    ...FontStyle(14, colors.neutral_900),
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  postImage: {
    height: SCREEN_WIDTH - 5,
    resizeMode: 'cover',
    width: SCREEN_WIDTH - 5,
    borderRadius: 4,
    alignSelf: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: colors.secondary_500,
  },
  middlerow: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    height: 42,

    // width: '20%'
  },
  modalView: {
    backgroundColor: colors.neutral_300,
    paddingHorizontal: 3,
  },
  modalUserName: {
    ...FontStyle(16, colors.neutral_900, '700'),
    paddingVertical: 15,
    textAlign: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_800,
  },
  modalText: {
    ...FontStyle(18, colors.neutral_900),
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  touchableView: { height: 42, justifyContent: 'center' },
  aboutTextMore: {
    ...FontStyle(14, colors.primary_500),
    paddingBottom: 10,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: -25,
    paddingTop: 10,
  },
});
