import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import colors from '../Themes/Colors';
import { Icons } from '../Themes/Icons';
import { SCREEN_WIDTH, fontname, wp } from '../Themes/Fonts';
import { errorToast, FontStyle, ImageStyle, passwordCheck } from '../utils/commonFunction';
import Input from './Input';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { useDispatch, useSelector } from 'react-redux';
import { toastConfig } from '../App';
import Toast from 'react-native-toast-message';
import { onDeleteAccount } from '../Services/AuthServices';

export default function DeleteModal({
  isVisible,
  onClose,
  transparent = false,
  extraStyle = {},
  children,
}) {
  const [checkBox, setCheckBox] = useState(false);
  const { user } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const [message, setmessage] = useState('')
  const [password, setpassword] = useState('')

  useEffect(() => {
    setmessage('')
    setpassword('')
    setCheckBox(false)
  }, [])

  const onDelete = () => {
    if (message.trim() == '') {
      errorToast('Please enter reason for deletion')
    } else if (!passwordCheck(password)) {
      errorToast('Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    } else if (!checkBox) {
      errorToast('Please check acknowledge')
    } else {
      onClose()
      let obj = {
        data: {
          userId: user?._id,
          deletedBy: 'self',
          reason: message.trim(),
          password: password,
        }
      }
      setTimeout(() => {
        dispatch(onDeleteAccount(obj))
      }, 500);
    }
  }

  return (
    <ReactNativeModal
      backdropOpacity={0.5}
      isVisible={isVisible}
      style={{ margin: 0 }}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}>
      <View style={styles.container}>
        <Toast config={toastConfig} position="top" topOffset={0} />
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
            style={styles.inputText1}
            multiline={true}
            placeholderTextColor={colors.neutral_500}
            onChangeText={(text) => setmessage(text)}
          />
          <Text style={styles.labelText}>
            {'Please confirm your password to continue:'}
          </Text>
          <Input value={password} placeholder={'Type your passcode'} onChangeText={(text) => setpassword(text)} isPassword />
          <View style={[{ marginTop: 40, flexDirection: 'row' }]}>
            <TouchableOpacity onPress={() => setCheckBox(!checkBox)}>
              <Image
                source={checkBox ? Icons.checkbox1 : Icons.checkbox}
                style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]}
              />
            </TouchableOpacity>
            <Text style={styles.checkText}>
              {
                'I acknowledge that my personal data linked to my account will be permanently erased and cannot be retrieved. I accept that I will not receive a refund for any remaining duration of my IndiansAbroad premium membership that I have already paid for.'
              }
            </Text>
          </View>
          <View style={[ApplicationStyles.row, { alignSelf: 'center', marginTop: 40 }]}>
            <TouchableOpacity style={[styles.btnView, {}]} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <View style={{ width: SCREEN_WIDTH * 0.02, }} />
            <TouchableOpacity onPress={() => onDelete()}
              style={[styles.btnView, { backgroundColor: colors.danger_500, }]}>
              <Text style={styles.btnText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  modalView: {
    backgroundColor: colors.white,
    paddingTop: 20,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: wp(20),
  },
  headerView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  headerText: {
    ...FontStyle(14, colors.neutral_900),
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
    backgroundColor: colors.secondary_700,
    paddingVertical: 4,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 120,
    textAlignVertical: 'top',
    ...FontStyle(13, colors.neutral_900),
    // marginTop:12
  },
  labelText: {
    ...FontStyle(13, colors.black, '700'),
    marginBottom: 4,
    marginTop: 20,
  },
  checkText: {
    ...FontStyle(14, colors.neutral_900),
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
