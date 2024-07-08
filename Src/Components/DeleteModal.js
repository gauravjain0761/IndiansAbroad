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

export default function DeleteModal({
  isVisible,
  onClose,
  transparent = false,
  extraStyle = {},
  children,
}) {
  const [checkBox, setCheckBox] = useState(false);
  return (
    <ReactNativeModal
      backdropOpacity={transparent ? 0 : 0.5}
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}>
      <View style={styles.modalView}>
        <View style={styles.headerView}>
          <Image source={Icons.logo} style={ImageStyle(23, 23)} />
          <Text
            style={[
              FontStyle(16, colors.neutral_900, '700'),
              { marginLeft: 8, textAlign: 'center' },
            ]}>
            {'IndiansAbroad'}
          </Text>
        </View>
        <Text style={styles.headerText}>
          You will be missed by IndiansAbroad community. Please specify the
          reason you want to leave us.
        </Text>
        <TextInput
          placeholder={
            'Write your reason here. This will help us to\nimprove the platform.'
          }
          style={styles.inputText}
          multiline={false}
          placeholderTextColor={colors.neutral_400}

        />
        <Text style={styles.labelText}>
          {'Please confirm your password to continue:'}
        </Text>
        <TextInput
          placeholder={'Type your password'}
          style={styles.inputText1}
          placeholderTextColor={colors.neutral_400}
        // value={}
        // onChangeText={onChangeText}
        />
        <View style={[{ marginTop: 40, flexDirection: 'row' }]}>
          <TouchableOpacity onPress={() => setCheckBox(!checkBox)}>
            <Image
              source={checkBox ? Icons.checkbox1 : Icons.checkbox}
              style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]}
            />
          </TouchableOpacity>
          <Text style={styles.checkText}>
            {
              'I acknowledge that my personal data linked to my account will be permanently erased and cannot be retrieved. I accept that i will not receive a refund for any remaining duration of my IndiansAbroad premium membership that I have already paid for.'
            }
          </Text>
        </View>
        <View style={[ApplicationStyles.row, { alignSelf: 'center', marginTop: 40 }]}>
          <TouchableOpacity style={[styles.btnView, {}]} onPress={onClose}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <View style={{ width: SCREEN_WIDTH * 0.02, }} />
          <TouchableOpacity
            style={[styles.btnView, { backgroundColor: colors.danger_500, }]}>
            <Text style={styles.btnText}>Confirm Deletion</Text>
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
  },
  headerText: {
    ...FontStyle(15, colors.neutral_900),
    marginVertical: 20,
  },
  inputText: {
    backgroundColor: colors.secondary_700,
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 110,
    textAlignVertical: 'top',
    marginTop: 20
  },
  inputText1: {
    ...FontStyle(15, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    borderRadius: 5,
    paddingLeft: 12,
    paddingVertical: 6,
    height: 56
    // marginTop:12
  },
  labelText: {
    ...FontStyle(15, colors.black),
    marginBottom: 4,
    marginTop: 20,
  },
  checkText: {
    ...FontStyle(13, colors.neutral_900),
    flex: 1,
    textAlign: 'justify'
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    width: '48%',
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(15, colors.white),
    paddingVertical: 12,
  },
});
