export function getFontType(fontWeight) {
  if (fontWeight == fontname.abeezeeItalic) {
    return 'ABeeZee-Italic';
  } else if (fontWeight == fontname.abeezee) {
    return 'ABeeZee-Regular';
  } else if (fontWeight == fontname.actor_regular) {
    return 'Actor-Regular';
  } else {
    return 'Actor-Regular';
  }
}

export const fontname = {
  actor_regular: 'Actor-Regular',
  abeezee: 'AbeeZee-Regular',
  abeezeeItalic: 'AbeeZee-Italic',
}

export function defaultFontStyle(fontName, fontSize, color, fontWeight) {
  return {
    fontFamily: fontName,
    fontSize: fontSize + 1,
    color: color,
    fontWeight: fontWeight,
  };
}

import { Dimensions, Platform, PixelRatio } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// based on iphone 5s's scale
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