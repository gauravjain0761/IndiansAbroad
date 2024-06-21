import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {Icons} from '../Themes/Icons';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import colors from '../Themes/Colors';
import {fontname, hp, screen_width, wp} from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';

export default function Input({value, onChangeText, label,placeholder}) {
  return (
    <View>
      <Text style={styles.labelText}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  labelText: {
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900),
    marginHorizontal: wp(20),
    marginBottom: 4,
    marginTop:8,
  },
  inputText: {
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    marginHorizontal: wp(20),
    borderRadius: 5,
    paddingLeft: 12,
    paddingVertical:Platform.OS == 'ios' ? 19 : 6,
    // marginTop:12
  },
});
