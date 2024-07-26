import { View, Text, StyleSheet, Animated, TouchableOpacity, FlatList, ScrollView, Image, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, hp, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Icons } from '../../Themes/Icons';
import ConnectedIndians from '../../Components/ConnectedIndians';
import RenderUserIcon from '../../Components/RenderUserIcon';
import PostCard from '../../Components/PostCard';
import { screenName } from '../../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getallpostsOfUser, onBlockUserApi } from '../../Services/OtherUserServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { OTHER_USER_INFO, SET_ACTIVE_POST, SET_ACTIVE_POST_COMMENTS } from '../../Redux/ActionTypes';
import NoDataFound from '../../Components/NoDataFound';
import { getFollowerList } from '../../Services/AuthServices';

export default function ProfileScreen() {
  const navigation = useNavigation()
  const [menuModal, setmenuModal] = useState(false)
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelection, setTabSelection] = useState('POST');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const { params } = useRoute()
  const [followList, setfollowList] = useState([])
  const { user, otherUserAllPost, followerList } = useSelector(e => e.common)
  const handleTabPress = (id, index) => {
    Animated.spring(buttonTranslateX, {
      toValue: index * (SCREEN_WIDTH - 20) / 2, // Assuming each tab has a width of 100
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    tabSelection == 'POST' && handleTabPress(1, 0);
    tabSelection !== 'POST' && handleTabPress(2, 1);
  }, [tabSelection]);
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);
  const isFocused = useIsFocused()
  const [blockModal, setblockModal] = useState(false)

  const onSearchName = (search) => {
    let list = followerList
    const filtered = list.filter((val) =>
      val.followingId.first_Name.toLowerCase().includes(search.toLowerCase())
    );
    const filter2 = list.filter((val) =>
      val.followingId.last_Name.toLowerCase().includes(search.toLowerCase())
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
    setfollowList(followerList)
  }, [followerList])

  useEffect(() => {
    if (isFocused) {
      dispatch(getallpostsOfUser({ data: { createdBy: user._id, } }))
      onGetOtherUserFollower()
    }
  }, [isFocused])

  const onGetOtherUserFollower = () => {
    dispatch(getFollowerList({
      data: { userId: user?._id, search: '' }
    }))
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={item._id} activeOpacity={1} onPress={() => {
        dispatchAction(dispatch, SET_ACTIVE_POST, item)
        dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined)
        navigation.navigate(screenName.PostDetail)
      }}>
        <PostCard item={item} index={index} />
      </TouchableOpacity>
    )
  }

  const onBlockuser = () => {
    setblockModal(false)
    let obj = {
      data: {
        userId: user?._id,
        action: 'block'
      },
      onSuccess: () => {
        navigation.goBack()
      }
    }
    dispatch(onBlockUserApi(obj))
  }

  return (

    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={'IndiansAbroad'} showRight={true} showLeft icon={Icons.setting} onRightPress={() => navigate(screenName.Setting)} />
      {user &&
        <ScrollView style={{ flex: 1 }} >

          <View style={styles.userViewStyle}>
            <View style={styles.imageView}>
              <RenderUserIcon url={user?.avtar} height={100} isBorder={user?.subscribedMember} />
            </View>
            <Text style={styles.userText}>{user?.first_Name} {user?.last_Name}</Text>
            <Text style={styles.userText1}>{user?.catchLine}</Text>
          </View>
          <View style={styles.tabMainView}>
            <TouchableOpacity
              onPress={() => {
                setTabSelection('POST');
                ref.current?.setPage(0);
              }} style={[{}, styles.tabItemView]}>
              <Image source={Icons.imagelist} style={{ ...ImageStyle(21, 21), tintColor: tabSelection == 'POST' ? colors.primary_6a7e : colors.neutral_900 }} />
              <Text style={FontStyle(14, tabSelection == 'POST' ? colors.primary_6a7e : colors.neutral_900, '700')}>{' (' + (otherUserAllPost ? otherUserAllPost?.totalPosts : 0) + ')'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTabSelection('INDIANS');
                ref.current?.setPage(1);
                setSearchText('')
              }}
              style={styles.tabItemView}>
              <Image source={Icons.users} style={{ ...ImageStyle(21, 21), tintColor: tabSelection == 'INDIANS' ? colors.primary_6a7e : colors.neutral_900 }} />
              <Text style={FontStyle(14, tabSelection == 'INDIANS' ? colors.primary_6a7e : colors.neutral_900, '700')}>{' (' + (followerList ? followerList?.length : 0) + ')'}</Text>
            </TouchableOpacity>
            <Animated.View style={[styles.animationView, { left: tabSelection == 'POST' ? 0 : 0, transform: [{ translateX: buttonTranslateX }], width: (SCREEN_WIDTH - 20) / 2, borderWidth: 0.9, borderColor: colors.primary_4574ca, },]} />
          </View>
          {tabSelection == 'POST' ?
            <View style={{ flex: 1 }}>
              {otherUserAllPost && <FlatList
                ListFooterComponent={() => {
                  return (
                    <View>
                      <View style={{ height: 50 }} />
                    </View>
                  );
                }}
                initialNumToRender={5} data={otherUserAllPost.data} renderItem={renderItem} ListEmptyComponent={<NoDataFound />} />}
            </View>
            :
            <View >
              {/* <ScrollView> */}
              <SearchBar
                value={searchText}
                onChangeText={text => { setSearchText(text), onSearchName(text) }}
                placeholder={'Search Indians here'}
                containerStyles={{ backgroundColor: colors.white, marginTop: 5 }}
              />
              {followList && <FlatList
                data={followList}
                ListFooterComponent={() => {
                  return (
                    <View>
                      <View style={{ height: 50 }} />
                    </View>
                  );
                }}
                renderItem={({ item }) => {
                  return <ConnectedIndians cardPress={() => {
                    dispatchAction(dispatch, OTHER_USER_INFO, undefined)
                    navigation.push(screenName.indiansDetails, { userId: item?.followingId?._id })
                  }} item={item} onUpdate={() => onGetOtherUserFollower()} />;
                }}
                ListEmptyComponent={<NoDataFound />}
                showsVerticalScrollIndicator={false}
              />}
              {/* </ScrollView> */}
            </View>
          }
        </ScrollView>
      }
    </SafeAreaView>
    // <View style={ApplicationStyles.applicationView}>
    //   <SafeAreaView edges={['top']}  >
    //     <Header
    //       title={'IndiansAbroad'}
    //       showRight={true}
    //       icon={Icons.setting}
    //       onRightPress={() => navigate(screenName.Setting)}
    //     />
    //   </SafeAreaView>
    //   {/* <ScrollView style={{flex:1}}> */}
    //   <View style={styles.userViewStyle}>
    //     <View style={styles.imageView}>
    //       <RenderUserIcon height={100} isBorder />
    //     </View>
    //     <Text style={styles.userText}>Harshal Jadhav</Text>
    //     <Text style={styles.userText1}>(In London)</Text>
    //   </View>
    //   <View style={styles.tabMainView}>
    //     <TouchableOpacity
    //       onPress={() => {
    //         setTabSelection('POST');
    //         setIsLeftButtonActive(true);
    //         ref.current?.setPage(0);
    //       }} style={[{}, styles.tabItemView]}>
    //       <Text style={FontStyle( 14, tabSelection == 'POST' ? colors.primary_6a7e : colors.neutral_900, '700')}>{'My Posts (10)'}</Text>
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       onPress={() => {
    //         setTabSelection('INDIANS');
    //         ref.current?.setPage(1);
    //         setIsLeftButtonActive(false);
    //       }}
    //       style={styles.tabItemView}>
    //       <Text style={FontStyle( 14, tabSelection == 'INDIANS' ? colors.primary_6a7e : colors.neutral_900, '700')}>{'Connected Indians (79)'}</Text>
    //     </TouchableOpacity>
    //     <Animated.View style={[styles.animationView, { left: tabSelection == 'POST' ? 0 : 0, transform: [{ translateX: buttonTranslateX }], width: (SCREEN_WIDTH - 20) / 2, borderWidth: 0.9, borderColor: colors.primary_4574ca, },]} />
    //   </View>
    //   <PagerView
    //     style={{ flex: 1 }}
    //     initialPage={tabSelectionIndex}
    //     ref={ref}
    //     onPageSelected={e => {
    //       setTabSelection(e?.nativeEvent?.position == 0 ? 'POST' : 'INDIANS');
    //       setTabSelectionIndex(e?.nativeEvent?.position);
    //       setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
    //     }}>
    //     <View key={'1'}>
    //       {/* <ScrollView style={{flex:1}}> */}
    //       <FlatList data={[0, 1, 2, 3, 4]} renderItem={renderItem} />
    //       {/* </ScrollView> */}
    //     </View>
    //     <View key={'2'}>
    //       {/* <ScrollView> */}
    //       <SearchBar
    //         value={searchText}
    //         onChangeText={text => setSearchText(text)}
    //         placeholder={'Search Indians here'}
    //         containerStyles={{ backgroundColor: colors.white, marginTop: 5 }}
    //       />
    //       <FlatList
    //         data={[1, 2]}
    //         renderItem={({ item }) => {
    //           return <ConnectedIndians />;
    //         }}
    //         showsVerticalScrollIndicator={false}
    //       />
    //       {/* </ScrollView> */}
    //     </View>
    //   </PagerView>
    //   {/* </ScrollView> */}
    // </View>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  tabItemView: {
    flex: 1,
    paddingVertical: wp(15),
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
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
  userViewStyle: {
    backgroundColor: colors.secondary_500,
    paddingVertical: hp(20),
  },
  userImage: {
    width: wp(110),
    height: wp(110),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  userText: {
    ...FontStyle(20, colors.neutral_900, '700'),
    textAlign: 'center',
  },
  userText1: {
    ...FontStyle(12, colors.neutral_900, '400'),
    textAlign: 'center',
  },
  btnView: {
    backgroundColor: colors.primary_4574ca,
    width: wp(78),
    alignItems: 'center',
    height: hp(32),
    borderRadius: 4,
    marginVertical: hp(12),
    justifyContent: 'center',
  },
  btnText: {
    ...FontStyle(12, colors.white, '400'),
    lineHeight: 20,
  },
  animationView: {
    borderColor: colors.primary_500,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  imageView: {
    alignSelf: 'center',
  },
});
