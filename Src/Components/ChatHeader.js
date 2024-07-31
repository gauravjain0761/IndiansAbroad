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

const ChatHeader = ({ url, name, subscribedMember, onPressName }) => {
  const { goBack, navigate } = useNavigation();
  const [moreMenu, setmoreMenu] = useState(false)
  return (
    <View style={styles.conatiner}>
      <TouchableOpacity onPress={() => goBack()} style={styles.menuIcon}>
        <View style={styles.backIcon}>
          <Image source={Icons.left_arrow} style={ImageStyle(14, 14)} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.5} onPress={() => onPressName ? onPressName() : {}} style={[ApplicationStyles.row, ApplicationStyles.flex]}>

        <RenderUserIcon isBorder={subscribedMember} url={url} height={50} />
        <Text style={styles.headerTextStyle}>{name}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setmoreMenu(true)} style={styles.menuIcon}>
        <Image source={Icons.more} style={ImageStyle(14, 14)} />
      </TouchableOpacity>
      {moreMenu && <MessageScreenMoreMenu visible={moreMenu} onClose={() => setmoreMenu(false)} />}
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
