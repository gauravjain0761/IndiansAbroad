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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts';
import { FontStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import ConnectCard from '../../Components/ConnectCard';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getallIndianRegionListApi, getallIndianUser, getallPagesUser } from '../../Services/PostServices';
import NoDataFound from '../../Components/NoDataFound';
import { dispatchAction } from '../../utils/apiGlobal';
import { IS_LOADING, SET_PAGE_DETAIL } from '../../Redux/ActionTypes';

export default function IndiansPageMore() {
  const { params } = useRoute();
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);
  const { user, allIndianRegion, allIndianRegionCount, allPages, allPagesCount } = useSelector(e => e.common);
  const isFocuse = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setpage] = useState(1);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    getIndianList(1)
  }, [])

  useEffect(() => {
    dispatch({ type: IS_LOADING, payload: true });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getIndianList(1);
  }, []);

  const getIndianList = (page) => {
    let obj = {
      data: {
        emails: [], //"dev.abhiharshe23@gmail.com"
        search: searchText,
        userId: user?._id,
        page: page,
        limit: 0,
      },
      onSuccess: () => {
        setpage(page);
        setloading(false);
        setRefreshing(false);
      },
    };
    dispatch(getallIndianRegionListApi(obj));
  }

  useEffect(() => {
    setSearchText('')
    if (isFocuse) getIndianList(1);
  }, [isFocuse]);

  const fetchMoreData = () => {
    if (allIndianRegion) {
      if (allIndianRegion.length < allIndianRegionCount) {
        setloading(true);
        getIndianList(page + 1);
      }
    }
  };

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
      onSuccess: () => {
        setpage(1);
        setloading(false);
      },
    };
    dispatch(getallIndianRegionListApi(obj));
  }


  const onOpenOtherUserDetail = (id) => {
    navigate(screenName.indiansDetails, { userId: id })
  }

  const RenderItem = ({ item, index }) => {
    return (<ConnectCard
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
      indians={true}
      city={item?.city}
    />)
  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={'IndiansAbroad'}
        showRight={false}
        showLeft={true}
        onLeftPress={() => goBack()}
      />
      <View style={{ flex: 1 }}>
        <SearchBar value={searchText} onChangeText={text => onSearchIndians(text)} placeholder={'Search Indians here'} />
        {searchText !== '' ?
          <FlatList
            style={styles.flatList}
            columnWrapperStyle={styles.column}
            numColumns={2}
            bounces={false}
            data={allIndianRegion}
            renderItem={RenderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => {
              return (
                <View>
                  {(allIndianRegion && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                  <View style={{ height: 200 }} />
                </View>
              )
            }}
          />
          :
          <View style={ApplicationStyles.flex}>
            {allIndianRegion &&
              <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                style={styles.flatList}
                columnWrapperStyle={styles.column}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                data={allIndianRegion?.filter(obj => obj?.isFollowing == 0 && obj?.isFollowingRequested == 0)}
                renderItem={RenderItem}
                showsVerticalScrollIndicator={false}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() => {
                  return (
                    <View>
                      {(allIndianRegion && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                      <View style={{ height: 200 }} />
                    </View>
                  )
                }} />
            }
          </View>
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
  },
  tabItemView: {
    flex: 1,
    padding: wp(15),
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
    // lineHeight: 18,
    paddingVertical: 2,
    ...FontStyle(11, colors.neutral_900, '400'),
  },
  flatList: {
    paddingHorizontal: wp(16),
    marginTop: 8
    // flex: 1,
  },
  column: {
    width: '100%',
    columnGap: wp(10),
  },
});