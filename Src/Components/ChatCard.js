import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {Icons} from '../Themes/Icons';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import colors from '../Themes/Colors';
import {fontname, hp, screen_width, wp} from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';

export default function ChatCard({indians, cardPress}) {
  return (
    <TouchableOpacity onPress={cardPress} style={[styles.header]}>
      <View style={styles.imageStyle}>
        <RenderUserIcon height={78} />
        {/* <Image source={Icons.bell} style={ImageStyle(18, 18)} /> */}
      </View>
      <Text numberOfLines={1} style={styles.text1}>
        Vikas Mane
      </Text>
      <Text numberOfLines={1} style={styles.text3}>
        HI Anay, How are you . .
      </Text>
      <View style={styles.btnView}>
        <Image source={Icons.sent} style={styles.chatIcon} />
        <Text style={styles.btnText}>13.06</Text>
      </View>
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
});
