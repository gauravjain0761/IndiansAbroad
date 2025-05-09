import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Icons } from '../Themes/Icons';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import colors from '../Themes/Colors';
import { api } from '../utils/apiConstants';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';

export default function RenderUserIcon({
  height,
  isBorder = false,
  url,
  activeOpacity,
  userId = undefined,
  type = 'user'
}) {
  const navigation = useNavigation();
  const { user } = useSelector(e => e.common);
  let isUrl = url !== undefined && url !== '';
  let styles = StyleSheet.create({
    userImage: {
      height: (height) - (isBorder ? 6 : 0),
      width: (height) - (isBorder ? 6 : 0),
      borderRadius: height / 2
    },
  });

  const onOpenUserDetail = () => {
    if (userId !== undefined && userId !== user._id) {
      navigation.navigate(screenName.indiansDetails, { userId: userId });
    }
    //  else {
    //     navigation.navigate(screenName.indiansDetails)
    // }
  };

  return (
    <TouchableOpacity
      disabled={userId === undefined ? true : false}
      activeOpacity={activeOpacity}
      onPress={() => onOpenUserDetail()}
      style={{
        height: height,
        width: height,
        borderWidth: 2,
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: isBorder ? '#C5B80F' : 'transparent',
        backgroundColor: isUrl ? colors.white : colors.inputBg,
      }}>
      <FastImage
        resizeMode={
          isUrl ? FastImage.resizeMode.cover : FastImage.resizeMode.contain
        }
        source={
          isUrl
            ? { uri: url.includes('https://') ? url : api.IMAGE_URL + url, priority: FastImage.priority.normal }
            : type == 'user' ? Icons.userPlaceholder : type == 'group' ? Icons.groupPlaceholder : Icons.pagePlaceholder
        }
        style={styles.userImage}
      />
    </TouchableOpacity>
  );
}
