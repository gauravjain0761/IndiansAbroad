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

export default function ConnectedIndians({indians, cardPress}) {
  return (
    <TouchableOpacity onPress={cardPress} style={[styles.header]}>
      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
        <View style={styles.imageStyle}>
          {/* <Image source={Icons.bell} style={ImageStyle(45, 45)} /> */}
        </View>
        <Text numberOfLines={1} style={styles.text1}>
          Vikas Mane
        </Text>
      </View>

      <TouchableOpacity style={styles.btnView}>
         <Image source={Icons.more} style={ImageStyle(14, 14)} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(5),
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(16),
    paddingVertical:hp(5)
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
    width: wp(45),
    height: wp(45),
    borderWidth: 1,
    alignItems: 'center',
    borderColor: colors.neutral_500,
    flexDirection: 'row',
    borderRadius: wp(45) / 2,
  },
  text1: {
    marginLeft:12,
    ...FontStyle(fontname.abeezee, 14, colors.neutral_900, '700'),
  },
});
