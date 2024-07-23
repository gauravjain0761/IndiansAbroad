import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { hp, wp } from '../Themes/Fonts';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import RenderUserIcon from './RenderUserIcon';
import { useNavigation } from '@react-navigation/native';

const ChatHeader = ({ url, name, subscribedMember }) => {
  const { goBack } = useNavigation();
  return (
    <View style={styles.conatiner}>
      <TouchableOpacity
        onPress={() => goBack()}
        style={styles.backBoxContainer}>
        <Image source={Icons.left_arrow} style={ImageStyle(14, 14)} />
      </TouchableOpacity>
      <View
        style={{
          ...styles.logoContainer,
          backgroundColor: url?.length > 0 ? 'transparent' : colors.white,
        }}>
        <RenderUserIcon isBorder={subscribedMember} url={url} height={50} />
      </View>
      <Text style={styles.headerTextStyle}>{name}</Text>
      <TouchableOpacity>
        <Image source={Icons.more} style={ImageStyle(14, 14)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    paddingHorizontal: wp(10),
    paddingVertical: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary_500,
  },
  backBoxContainer: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderColor: colors.primary_500,
    backgroundColor: colors.btnBg,
    zIndex: 111,
  },
  logoContainer: {
    height: wp(50),
    width: wp(50),
    backgroundColor: colors.white,
    borderRadius: 5,
    marginHorizontal: wp(10),
  },
  headerTextStyle: {
    ...FontStyle(17, colors.neutral_900, '700'),
    flex: 1,
  },
});

export default ChatHeader;
