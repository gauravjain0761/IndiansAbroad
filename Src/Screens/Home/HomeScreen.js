import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, Image, Platform, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { fontname, screen_width, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import PostCard from '../../Components/PostCard';
import CreatePost from '../../Components/CreatePost';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import { getalluserEvent, getalluserposts } from '../../Services/PostServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { IS_LOADING, SET_ACTIVE_EVENT, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS, SET_ALL_EVENTS, SET_GLOBAL_SEARCH, } from '../../Redux/ActionTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../Components/NoDataFound';
import { getFollowerList, onUpdateFbToken } from '../../Services/AuthServices';
import { getDiscussionCountry } from '../../Services/DiscussionServices';
import { io } from 'socket.io-client';
import EventDashboardCard from '../../Components/EventDashboardCard';
import { Icons } from '../../Themes/Icons';
import { socket, socketConnect } from '../../Socket/Socket';
import { onGetUnreadMsgCount } from '../../Services/ChatServices';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('Activity');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const [createPostModal, setcreatePostModal] = useState(false);
  const navigation = useNavigation();
  const { allPost, allPostsCount, user, allEvent, allEventCount, fcmToken } = useSelector(
    e => e.common,
  );
  const isFocuse = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setpage] = useState(1);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (isFocuse) { dispatch(onGetUnreadMsgCount({ data: { userId: user?._id } })); }
  }, [isFocuse]);

  useEffect(() => {
    socketConnect(dispatch, flag => {
      if (flag) {
        /**
         * Client server socket connection true so
         */
      } else {
        /**
         * Client server socket connection fail so
         * TODO: Refresh popup code Goes here
         */
      }
    });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData()
    dispatch(getFollowerList({ data: { userId: user?._id, search: '' }, }),);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getPostList = page => {
    let obj = {
      data: {
        createdBy: user?._id,
        page: page,
        limit: 0,
      },
      onSuccess: () => {
        setpage(page);
        setloading(false);
      },
    };
    dispatch(getalluserposts(obj));
  };

  useEffect(() => {
    if (!allPost) dispatchAction(dispatch, IS_LOADING, true);
    if (!allEvent) dispatchAction(dispatch, IS_LOADING, true);
    dispatch(getDiscussionCountry({}));
    console.log('fcmToken---', fcmToken)
    if (fcmToken) {
      dispatch(onUpdateFbToken({ data: { userId: user?._id, firebaseToken: fcmToken } }))
    }
    dispatch(getFollowerList({ data: { userId: user?._id, search: '' }, }),);
  }, []);

  const getData = () => {
    if (tabSelection == 'Activity') {
      getPostList(1);
    } else {
      getEventList(1);
    }
  };
  const getEventList = page => {
    let obj = {
      page: page,
      data: {
        approve_status: 'All',
        expiry_status: 'All',
      },
      onSuccess: () => {
        setpage(page);
        setloading(false);
      },
    };
    dispatch(getalluserEvent(obj));
  };
  useEffect(() => {
    getData();
  }, [tabSelection]);

  useEffect(() => {
    Animated.timing(buttonTranslateX, {
      toValue: isLeftButtonActive ? 0 : Dimensions.get('screen').width * 0.5,
      duration: 400,
    }).start();
  }, [isLeftButtonActive]);
  const ref = React.createRef(PagerView);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          dispatchAction(dispatch, SET_ACTIVE_POST, item);
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          navigation.navigate(screenName.PostDetail);
        }}>
        <PostCard item={item} index={index} />
      </TouchableOpacity>
    );
  };

  const renderEventItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          dispatchAction(dispatch, SET_ACTIVE_EVENT, item);
          // dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          navigation.navigate(screenName.EventDetailScreen);
        }}>
        <EventDashboardCard item={item} index={index} />
      </TouchableOpacity>
    );
  };
  const fetchMoreData = () => {
    if (tabSelection == 'Activity') {
      if (allPost) {
        if (allPost.length < allPostsCount) {
          setloading(true);
          getPostList(page + 1);
        }
      }
    } else {
      if (allEvent) {
        if (allEvent?.length < allEventCount) {
          setloading(true);
          getEventList(page + 1);
        }
      }
    }
  };

  const onPressBell = () => {
    navigation.navigate(screenName.NotificationScreen);
  };

  const onCreateEvent = () => {
    navigation.navigate(screenName.CreateEvent1);
  };
  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}>
        <Header
          title={'IndiansAbroad'}
          showRight={true}
          isHome={true}
          onRightPress={onPressBell}
          onClickPlus={() => setcreatePostModal(true)}
          showPlus={tabSelection == 'Activity'}
        />
      </SafeAreaView>

      <View style={styles.tabMainView}>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('Activity');
            setIsLeftButtonActive(true);
            ref.current?.setPage(0);
          }}
          style={styles.tabItemView}>
          <Text
            style={
              tabSelection == 'Activity'
                ? styles.selectedText
                : styles.unSewlectedText
            }>
            {'ACTIVITY'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('Events');
            ref.current?.setPage(1);
            setIsLeftButtonActive(false);
          }}
          style={styles.tabItemView}>
          <Text
            style={
              tabSelection == 'Events'
                ? styles.selectedText
                : styles.unSewlectedText
            }>
            {'EVENTS'}
          </Text>
        </TouchableOpacity>
      </View>

      <PagerView
        style={{ flex: 1 }}
        initialPage={tabSelectionIndex}
        ref={ref}
        onPageSelected={e => {
          setTabSelection(
            e?.nativeEvent?.position == 0 ? 'Activity' : 'Events',
          );
          setTabSelectionIndex(e?.nativeEvent?.position);
          setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
        }}>
        <View key={'1'}>
          <SearchBar
            value={searchText}
            onChangeText={text => setSearchText(text)}
            placeholder={'Search users, posts, forums'}
            onPressIn={() => {
              dispatchAction(dispatch, SET_GLOBAL_SEARCH, undefined);
              navigation.navigate(screenName.SearchScreen);
            }}
          // containerStyles={{top:-14}}
          />
          {allPost && (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={allPost}
              renderItem={renderItem}
              onEndReached={fetchMoreData}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => {
                return (
                  <View>
                    {allPost && loading && (
                      <ActivityIndicator size={'large'} color={colors.black} />
                    )}
                    <View style={{ height: 50 }} />
                  </View>
                );
              }}
              ListEmptyComponent={<NoDataFound />}
            />
          )}
        </View>
        <View key={'2'} style={{ flex: 1 }}>
          <View style={styles.rowSearchView}>
            <TouchableOpacity
              onPress={() => navigation.navigate(screenName.SavedEvents)}>
              <Image style={styles.iconSearch} source={Icons.favorite} />
            </TouchableOpacity>
            <SearchBar
              value={searchText}
              onChangeText={text => setSearchText(text)}
              placeholder={'Search Events By Name, Location'}
              onPressIn={() => {
                dispatchAction(dispatch, SET_GLOBAL_SEARCH, undefined);
                navigation.navigate(screenName.SearchScreen);
              }}
              inputViewStyle={{ width: screen_width * 0.635 }}
            // containerStyles={{ flex: 1, paddingHorizontal: 0 }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate(screenName.EventDashboard)}>
              <Image style={styles.iconSearch} source={Icons.calender} />
            </TouchableOpacity>
          </View>
          {allEvent && (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={allEvent}
              renderItem={renderEventItem}
              onEndReached={fetchMoreData}
              onEndReachedThreshold={0.3}
              ListFooterComponent={() => {
                return (
                  <View>
                    {allEvent && loading && (
                      <ActivityIndicator size={'large'} color={colors.black} />
                    )}
                    <View style={{ height: 50 }} />
                  </View>
                );
              }}
              ListEmptyComponent={<NoDataFound />}
            />
          )}
          <TouchableOpacity
            onPress={() => onCreateEvent()}
            style={{
              position: 'absolute',
              bottom: wp(20) + (Platform.OS == 'ios' ? 0 : 10),
              right: wp(20),
              backgroundColor: colors.white,
              borderRadius: 50,
              padding: 2,
            }}>
            <Image
              source={Icons.plusPost}
              style={[ImageStyle(46, 46), { tintColor: '#5278D9FF' }]}
            />
          </TouchableOpacity>
        </View>
      </PagerView>
      <CreatePost
        createPostModal={createPostModal}
        setcreatePostModal={setcreatePostModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
    // top: -8,
    // alignSelf:'center'
    justifyContent: 'space-around',
  },
  tabItemView: {
    // flex: 1,
    paddingBottom: wp(14),
    paddingHorizontal: wp(14),
    borderRadius: 50,
    alignItems: 'center',
  },
  selectedText: FontStyle(14, colors.tertiary1_500, '700'),
  unSewlectedText: FontStyle(14, colors.neutral_900, '700'),
  rowSearchView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary_500,
  },
  iconSearch: {
    height: 23,
    width: 23,
    resizeMode: 'contain',
    margin: 8,
  },
});
