import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {hp, wp} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import {Icons} from '../Themes/Icons';
import {FontStyle} from '../utils/commonFunction';

const ChatInput = () => {
  return (
    <View style={styles.conatiner}>
      <TouchableOpacity style={styles.plusBoxStyle}>
        <Image
          style={styles.plusIconStyle}
          resizeMode="contain"
          source={Icons.plus}
        />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Type Here"
          placeholderTextColor={colors.secondary_500}
        />
      </View>
      <TouchableOpacity>
        <Image
          source={Icons.send}
          resizeMode="contain"
          style={styles.sendIconStyle}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(5),
    paddingHorizontal: wp(10),
    backgroundColor: colors.primary_8091ba,
  },
  plusIconStyle: {
    height: wp(15),
    width: wp(15),
    tintColor: colors.primary_4574ca,
  },
  plusBoxStyle: {
    height: wp(30),
    width: wp(30),
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary_4574ca,
  },
  inputContainer: {
    flex: 1,
    height: hp(45),
    borderRadius: 5,
    marginHorizontal: wp(10),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  inputStyle: {
    paddingHorizontal: wp(10),
    ...FontStyle(15, colors.black, '600'),
  },
  sendIconStyle: {
    height: wp(25),
    width: wp(25),
  },
});

export default ChatInput;
