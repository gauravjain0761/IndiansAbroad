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

export default function ConnectCard({
  value,
  onChangeText,
  placeholder
}) {
  return (
    <View style={[ApplicationStyles.row, styles.header]}>
        <Image source={Icons.bell} style={ImageStyle(18, 18)} />
        <Text></Text>
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary_500,
    borderRadius: wp(20),
    paddingHorizontal: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(25),
    paddingBottom: hp(28),
    width: '49%',
    marginBottom: hp(16),
    minHeight: hp(180),
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: wp(10),
    backgroundColor:colors.inputBg,
    
  },
  inputStyle: {
    padding: 5,
    paddingLeft:wp(10),
    width:screen_width *0.85,
    ...FontStyle(fontname.actor_regular,14,colors.black,"500")
  },
});
