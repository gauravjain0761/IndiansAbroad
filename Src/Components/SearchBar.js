import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView, ScrollView
} from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, screen_width, wp } from '../Themes/Fonts';

export default function SearchBar({
  value,
  onChangeText,
  placeholder,
  containerStyles,
  onPressIn = undefined,
  inputViewStyle
}) {

  // const onPressIn = () => {
  //   c
  // }

  return (
    <KeyboardAvoidingView {...(Platform.OS === 'ios' ? { behavior: 'padding', } : {})}>
      <View style={[styles.header, containerStyles]}>
        <View style={[ApplicationStyles.row, styles.textInput]}>
          <Image source={Icons.search} style={ImageStyle(18, 18)} />
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={colors.neutral_500}
            style={[styles.inputStyle,inputViewStyle]}
            value={value}
            onChangeText={onChangeText}
            onPress={() => onPressIn ? onPressIn() : {}}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary_500,
    paddingVertical: 5,
    paddingHorizontal: wp(12),
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: wp(10),
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.neutral_500
  },
  inputStyle: {
    padding: 5,
    paddingLeft: wp(10),
    width: screen_width * 0.85,
    ...FontStyle(13, colors.black, "500"),
    height: 43
  },
});
