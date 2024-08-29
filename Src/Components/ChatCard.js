import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, hp, screen_width, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ModalContainer from './ModalContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onDeleteChat } from '../Services/ChatServices';
import ConfirmationModal from './ConfirmationModal';


export default function ChatCard({ data, cardPress, isGroup }) {
  const { user } = useSelector(e => e.common);
  let currentUser = data?.users?.filter(item => item._id !== user?._id)?.[0];
  const [longPressModal, setlongPressModal] = useState(false)
  const [deleteChatModal, setdeleteChatModal] = useState(false)
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()

  const onPressDelete = () => {
    setdeleteChatModal(false)
    let obj = {
      data: {
        chatId: data?._id,
      },
      isGroup: isGroup,
      onSuccess: () => {
      }
    }
    dispatch(onDeleteChat(obj))
  }

  return (
    <TouchableOpacity
      onLongPress={() => { setlongPressModal(true) }}
      onPress={() => cardPress(currentUser)}
      style={[styles.header]}>
      <View style={styles.imageStyle}>
        <RenderUserIcon
          url={isGroup ? data?.chatLogo[0]?.cdnlocation : currentUser?.avtar}
          height={78}
        // isBorder={currentUser?.subscribedMember}
        />
        {/* <Image source={Icons.bell} style={ImageStyle(18, 18)} /> */}
      </View>
      <Text numberOfLines={1} style={styles.text1}>
        {isGroup ? data?.chatName : currentUser?.first_Name + ' ' + currentUser?.last_Name}
      </Text>
      <Text numberOfLines={1} style={styles.text3}>
        {data?.latestMessage?.content}
      </Text>
      <View style={styles.btnView}>
        <Image source={Icons.sent} style={styles.chatIcon} />
        <Text style={styles.btnText}>
          {moment(data?.latestMessage?.createdAt).format('HH:mm')}
        </Text>
      </View>
      {data?.unreadMessages > 0 && <View style={styles.unreadMsg}>
        <Text style={styles.unreadMsgText}>{data?.unreadMessages}</Text>
      </View>}


      {longPressModal &&
        <ModalContainer isVisible={longPressModal} onClose={() => setlongPressModal(false)} >
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => {
              setlongPressModal(false), setTimeout(() => {
                setdeleteChatModal(true)
              }, 500);
            }} style={styles.row}>
              <Image style={styles.image} source={Icons.trash} />
              <Text style={styles.text}>Delete for everyone</Text>
            </TouchableOpacity>

            <View style={{ paddingBottom: insets.bottom }} />
          </View>
        </ModalContainer>
      }


      {deleteChatModal && (
        <ConfirmationModal
          visible={deleteChatModal}
          onClose={() => setdeleteChatModal(false)}
          title={`Are you sure you want to delete chat?`}
          successBtn={'Delete'}
          canselBtn={'No'}
          onPressCancel={() => setdeleteChatModal(false)}
          onPressSuccess={() => onPressDelete()}
        />
      )}


    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.neutral_150,
    borderRadius: wp(3),
    paddingHorizontal: wp(10),
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(5),
    // paddingBottom: hp(28),
    width: '49.1%',
    marginBottom: hp(5),
  },
  imageStyle: {
    // width: wp(92),
    // height: hp(82),
    // // borderWidth: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: colors.white
    // borderColor: colors.neutral_500
  },
  text1: {
    marginTop: 5,
    ...FontStyle(14, colors.neutral_900, '700'),
  },
  text3: {
    lineHeight: 18,
    textAlign: 'center',
    ...FontStyle(12, colors.neutral_900, '400'),
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  btnText: {
    ...FontStyle(12, colors.neutral_900, '400'),
    lineHeight: 18,
  },
  chatIcon: {
    width: 18,
    height: 18,
    marginRight: 0,
    resizeMode: 'contain',
  },
  unreadMsg: {
    backgroundColor: colors.primary_500,
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderWidth: 0.5
  },
  unreadMsgText: {
    ...FontStyle(10, colors.white, '600')
  },


  modalView: {
    backgroundColor: colors.white,
    paddingHorizontal: 3,
    paddingVertical: wp(10)
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    paddingVertical: wp(10),
    marginHorizontal: wp(20)
  },
  image: {
    height: 20,
    width: 20,
    tintColor: colors.neutral_900
  },
  text: {
    ...FontStyle(14, colors.neutral_900)
  }
});
