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
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { fontname, SCREEN_HEIGHT, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import PostCard from '../../Components/PostCard';
import CreatePost from '../../Components/CreatePost';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import { getalluserposts, getSaveListAction } from '../../Services/PostServices';
import { dispatchAction } from '../../utils/apiGlobal';
import {
  IS_LOADING,
  SET_ACTIVE_EVENT,
  SET_ACTIVE_POST,
  SET_ACTIVE_POST_COMMENTS,
  SET_ALL_EVENTS,
  SET_GLOBAL_SEARCH,
} from '../../Redux/ActionTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataFound from '../../Components/NoDataFound';
import { getDiscussionCountry } from '../../Services/DiscussionServices';
import { io } from 'socket.io-client';
import EventDashboardCard from '../../Components/EventDashboardCard';
import { Icons } from '../../Themes/Icons';
import RenderEventTicket from '../../Components/RenderEventTicket';

export default function SavedEvents() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('saved');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const [createPostModal, setcreatePostModal] = useState(false);
  const navigation = useNavigation();
  const { allSave, allSaveCount, allPost, allPostsCount, user } = useSelector(
    e => e.common,
  );
  const isFocuse = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setpage] = useState(1);
  const [loading, setloading] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
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
    dispatch(getSaveListAction(obj));
  };

  const getData = () => {
    if (tabSelection == 'saved') {
      getPostList(1);
    } else {
    }
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

  const renderEventItem = ({ item, index }) => {
    console.log('item',item);
    
    if (item?.is_Saved) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            dispatchAction(dispatch, SET_ACTIVE_EVENT, item);
            // dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
            navigation.navigate(screenName.EventDetailScreen);
          }}>
          <EventDashboardCard
            item={item}
            index={index}
            onRefresh={() => {
              getPostList(1);
            }}
          />
        </TouchableOpacity>
      );
    }
  };

  const renderBookedTicketsItem = ({ item, index }) => {
    return <RenderEventTicket />;
  };



  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}>
        <Header title={'IndiansAbroad'} showLeft />
      </SafeAreaView>
      <View style={styles.tabMainView}>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('saved');
            setIsLeftButtonActive(true);
            ref.current?.setPage(0);
          }}
          style={styles.tabItemView}>
          <Text
            style={
              tabSelection == 'saved'
                ? styles.selectedText
                : styles.unSewlectedText
            }>
            {'Saved'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('participating');
            ref.current?.setPage(1);
            setIsLeftButtonActive(false);
          }}
          style={styles.tabItemView}>
          <Text
            style={
              tabSelection == 'participating'
                ? styles.selectedText
                : styles.unSewlectedText
            }>
            {'Participating'}
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.animationView,
            {
              left: tabSelection == 'saved' ? 0 : 0,
              transform: [{ translateX: buttonTranslateX }],
              width: SCREEN_WIDTH / 2,
              borderWidth: 0.9,
              borderColor: colors.primary_4574ca,
            },
          ]}
        />
      </View>
      <PagerView
        style={{ flex: 1 }}
        initialPage={tabSelectionIndex}
        ref={ref}
        onPageSelected={e => {
          setTabSelection(
            e?.nativeEvent?.position == 0 ? 'saved' : 'participating',
          );
          setTabSelectionIndex(e?.nativeEvent?.position);
          setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
        }}>
        <View key={'1'} style={{ flex: 1 }}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={allSave?.favoriteEvents}
            renderItem={renderEventItem}
            contentContainerStyle={{ flex: allSave?.favoriteEvents?.length !== 0 ? 0 : 1 }}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              <NoDataFound
                containerStyle={{
                  top: SCREEN_HEIGHT * 0.22,
                }}
                text={'Your saved events will appear here.'}
              />
            }
          />
        </View>
        <View key={'2'} style={{ flex: 1 }}>

          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={allSave?.bookedTickets}
            renderItem={renderBookedTicketsItem}
            contentContainerStyle={{ flex: allSave?.bookedTickets?.length !== 0 ? 0 : 1 }}
            onEndReachedThreshold={0.3}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <NoDataFound
                containerStyle={{
                  top: SCREEN_HEIGHT * 0.22,
                }}
                text={'Your Event tickets will appear here once you sign up for any events.'}
              />
            }
          />
          {/* <View style={{height: 50}} /> */}
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
    marginBottom: 3,
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
  animationView: {
    borderColor: colors.primary_500,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
