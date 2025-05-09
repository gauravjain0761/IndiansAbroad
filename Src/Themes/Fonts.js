export function getFontType(fontWeight) {
  if (fontWeight == '400') {
    return 'OpenSans-Regular';
  } else if (fontWeight == '300') {
    return 'OpenSans-Light';
  } else if (fontWeight == '500') {
    return 'OpenSans-Medium';
  } else if (fontWeight == '600') {
    return 'OpenSans-SemiBold';
  } else if (fontWeight == '700') {
    return 'OpenSans-Bold';
  } else {
    return 'OpenSans-Regular';
  }
}

export function defaultFontStyle(fontSize, color, fontWeight) {
  return {
    fontFamily: getFontType(fontWeight),
    fontSize: fontSize + 1,
    color: color,
    includeFontPadding: false
  };
}

import { Dimensions, Platform, PixelRatio } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

export const screen_width = SCREEN_WIDTH;
export const screen_Height = SCREEN_HEIGHT

Dimensions.get('window');

export const hp = (i) => {
  return heightPercentageToDP((i * 100) / SCREEN_HEIGHT);
};

export const wp = (i) => {
  return widthPercentageToDP((i * 100) / SCREEN_WIDTH);
};


export function actuatedNormalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 3;
  }
}