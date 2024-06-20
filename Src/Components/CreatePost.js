import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import {fontname, hp, wp} from '../Themes/Fonts';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import PostCard from '../Components/PostCard';
import ModalContainer from '../Components/ModalContainer';
import {Icons} from '../Themes/Icons';

export default function CreatePost({createPostModal, setcreatePostModal}) {
  const [postText, setpostText] = useState('');
  return (
    <ModalContainer
      isVisible={createPostModal}
      onClose={() => setcreatePostModal(false)}
      transparent>
      <View style={styles.modalView}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: wp(20),
            paddingTop: 28,
          }}>
          <TouchableOpacity
            onPress={() => setcreatePostModal(false)}
            style={styles.backView}>
            <Image source={Icons.left_arrow} style={ImageStyle(15, 15)} />
          </TouchableOpacity>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Create Post</Text>
          </View>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            onChangeText={text => setpostText(text)}
            value={postText}
            style={styles.input}
            placeholder="Write Here"
            multiline={true}
            placeholderTextColor={colors.neutral_500}
          />
          <View style={styles.rowView}>
            <TouchableOpacity style={styles.button}>
              <Image source={Icons.photoUpload} style={styles.photoUpload} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image
                source={Icons.videoUpload}
                style={[
                  styles.photoUpload,
                  {bottom: 5.5, height: 34, width: 40},
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setcreatePostModal(false)}
          style={styles.blueButton}>
          <Text style={styles.publishText}>Publish</Text>
        </TouchableOpacity>
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  title: {
    ...FontStyle(fontname.abeezee, 18, colors.neutral_900, '400'),
    right: 18,
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: colors.inputBg,
  },
  backView: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderColor: colors.primary_500,
    backgroundColor: colors.btnBg,
  },
  inputBox: {
    backgroundColor: colors.white,
    borderRadius: 4,
    marginHorizontal: wp(14),
    marginBottom: 30,
    marginTop: 30,
    elevation: 1,
  },
  input: {
    height: 170,
    textAlignVertical: 'top',
    padding: 15,
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_500),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  photoUpload: {
    height: 45,
    width: 40,
    resizeMode: 'stretch',
  },
  publishText: {
    ...FontStyle(fontname.actor_regular, 14, colors.white),
  },
  blueButton: {
    backgroundColor: colors.buttonBlue,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    width: 87,
    alignItems: 'center',
    borderRadius: 4,
  },
});
