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
import RenderUserIcon from './RenderUserIcon';
import {useSelector} from 'react-redux';
import moment from 'moment';

export default function ChatCard({data, cardPress}) {
  const {user} = useSelector(e => e.common);

  let currentUser = data?.users?.filter(item => item._id !== user?._id)?.[0];

  return (
    <TouchableOpacity
      onPress={() => cardPress(currentUser)}
      style={[styles.header]}>
      <View style={styles.imageStyle}>
        <RenderUserIcon
          url={currentUser?.avtar}
          height={78}
          isBorder={currentUser?.subscribedMember}
        />
        {/* <Image source={Icons.bell} style={ImageStyle(18, 18)} /> */}
      </View>
      <Text numberOfLines={1} style={styles.text1}>
        {currentUser?.first_Name + ' ' + currentUser?.last_Name}
      </Text>
      <Text numberOfLines={1} style={styles.text3}>
        {data?.latestMessage?.content}
      </Text>
      <View style={styles.btnView}>
        <Image source={Icons.sent} style={styles.chatIcon} />
        <Text style={styles.btnText}>
          {moment(data?.latestMessage?.createdAt).format('HH:mm')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.neutral_150,
    borderRadius: wp(3),
    paddingHorizontal: wp(10),
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(5),
    // paddingBottom: hp(28),
    width: '49.1%',
    marginBottom: hp(5),
  },
  imageStyle: {
    // width: wp(92),
    // height: hp(82),
    // // borderWidth: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: colors.white
    // borderColor: colors.neutral_500
  },
  text1: {
    marginTop: 5,
    ...FontStyle(14, colors.neutral_900, '700'),
  },
  text3: {
    lineHeight: 18,
    textAlign: 'center',
    ...FontStyle(12, colors.neutral_900, '400'),
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  btnText: {
    ...FontStyle(12, colors.neutral_900, '400'),
    lineHeight: 18,
  },
  chatIcon: {
    width: 18,
    height: 18,
    marginRight: 0,
    resizeMode: 'contain',
  },
});
