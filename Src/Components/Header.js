import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { SCREEN_WIDTH, fontname, wp } from '../Themes/Fonts';
import { useNavigation } from '@react-navigation/native';

export default function Header({
  showLeft = false,
  showRight = false,
  title,
  isHome = false,
  onLeftPress,
  onRightPress,
  onClickPlus,
  icon,
  logoShow = true,
  titleStyle,
  isChat,
  chatLeftPress,
  chatRightPress,
  isChatDetails,
}) {
  const navigation = useNavigation();
  if (isChatDetails) {
    return (
      <View style={[ApplicationStyles.row, styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuIcon}>
          <View style={styles.backIcon}>
            <Image source={Icons.left_arrow} style={ImageStyle(14, 14)} />
          </View>
        </TouchableOpacity>
        <View style={styles.middleView}>
          {logoShow && <Image source={Icons.logo} style={ImageStyle(23, 23)} />}
          <Text style={[styles.titleText, titleStyle,]}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.rigthIconView} onPress={() => chatRightPress()}>
          <Image source={Icons.more} style={ImageStyle(12, 12)} />
        </TouchableOpacity>
      </View>
    );
  }
  if (isChat) {
    return (
      <View style={[ApplicationStyles.row, styles.header]}>
        <TouchableOpacity style={styles.menuIcon} onPress={chatLeftPress}>
          <Image source={Icons.contact} style={ImageStyle(24, 24)} />
        </TouchableOpacity>
        <View style={styles.middleView}>
          {logoShow && <Image source={Icons.logo} style={ImageStyle(23, 23)} />}
          <Text style={[styles.titleText, titleStyle,]}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.rigthIconView} onPress={() => chatRightPress()}>
          <Image source={Icons.postAdd} style={ImageStyle(26, 24)} />
        </TouchableOpacity>
      </View>
    );
  }
  if (isHome) {
    return (
      <View style={[ApplicationStyles.row, styles.header]}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuIcon}>
          <Image source={Icons.menus} style={ImageStyle(24, 24)} />
        </TouchableOpacity>
        <View style={styles.middleView}>
          {logoShow && <Image source={Icons.logo} style={ImageStyle(23, 23)} />}
          <Text style={[styles.titleText, titleStyle,]}>{title}</Text>
        </View>
        <View style={[ApplicationStyles.row, { gap: 15, position: 'absolute', right: 0, }]}>
          <TouchableOpacity style={{
            borderRadius: 4,
            overflow: 'hidden'
          }} onPress={() => onClickPlus()}>
            <Image source={Icons.plusHome} style={ImageStyle(24, 24, 'cover')} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingRight: wp(16) }} onPress={() => onRightPress()}>
            <Image source={Icons.bell} style={ImageStyle(24, 24)} />
          </TouchableOpacity>
        </View>
      </View >
    );
  }
  return (
    <View style={[ApplicationStyles.row, styles.header]}>
      {showLeft &&
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuIcon}>
          <View style={styles.backIcon}>
            <Image source={Icons.left_arrow} style={ImageStyle(14, 14)} />
          </View>
        </TouchableOpacity>
      }
      <View style={styles.middleView}>
        {logoShow && title !== '' && <Image source={Icons.logo} style={ImageStyle(23, 23)} />}
        <Text style={[styles.titleText, titleStyle,]}>{title}</Text>
      </View>
      {showRight &&
        <TouchableOpacity style={styles.rigthIconView} onPress={() => onRightPress ? onRightPress() : {}}>
          <Image source={icon ? icon : Icons.bell} style={ImageStyle(24, 24)} />
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    height: 50,
    width: SCREEN_WIDTH,
  },
  middleView: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: { marginLeft: 8, textAlign: 'center', ...FontStyle(16, colors.neutral_900, '700',) },
  rigthIconView: {
    position: 'absolute',
    zIndex: 111,
    height: 50,
    paddingHorizontal: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
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
  menuIcon: {
    position: 'absolute',
    zIndex: 111,
    height: 50,
    paddingHorizontal: wp(16),
    alignItems: 'center',
    justifyContent: 'center'
  },

});
