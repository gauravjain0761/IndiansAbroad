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
import { onConnectRequest, onGetOtherUserInfo, onUnFollowRequest } from '../Services/OtherUserServices';
import { dispatchAction } from '../utils/apiGlobal';
import { UPDATE_POST_LIST } from '../Redux/ActionTypes';

export default function PostShareModal({
  shareView,
  menuModal,
  setmenuModal,
  item,
  onPressBlock
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
          if (item?.isFollowing) {
            dispatchAction(dispatch, UPDATE_POST_LIST, {
              postId: item?._id,
              type: 'unfollow',
            });
          }
        }
      }
      if (item?.isFollowing) {
        dispatch(onUnFollowRequest(obj))
      } else {
        dispatch(onConnectRequest(obj))
      }
    }

  }

  const onBlock = () => {
    setmenuModal(false)
    setTimeout(() => {
      if (item?.createdBy) { onPressBlock() }
    }, 500);
  }

  return (
    <ModalContainer
      isVisible={menuModal}
      onClose={() => setmenuModal(false)}
      transparent={true}>
      <View style={styles.modalView}>
        <Text style={styles.modalUserName}>{item ? `${item?.createdBy?.first_Name} ${item?.createdBy?.last_Name}` : 'Nikita Khairnar'}</Text>
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
        <TouchableOpacity onPress={() => onPressConnect()}>
          <Text style={styles.modalText}>{item?.isFollowing ? 'Disconnect' : 'Connect'}</Text>
        </TouchableOpacity>
        <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />
        <TouchableOpacity onPress={() => onBlock()}>
          <Text style={styles.modalText}>{'Block'}</Text>
        </TouchableOpacity>
        <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />
        {!item?.isReported ? <TouchableOpacity>
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
    ...FontStyle(fontname.abeezee, 16, colors.neutral_900, '700'),
    paddingVertical: 15,
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_800,
  },
  modalText: {
    ...FontStyle(fontname.actor_regular, 18, colors.neutral_900),
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
