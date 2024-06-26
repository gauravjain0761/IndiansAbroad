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
import UpdateDeleteMenu from './UpdateDeleteMenu';
import { useDispatch, useSelector } from 'react-redux';
import PostCarousal from './PostCarousal';
import { screenName } from '../Navigation/ScreenConstants';
import { useNavigation } from '@react-navigation/native';
import { onLikePost } from '../Services/PostServices';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_LIKE_DISLIKE } from '../Redux/ActionTypes';
import { api } from '../utils/apiConstants';
import { onBlockUserApi, onConnectRequest } from '../Services/OtherUserServices';
import ConfirmationModal from './ConfirmationModal';

export default function PostCard({ item, index, isUser = false, isDetailScreen = false }) {
  const [menuModal, setmenuModal] = useState(false);
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  const dispatch = useDispatch()
  const [blockModal, setblockModal] = useState(false)
  const [textShown, setTextShown] = useState(false);


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

  const openLikeScreen = () => {
    navigation.navigate(screenName.LikesScreen, {
      postId: item._id,
    })
  }

  const onPressConnect = () => {
    console.log(item?.createdBy)
    let obj = {
      data: {
        userId: user._id,
        followingId: item?.createdBy?._id
      }
    }
    dispatch(onConnectRequest(obj))
  }

  const onBlockuser = () => {
    setblockModal(false)
    let obj = {
      data: {
        userId: item?.createdBy?._id,
        action: 'block'
      }
    }
    dispatch(onBlockUserApi(obj))
  }

  if (item?.createdBy) {
    return (
      <View key={index}>
        <View style={styles.headerView}>
          <TouchableOpacity style={styles.userImage}>
            <RenderUserIcon url={api.IMAGE_URL + item?.createdBy?.avtar} height={57} isBorder={item?.createdBy?.subscribedMember} />
          </TouchableOpacity>
          <View style={ApplicationStyles.flex}>
            <TouchableOpacity onPress={() => navigation.navigate(screenName.indiansDetails)}>
              <Text style={styles.username1}>
                {item?.createdBy?.first_Name} {item?.createdBy?.last_Name}
              </Text>
            </TouchableOpacity>
            {!isUser && (
              <TouchableOpacity onPress={() => navigation.navigate(screenName.indiansDetails)}>
                <Text style={styles.degreeText1}>PhD Student, Seoul</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.degreeText}>{item?.timeElapsed}</Text>
          </View>
          {!isUser && (
            <View>
              {item?.isFollowing ? (
                <TouchableOpacity style={styles.messageView}>
                  <Image
                    source={Icons.messageIcon}
                    style={ImageStyle(30, 30, 'cover')}
                  />
                  <Text style={styles.degreeText}>Message</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => onPressConnect()} style={styles.messageView}>
                  <Image
                    source={Icons.personAdd}
                    style={ImageStyle(30, 30, 'cover')}
                  />
                  <Text style={styles.degreeText}>Connect</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {item?.message !== '' && <Text style={styles.description} >
          {item?.message.length > 120 && !textShown ? `${item?.message.substring(0, 120)}...` : item?.message}
        </Text>}

        {item?.message !== '' && item?.message.length > 120 ?
          <TouchableOpacity onPress={() => { setTextShown(!textShown); }}>
            <Text style={styles.aboutTextMore}>{`${!textShown ? 'Read more' : 'Read less'}`}</Text>
          </TouchableOpacity>
          : null}

        {item?.mediaFiles.length > 0 && (
          <PostCarousal isDetailScreen={isDetailScreen} images={item?.mediaFiles} />
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

            <TouchableOpacity style={styles.innerRow}>
              <Image source={Icons.chatCircle} style={ImageStyle(22, 22)} />
              <Text style={styles.username}>{item?.commentCount} Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.innerRow}>
              <Image source={Icons.share} style={ImageStyle(22, 22)} />
              <Text style={styles.username}>Share</Text>
            </TouchableOpacity>
          </View>
          {isUser ? (
            <UpdateDeleteMenu
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
        <PostShareModal
          item={item}
          menuModal={menuModal}
          setmenuModal={() => setmenuModal(false)}
          onPressBlock={() => setblockModal(true)}
        />
        <ConfirmationModal
          visible={blockModal}
          onClose={() => setblockModal(false)}
          title={`Do you want to block ${item?.createdBy?.first_Name} ${item?.createdBy?.last_Name}?`}
          successBtn={'Yes'}
          canselBtn={'No'}
          onPressCancel={() => setblockModal(false)}
          onPressSuccess={() => onBlockuser()}
        />
      </View>
    );
  }
  return (
    <View key={index}>
      <View style={styles.headerView}>
        <TouchableOpacity style={styles.userImage}>
          <RenderUserIcon height={57} isBorder />
        </TouchableOpacity>
        <View style={ApplicationStyles.flex}>
          <Text style={styles.username1}>Nikita Khairnar</Text>
          {!isUser && <Text style={styles.degreeText1}>PhD Student, Seoul</Text>}
          <Text style={styles.degreeText}>15 hours ago</Text>
        </View>
        {!isUser && (
          <View>
            <TouchableOpacity style={styles.messageView}>
              <Image
                source={Icons.messageIcon}
                style={ImageStyle(30, 30, 'cover')}
              />
              <Text style={styles.degreeText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        <Text style={styles.description}>
          Festival of Cultures {'\n'}Event in Edinburgh
        </Text>
      </View>
      <View>
        <Image source={Icons.postViewImage} style={styles.postImage} />
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.middlerow}>
          <TouchableOpacity style={styles.innerRow}>
            <Image source={Icons.heart} style={ImageStyle(22, 22)} />
            <Text style={styles.username}>7 Likes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.innerRow}>
            <Image source={Icons.chatCircle} style={ImageStyle(22, 22)} />
            <Text style={styles.username}>1 Comments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.innerRow}>
            <Image source={Icons.share} style={ImageStyle(22, 22)} />
            <Text style={styles.username}>Share</Text>
          </TouchableOpacity>
        </View>
        {isUser ? (
          <UpdateDeleteMenu
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
      <PostShareModal
        menuModal={menuModal}
        setmenuModal={() => setmenuModal(false)}
      />
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
    ...FontStyle(fontname.abeezee, 13, colors.neutral_900),
    textTransform: 'capitalize',
  },
  username1: {
    ...FontStyle(fontname.abeezee, 13, colors.neutral_900, "700"),
    textTransform: 'capitalize',
  },
  degreeText: {
    ...FontStyle(fontname.abeezee, 11, colors.neutral_900),
  },
  degreeText1: {
    marginTop: 2,
    ...FontStyle(fontname.actor_regular, 11, colors.neutral_900),
  },
  messageView: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  description: {
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
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
    ...FontStyle(fontname.abeezee, 16, colors.neutral_900, '700'),
    paddingVertical: 15,
    textAlign: 'center',
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
  touchableView: { height: 42, justifyContent: 'center', },
  aboutTextMore: {
    ...FontStyle(fontname.actor_regular, 14, colors.primary_500),
    paddingBottom: 10,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: -25,
    paddingTop: 10
  }
});
