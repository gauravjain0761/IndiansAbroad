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

export default function ConnectCard({indians,cardPress}) {
  return (
    <TouchableOpacity onPress={cardPress} style={[styles.header]}>
      <View style={styles.imageStyle}>
        <Image source={Icons.bell} style={ImageStyle(18, 18)} />
      </View>
      <Text numberOfLines={1} style={styles.text1}>
        Vikas Mane
      </Text>
      <Text numberOfLines={1} style={styles.text2}>
        MS Student
      </Text>
     {indians && <Text numberOfLines={1} style={styles.text3}>
        London University
      </Text>}
      <TouchableOpacity style={styles.btnView}>
        <Text style={styles.btnText}>Connect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary_500,
    borderRadius: wp(20),
    paddingHorizontal: wp(10),
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(10),
    // paddingBottom: hp(28),
    width: '49%',
    marginBottom: hp(16),
    minHeight: hp(160),
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
  imageStyle: {
    width: wp(92),
    height: hp(82),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:colors.neutral_500
  },
  text1: {
    marginTop: 5,
    ...FontStyle(fontname.abeezee, 14, colors.neutral_900, '700'),
  },
  text2: {
    marginTop: 2,
    lineHeight: 16,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
  text3: {
    // marginTop:2,
    lineHeight: 16,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
  btnView: {
    backgroundColor: colors.primary_4574ca,
    width: wp(130),
    alignItems: 'center',
    height: hp(20),
    borderRadius: 4,
    marginVertical: hp(12),
  },
  btnText:{
    ...FontStyle(fontname.actor_regular, 12, colors.white, '400'),
    lineHeight:18
  }
});
