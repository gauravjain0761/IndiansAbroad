import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../Themes/Colors';
import {
  screen_Height,
  SCREEN_HEIGHT,
  screen_width,
  SCREEN_WIDTH,
  wp,
} from '../Themes/Fonts';
import ReactNativeModal from 'react-native-modal';
import { Icons } from '../Themes/Icons';
import { api } from '../utils/apiConstants';

const ImageModalShow = ({ modalVisible, onClose, url }) => {
  let isUrl = url !== undefined && url !== '';
  console.log(url)
  return (
    <ReactNativeModal
      backdropOpacity={0.5}
      isVisible={modalVisible}
      style={{ margin: 0, backgroundColor: colors.white }}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeView} onPress={onClose}>
          <Image source={Icons.close} style={styles.closeStyle} />
        </TouchableOpacity>
        <View style={styles.modalView}>
          <Image
            source={
              isUrl
                ? { uri: api.IMAGE_URL + url }
                : Icons.logo
            }
            style={styles.imageStyle}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default ImageModalShow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  imageStyle: {
    width: screen_width,
    height: screen_Height * 0.8,
    resizeMode: 'contain'
  },
  closeStyle: {
    width: 24,
    height: 24,
  },
  closeView: {
    alignSelf: 'flex-end',
    marginRight: 20,
  }
});
