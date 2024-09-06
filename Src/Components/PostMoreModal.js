import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, screen_width, wp } from '../Themes/Fonts';
import ModalContainer from './ModalContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { onCancelRequest, onConnectRequest, onGetOtherUserInfo, onPagesConnectRequest, onPagesDisConnectRequest, onUnFollowRequest } from '../Services/OtherUserServices';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_CONNECT_REQUEST, SET_POST_PAGES_CONNECT, SET_POST_PAGES_DISCONNECT, UPDATE_POST_LIST } from '../Redux/ActionTypes';

export default function PostMoreModal({
  shareView,
  menuModal,
  setmenuModal,
  item,
  onPressBlock,
  isPage = false, page,
  onReportUser
}) {
  const insets = useSafeAreaInsets();
  const { user, otherUserInfo } = useSelector((state) => state.common);
  const dispatch = useDispatch()

  const onPressConnect = () => {
    setmenuModal(false)
    if (item?.createdBy) {
      let obj = {
        data: {
          userId: user._id,
          followingId: item?.createdBy?._id
        },
        postId: item?._id,
        onSuccess: () => {
          if (otherUserInfo) {
            dispatch(onGetOtherUserInfo({ params: { userId: otherUserInfo?._id, } }))
          }
          if (item?.isFollowing == 'following') {
            dispatchAction(dispatch, UPDATE_POST_LIST, {
              postId: item?._id,
              type: 'unfollow',
            });
          } else if (item?.isFollowing == 'notfollowing') {
            dispatchAction(dispatch, UPDATE_POST_LIST, {
              postId: item?._id,
              type: 'follow',
            });
          } else {
            dispatchAction(dispatch, SET_CONNECT_REQUEST, { followingId: item?.createdBy?._id, type: 'remove' })
          }
        }
      }

      if (item?.isFollowing == 'notfollowing') {
        dispatch(onConnectRequest(obj));
      } else if (item?.isFollowing == 'requested') {
        dispatch(onCancelRequest(obj));
      } else {
        dispatch(onUnFollowRequest(obj));
      }
    }
  }

  const onBlock = () => {
    setmenuModal(false)
    setTimeout(() => {
      if (item?.createdBy) { onPressBlock() }
    }, 500);
  }

  const onReport = () => {
    setmenuModal(false)
    setTimeout(() => {
      onReportUser()
    }, 500);
  }

  const onPressPagesConnect = () => {
    let obj = {
      data: {
        cpId: item?._id,
        followingId: user._id,
      },
      onSuccess: () => {
        dispatchAction(dispatch, item?.isfollowing ? SET_POST_PAGES_DISCONNECT : SET_POST_PAGES_CONNECT, {
          postId: item?._id,
        });
      },
      onFailure: () => { },
    };
    dispatch(item?.isfollowing ? onPagesDisConnectRequest(obj) : onPagesConnectRequest(obj));
  };


  return (
    <ModalContainer
      isVisible={menuModal}
      onClose={() => setmenuModal(false)}
      transparent={true}>
      <View style={styles.modalView}>
        <Text style={styles.modalUserName}>{item ? isPage ? `${item?.cpId.title}` : `${item?.createdBy?.first_Name} ${item?.createdBy?.last_Name}` : 'Nikita Khairnar'}</Text>
        <View style={styles.line} />
        {shareView && (
          <>
            <TouchableOpacity>
              <Text style={styles.modalText}>Share Profile</Text>
            </TouchableOpacity>
            <View
              style={[styles.line, { borderBottomColor: colors.neutral_500 }]}
            />
          </>
        )}
        {!isPage && <TouchableOpacity onPress={() => onPressConnect()}>
          <Text style={styles.modalText}>{item?.isFollowing == 'notfollowing'
            ? 'Connect'
            : item?.isFollowing == 'requested'
              ? 'Cancel Request'
              : 'Disconnect'}</Text>
        </TouchableOpacity>}
        {!isPage && <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />}
        {!isPage && <TouchableOpacity onPress={() => onBlock()}>
          <Text style={styles.modalText}>{'Block'}</Text>
        </TouchableOpacity>}
        <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />
        {!item?.isReported ? <TouchableOpacity onPress={() => onReport()}>
          <Text style={styles.modalText}>Report</Text>
        </TouchableOpacity> : null}
        <View style={styles.line} />
        <View style={{ paddingBottom: insets.bottom }} />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: colors.neutral_300,
    paddingHorizontal: 3,
  },
  modalUserName: {
    ...FontStyle(16, colors.neutral_900, '700'),
    paddingVertical: 15,
    textAlign: 'center',
    textTransform: 'capitalize'
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
});
