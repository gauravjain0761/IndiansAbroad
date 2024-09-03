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
    marginTop: hp(10),
    paddingHorizontal: wp(16),
  }
});



// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Animated,
//   Dimensions,
//   TouchableOpacity,
//   FlatList,
//   ScrollView,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ApplicationStyles from '../../Themes/ApplicationStyles';
// import Header from '../../Components/Header';
// import PagerView from 'react-native-pager-view';
// import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts';
// import { FontStyle } from '../../utils/commonFunction';
// import colors from '../../Themes/Colors';
// import SearchBar from '../../Components/SearchBar';
// import ConnectCard from '../../Components/ConnectCard';
// import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
// import { screenName } from '../../Navigation/ScreenConstants';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { getallIndianUser, getallPagesUser } from '../../Services/PostServices';
// import NoDataFound from '../../Components/NoDataFound';
// import { dispatchAction } from '../../utils/apiGlobal';
// import { SET_PAGE_DETAIL } from '../../Redux/ActionTypes';

// export default function IndiansPageMore() {
//   const { params } = useRoute();
//   const [tabType, setTabType] = useState('All');
//   const { navigate, goBack } = useNavigation();
//   const [searchText, setSearchText] = useState('');
//   const [searchTextPost, setSearchTextPost] = useState('');

//   const [tabSelectionIndex, setTabSelectionIndex] = useState(
//     params?.dataList == 'INDIANS' ? 0 : 1,
//   );
//   const [tabSelection, setTabSelection] = useState(params?.dataList);
//   const buttonTranslateX = useRef(new Animated.Value(0)).current;
//   const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);

//   const dispatch = useDispatch();
//   const ref = React.createRef(PagerView);
//   const { user, allIndian, allIndianCount, allPages, allPagesCount } = useSelector(e => e.common);
//   const isFocuse = useIsFocused();
//   const [refreshing, setRefreshing] = React.useState(false);
//   const [pagesRefreshing, setPagesRefreshing] = React.useState(false);
//   const [page, setpage] = useState(1);
//   const [pagePages, setPagePages] = useState(1);
//   const [loading, setloading] = useState(false);
//   const [allIndianList, setallIndianList] = useState(undefined)

//   useEffect(() => {
//     if (allIndian && searchText == '') {
//       let temp = allIndian?.filter(obj => obj?.isFollowing == 0 && obj?.isFollowingRequested == 0)
//       setallIndianList(temp)
//     } else {
//       setallIndianList(allIndian)
//     }
//   }, [allIndian])

//   useEffect(() => {
//     dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
//   }, []);

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     getIndianList(1);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   }, []);

//   const onRefreshPages = React.useCallback(() => {
//     setPagesRefreshing(true);
//     getPagesList(1);
//     setTimeout(() => {
//       setPagesRefreshing(false);
//     }, 2000);
//   }, []);

//   const getIndianList = page => {
//     let obj = {
//       data: {
//         emails: [], //"dev.abhiharshe23@gmail.com"
//         search: '',
//         userId: user?._id,
//         page: page,
//         limit: 0,
//       },
//       onSuccess: () => {
//         setpage(page);
//         setloading(false);
//       },
//     };
//     dispatch(getallIndianUser(obj));
//   };

//   const getPagesList = page => {
//     let obj = {
//       params: {
//         page: page,
//         userId: user?._id,
//         searchText: '',
//       },
//       onSuccess: () => {
//         setPagePages(page);
//         setloading(false);
//       },
//     };
//     dispatch(getallPagesUser(obj));
//   };

//   useEffect(() => {
//     setSearchText('')
//     setSearchTextPost('')
//     if (isFocuse) getIndianList(1);
//     if (isFocuse) getPagesList(1);
//   }, [isFocuse]);

//   const fetchMoreData = () => {
//     if (allIndian) {
//       if (allIndian.length < allIndianCount) {
//         setloading(true);
//         getIndianList(page + 1);
//       }
//     }
//   };

//   const fetchMorePagesData = () => {
//     if (allPages) {
//       if (allPages.length < allPagesCount) {
//         setloading(true);
//         getPagesList(pagePages + 1);
//       }
//     }
//   };

//   const onSearchIndians = (text) => {
//     setSearchText(text)
//     let obj = {
//       data: {
//         emails: [], //"dev.abhiharshe23@gmail.com"
//         search: text,
//         userId: user?._id,
//         page: 1,
//         limit: 0,
//       },
//       onSuccess: () => {
//         setpage(1);
//         setloading(false);
//       },
//     };
//     dispatch(getallIndianUser(obj));
//   }

//   const onSearchPost = text => {
//     setSearchTextPost(text)
//     let obj = {
//       params: {
//         page: 1,
//         userId: user?._id,
//         searchText: text,
//       },
//       onSuccess: () => {
//         setpage(1);
//         setloading(false);
//       },
//     };
//     dispatch(getallPagesUser(obj));
//   };

