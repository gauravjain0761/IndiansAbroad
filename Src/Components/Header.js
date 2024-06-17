import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {Icons} from '../Themes/Icons';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import colors from '../Themes/Colors';
import {fontname, wp} from '../Themes/Fonts';

export default function Header({showLeft = false, showRight = false,title}) {
  return (
    <View style={[ApplicationStyles.row, styles.header]}>
      {showLeft ? (
        <TouchableOpacity>
          <Image source={Icons.bell} style={ImageStyle(18, 18)} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View
        style={[
          ApplicationStyles.row,
          {left: showLeft ? 0 : !showRight ? 0 : 10},
        ]}>
        <Image source={Icons.logo} style={ImageStyle(20, 20)} />
        <Text
          style={[
            FontStyle(fontname.actor_regular, 16, colors.black),
            {marginLeft: 8, textAlign: 'center'},
          ]}>
          {title}
        </Text>
      </View>
      {showRight ? (
        <TouchableOpacity>
          <Image source={Icons.bell} style={ImageStyle(18, 18)} />
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
});
