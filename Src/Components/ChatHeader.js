import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { hp, wp } from '../Themes/Fonts';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import RenderUserIcon from './RenderUserIcon';
import { useNavigation } from '@react-navigation/native';
import ApplicationStyles from '../Themes/ApplicationStyles';
import App from '../App';
import { screenName } from '../Navigation/ScreenConstants';
import MessageScreenMoreMenu from './MessageScreenMoreMenu';
import GroupChatMoreMenu from './GroupChatMoreMenu';
import ConfirmationModal from './ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { onClearAllChat, onLeaveFromGroup } from '../Services/ChatServices';
import { resetNavigation } from '../utils/Global';
import { onBlockUserApi, onUnFollowRequest } from '../Services/OtherUserServices';
import ReportModal from './ReportModal';
import PageChatMoreMenu from './PageChatMoreMenu';
import { getFollowerList } from '../Services/PostServices';

const ChatHeader = ({ url, name, subscribedMember, onPressName, isGroup = false, isPage = false }) => {
  const { goBack, navigate } = useNavigation();
  const [moreMenu, setmoreMenu] = useState(false)
  const [moreMenuGroup, setmoreMenuGroup] = useState(false)
  const [moreMenuPage, setmoreMenuPage] = useState(false)
  const [clearChatModal, setclearChatModal] = useState(false)
  const dispatch = useDispatch()
  const { user, activeChatRoomUser, chatMessageList } = useSelector(e => e.common)
  const [leaveGroupModal, setleaveGroupModal] = useState(false)
  const navigation = useNavigation()
  const [blockModal, setblockModal] = useState(false)
  const [reportModal, setReportModal] = useState(false);

  const onClearChat = () => {
    setclearChatModal(false)
    dispatch(onClearAllChat(
      {
        data: {
          userId: user._id,
          chatId: activeChatRoomUser?.chatId,
        },
      }
    ))
  }
  const onLeaveGroup = () => {
    setleaveGroupModal(false)
    dispatch(onLeaveFromGroup(
      {
        data: {
          curruntUser: user._id,
          groupId: activeChatRoomUser?.chatId,
        },
        onSuccess: () => {
          navigation.goBack()
          // resetNavigation('Home')
        }
      }
    ))
  }
  const onUnfollowUser = () => {
    let obj = {
      data: {
        userId: user._id,
        followingId: activeChatRoomUser?.currentUser?._id
      },
      onSuccess: () => {
        dispatch(
          getFollowerList({
            data: { userId: user?._id, search: '' },
          }),
        );
        goBack()
      }
    }
    dispatch(onUnFollowRequest(obj))
  }
  const onBlockuser = () => {
    setblockModal(false)
    setTimeout(() => {
      let obj = {
        data: {
          userId: activeChatRoomUser?.currentUser?._id,
          action: 'block'
        },
        onSuccess: () => {
          dispatch(
            getFollowerList({
              data: { userId: user?._id, search: '' },
            }),
          );
          goBack()
        }
      }
      dispatch(onBlockUserApi(obj))
    }, 500);
  }

  return (
    <View style={styles.conatiner}>
      <TouchableOpacity onPress={() => goBack()} style={styles.menuIcon}>
        <View style={styles.backIcon}>
          <Image source={Icons.left_arrow} style={ImageStyle(14, 14)} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.5} onPress={() => onPressName ? onPressName() : {}} style={[ApplicationStyles.row, ApplicationStyles.flex]}>

        <RenderUserIcon isBorder={subscribedMember} type={isGroup ? 'group' : 'user'} url={url} height={50} />
        <Text style={styles.headerTextStyle}>{name}</Text>
      </TouchableOpacity>
      {isPage ?
        (chatMessageList?.length > 0 ?
          <TouchableOpacity onPress={() => { isPage ? chatMessageList.length > 0 ? setmoreMenuPage(true) : {} : isGroup ? setmoreMenuGroup(true) : setmoreMenu(true) }} style={styles.menuIcon}>
            <Image source={Icons.more} style={ImageStyle(14, 14)} />
          </TouchableOpacity>
          : null)
        :
        <TouchableOpacity onPress={() => { isPage ? chatMessageList.length > 0 ? setmoreMenuPage(true) : {} : isGroup ? setmoreMenuGroup(true) : setmoreMenu(true) }} style={styles.menuIcon}>
          <Image source={Icons.more} style={ImageStyle(14, 14)} />
        </TouchableOpacity>
      }


      {/* <TouchableOpacity onPress={() => { isPage ? chatMessageList.length > 0 ? setmoreMenuPage(true) : {} : isGroup ? setmoreMenuGroup(true) : setmoreMenu(true) }} style={styles.menuIcon}>
        <Image source={Icons.more} style={ImageStyle(14, 14)} />
      </TouchableOpacity> */}

      {moreMenuPage && <PageChatMoreMenu
        onPressClear={() => { setmoreMenuPage(false), setTimeout(() => { setclearChatModal(true) }, 500) }}
        visible={moreMenuPage}
        onClose={() => setmoreMenuPage(false)} />}

      {moreMenu && <MessageScreenMoreMenu
        onPressClear={() => { setmoreMenu(false), setTimeout(() => { setclearChatModal(true) }, 500) }}
        visible={moreMenu}
        onPressBlock={() => {
          setmoreMenu(false), setTimeout(() => {
            setblockModal(true)
          }, 500);
        }}
        onPressDisconnect={() => {
          setmoreMenu(false), setTimeout(() => {
            onUnfollowUser()
          }, 500)
        }}
        onReport={() => {
          setmoreMenu(false), setTimeout(() => {
            setReportModal(true)
          }, 500)
        }}
        onClose={() => setmoreMenu(false)} />}
      {moreMenuGroup && <GroupChatMoreMenu
        onLeaveGroup={() => { setmoreMenuGroup(false), setTimeout(() => { setleaveGroupModal(true) }, 500) }}

        onPressClear={() => { setmoreMenuGroup(false), setTimeout(() => { setclearChatModal(true) }, 500) }}
        visible={moreMenuGroup}
        onClose={() => setmoreMenuGroup(false)} />}
      {clearChatModal && (
        <ConfirmationModal
          visible={clearChatModal}
          onClose={() => setclearChatModal(false)}
          title={`Are you sure you want to clear chat?`}
          successBtn={'Clear'}
          canselBtn={'No'}
          onPressCancel={() => setclearChatModal(false)}
          onPressSuccess={() => onClearChat()}
        />
      )}
      {leaveGroupModal && (
        <ConfirmationModal
          visible={leaveGroupModal}
          onClose={() => setleaveGroupModal(false)}
          title={`Are you sure you want to exit from group?`}
          successBtn={'Exit'}
          canselBtn={'No'}
          onPressCancel={() => setleaveGroupModal(false)}
          onPressSuccess={() => onLeaveGroup()}
        />
      )}

      {blockModal && <ConfirmationModal
        visible={blockModal}
        onClose={() => setblockModal(false)}
        title={`Do you want to block ${name}?`}
        successBtn={'Yes'}
        canselBtn={'No'}
        onPressCancel={() => setblockModal(false)}
        onPressSuccess={() => {
          onBlockuser()
        }}
      />}
      {reportModal && (
        <ReportModal
          visible={reportModal}
          onClose={() => setReportModal(false)}
          postId={activeChatRoomUser?.currentUser?._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    paddingVertical: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary_500,
  },
  menuIcon: {
    height: 50,
    paddingHorizontal: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    height: wp(50),
    width: wp(50),
    backgroundColor: colors.white,
    borderRadius: 5,
    marginRight: wp(10),
  },
  headerTextStyle: {
    ...FontStyle(17, colors.neutral_900, '700'),
    flex: 1,
    marginLeft: wp(10)
  },
  backIcon: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderColor: colors.primary_500,
    backgroundColor: colors.btnBg,
    zIndex: 111,
  },
});

export default ChatHeader;
