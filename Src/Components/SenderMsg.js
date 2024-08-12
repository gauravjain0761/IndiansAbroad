import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SCREEN_WIDTH, hp, wp } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import { FontStyle } from '../utils/commonFunction';
import { Menu, MenuItem } from 'react-native-material-menu';
import moment from 'moment';
import RenderText from './RenderText';
import RenderUserIcon from './RenderUserIcon';
import ChatMessageMedia from './ChatMessageMedia';
import { onGetSinglePost } from '../Services/PostServices';
import { useDispatch, useSelector } from 'react-redux';
import { IS_LOADING, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS } from '../Redux/ActionTypes';
import { screenName } from '../Navigation/ScreenConstants';
import { dispatchAction } from '../utils/apiGlobal';
import { useNavigation } from '@react-navigation/native';

const SenderMsg = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const { user } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const hideMenu = () => setVisible(false);
  const navigation = useNavigation()
  const showMenu = () => setVisible(true);



  const onOpenPostDetail = () => {
    dispatchAction(dispatch, IS_LOADING, true);

    dispatch(onGetSinglePost({
      data: {
        postId: data?.sharePostId,
        loginUserId: user._id
      },
      onSuccess: (res) => {
        console.log('-------', res)
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
  return (
    <View style={styles.conatiner}>
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
                  <Text style={styles.nameTextStyle}>{'You'}</Text>
                  {(data?.shareContentType == 'post' || data?.shareContentType == 'cppost') && <Text style={styles.sharedNAme}>{'Shared Post'}</Text>}
                </View>}
              {data?.shareContentType == 'group-invitation' &&
                <View style={styles.groupView}>
                  <RenderUserIcon url={data?.invitedGroupId?.chatLogo[0]?.cdnlocation} height={30} />
                  <Text style={styles.groupName}>{data?.invitedGroupId?.chatName}</Text>
                </View>
              }
              {data?.shareContentType == 'post' &&
                <TouchableOpacity onPress={() => onOpenPostDetail()} >
                  <ChatMessageMedia data={data} />
                  <View style={{ flexDirection: 'row' }}>
                    <RenderText style={[styles.msgTextStyle, { width: wp(250) }]} text={data?.content}></RenderText>
                    {/* <Text style={[styles.timeTextStyle, { color: colors.primary_500 }]}>  {moment(data?.createdAt).format('HH:mm')}</Text> */}
                  </View>
                </TouchableOpacity>
              }
              {data?.shareContentType == 'cppost' &&
                <TouchableOpacity onPress={() => onOpenPostDetail()} >
                  <ChatMessageMedia data={data} />
                  <View style={{ flexDirection: 'row' }}>
                    <RenderText style={[styles.msgTextStyle, { width: wp(250) }]} text={data?.content}></RenderText>
                    {/* <Text style={[styles.timeTextStyle, { color: colors.primary_500 }]}>  {moment(data?.createdAt).format('HH:mm')}</Text> */}
                  </View>
                </TouchableOpacity>
              }
              {data?.shareContentType == 'normalmessage' &&
                <View style={{ flexDirection: 'row' }}>
                  <RenderText style={styles.msgTextStyle} text={data?.content}></RenderText>
                  <Text style={[styles.timeTextStyle, { color: colors.primary_500 }]}>  {moment(data?.createdAt).format('HH:mm')}</Text>
                </View>
              }
              {/* <Text style={styles.msgTextStyle}>{data?.content}<Text style={[styles.timeTextStyle, { color: colors.primary_500 }]}>  {moment(data?.createdAt).format('HH:mm')}</Text></Text> */}
              <Text style={[styles.timeTextStyle, { marginTop: -13, }]}>
                {moment(data?.createdAt).format('HH:mm')}
              </Text>
            </TouchableOpacity>
          } onRequestClose={hideMenu}>
          <View style={styles.menuChildrenContainer}>
            <TouchableOpacity onPress={hideMenu}>
              <Text style={styles.itemMenuTextStyle}>{'Forward'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={hideMenu}>
              <Text style={styles.itemMenuTextStyle}>{'Edit'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={hideMenu}>
              <Text style={styles.itemMenuTextStyle}>{'Copy'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={hideMenu}>
              <Text style={styles.itemMenuTextStyle}>{'Delete for me'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={hideMenu}>
              <Text style={styles.itemMenuTextStyle}>
                {'Delete for everyone'}
              </Text>
            </TouchableOpacity>
          </View>
        </Menu>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    // flexDirection: 'row',
    // maxWidth: SCREEN_WIDTH - wp(50),
    marginHorizontal: wp(10),
    marginBottom: hp(10),
    alignSelf: 'flex-end',
    // backgroundColor: 'red'
  },
  imgStyle: {
    height: wp(35),
    width: wp(35),
    borderRadius: wp(35 / 2),
  },
  boxContainer: {
    borderRadius: wp(5),
    backgroundColor: colors.primary_500,
  },
  nameTextStyle: {
    ...FontStyle(14, colors.white, '700'),
    paddingHorizontal: wp(10),
    paddingTop: wp(5)
  },
  msgTextStyle: {
    ...FontStyle(14, colors.white, '400'),
    paddingLeft: wp(5),
    paddingBottom: wp(5),
    maxWidth: SCREEN_WIDTH - wp(130),
  },
  columnContainer: {
    marginLeft: wp(10),
  },
  timeTextStyle: {
    ...FontStyle(10, colors.white, '400'),
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
    borderWidth: 1,
    borderColor: colors.neutral_150,
  },
  itemMenuTextStyle: {
    ...FontStyle(14, colors.neutral_900, '600'),
    marginVertical: hp(1),
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sharedNAme: {
    ...FontStyle(12, '#B0C2E3FF'),
    paddingHorizontal: wp(10),
    paddingTop: wp(5)
  },
  groupView: {
    backgroundColor: colors.white,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10
  },
  groupName: {
    ...FontStyle(13, colors.neutral_900),
  }
});

export default SenderMsg;
