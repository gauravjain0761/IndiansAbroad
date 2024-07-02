import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import { useNavigation } from '@react-navigation/native';
import colors from '../Themes/Colors';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import { SCREEN_WIDTH, fontname, wp } from '../Themes/Fonts';
import SearchBar from '../Components/SearchBar';
import PostCard from '../Components/PostCard';
import DiscussionForumCard from '../Components/DiscussionForumCard';
import { screenName } from '../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateDiscussion() {
  const { navigate, goBack } = useNavigation();
  const [selectTab, setSelectTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const [postText, setpostText] = useState('');

  return (
    <SafeAreaView
      style={[
        ApplicationStyles.applicationView,
        { backgroundColor: colors.secondary_500 },
      ]}>
      <Header
        title={''}
        logoShow={false}
        titleStyle={{ color: colors.primary_6a7e }}
        showLeft={true}
        onLeftPress={() => {
          goBack();
        }}
      />
      <Text style={styles.startText}>Start writing</Text>
      <Text style={styles.startText1}>
        Your thread will be posted in the World Wide discussion forum
      </Text>
      <TextInput
        onChangeText={text => setpostText(text)}
        value={postText}
        style={styles.inputTitle}
        placeholder="Title"
        placeholderTextColor={colors.neutral_500}
      />
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
        </View>
      </View>
      <TouchableOpacity onPress={() => { }} style={styles.blueButton}>
        <Text style={styles.publishText}>Publish</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary_8091ba,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 5,
  },
  btnStyle: {
    width: SCREEN_WIDTH * 0.24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 2,
  },
  startText: {
    top: -12,
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900, '700'),
  },
  startText1: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 15, colors.primary_4574ca, '400'),
  },
  inputBox: {
    backgroundColor: colors.white,
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 5,
    borderWidth: 1
  },
  input: {
    height: 160,
    textAlignVertical: 'top',
    padding: 15,
    paddingLeft: 20,
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_500),
  },
  inputTitle: {
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_500),
    backgroundColor: colors.white,
    marginHorizontal: wp(20),
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    paddingLeft: 20,
    height: 47
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  photoUpload: {
    height: 26,
    width: 26,
    resizeMode: 'contain',
  },
  publishText: {
    ...FontStyle(fontname.actor_regular, 14, colors.white),
  },
  blueButton: {
    backgroundColor: colors.buttonBlue,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    padding: 8,
    width: 87,
    alignItems: 'center',
    borderRadius: 4,
  },
});
