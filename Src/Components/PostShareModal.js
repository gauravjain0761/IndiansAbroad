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
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import { fontname, screen_width, wp } from '../Themes/Fonts';
import ModalContainer from './ModalContainer';

export default function PostShareModal({
  shareView,
  menuModal,
  setmenuModal,
  item
}) {
  return (
    <ModalContainer
      isVisible={menuModal}
      onClose={() => setmenuModal(false)}
      transparent={true}>
      <View style={styles.modalView}>
        <Text style={styles.modalUserName}>{item ? `${item?.createdBy?.first_Name} ${item?.createdBy?.last_Name}` : 'Nikita Khairnar'}</Text>
        <View style={styles.line} />
        {shareView && (
          <>
            <TouchableOpacity>
              <Text style={styles.modalText}>Share Profile</Text>
            </TouchableOpacity>
            <View
              style={[styles.line, { borderBottomColor: colors.neutral_500 }]}
            />
          </>
        )}
        <TouchableOpacity>
          <Text style={styles.modalText}>{item?.isFollowing ? 'Disconnect' : 'Connect'}</Text>
        </TouchableOpacity>
        <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />
        <TouchableOpacity>
          <Text style={styles.modalText}>{item?.isPostBlocked ? 'Unblock' : 'Block'}</Text>
        </TouchableOpacity>
        <View style={[styles.line, { borderBottomColor: colors.neutral_500 }]} />
        {!item?.isReported ? <TouchableOpacity>
          <Text style={styles.modalText}>Report</Text>
        </TouchableOpacity> : null}
        <View style={styles.line} />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: colors.neutral_300,
    paddingHorizontal: 3,
  },
  modalUserName: {
    ...FontStyle(fontname.abeezee, 16, colors.neutral_900, '700'),
    paddingVertical: 15,
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_800,
  },
  modalText: {
    ...FontStyle(fontname.actor_regular, 18, colors.neutral_900),
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
