import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { SCREEN_WIDTH, fontname, wp } from '../Themes/Fonts';

export default function Header({ showLeft = false, showRight = false, title, isHome = false,onLeftPress }) {

  if (isHome) {
    return (
      <View style={[ApplicationStyles.row, styles.header]}>
        <TouchableOpacity>
          <Image source={Icons.menus} style={ImageStyle(24, 24)} />
        </TouchableOpacity>
        <View
          style={[
            ApplicationStyles.row,
            { position: 'absolute', justifyContent: 'center', width: SCREEN_WIDTH - wp(32) },
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
        <View style={[
          ApplicationStyles.row,
          { gap: 10 }
        ]}>
          <TouchableOpacity>
            <Image source={Icons.plusHome} style={ImageStyle(26, 24)} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Icons.bell} style={ImageStyle(24, 24)} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  return (
    <View style={[ApplicationStyles.row, styles.header]}>
      {showLeft ? (
        <TouchableOpacity onPress={onLeftPress} style={styles.backIcon}>
          <Image source={Icons.left_arrow} style={ImageStyle(14, 14)} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View
        style={[
          ApplicationStyles.row,
          { position: 'absolute', justifyContent: 'center', width: SCREEN_WIDTH - wp(32) },
        ]}>
        <Image source={Icons.logo} style={ImageStyle(23, 23)} />
        <Text
          style={[
            FontStyle(fontname.actor_regular, 16, colors.neutral_900,"700"),
            {marginLeft: 8, textAlign: 'center'},
          ]}>
          {title}
        </Text>
      </View>
      {showRight ? (
        <TouchableOpacity>
          <Image source={Icons.bell} style={ImageStyle(24, 24)} />
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
    marginHorizontal: wp(16),
    marginVertical: 12,
  },
  backIcon:{
    borderWidth:1,
    paddingHorizontal:10,
    paddingVertical:3,
    borderRadius:12,
    borderColor:colors.primary_500
  }
});
