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
        <View
          style={[
            ApplicationStyles.row,
            {
              position: 'absolute',
              justifyContent: 'center',
              width: SCREEN_WIDTH - wp(32),
              flex: 1
            },
          ]}>
          <Image source={Icons.logo} style={ImageStyle(23, 23)} />
          <Text
            style={[
              FontStyle(fontname.actor_regular, 16, colors.neutral_900, '700'),
              { marginLeft: 8, textAlign: 'center' },
            ]}>
            {title}
          </Text>
        </View>
        <View style={[ApplicationStyles.row, { gap: 10, position: 'absolute', right: 0, }]}>
          <TouchableOpacity onPress={() => chatRightPress()}>
            <Image source={Icons.more} style={ImageStyle(12, 12)} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (isChat) {
    return (
      <View style={[ApplicationStyles.row, styles.header]}>
        <TouchableOpacity style={styles.menuIcon} onPress={chatLeftPress}>
          <Image source={Icons.contact} style={ImageStyle(24, 24)} />
        </TouchableOpacity>
        <View
          style={[
            ApplicationStyles.row,
            {
              position: 'absolute',
              justifyContent: 'center',
              width: SCREEN_WIDTH - wp(32),
            },
          ]}>
          <Image source={Icons.logo} style={ImageStyle(23, 23)} />
          <Text
            style={[
              FontStyle(fontname.actor_regular, 16, colors.neutral_900, '700'),
              { marginLeft: 8, textAlign: 'center' },
            ]}>
            {title}
          </Text>
        </View>
        <View style={[ApplicationStyles.row, { gap: 10, position: 'absolute', right: 0 }]}>
          <TouchableOpacity onPress={() => chatRightPress()}>
            <Image source={Icons.postAdd} style={ImageStyle(26, 24)} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (isHome) {
    return (
      <View style={[ApplicationStyles.row, styles.header]}>
        <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.toggleDrawer()}>
          <Image source={Icons.menus} style={ImageStyle(24, 24)} />
        </TouchableOpacity>
        <View
          style={[
            ApplicationStyles.row,
            {
              position: 'absolute',
              justifyContent: 'center',
              width: SCREEN_WIDTH - wp(32),
              alignSelf: 'center',
              left: 0, right: 0
            },
          ]}>
          <Image source={Icons.logo} style={ImageStyle(23, 23)} />
          <Text
            style={[
              FontStyle(fontname.abeezee, 16, colors.neutral_900, '700'),
              { marginLeft: 8, textAlign: 'center' },
            ]}>
            {title}
          </Text>
        </View>
        <View style={[ApplicationStyles.row, { gap: 15, position: 'absolute', right: 0, }]}>
          <TouchableOpacity style={{
            borderRadius: 4,
            overflow: 'hidden'
          }} onPress={() => onClickPlus()}>
            <Image source={Icons.plusHome} style={ImageStyle(24, 24, 'cover')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRightPress()}>
            <Image source={Icons.bell} style={ImageStyle(24, 24)} />
          </TouchableOpacity>
        </View>
      </View >
    );
  }
  return (
    <View style={[ApplicationStyles.row, styles.header]}>
      {showLeft ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuIcon}>

          <View style={styles.backIcon}>
            <Image source={Icons.left_arrow} style={ImageStyle(14, 14)} />
          </View>
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {!logoShow ? (
        <View
          style={[
            ApplicationStyles.row,
            {
              position: 'absolute',
              justifyContent: 'center',
              width: SCREEN_WIDTH - wp(32),
            },
          ]}>
          <Text
            style={[
              FontStyle(fontname.actor_regular, 16, colors.neutral_900, "700"),
              { textAlign: 'center' },
              titleStyle,
            ]}>
            {title}
          </Text>
        </View>
      ) : (
        title !== '' && (
          <View
            style={[
              ApplicationStyles.row,
              {
                position: 'absolute',
                justifyContent: 'center',
                width: SCREEN_WIDTH - wp(32),
              },
            ]}>
            <Image source={Icons.logo} style={ImageStyle(23, 23)} />
            <Text
              style={[
                FontStyle(
                  fontname.actor_regular,
                  16,
                  colors.neutral_900,
                  '700',
                ),
                { marginLeft: 8, textAlign: 'center' },
                titleStyle,
              ]}>
              {title}
            </Text>
          </View>
        )
      )}

      {showRight ? (
        <TouchableOpacity onPress={() => onRightPress ? onRightPress() : {}}>
          <Image source={icon ? icon : Icons.bell} style={ImageStyle(24, 24)} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    marginRight: wp(16),
    height: 50,
  },
  backIcon: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderColor: colors.primary_500,
    backgroundColor: colors.btnBg,
    // position: 'absolute',
    zIndex: 111,
    // backgroundColor: 'yellow',
    // height: 50,
    // marginHorizontal: wp(16),
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  menuIcon: {
    position: 'absolute',
    zIndex: 111,
    // backgroundColor: 'yellow',
    height: 50,
    paddingHorizontal: wp(16),
    alignItems: 'center',
    justifyContent: 'center'
  }
});
