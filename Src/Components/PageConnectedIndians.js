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
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import { onBlockUserApi, onCancelRequest, onConnectRequest, onUnFollowRequest } from '../Services/OtherUserServices';
import ConfirmationModal from './ConfirmationModal';
import { useNavigation } from '@react-navigation/native';


export default function PageConnectedIndians({ indians, cardPress, item, onUpdate }) {
  const [visible, setVisible] = useState(false);
  const { user } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  const [blockModal, setblockModal] = useState(false)
  const navigation = useNavigation()
  const onConnect = () => {
    hideMenu()
    let obj = {
      data: {
        userId: user._id,
        followingId: item?._id
      },
      onSuccess: () => {
        if (onUpdate) onUpdate()
      }
    }
    if (item?.isfollowing == 'notfollowing') {
      dispatch(onConnectRequest(obj));
    } else if (item?.isfollowing == 'requested') {
      dispatch(onCancelRequest(obj));
    } else {
      dispatch(onUnFollowRequest(obj));
    }

  }

  const onBlockuser = () => {
    setblockModal(false)
    setTimeout(() => {
      let obj = {
        data: {
          userId: item?._id,
          action: 'block'
        },
        onSuccess: () => {
          if (onUpdate) onUpdate()
        }
      }
      dispatch(onBlockUserApi(obj))
    }, 500);

  }
  return (
    <TouchableOpacity onPress={cardPress} style={[styles.header]}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <RenderUserIcon url={item?.avtar} height={45} isBorder={item?.subscribedMember} />
        <Text numberOfLines={1} style={styles.text1}>
          {item?.first_Name} {item?.last_Name}
        </Text>
      </View>
      <Menu
        visible={visible}
        anchor={<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: hp(15), flex: 1 }} onPress={showMenu}>
          <Image source={Icons.more} style={ImageStyle(14, 14)} />
        </TouchableOpacity>}
        onRequestClose={hideMenu}
        style={styles.menu}
      >
        <MenuItem textStyle={styles.itemText} onPress={() => onConnect()}>{item?.isfollowing == 'notfollowing'
          ? 'Connect'
          : item?.isfollowing == 'requested'
            ? 'Cancel Request'
            : 'Disconnect'}</MenuItem>
        <MenuDivider color={colors.primary_500} />
        <MenuItem textStyle={styles.itemText} onPress={() => { hideMenu(), setblockModal(true) }}>Block</MenuItem>
      </Menu>

      <ConfirmationModal
        visible={blockModal}
        onClose={() => setblockModal(false)}
        title={`Do you want to block ${item?.first_Name} ${item?.last_Name}?`}
        successBtn={'Yes'}
        canselBtn={'No'}
        onPressCancel={() => setblockModal(false)}
        onPressSuccess={() => {
          onBlockuser()
        }}
      />

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: hp(16),
    // paddingVertical: hp(5),
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_400,
    paddingVertical: hp(15),
    paddingLeft: hp(15)
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
    ...FontStyle(14, colors.black, '500'),
  },
  text1: {
    marginLeft: 12,
    ...FontStyle(14, colors.neutral_900),
  },
  itemText: {
    ...FontStyle(18, colors.neutral_900)
  },
  menu: {
    backgroundColor: colors.secondary_500,
    marginTop: 12,
    borderRadius: 0
  }
});
