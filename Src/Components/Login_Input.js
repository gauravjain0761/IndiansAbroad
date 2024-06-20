import {
  ColorValue,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React, {FC} from 'react';
import { hp } from '../Themes/Fonts';


const Login_Input = ({
  placeholder = 'Enter Text...',
  input_style,
  placeholder_color,
  value,
  input_container_style,
  custom_component = null,
  onTextChange,
}) => {
  return (
    <View style={[styles?.def_input_bg,input_container_style]}>
      {custom_component || (
        <TextInput
          placeholder={placeholder}
          value={value}
          keyboardType="phone-pad"
          // placeholderTextColor={placeholder_color}
          showSoftInputOnFocus
          style={[styles?.def_input_styles, input_style]}
          onChangeText={(e) => onTextChange(e)}
        />
      )}
    </View>
  );
};

export default Login_Input;

const styles = StyleSheet.create({
  container: {},
  def_input_bg: {
    // width: SCREEN_WIDTH * 0.75 ,
    height: hp(70),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf:'center',
    // borderWidth:1
  },
  def_input_styles: {
    width: '100%',
    height: '100%',
  },
  placeholder: {},
});
