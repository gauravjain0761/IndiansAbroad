import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import {SCREEN_WIDTH, fontname, hp, wp} from '../Themes/Fonts';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import {useNavigation} from '@react-navigation/native';
import {screenName} from '../Navigation/ScreenConstants';
import RenderUserIcon from '../Components/RenderUserIcon';
import {Icons} from '../Themes/Icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateGroup() {
  const {navigate, goBack} = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('INDIANS');
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState(false);

  useEffect(() => {
    dispatch({type: 'PRE_LOADER', payload: {preLoader: true}});
  }, []);

  const renderItem = () => {
    return (
      <View style={[ApplicationStyles.row, {paddingHorizontal: wp(20)}]}>
        <View style={[ApplicationStyles.row, styles.listView]}>
          <RenderUserIcon height={48} />
          <Text style={styles.listText}>Pratik Katkar</Text>
        </View>
        <TouchableOpacity onPress={() => setCheckBox(!checkBox)}>
          <Image
            source={checkBox ? Icons.checkbox1 : Icons.checkbox}
            style={[ImageStyle(20, 20), {top: 1, marginRight: 6}]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        showLeft={true}
        showRight={false}
        onLeftPress={() => goBack()}
      />

      <Text style={styles.chatText}>Create Group</Text>
      <View
        style={{
          marginHorizontal: wp(16),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={styles.addImage}>
          <Image source={Icons.addImage1} style={styles.addImage1} />
        </TouchableOpacity>
        <TextInput placeholder={'Group Name'} style={styles.inputText} />
      </View>
      <TextInput
        placeholder={'Description of group'}
        style={styles.inputText1}
      />

      <Text style={styles.searchText}>Add Group Member</Text>
      <SearchBar
        value={searchText}
        onChangeText={text => setSearchText(text)}
        placeholder={'Search here'}
        containerStyles={{backgroundColor: colors.white, marginHorizontal: 8}}
      />
      <View style={{paddingHorizontal: 0, marginTop: 8, flex: 1}}>
        <FlatList
          data={[1, 2, 1, 2, 3, 4, 5, 6]}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          // style={{flex: 1}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatText: {
    top: -19,
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 16, colors.neutral_900, '400'),
  },
  searchText: {
    marginHorizontal: wp(22),
    ...FontStyle(fontname.actor_regular, 13, colors.neutral_900, '400'),
  },
  addImage1: {
    width: 24,
    height: 24,
  },
  addImage: {
    borderWidth: 1,
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 68,
    backgroundColor: colors.neutral_300,
    borderStyle: 'dashed',
    borderColor: colors.neutral_500,
  },
  inputText: {
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    borderRadius: 5,
    paddingLeft: 12,
    // paddingVertical: 10,
    // marginTop:12,
    width: SCREEN_WIDTH * 0.65,
    marginLeft: 20,
    height: 55,
  },
  inputText1: {
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900),
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    borderRadius: 5,
    paddingLeft: 12,
    // paddingVertical: 10,
    marginVertical: 20,
    marginHorizontal: wp(20),
  },
  tabMainView: {
    flexDirection: 'row',
  },
  tabItemView: {
    flex: 1,
    padding: wp(15),
    borderRadius: 50,
    alignItems: 'center',
  },
  listText: {
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
    marginLeft: 15,
  },
  listView: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: colors.neutral_400,
    // backgroundColor: colors.inputBg,
    flex: 1,
  },
  lineStyle: {
    borderWidth: 0.6,
    marginVertical: 6,
    borderColor: colors.secondary_500,
  },
});
