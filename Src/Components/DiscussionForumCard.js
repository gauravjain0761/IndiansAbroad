import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { SCREEN_WIDTH, fontname, wp } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import ReactNativeModal from 'react-native-modal';
import ModalContainer from './ModalContainer';
import RenderUserIcon from './RenderUserIcon';
import PostMoreModal from './PostMoreModal';
import { api } from '../utils/apiConstants';
import FastImage from 'react-native-fast-image';
import ShareModal from './ShareModal';

export default function DiscussionForumCard({ item, index }) {
  const [menuModal, setmenuModal] = useState(false);
  const [shareModal, setshareModal] = useState(false);
  return (
    <View key={index} style={[ApplicationStyles.row, styles.cardView]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.username}>
          {item?.title}
        </Text>
        <Text numberOfLines={2} style={styles.degreeText}>
          {item?.message}
        </Text>
        <View style={[ApplicationStyles.row]}>
          <Text style={[styles.degreeText1, { color: colors.neutral_700 }]}>
            {item?.createdBy?.first_Name} {item?.createdBy?.last_Name}
          </Text>
          <View style={[ApplicationStyles.row]}>
            <View style={styles.lineStyle} />
            <Text style={[styles.degreeText1, { color: colors.neutral_700 }]}>{item?.createdDate}</Text>
          </View>
        </View>
        <View style={[ApplicationStyles.row, { marginTop: 3, alignItems: 'flex-end', }]}>
          <Text style={styles.valueText}>{item?.commentCount}</Text>
          <TouchableOpacity >
            <Image
              source={Icons.userChat}
              style={[styles.share, { marginRight: wp(12), marginLeft: 3 }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setshareModal(true)}>
            <Image source={Icons.share} style={styles.share} />
          </TouchableOpacity>
        </View>
      </View>
      {item?.mediaFiles?.length > 0 ? <View style={{ marginRight: 10, marginLeft: 20 }}>
        <FastImage source={{ uri: item?.thumbNail?.location }} resizeMode={FastImage.resizeMode.cover} style={styles.userImage} />
      </View> : <View style={{ marginRight: 10, marginLeft: 20 }}>
        <FastImage source={{ uri: item?.thumbNail?.location }} resizeMode={FastImage.resizeMode.cover} style={styles.userImage} />
      </View>}
      {shareModal && (
        <ShareModal
          visible={shareModal}
          postId={item._id}
          onClose={() => setshareModal(false)}
          item={item}
          isThread={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    borderBottomWidth: 3,
    borderBottomColor: colors.secondary_500,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  userImage: {
    height: 77,
    width: 77,
    borderRadius: 4
  },
  share: {
    height: 22,
    width: 22,
    resizeMode: 'contain'
  },
  username: {
    ...FontStyle(16, colors.neutral_900, '700'),
    // textAlign: 'justify'
  },
  degreeText: {
    marginVertical: 3,
    ...FontStyle(14, colors.neutral_600, "400"),
    // textAlign: 'justify'
  },
  degreeText1: {
    // lineHeight:18,
    marginBottom: 2,
    ...FontStyle(14, colors.neutral_600),
  },
  lineStyle: {
    height: 8,
    width: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
    marginRight: 3,
    borderColor: colors.neutral_600,
  },
  valueText: {
    ...FontStyle(14, colors.danger_500, "600"),
  }
});
