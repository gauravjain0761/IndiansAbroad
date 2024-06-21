import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import {useNavigation} from '@react-navigation/native';
import colors from '../Themes/Colors';
import {Icons} from '../Themes/Icons';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import {SCREEN_WIDTH, fontname, wp} from '../Themes/Fonts';
import SearchBar from '../Components/SearchBar';
import PostCard from '../Components/PostCard';
import DiscussionForumCard from '../Components/DiscussionForumCard';
import { screenName } from '../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiscussionForum() {
  const {navigate, goBack} = useNavigation();
  const [selectTab, setSelectTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation()


  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate(screenName.DiscussionForumDetail)}>
        <DiscussionForumCard item={item} index={index} />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={'Discussion Forum'}
        logoShow={false}
        titleStyle={{color: colors.primary_6a7e}}
        showLeft={true}
        onLeftPress={() => {
          goBack();
        }}
      />
      <View
        style={[
          ApplicationStyles.row,
          {marginHorizontal: wp(16), justifyContent: 'space-between', top: -8},
        ]}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => setSelectTab(0)}
            style={[
              styles.btnStyle,
              {
                backgroundColor:
                  selectTab == 0 ? colors.white : colors.primary_6a7e,
              },
            ]}>
            <Text
              style={[
                styles.btnText,
                {
                  color: selectTab == 0 ? colors.primary_4574ca : colors.white,
                },
              ]}>
              Local
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectTab(1)}
            style={[
              styles.btnStyle,
              {
                backgroundColor:
                  selectTab == 1 ? colors.white : colors.primary_6a7e,
              },
            ]}>
            <Text
              style={[
                styles.btnText,
                {
                  color: selectTab == 1 ? colors.primary_4574ca : colors.white,
                },
              ]}>
              World Wide
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>navigate(screenName.CreateDiscussion)}>
          <Image source={Icons.penEdit} style={ImageStyle(30, 30)} />
        </TouchableOpacity>
      </View>
      <SearchBar
        value={searchText}
        onChangeText={text => setSearchText(text)}
        placeholder={'Search Threads'}
        containerStyles={{marginTop: 5,}}
      />
       <FlatList
            data={[0, 1, 2, 3, 4]}
            renderItem={renderItem}
          />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary_6a7e,
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
  btnText: {
    ...FontStyle(fontname.actor_regular, 14, colors.primary_6a7e),
  },
});
