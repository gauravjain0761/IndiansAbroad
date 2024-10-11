import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import colors from '../../Themes/Colors';
import { Icons } from '../../Themes/Icons';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import { SCREEN_WIDTH, fontname, wp } from '../../Themes/Fonts';
import SearchBar from '../../Components/SearchBar';
import PostCard from '../../Components/PostCard';
import DiscussionForumCard from '../../Components/DiscussionForumCard';
import { screenName } from '../../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getDiscussionCountry, getThreadList, onGetThreadList } from '../../Services/DiscussionServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS, UPDATE_COUNTRY_DISCUSSION_LIST } from '../../Redux/ActionTypes';
import NoDataFound from '../../Components/NoDataFound';

export default function DiscussionForum() {
  const { navigate, goBack } = useNavigation();
  const [selectTab, setSelectTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const [refreshing, setRefreshing] = React.useState(false);
  const { discussionCountry, threadList, user } = useSelector(e => e.common)
  useEffect(() => {
    dispatch(getDiscussionCountry({}))
  }, [])
  useEffect(() => {
    if (isFocused && discussionCountry) {
      let temp = discussionCountry.filter(obj => obj.isSelected)
      getThreadsList(temp[0]?._id, searchText)
    }
  }, [discussionCountry, searchText, isFocused])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (discussionCountry) {
      let temp = discussionCountry?.filter(obj => obj.isSelected)
      getThreadsList(temp[0]?._id)
    }
    else {
      setRefreshing(false)
    }
  }, []);

  const getThreadsList = (id, search) => {
    // setRefreshing(false);
    let obj = {
      data: {
        page: 0,
        searchText: search ? search : '',
        countryId: id,
        userId: user?._id
      },
      onSuccess: () => {
        setRefreshing(false);
      },
      onFailure: () => {
        setRefreshing(false)
      }
    }
    dispatch(onGetThreadList(obj))
  }

  console.log(refreshing)

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => {
        dispatchAction(dispatch, SET_ACTIVE_POST, item);
        dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
        navigation.navigate(screenName.DiscussionForumDetail)
      }}>
        <DiscussionForumCard item={item} index={index} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}  >
        <Header title={'Discussion Forum'} logoShow={false} titleStyle={{ color: colors.primary_6a7e }} showLeft={true} onLeftPress={() => { goBack(); }} />
      </SafeAreaView>
      <View
        style={[
          ApplicationStyles.row,
          { marginHorizontal: wp(16), justifyContent: 'space-between', marginBottom: 5 },
        ]}>
        <View style={styles.topHeader}>
          {discussionCountry && discussionCountry?.map((item, index) => {
            return (
              <TouchableOpacity onPress={() => { dispatchAction(dispatch, UPDATE_COUNTRY_DISCUSSION_LIST, item._id) }} style={[styles.btnStyle, { backgroundColor: item?.isSelected ? colors.white : colors.primary_6a7e, },]}>
                <Text style={[styles.btnText, { color: item?.isSelected ? colors.primary_4574ca : colors.white, },]}>
                  {item.countryName !== 'World Wide' ? 'Local' : item.countryName}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity onPress={() => navigate(screenName.CreateDiscussion)}>
          <Image source={Icons.penEdit} style={ImageStyle(30, 30)} />
        </TouchableOpacity>
      </View>
      <SearchBar
        value={searchText}
        onChangeText={text => setSearchText(text)}
        placeholder={'Search Threads'}
        containerStyles={{ marginTop: 5, }}
      />
      {threadList && <FlatList
        data={threadList}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() => {
          return (
            <View>
              <View style={{ height: 50 }} />
            </View>
          );
        }}
        style={{ flex: 1 }}
        ListEmptyComponent={<NoDataFound />}
      />}
    </View>
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
    ...FontStyle(14, colors.primary_6a7e),
  },
});
