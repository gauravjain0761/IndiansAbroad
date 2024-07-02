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
import { fontname, hp, screen_width, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import { screenName } from '../Navigation/ScreenConstants';
import { useNavigation } from '@react-navigation/native';
import { api } from '../utils/apiConstants';
import {
  onCancelRequest,
  onConnectRequest,
  onDisConnect,
  onPagesConnectRequest,
  onPagesDisConnectRequest,
  onUnFollowRequest,
} from '../Services/OtherUserServices';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchAction } from '../utils/apiGlobal';
import {
  SET_POST_CANCEL_REQUEST,
  SET_POST_CONNECT,
  SET_POST_DISCONNECT,
  SET_POST_PAGES_CONNECT,
  SET_POST_PAGES_DISCONNECT,
} from '../Redux/ActionTypes';

export default function ConnectCard({
  indians,
  cardPress,
  name,
  universityORcompany,
  userAvtar,
  subscribedMember,
  isFollowing,
  isFollowingRequested,
  isFollower,
  index,
  isfollowing,
  followingId,
}) {
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  const dispatch = useDispatch();

  const onPressConnect = () => {
    let obj = {
      data: {
        userId: user._id,
        followingId: followingId,
      },
      onSuccess: () => {
        dispatchAction(dispatch, SET_POST_CONNECT, {
          postId: followingId,
          action: isFollowingRequested == 1 ? 0 : 1,
        });
      },
      onFailure: () => { },
    };
    dispatch(onConnectRequest(obj));
  };

  const onPressCancelRequest = () => {
    let obj = {
      data: {
        userId: user._id,
        followingId: followingId,
      },
      onSuccess: () => {
        dispatchAction(dispatch, SET_POST_CANCEL_REQUEST, {
          postId: followingId,
          action: isFollowingRequested == 1 ? 0 : 1,
        });
      },
      onFailure: () => { },
    };
    dispatch(onCancelRequest(obj));
  };

  const onPressDisConnect = () => {
    let obj = {
      data: {
        userId: user._id,
        followingId: followingId,
      },
      onSuccess: () => {
        dispatchAction(dispatch, SET_POST_DISCONNECT, {
          postId: followingId,
          action: isFollowing == 1 ? 0 : 1,
        });
      },
      onFailure: () => { },
    };
    dispatch(onUnFollowRequest(obj));
  };

  const onPressPagesDisConnect = () => {
    let obj = {
      data: {
        cpId: followingId,
        followingId: user._id,
      },
      onSuccess: () => {
        dispatchAction(dispatch, SET_POST_PAGES_DISCONNECT, {
          postId: followingId,
        });
      },
      onFailure: () => { },
    };
    dispatch(onPagesDisConnectRequest(obj));
  };

  const onPressPagesConnect = () => {
    let obj = {
      data: {
        cpId: followingId,
        followingId: user._id,
      },
      onSuccess: () => {
        dispatchAction(dispatch, SET_POST_PAGES_CONNECT, {
          postId: followingId,
        });
      },
      onFailure: () => { },
    };
    dispatch(onPagesConnectRequest(obj));
  };

  return (
    <TouchableOpacity
      key={followingId}
      activeOpacity={0.9}
      onPress={cardPress}
      style={[styles.header]}>
      <View
        style={styles.imageStyle}>
        <RenderUserIcon
          url={userAvtar}
          height={78}
          activeOpacity={1}
          isBorder={subscribedMember}
        />
        {/* <Image source={Icons.bell} style={ImageStyle(18, 18)} /> */}
      </View>
      <Text numberOfLines={1} style={styles.text1}>
        {name}
      </Text>
      {!indians && (
        <Text numberOfLines={1} style={styles.text2}>
          MS Student
        </Text>
      )}
      {indians && (
        <Text numberOfLines={2} style={styles.text3}>
          {universityORcompany}
        </Text>
      )}

      {indians ? (
        isFollowing == 1 ? (
          <TouchableOpacity
            onPress={() => onPressDisConnect()}
            style={styles.btnView}>
            <Text style={styles.btnText}>Disconnect</Text>
          </TouchableOpacity>
        ) : isFollowingRequested == 1 ? (
          <TouchableOpacity
            onPress={() => {
              onPressCancelRequest();
            }}
            style={styles.btnView}>
            <Text style={styles.btnText}>Cancel Request</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onPressConnect()}
            style={styles.btnView}>
            <Text style={styles.btnText}>Connect</Text>
          </TouchableOpacity>
        )
      ) : isfollowing == true ? (
        <TouchableOpacity onPress={onPressPagesDisConnect} style={styles.btnView}>
          <Text style={styles.btnText}>Disconnect</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPressPagesConnect} style={styles.btnView}>
          <Text style={styles.btnText}>Connect</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary_500,
    // borderRadius: wp(20),
    paddingHorizontal: wp(10),
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(7),
    // paddingBottom: hp(28),
    width: '49%',
    flex: 1,
    marginBottom: hp(7),
    minHeight: hp(160),
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: wp(10),
    backgroundColor: colors.inputBg,
  },
  inputStyle: {
    padding: 5,
    paddingLeft: wp(10),
    width: screen_width * 0.85,
    ...FontStyle(fontname.actor_regular, 14, colors.black, '500'),
  },
  imageStyle: {
    width: wp(92),
    height: hp(82),
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    // borderColor: colors.neutral_500
  },
  text1: {
    marginTop: 5,
    ...FontStyle(fontname.abeezee, 14, colors.neutral_900, '700'),
  },
  text2: {
    marginTop: 2,
    // lineHeight: 16,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
  text3: {
    // marginTop:2,
    // lineHeight: 16,
    // top: -2,
    textAlign: 'center',
    height: 32,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
  btnView: {
    backgroundColor: colors.primary_4574ca,
    width: wp(130),
    alignItems: 'center',
    height: hp(20),
    borderRadius: 4,
    marginTop: 5,
    marginBottom: hp(9),
  },
  btnText: {
    ...FontStyle(fontname.actor_regular, 12, colors.white, '400'),
    lineHeight: 18,
  },
});
