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
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../Themes/Fonts';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icons } from '../Themes/Icons';
import ConnectedIndians from '../Components/ConnectedIndians';
import RenderUserIcon from '../Components/RenderUserIcon';
import PostCard from '../Components/PostCard';
import { screenName } from '../Navigation/ScreenConstants';
import PostShareModal from '../Components/PostShareModal';
import PagePostCard from '../Components/PagePostCard';
import UpdateDeleteMenu from '../Components/UpdateDeleteMenu';
import DeletePopModal from '../Components/DeletePopModal';
import { getAllPageFollower, getAllPagePost, onPagesConnectRequest, onPagesDisConnectRequest } from '../Services/OtherUserServices';
import { IS_LOADING, OTHER_USER_INFO, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS, SET_POST_PAGES_CONNECT, SET_POST_PAGES_DISCONNECT } from '../Redux/ActionTypes';
import { dispatchAction } from '../utils/apiGlobal';
import NoDataFound from '../Components/NoDataFound';
import PageConnectedIndians from '../Components/PageConnectedIndians';

export default function PagesDetails() {
  const tabs = [
    { id: 1, label: 'Posts' },
    { id: 2, label: 'Connected Indians' },
  ];
  const showCurrent = false;

  const navigation = useNavigation();
  const { navigate, goBack } = useNavigation();
  const [tabType, setTabType] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('ABOUT');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const [deletePop, setDeletePop] = useState(false);
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);
  const { params } = useRoute()
  const [pageDetail, setpageDetail] = useState(undefined)
  const { user, allPagePostCount, allPagePost, allPageFollowerList } = useSelector(e => e.common)
  const [loading, setloading] = useState(false)
  const [page, setpage] = useState(1)
  const [followList, setfollowList] = useState([])

  useEffect(() => {
    setfollowList(allPageFollowerList)
  }, [allPageFollowerList])

  const onSearchName = (search) => {
    let list = allPageFollowerList
    const filtered = list.filter((val) =>
      val.first_Name.toLowerCase().includes(search.toLowerCase())
    );
    const filter2 = list.filter((val) =>
      val.last_Name.toLowerCase().includes(search.toLowerCase())
    );
    let searchTextContact = Object.values(
      filtered.concat(filter2).reduce((r, o) => {
        r[o._id] = o;
        return r;
      }, {})
    );
    setfollowList(searchTextContact)
  }

  useEffect(() => {
    setpageDetail(params?.pageDetail)
  }, [params])

  useEffect(() => {
    if (!allPagePost) dispatchAction(dispatch, IS_LOADING, true)
    getPostList(1)
    onGetConnectedIndians()
  }, []);

  const onGetConnectedIndians = () => {
    dispatch(getAllPageFollower({
      params: {
        cpId: params?.pageDetail?._id,
        userId: user._id,
        page: 1,
        name: ''
      }
    }))
  }

  const getPostList = page => {
    let obj = {
      params: {
        userId: user?._id,
        // page: page,
        // limit: 5,
      },
      pageId: params?.pageDetail?._id,
      onSuccess: () => {
        setpage(page);
        setloading(false);
      },
    };
    dispatch(getAllPagePost(obj));
  };

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={item._id} activeOpacity={1} onPress={() => {
        dispatchAction(dispatch, SET_ACTIVE_POST, item)
        dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined)
        navigation.navigate(screenName.PagesPostDetail)
      }}>
        <PagePostCard item={item} index={index} />
      </TouchableOpacity>
    );
  };

  const onPressPagesConnect = () => {
    let obj = {
      data: {
        cpId: pageDetail?._id,
        followingId: user._id,
      },
      onSuccess: () => {
        dispatchAction(dispatch, pageDetail?.isfollowing ? SET_POST_PAGES_DISCONNECT : SET_POST_PAGES_CONNECT, {
          postId: pageDetail?._id,
        });
        let pageDetailTemp = Object.assign({}, pageDetail)
        pageDetailTemp.isfollowing = !pageDetailTemp.isfollowing
        setpageDetail(pageDetailTemp)
      },
      onFailure: () => { },
    };
    dispatch(pageDetail?.isfollowing ? onPagesDisConnectRequest(obj) : onPagesConnectRequest(obj));
  };

  const fetchMoreData = () => {
    // if (allPost) {
    //   if (allPost.length < allPostsCount) {
    //     setloading(true);
    //     getPostList(page + 1);
    //   }
    // }
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView>
        <Header
          title={''}
          showLeft={true}
          onLeftPress={() => {
            goBack();
          }}
        />
      </SafeAreaView>
      <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
        <View style={styles.userViewStyle}>
          {pageDetail?._id == user?._id && <UpdateDeleteMenu containerStyle={{ position: 'absolute', right: 10 }} onDeletePress={() => { setDeletePop(true) }} onUpdatePress={() => { navigate(screenName.IndiansPageUpdate) }} icon={<Image source={Icons.more1} style={[ImageStyle(28, 28)]} />} />}
          <View style={styles.imageView}>
            <RenderUserIcon height={wp(100)} url={pageDetail?.logo} />
          </View>
          <Text style={styles.userText}>{pageDetail?.title}</Text>
          <Text style={styles.userText1}>{pageDetail?.catchline}</Text>
        </View>
        <View style={[ApplicationStyles.row, { alignSelf: 'center' }]}>
          {pageDetail?._id == user?._id ? (
            <TouchableOpacity style={styles.btnView}>
              <Text style={styles.btnText}>My page Chatroom</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => onPressPagesConnect()} style={styles.btnView}>
                <Text style={styles.btnText}>{pageDetail?.isfollowing ? 'Disconnect' : 'Connect'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnView, { marginLeft: 8, marginRight: 2 }]}>
                <Text style={styles.btnText}>Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.tabMainView}>
          <TouchableOpacity onPress={() => { setTabSelection('ABOUT'), ref.current?.setPage(0) }} style={[{ marginRight: wp(5), }, styles.tabItemView,]}>
            <Text style={tabSelection == 'ABOUT' ? styles.tabText : styles.tabText1}>{'ABOUT'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setTabSelection('ACTIVITIES'); ref.current?.setPage(1); }} style={[{ marginRight: wp(5), }, styles.tabItemView,]}>
            <Text style={tabSelection == 'ACTIVITIES' ? styles.tabText : styles.tabText1}>{'ACTIVITIES'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setTabSelection('CONNECTED INDIANS'); ref.current?.setPage(2); }} style={[{ marginLeft: wp(5), flex: 1, }, styles.tabItemView,]}>
            <Text style={[tabSelection == 'CONNECTED INDIANS' ? styles.tabText : styles.tabText1, { bottom: 12 }]}>{'CONNECTED INDIANS'}</Text>
          </TouchableOpacity>
          <Animated.View style={[styles.animationView, { left: tabSelection == 'ABOUT' ? 0 : tabSelection == 'ACTIVITIES' ? SCREEN_WIDTH * 0.32 : SCREEN_WIDTH * 0.65, width: tabSelection == 'ABOUT' ? 130 : tabSelection == 'ACTIVITIES' ? 135 : `${80 / tabs.length}%`, borderWidth: 0.9, borderColor: colors.primary_4574ca, },]} />
        </View>
        {/* <PagerView
          style={{ flex: 1 }}
          initialPage={tabSelectionIndex}
          ref={ref}
          onPageSelected={e => {
            setTabSelection(e?.nativeEvent?.position == 0 ? 'ABOUT' : e?.nativeEvent?.position == 1 ? 'ACTIVITIES' : 'CONNECTED INDIANS',);
            setTabSelectionIndex(e?.nativeEvent?.position);
          }}> */}
        {tabSelection == 'ABOUT' && <View >
          <View style={{ marginHorizontal: wp(12), }}>
            <Text style={styles.textView}>{pageDetail?.about}</Text>
            <View style={ApplicationStyles.row}>
              <Text style={styles.text1}>Website</Text>
              <Text style={styles.text2}>{pageDetail?.websitelink !== '' ? pageDetail?.websitelink : 'Not Provided'}</Text>
            </View>
            <View style={ApplicationStyles.row}>
              <Text style={styles.text1}>City</Text>
              <Text style={styles.text2}>{pageDetail?.city}</Text>
            </View>
            <View style={[ApplicationStyles.row, { alignItems: 'flex-start' }]}>
              <Text style={styles.text1}>Country</Text>
              <Text style={styles.text2}>{pageDetail?.countryId?.countryName}</Text>
            </View>
          </View>
        </View>}
        {tabSelection == 'ACTIVITIES' && <View >
          {allPagePost && <FlatList data={allPagePost}
            onEndReachedThreshold={0.5}
            onEndReached={fetchMoreData}
            ListFooterComponent={() => {
              return (
                <View>
                  {(allPagePost && loading) && <ActivityIndicator size={'large'} color={colors.black} />}
                  <View style={{ height: 50 }} />
                </View>
              )
            }}
            ListEmptyComponent={<NoDataFound />}
            renderItem={renderItem} />}
        </View>}
        {tabSelection == 'CONNECTED INDIANS' && <View >
          <View>
            <SearchBar
              value={searchText}
              onChangeText={text => { setSearchText(text), onSearchName(text) }}
              placeholder={'Search Indians here'}
              containerStyles={{ backgroundColor: colors.white, marginTop: 5 }}
            />
            {followList && <FlatList
              data={followList}
              renderItem={({ item }) => {
                return <PageConnectedIndians cardPress={() => {
                  dispatchAction(dispatch, OTHER_USER_INFO, undefined)
                  navigation.push(screenName.indiansDetails, { userId: item?._id })
                }} item={item} onUpdate={() => onGetConnectedIndians()} />;
              }}
              ListEmptyComponent={<NoDataFound />}
              showsVerticalScrollIndicator={false}
            />}
          </View>
        </View>}
        {/* </PagerView> */}
      </ScrollView>
      <DeletePopModal
        isVisible={deletePop}
        onClose={() => setDeletePop(false)}
      />
    </View>
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
    ...FontStyle(fontname.actor_regular, 11, colors.neutral_900, '400'),
  },
  userViewStyle: {
    backgroundColor: colors.secondary_500,
    padding: hp(10),
  },
  userImage: {
    width: wp(100),
    height: wp(100),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  userText: {
    ...FontStyle(fontname.abeezee, 20, colors.neutral_900, '700'),
    textAlign: 'center',
  },
  userText1: {
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
    textAlign: 'center',
    marginBottom: 10,
  },
  btnView: {
    backgroundColor: colors.primary_4574ca,
    // width: wp(78),
    alignItems: 'center',
    height: hp(32),
    borderRadius: 4,
    marginVertical: hp(12),
    justifyContent: 'center',
    paddingHorizontal: wp(15),
  },
  btnText: {
    ...FontStyle(fontname.actor_regular, 12, colors.white, '400'),
    lineHeight: 20,
  },
  detailsView: {
    marginHorizontal: wp(16),
    marginTop: hp(10),
  },
  text1: {
    lineHeight: 20,
    width: 80,
    marginVertical: 6,
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900, '400'),
  },
  textView: {
    lineHeight: 20,
    marginBottom: 12,
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900, '700'),
  },
  text2: {
    lineHeight: 20,
    marginVertical: 6,
    ...FontStyle(fontname.actor_regular, 15, colors.primary_8091ba, '400'),
  },
  animationView: {
    borderColor: colors.primary_500,
    position: 'absolute',
    bottom: 20,
    left: 0,
  },
  imageView: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    padding: 5,
  },
  tabText: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 12, colors.primary_6a7e, '400'),
  },
  tabText1: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
});
