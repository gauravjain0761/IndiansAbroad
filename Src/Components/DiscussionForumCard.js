import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Icons} from '../Themes/Icons';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {SCREEN_WIDTH, fontname, wp} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import ReactNativeModal from 'react-native-modal';
import ModalContainer from './ModalContainer';
import RenderUserIcon from './RenderUserIcon';
import PostShareModal from './PostShareModal';

export default function DiscussionForumCard({item, index}) {
  const [menuModal, setmenuModal] = useState(false);
  return (
    <View key={index} style={[ApplicationStyles.row, styles.cardView]}>
      <View style={[{width: SCREEN_WIDTH * 0.65}]}>
        <Text style={styles.username}>
          Cultural Clashes: Do Indian Expats Struggle to Adapt Abroad?
        </Text>
        <Text numberOfLines={2} style={styles.degreeText}>
          {'So I will share my view. I am in Tokyo right .....'}
        </Text>
        <View style={[ApplicationStyles.row]}>
          <Text style={[styles.degreeText, {color: colors.neutral_700}]}>
            Aditya Patil
          </Text>
          <View style={[ApplicationStyles.row]}>
            <View style={styles.lineStyle} />
            <Text style={styles.degreeText}>3 months ago</Text>
          </View>
        </View>
        <View style={[ApplicationStyles.row, {marginTop: 5}]}>
          <Text>13</Text>
          <TouchableOpacity>
            <Image
              source={Icons.userChat}
              style={[styles.share, {marginHorizontal: wp(12)}]}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Icons.share} style={styles.share} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginLeft: 28}}>
        <Image source={Icons.userImage} style={styles.userImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    borderBottomWidth: 3,
    borderBottomColor: colors.secondary_500,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  userImage: {
    height: 77,
    width: 77,
  },
  share: {
    height: 22,
    width: 22,
    resizeMode:'contain'
  },
  username: {
    ...FontStyle(fontname.actor_regular, 17, colors.neutral_900, '700'),
  },
  degreeText: {
    marginVertical: 4,
    ...FontStyle(fontname.actor_regular, 11, colors.neutral_600),
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
});
