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


export default function ConnectedIndians({ indians, cardPress }) {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  return (
    <TouchableOpacity onPress={cardPress} style={[styles.header]}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <RenderUserIcon height={45} isBorder />
        <Text numberOfLines={1} style={styles.text1}>
          Vikas Mane
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
        <MenuItem textStyle={styles.itemText} onPress={hideMenu}>Disconnect</MenuItem>
        <MenuDivider color={colors.primary_500} />
        <MenuItem textStyle={styles.itemText} onPress={hideMenu}>Block</MenuItem>
      </Menu>
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
    ...FontStyle(fontname.actor_regular, 14, colors.black, '500'),
  },
  text1: {
    marginLeft: 12,
    ...FontStyle(fontname.abeezee, 14, colors.neutral_900),
  },
  itemText: {
    ...FontStyle(fontname.actor_regular, 18, colors.neutral_900)
  },
  menu: {
    backgroundColor: colors.secondary_500,
    marginTop: 12,
    borderRadius: 0
  }
});
