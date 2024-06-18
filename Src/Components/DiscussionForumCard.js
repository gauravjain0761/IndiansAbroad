import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Icons} from '../Themes/Icons';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {SCREEN_WIDTH, fontname} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import ReactNativeModal from 'react-native-modal';
import ModalContainer from './ModalContainer';
import RenderUserIcon from './RenderUserIcon';
import PostShareModal from './PostShareModal';

export default function DiscussionForumCard({item, index}) {
  const [menuModal, setmenuModal] = useState(false);
  return (
    <View key={index} style={styles.cardView}>
      <View style={ApplicationStyles.flex}>
        <Text style={styles.username}>Cultural Clashes: Do Indian Expats Struggle to Adapt Abroad?</Text>
        <Text style={styles.degreeText}>PhD Student, Seoul</Text>
        <Text style={styles.degreeText}>15 hours ago</Text>
      </View>
      <View>
        <Image />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    borderBottomWidth: 3,
    borderBottomColor:colors.secondary_500
  },
  userImage: {
    height: 57,
    width: 57,
    borderRadius: 57 / 2,
  },
  username: {
    ...FontStyle(fontname.actor_regular, 13, colors.neutral_900),
  },
  degreeText: {
    ...FontStyle(fontname.actor_regular, 11, colors.neutral_900),
  },
});
