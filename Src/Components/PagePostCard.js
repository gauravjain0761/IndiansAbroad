import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { SCREEN_WIDTH, fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import ReactNativeModal from 'react-native-modal';
import ModalContainer from './ModalContainer';
import RenderUserIcon from './RenderUserIcon';
import PostShareModal from './PostShareModal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PostCarousal from './PostCarousal';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_LIKED_USER_LIST, SET_LIKE_DISLIKE } from '../Redux/ActionTypes';
import { screenName } from '../Navigation/ScreenConstants';
import { onDeletePost, onLikePost } from '../Services/PostServices';
import ReportModal from './ReportModal';
import ShareModal from './ShareModal';
import RenderText from './RenderText';
import UpdateDeleteMenu from './UpdateDeleteMenu';
import ConfirmationModal from './ConfirmationModal';
import { getAllPagePost } from '../Services/OtherUserServices';

export default function PagePostCard({ item, index, }) {
  const [menuModal, setmenuModal] = useState(false);
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  const dispatch = useDispatch()
  const [blockModal, setblockModal] = useState(false)
  const [textShown, setTextShown] = useState(false);
  // const { otherUserInfo } = useSelector(e => e.common)
  const [reportModal, setReportModal] = useState(false)
  const [shareModal, setshareModal] = useState(false)
  const [deletePostModal, setDeletePostModal] = useState(false);

  let isUser = item?.createdBy?._id == user._id

  const openLikeScreen = () => {
    dispatchAction(dispatch, SET_LIKED_USER_LIST, undefined)
    navigation.navigate(screenName.LikesScreen, {
      postId: item._id,
    })
  }

  const onPostLike = (isLiked) => {
    const liked = isLiked
    dispatchAction(dispatch, SET_LIKE_DISLIKE, { postId: item._id, action: liked ? 'unlike' : 'like' })
    let obj = {
      data: {
        postId: item._id,
        createdBy: user._id,
        action: liked ? 'unlike' : 'like'
      },
      onSuccess: () => { },
      onFailure: () => {
        dispatchAction(dispatch, SET_LIKE_DISLIKE, { postId: item._id, action: item?.isLiked ? 'unlike' : 'like' })
      }
    }
    dispatch(onLikePost(obj))
  }
  const onDelete = () => {
    setDeletePostModal(false);
    let obj = {
      data: {
        postId: item._id,
        createdBy: user._id,
      },
      onSuccess: () => {
        let obj1 = {
          params: {
            userId: user?._id,
          },
          pageId: item?.cpId?._id,
        };
        dispatch(getAllPagePost(obj1));
      },
      onFailure: () => { },
    };
    dispatch(onDeletePost(obj));
  };

  return (
    <View key={item._id}>
      <View style={styles.headerView}>
        <View style={styles.userImage}>
          <RenderUserIcon url={item?.cpId?.logo} height={57} />
        </View>
        <View style={ApplicationStyles.flex}>
          <View>
            <Text style={styles.username1}>
              {item?.cpId?.title}
            </Text>
          </View>
          <View>
            <Text style={styles.degreeText1}>Page, {item?.cpId?.countryId?.countryName}</Text>
          </View>
          <Text style={styles.degreeText}>{item?.timeElapsed}</Text>
        </View>
        {/* <View>
          <TouchableOpacity style={styles.messageView}>
            <Image
              source={Icons.more}
              style={ImageStyle(14, 14, 'cover')}
            />
          </TouchableOpacity>
        </View> */}
      </View>
      {item?.message && item?.message !== '' && (
        <RenderText
          style={styles.description}
          text={item?.message}
          showReadMore
        />
      )}
      {/* {item?.message !== '' && item?.message.length > 120 ?
        <TouchableOpacity onPress={() => { setTextShown(!textShown); }}>
          <Text style={styles.aboutTextMore}>{`${!textShown ? 'Read more' : 'Read less'}`}</Text>
        </TouchableOpacity>
        : null} */}
      {item?.mediaFiles.length > 0 && (
        <PostCarousal images={item?.mediaFiles} />
      )}
      <View style={styles.bottomRow}>
        <View style={styles.middlerow}>
          <View style={styles.innerRow}>
            <TouchableOpacity style={styles.touchableView} onPress={() => onPostLike(item?.isLiked)} >
              <Image
                source={item?.isLiked ? Icons.heartFilled : Icons.heart}
                style={ImageStyle(22, 22)}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableView} onPress={() => openLikeScreen()}>
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
            onUpdatePress={() =>
              navigation.navigate(screenName.UpdatePostScreen, { item: item })
            }
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
      {menuModal && <PostShareModal
        item={item}
        menuModal={menuModal}
        setmenuModal={() => setmenuModal(false)}
        isPage={true}
        onReportUser={() => setReportModal(true)}
      />}

      {reportModal && <ReportModal
        visible={reportModal}
        onClose={() => setReportModal(false)}
        postId={item._id}
      />}
      {shareModal &&
        <ShareModal visible={shareModal} postId={item._id} onClose={() => setshareModal(false)} item={item} />}
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
    </View>
  );
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
    ...FontStyle(14, colors.neutral_900, "700"),
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
  touchableView: { height: 42, justifyContent: 'center', },
  aboutTextMore: {
    ...FontStyle(14, colors.primary_500),
    paddingBottom: 10,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: -25,
    paddingTop: 10
  }
});
