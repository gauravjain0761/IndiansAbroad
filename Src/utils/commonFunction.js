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

export const ImageStyle = (width, height) => {
  return { width: width, height: height };
};
export const FontStyle = (fontFamily, size, color, fontWeight) => {
  return { ...defaultFontStyle(fontFamily, size, color, fontWeight) };
};
