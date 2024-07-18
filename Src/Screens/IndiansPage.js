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
  RefreshControl,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../Themes/Fonts';
import { FontStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getallIndianUser,
  getallPagesUser,
  getalluserposts,
} from '../Services/PostServices';
import NoDataFound from '../Components/NoDataFound';

export default function IndiansPage() {
  const { navigate } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchTextPost, setSearchTextPost] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('INDIANS');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const { user, allIndian, allPages } = useSelector(e => e.common);
  const [allIndianList, setallIndianList] = useState(undefined)
  const isFocuse = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [pagesRefreshing, setPagesRefreshing] = React.useState(false);
  useEffect(() => {
    Animated.timing(buttonTranslateX, {
      toValue: isLeftButtonActive ? 0 : Dimensions.get('screen').width * 0.5,
      duration: 400,
    }).start();
  }, [isLeftButtonActive]);
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);

  useEffect(() => {
    if (allIndian && searchText == '') {
      let temp = allIndian?.filter(obj => obj?.isFollowing == 0 && obj?.isFollowingRequested == 0)
      setallIndianList(temp)
    } else {
      setallIndianList(allIndian)
    }
  }, [allIndian])


  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getIndianList(1);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onRefreshPages = React.useCallback(() => {
    setPagesRefreshing(true);
    getPagesList(1);
    setTimeout(() => {
      setPagesRefreshing(false);
    }, 2000);
  }, []);

  const getIndianList = page => {
    let obj = {
      data: {
        emails: [], //"dev.abhiharshe23@gmail.com"
        search: '',
        userId: user?._id,
        page: page,
        limit: 0,
      },
    };
    dispatch(getallIndianUser(obj));
  };
  const getPagesList = page => {
    let obj = {
      params: {
        page: page,
        userId: user?._id,
        searchText: '',
      },
    };
    dispatch(getallPagesUser(obj));
  };

  useEffect(() => {
    if (isFocuse) {
      setSearchText('')
      setSearchTextPost('')
      getIndianList(1);
      getPagesList(1);
    }
  }, [isFocuse]);

  const onOpenOtherUserDetail = (id) => {
    navigate(screenName.indiansDetails, { userId: id })
  }

  const RenderIndians = ({ data }) => {
    return (
      <FlatList
        style={styles.flatList}
        columnWrapperStyle={styles.column}
        numColumns={2}
        bounces={false}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <ConnectCard
              index={index}
              cardPress={() => { onOpenOtherUserDetail(item?._id) }}
              followingId={item?._id}
              name={`${item?.first_Name} ${item?.last_Name}`}
              universityORcompany={item?.universityORcompany}
              userAvtar={item?.avtar}
              isFollowing={item?.isFollowing}
              isFollowingRequested={item?.isFollowingRequested}
              isFollower={item?.isFollower}
              subscribedMember={item?.subscribedMember}
              indians={tabSelection == 'INDIANS'}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  const RenderSeeMoreView = ({ onPressSeeMore }) => {
    return (
      <View
        style={[
          ApplicationStyles.row,
          { alignSelf: 'center', marginBottom: hp(15), marginTop: 3 },
        ]}>
        <View style={styles.lineView} />
        <TouchableOpacity
          style={styles.seeBtn}
          onPress={() => onPressSeeMore()}>
          <Text style={styles.seeBtnText}>See More</Text>
        </TouchableOpacity>
        <View style={styles.lineView} />
      </View>
    )
  }

  const RenderPages = ({ data }) => {
    return (
      <FlatList
        style={styles.flatList}
        columnWrapperStyle={styles.column}
        numColumns={2}
        bounces={false}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <ConnectCard
              index={index}
              cardPress={() => { onOpenPageDetail(item) }}
              followingId={item?._id}
              name={`${item?.title}`}
              universityORcompany={item?.universityORcompany}
              userAvtar={item?.logo}
              isfollowing={item?.isfollowing}
              indians={tabSelection == 'INDIANS'}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  const onOpenPageDetail = (item) => {
    navigate(screenName.pagesDetails, { pageDetail: item });
  }

  const onSearchIndians = (text) => {
    setSearchText(text)
    let obj = {
      data: {
        emails: [], //"dev.abhiharshe23@gmail.com"
        search: text,
        userId: user?._id,
        page: 1,
        limit: 0,
      },
    };
    dispatch(getallIndianUser(obj));
  }

  const onSearchPost = text => {
    setSearchTextPost(text)
    let obj = {
      params: {
        page: 1,
        userId: user?._id,
        searchText: text,
      },
    };
    dispatch(getallPagesUser(obj));
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}>
        <Header title={'IndiansAbroad'} showLeft showRight onRightPress={() => navigate(screenName.NotificationScreen)} />
      </SafeAreaView>
      <View style={styles.tabMainView}>
        <TouchableOpacity onPress={() => { setTabSelection('INDIANS'), setIsLeftButtonActive(true), ref.current?.setPage(0) }} style={[styles.tabItemView,]}>
          <Text style={FontStyle(14, tabSelection == 'INDIANS' ? colors.primary_6a7e : colors.neutral_600, '700',)}>
            {'INDIANS'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setTabSelection('PAGES'), ref.current?.setPage(1), setIsLeftButtonActive(false) }} style={styles.tabItemView}>
          <Text style={FontStyle(14, tabSelection == 'PAGES' ? colors.primary_6a7e : colors.neutral_600, '700',)}>
            {'PAGES'}
          </Text>
        </TouchableOpacity>
      </View>
      <PagerView style={{ flex: 1 }} initialPage={tabSelectionIndex} ref={ref} onPageSelected={e => {
        setTabSelection(e?.nativeEvent?.position == 0 ? 'INDIANS' : 'PAGES');
        setTabSelectionIndex(e?.nativeEvent?.position);
        setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
      }}>
        <View style={{ flex: 1 }} key={'1'}>
          <SearchBar value={searchText} onChangeText={text => onSearchIndians(text)} placeholder={'Search Indians here'} />
          <Text style={styles.peopleText}> {tabSelection == 'INDIANS' ? 'People you may know' : 'Pages from your area'}</Text>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {allIndianList !== undefined && (
              allIndianList?.length > 0 ?
                <>
                  <RenderIndians data={allIndianList?.slice(0, 2)} />
                  <RenderSeeMoreView onPressSeeMore={() => navigate(screenName.IndiansPageMore, { dataList: 'INDIANS', })} />
                  <RenderIndians data={allIndianList?.slice(2)} />
                  {/* <RenderSeeMoreView onPressSeeMore={() => navigate(screenName.IndiansPageMore, { dataList: 'INDIANS', })} /> */}
                  <View style={{ height: 10 }} />
                </>
                :
                <NoDataFound />
            )}
          </ScrollView>
        </View>
        <View style={{ flex: 1 }} key={'2'}>
          <SearchBar value={searchTextPost} onChangeText={text => onSearchPost(text)} placeholder={'Search Pages here'} />
          <Text style={styles.peopleText}> {tabSelection == 'INDIANS' ? 'People you may know' : 'Pages from your area'}</Text>
          <ScrollView refreshControl={<RefreshControl refreshing={pagesRefreshing} onRefresh={onRefreshPages} />}>
            {allPages !== undefined && (
              allPages.length > 0 ?
                <>
                  <RenderPages data={allPages?.slice(0, 2)} />
                  <RenderSeeMoreView onPressSeeMore={() => navigate(screenName.IndiansPageMore, { dataList: 'PAGES', })} />
                  <RenderPages data={allPages?.slice(2)} />
                  {/* <RenderSeeMoreView onPressSeeMore={() => navigate(screenName.IndiansPageMore, { dataList: 'PAGES', })} /> */}
                  <View style={{ height: 10 }} />
                </>
                :
                <NoDataFound />
            )}
          </ScrollView>
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItemView: {
    paddingBottom: wp(14),
    paddingHorizontal: wp(14),
    borderRadius: 50,
    alignItems: 'center',
  },
  lineView: {
    width: SCREEN_WIDTH * 0.34,
    borderWidth: 0.5,
    borderColor: colors.neutral_400,
  },
  seeBtn: {
    backgroundColor: colors.secondary_d9e2,
    paddingHorizontal: 12,
    borderRadius: 3,
    marginHorizontal: wp(7),
  },
  seeBtnText: {
    paddingVertical: 2,
    ...FontStyle(11, colors.neutral_900, '400'),
  },
  peopleText: [
    FontStyle(14, colors.neutral_900, '700'),
    { marginHorizontal: wp(16), marginVertical: 8, },
  ],
  flatList: {
    paddingHorizontal: wp(16),
    flex: 1,
  },
  column: {
    width: '100%',
    columnGap: wp(10),
  }
});
