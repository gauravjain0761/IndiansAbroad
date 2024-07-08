import Toast from 'react-native-toast-message';
import { icons } from '../theme/icons';
import { defaultFontStyle } from '../Themes/Fonts';

export const infoToast = message => {
  Toast.show({ type: 'info', text1: message });
};
export const errorToast = message => {
  Toast.show({ type: 'error', text1: message });
};

export const otpToast = message => {
  Toast.show({ type: 'otp_success', text1: message });
};

export const successToast = message => {
  Toast.show({ type: 'success', text1: message });
};

export const ImageStyle = (width, height, resizemode) => {
  return { width: width, height: height, resizeMode: resizemode ? resizemode : 'contain' };
};

export const FontStyle = (size, color, fontWeight) => {
  return { ...defaultFontStyle(size, color, fontWeight) };
};


export const emailCheck = (email: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true;
  }
};

export const nameCheck = (name: string) => {
  let reg = /^([a-zA-Z ]){2,30}$/;
  if (reg.test(name) === false) {
    return false;
  } else {
    return true;
  }
};

export const passwordCheck = (string: string) => {
  let reg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
  return reg.test(string);
};

export const mobileNumberCheck = (mobileNo: string) => {
  let reg = /^\d*$/
  return reg.test(mobileNo);
}