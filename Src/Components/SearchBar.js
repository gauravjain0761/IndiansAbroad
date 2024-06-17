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
import {fontname, screen_width, wp} from '../Themes/Fonts';

export default function SearchBar({
  value,
  onChangeText,
  placeholder,
  containerStyles
}) {
  return (
    <View style={[styles.header,containerStyles]}>
      <View style={[ApplicationStyles.row, styles.textInput]}>
        <Image source={Icons.bell} style={ImageStyle(18, 18)} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.neutral_500}
          style={styles.inputStyle}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary_8091ba,
    paddingVertical: 5,
    paddingHorizontal: wp(12),
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
