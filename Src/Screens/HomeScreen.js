import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import { fontname, wp } from '../Themes/Fonts';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import PostCard from '../Components/PostCard';
import CreatePost from '../Components/CreatePost';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { getalluserposts } from '../Services/PostServices';
import { dispatchAction } from '../utils/apiGlobal';
import { IS_LOADING, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS, SET_GLOBAL_SEARCH } from '../Redux/ActionTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../Components/NoDataFound';
import { getFollowerList } from '../Services/AuthServices';
import { getDiscussionCountry } from '../Services/DiscussionServices';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [tabType, setTabType] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('Activity');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const [createPostModal, setcreatePostModal] = useState(false);
  const navigation = useNavigation();
  const { allPost, allPostsCount, user } = useSelector(e => e.common);
  const isFocuse = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setpage] = useState(1);
  const [loading, setloading] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPostList(1);
    dispatch(getFollowerList({
      data: { userId: user?._id, search: '' }
    }))
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
    if (!allPost) dispatchAction(dispatch, IS_LOADING, true)
    dispatch(getDiscussionCountry({}))
  }, []);



  useEffect(() => {
    if (isFocuse) {
      getPostList(1)
    }
  }, [isFocuse]);

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
          dispatchAction(dispatch, SET_ACTIVE_POST, item)
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined)
          navigation.navigate(screenName.PostDetail)
        }}>
        <PostCard item={item} index={index} />
      </TouchableOpacity>
    );
  };

  const fetchMoreData = () => {
    if (allPost) {
      if (allPost.length < allPostsCount) {
        setloading(true);
        getPostList(page + 1);
      }
    }
  };

  const onPressBell = () => {
    navigation.navigate(screenName.NotificationScreen);
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}  >
        <Header
          title={'IndiansAbroad'}
          showRight={true}
          isHome={true}
          onRightPress={onPressBell}
          onClickPlus={() => setcreatePostModal(true)}
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
          <Text style={tabSelection == 'Activity' ? styles.selectedText : styles.unSewlectedText}>
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
          <Text style={tabSelection == 'Events' ? styles.selectedText : styles.unSewlectedText}>
            {'EVENTS'}
          </Text>
        </TouchableOpacity>
      </View>
      <SearchBar
        value={searchText}
        onChangeText={text => setSearchText(text)}
        placeholder={'Search users, posts, forums'}
        onPressIn={() => {
          dispatchAction(dispatch, SET_GLOBAL_SEARCH, undefined)
          navigation.navigate(screenName.SearchScreen)
        }}
      // containerStyles={{top:-14}}
      />
      <PagerView
        style={{ flex: 1, }}
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
          {allPost && <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={allPost}
            renderItem={renderItem}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() => {
              return (
                <View>
                  {(allPost && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                  <View style={{ height: 50 }} />
                </View>
              )
            }}
            ListEmptyComponent={<NoDataFound />}
          />}

        </View>
        <View key={'2'}>
          <FlatList data={[0, 1, 2, 3, 4]} renderItem={renderItem} />
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
  selectedText: FontStyle(
    fontname.actor_regular,
    14,
    colors.tertiary1_500,
    '700',
  ),
  unSewlectedText: FontStyle(
    fontname.actor_regular,
    14,
    colors.neutral_900,
    '700',
  ),
});
