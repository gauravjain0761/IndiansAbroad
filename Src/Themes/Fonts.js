export function getFontType(fontWeight) {
  if (fontWeight == '600') {
    return 'SFUIText-Semibold';
  } else if (fontWeight == 'normal') {
    return 'SFUIText-Regular';
  } else if (fontWeight == 'bold') {
    return 'SFUIText-Bold';
  } else if (fontWeight == '300') {
    return 'SFUIText-Light';
  } else if (fontWeight == '900') {
    return 'SFUIText-Heavy';
  } else if (fontWeight == '500') {
    return 'SFUIText-Medium';
  } else if (fontWeight == 'italicMedium') {
    return 'SFUIText-MediumItalic';
  } else if (fontWeight == 'italicHeavy') {
    return 'SFUIText-HeavyItalic';
  } else {
    return 'SFUIText-Regular';
  }
}

export function getFontSize(fontSize) {
  if (fontSize == '16px') {
    return actuatedNormalize(14);
  } else if (fontSize == '14px') {
    return actuatedNormalize(12);
  } else if (fontSize == '13px') {
    return actuatedNormalize(11);
  } else if (fontSize == '12px') {
    return actuatedNormalize(10);
  } else if (fontSize == '10px') {
    return actuatedNormalize(8);
  } else if (fontSize == '20px') {
    return actuatedNormalize(18);
  } else {
    return fontSize;
  }
}
export function defaultFontStyle(fontWeight, fontSize, color) {
  return {
    fontFamily: getFontType(fontWeight),
    fontSize: getFontSize(fontSize),
    color: color,
  };
}

import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function actuatedNormalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