//   return (
//     <SafeAreaView style={ApplicationStyles.applicationView}>
//       <Header
//         title={'IndiansAbroad'}
//         showRight={false}
//         showLeft={true}
//         onLeftPress={() => goBack()}
//       />
//       <View style={styles.tabMainView}>
//         <TouchableOpacity
//           onPress={() => {
//             setTabSelection('INDIANS');
//             setIsLeftButtonActive(true);
//             ref.current?.setPage(0);
//           }}
//           style={[{}, styles.tabItemView]}>
//           <Text
//             style={FontStyle(
//               14,
//               tabSelection == 'INDIANS'
//                 ? colors.primary_6a7e
//                 : colors.neutral_900,
//               '700',
//             )}>
//             {'INDIANS'}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             setTabSelection('PAGES');
//             ref.current?.setPage(1);
//             setIsLeftButtonActive(false);
//           }}
//           style={styles.tabItemView}>
//           <Text
//             style={FontStyle(
//               14,
//               tabSelection == 'PAGES'
//                 ? colors.primary_6a7e
//                 : colors.neutral_900,
//               '700',
//             )}>
//             {'PAGES'}
//           </Text>
//         </TouchableOpacity>
//         {/* <Animated.View style={[styles.animationView, { left: tabSelection == 'INDIANS' ? 0 : 0, transform: [{ translateX: buttonTranslateX }], width: (SCREEN_WIDTH - 20) / 2, borderWidth: 0.9, borderColor: colors.primary_4574ca, },]} /> */}
//       </View>
//       <PagerView
//         style={{ flex: 1 }}
//         initialPage={tabSelectionIndex}
//         ref={ref}
//         onPageSelected={e => {
//           setTabSelection(e?.nativeEvent?.position == 0 ? 'INDIANS' : 'PAGES');
//           setTabSelectionIndex(e?.nativeEvent?.position);
//           setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
//         }}>
//         <View style={{ flex: 1 }} key={'1'}>
//           <SearchBar value={searchText} onChangeText={text => onSearchIndians(text)} placeholder={'Search Indians here'} />
//           <Text style={[
//             FontStyle(14, colors.neutral_900, '700'),
//             { marginHorizontal: wp(16), marginVertical: 8 },
//           ]}> {tabSelection == 'INDIANS' ? 'People you may know' : 'Pages from your area'}</Text>
//           {allIndianList && <FlatList
//             style={{
//               paddingHorizontal: wp(16),
//               flex: 1
//             }}
//             columnWrapperStyle={{
//               width: '100%',
//               columnGap: wp(10),
//               // rowGap: hp(16),
//             }}
//             refreshControl={
//               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//             }
//             numColumns={2}
//             onEndReached={fetchMoreData}
//             onEndReachedThreshold={0.3}
//             data={allIndianList}
//             ListEmptyComponent={<NoDataFound />}
//             renderItem={({ item, index }) => {
//               return (
//                 <ConnectCard
//                   cardPress={() => {
//                     navigate(screenName.indiansDetails, { userId: item?._id });
//                   }}
//                   index={index}
//                   followingId={item?._id}
//                   name={`${item?.first_Name} ${item?.last_Name}`}
//                   universityORcompany={item?.universityORcompany}
//                   userAvtar={item?.avtar}
//                   isFollowing={item?.isFollowing}
//                   isFollowingRequested={item?.isFollowingRequested}
//                   isFollower={item?.isFollower}
//                   subscribedMember={item?.subscribedMember}
//                   indians={tabSelection == 'INDIANS'}
//                 />
//               );
//             }}
//             showsVerticalScrollIndicator={false}
//             ListFooterComponent={() => {
//               return (
//                 <View>
//                   {(allIndian && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
//                   <View style={{ height: 200 }} />
//                 </View>
//               )
//             }}
//           />}
//           {/*  */}
//         </View>
//         <View style={{ flex: 1 }} key={'2'}>
//           <SearchBar value={searchTextPost} onChangeText={text => onSearchPost(text)} placeholder={'Search Pages here'} />
//           <Text style={[
//             FontStyle(14, colors.neutral_900, '700'),
//             { marginHorizontal: wp(16), marginVertical: 8 },
//           ]}> {tabSelection == 'INDIANS' ? 'People you may know' : 'Pages from your area'}</Text>
//           <FlatList
//             style={{
//               paddingHorizontal: wp(16),
//             }}
//             refreshControl={
//               <RefreshControl refreshing={pagesRefreshing} onRefresh={onRefreshPages} />
//             }
//             columnWrapperStyle={{
//               width: '100%',
//               columnGap: wp(10),
//             }}
//             ListEmptyComponent={<NoDataFound />}
//             numColumns={2}
//             bounces={false}
//             data={allPages}
//             onEndReached={fetchMorePagesData}
//             onEndReachedThreshold={0.3}
//             renderItem={({ item }) => {
//               return (
//                 <ConnectCard
//                   cardPress={() => {
//                     navigate(screenName.pagesDetails, { pageDetail: item });
//                   }}
//                   followingId={item?._id}
//                   name={`${item?.title}`}
//                   universityORcompany={item?.universityORcompany}
//                   userAvtar={item?.logo}
//                   isfollowing={item?.isfollowing}
//                   indians={tabSelection == 'INDIANS'}
//                 />
//               );
//             }}
//             showsVerticalScrollIndicator={false}
//             ListFooterComponent={() => {
//               return (
//                 <View>
//                   {(allPages && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
//                   <View style={{ height: 200 }} />
//                 </View>
//               )
//             }}
//           />
//         </View>
//       </PagerView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   tabMainView: {
//     flexDirection: 'row',
//   },
//   tabItemView: {
//     flex: 1,
//     padding: wp(15),
//     borderRadius: 50,
//     alignItems: 'center',
//   },
//   lineView: {
//     width: SCREEN_WIDTH * 0.34,
//     borderWidth: 0.5,
//     borderColor: colors.neutral_400,
//   },
//   seeBtn: {
//     backgroundColor: colors.secondary_d9e2,
//     paddingHorizontal: 12,
//     borderRadius: 3,
//     marginHorizontal: wp(7),
//   },
//   seeBtnText: {
//     // lineHeight: 18,
//     paddingVertical: 2,
//     ...FontStyle(11, colors.neutral_900, '400'),
//   },
// });
