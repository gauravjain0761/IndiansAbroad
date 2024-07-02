import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import colors from '../Themes/Colors';
import { Icons } from '../Themes/Icons';
import { SCREEN_WIDTH, fontname, wp } from '../Themes/Fonts';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import Input from './Input';
import ApplicationStyles from '../Themes/ApplicationStyles';

export default function DeletePopModal({
  isVisible,
  onClose,
  transparent = false,
  extraStyle = {},
  children,
}) {
  return (
    <ReactNativeModal
      style={{ margin: 10 }}
      backdropOpacity={transparent ? 0 : 0.5}
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}>
      <View style={styles.modalView}>
        <View style={styles.headerView}>
          <Image source={Icons.check} style={ImageStyle(24, 24)} />
          <Text
            style={[
              FontStyle(fontname.abeezee, 24, colors.neutral_900, '700'),
              { marginLeft: 8, flex: 1 },
            ]}>
            {'Delete page ?'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}>
            <Image
              source={Icons.close}
              style={[ImageStyle(23, 23), { tintColor: colors.neutral_500 }]}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>
          If you delete your page, all the post, chat and data associated with
          this page will be permanently erased and you will not be able to
          restore it later. Do you want to delete your page permanently ?
        </Text>

        <View style={[ApplicationStyles.row, { alignSelf: 'flex-end' }]}>
          <TouchableOpacity style={[styles.btnView, {}]} onPress={onClose}>
            <Text style={styles.btnText}>Yes</Text>
          </TouchableOpacity>
          <View style={{ width: SCREEN_WIDTH * 0.02 }} />
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={[styles.btnView, { backgroundColor: colors.neutral_250 }]}>
            <Text style={[styles.btnText, { color: colors.neutral_600 }]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: colors.white,
    paddingTop: 20,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  headerView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  headerText: {
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900),
    marginVertical: 20,
  },
  inputText: {
    backgroundColor: colors.secondary_700,
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 110,
    textAlignVertical: 'top',
    marginTop: 20,
  },
  inputText1: {
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingLeft: 12,
    paddingVertical: 6,
    // marginTop:12
  },
  labelText: {
    ...FontStyle(fontname.actor_regular, 15, colors.black),
    marginBottom: 4,
    marginTop: 20,
  },
  checkText: {
    ...FontStyle(fontname.actor_regular, 13, colors.neutral_900),
    flex: 1,
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    // width: '48%',
    paddingHorizontal: 30,
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 15, colors.white),
    paddingVertical: 12,
  },
});
