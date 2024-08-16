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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts';
import {
  FontStyle,
  ImageStyle,
  searchUserByName,
} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import ConnectCard from '../../Components/ConnectCard';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Icons } from '../../Themes/Icons';
import ConnectedIndians from '../../Components/ConnectedIndians';
import RenderUserIcon from '../../Components/RenderUserIcon';
import PostCard from '../../Components/PostCard';
import { screenName } from '../../Navigation/ScreenConstants';
import PostShareModal from '../../Components/PostShareModal';
import PagePostCard from '../../Components/PagePostCard';
import UpdateDeleteMenu from '../../Components/UpdateDeleteMenu';
import DeletePopModal from '../../Components/DeletePopModal';
import {
  getAllPageFollower,
  getAllPagePost,
  onPagesConnectRequest,
  onPagesDisConnectRequest,
} from '../../Services/OtherUserServices';
import {
  IS_LOADING,
  OTHER_USER_INFO,
  SET_ACTIVE_POST,
  SET_ACTIVE_POST_COMMENTS,
  SET_POST_PAGES_CONNECT,
  SET_POST_PAGES_DISCONNECT,
} from '../../Redux/ActionTypes';
import { dispatchAction } from '../../utils/apiGlobal';
import NoDataFound from '../../Components/NoDataFound';
import PageConnectedIndians from '../../Components/PageConnectedIndians';
import { onGetPageDetail } from '../../Services/PostServices';
import ImageModalShow from '../../Components/ImageModal';
import { onOpenNewChatForUser } from '../../Services/ChatServices';

export default function PagesDetails() {
  const navigation = useNavigation();
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelection, setTabSelection] = useState('ABOUT');
  const [deletePop, setDeletePop] = useState(false);
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);
  const { params } = useRoute();
  const [pageDetail, setpageDetail] = useState(undefined);
  const { user, allPagePostCount, allPagePost, allPageFollowerList } =
    useSelector(e => e.common);
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);
  const [followList, setfollowList] = useState([]);
  const isfocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectURI, setSelectURI] = useState('');

  useEffect(() => {
    setfollowList(allPageFollowerList);
  }, [allPageFollowerList]);

  const onSearchName = search => {
    let arr = searchUserByName(allPageFollowerList, undefined, search);
    setfollowList(arr);
  };

  useEffect(() => {
    // let obj = {
    //   id: params?.pageDetail?._id
    // }
    // dispatch(onGetPageDetail(obj))
    if (isfocused) {
      getPostList(1);
      onGetConnectedIndians();
    }
  }, [isfocused]);

  useEffect(() => {
    if (!allPagePost) dispatchAction(dispatch, IS_LOADING, true);
    setpageDetail(params?.pageDetail);
  }, []);

  const onGetConnectedIndians = () => {
    dispatch(
      getAllPageFollower({
        params: {
          cpId: params?.pageDetail?._id,
          userId: user._id,
          page: 1,
          name: '',
        },
      }),
    );
  };

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
      <TouchableOpacity
        key={item._id}
        activeOpacity={1}
        onPress={() => {
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          dispatchAction(dispatch, SET_ACTIVE_POST, item);
          navigation.navigate(screenName.PagesPostDetail);
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
        dispatchAction(
          dispatch,
          pageDetail?.isfollowing
            ? SET_POST_PAGES_DISCONNECT
            : SET_POST_PAGES_CONNECT,
          {
            postId: pageDetail?._id,
          },
        );
        let pageDetailTemp = Object.assign({}, pageDetail);
        pageDetailTemp.isfollowing = !pageDetailTemp.isfollowing;
        setpageDetail(pageDetailTemp);
      },
      onFailure: () => { },
    };
    dispatch(
      pageDetail?.isfollowing
        ? onPagesDisConnectRequest(obj)
        : onPagesConnectRequest(obj),
    );
  };
  const onPressMessage = () => {
    if (pageDetail?.isfollowing) {
      let obj = {
        data: {
          CpUserId: pageDetail?.createdBy?._id,
          userId: user?._id,
          communityPageId: pageDetail?._id
        },
        isPage: true,
        onSuccess: () => {
          navigate(screenName.PageMessaging)
          // navigation.dispatch(
          //   StackActions.replace(screenName.Messaging)
          // );
        }
      }
      dispatch(onOpenNewChatForUser(obj))

    } else {
      Alert.alert('You need to connect to this page to send a message.');
    }
  }

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
        <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
          <View style={styles.userViewStyle}>
            {pageDetail?._id == user?._id && (
              <UpdateDeleteMenu
                containerStyle={{ position: 'absolute', right: 10 }}
                onDeletePress={() => {
                  setDeletePop(true);
                }}
                onUpdatePress={() => {
                  navigate(screenName.IndiansPageUpdate);
                }}
                icon={
                  <Image source={Icons.more1} style={[ImageStyle(28, 28)]} />
                }
              />
            )}
            <TouchableOpacity onPress={() => {
              setSelectURI(pageDetail?.logo);
              setModalVisible(true);
            }} style={styles.imageView}>
              <RenderUserIcon height={wp(100)} url={pageDetail?.logo} />
            </TouchableOpacity>
            <Text style={styles.userText}>{pageDetail?.title}</Text>
            {pageDetail?.catchline && (
              <Text style={styles.userText1}>{pageDetail?.catchline}</Text>
            )}
          </View>
          <View style={[ApplicationStyles.row, { alignSelf: 'center' }]}>
            {pageDetail?._id == user?._id ? (
              <TouchableOpacity style={styles.btnView}>
                <Text style={styles.btnText}>My page Chatroom</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => onPressPagesConnect()}
                  style={styles.btnView}>
                  <Text style={styles.btnText}>
                    {pageDetail?.isfollowing ? 'Disconnect' : 'Connect'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressMessage()}
                  style={[styles.btnView, { marginLeft: 8, marginRight: 2 }]}>
                  <Text style={styles.btnText}>Message</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={styles.tabMainView}>
            <TouchableOpacity
              onPress={() => {
                setTabSelection('ABOUT');
              }}
              style={[
                {
                  marginRight: wp(5),
                  borderBottomColor:
                    tabSelection == 'ABOUT'
                      ? colors.primary_4574ca
                      : 'transparent',
                },
                styles.tabItemView,
              ]}>
              <Image
                source={Icons.files}
                style={{
                  ...ImageStyle(21, 21),
                  tintColor:
                    tabSelection == 'ABOUT'
                      ? colors.primary_6a7e
                      : colors.neutral_900,
                }}
              />

              {/* <Text style={tabSelection == 'ABOUT' ? styles.tabText : styles.tabText1}>{'ABOUT'}</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTabSelection('ACTIVITIES');
              }}
              style={[
                {
                  marginRight: wp(5),
                  borderBottomColor:
                    tabSelection == 'ACTIVITIES'
                      ? colors.primary_4574ca
                      : 'transparent',
                },
                styles.tabItemView,
              ]}>
              <Image
                source={Icons.imagelist}
                style={{
                  ...ImageStyle(21, 21),
                  tintColor:
                    tabSelection == 'ACTIVITIES'
                      ? colors.primary_6a7e
                      : colors.neutral_900,
                }}
              />

              {/* <Text style={tabSelection == 'ACTIVITIES' ? styles.tabText : styles.tabText1}>{'ACTIVITIES'}</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTabSelection('CONNECTED INDIANS');
              }}
              style={[
                {
                  borderBottomColor:
                    tabSelection == 'CONNECTED INDIANS'
                      ? colors.primary_4574ca
                      : 'transparent',
                },
                styles.tabItemView,
              ]}>
              <Image
                source={Icons.users}
                style={{
                  ...ImageStyle(21, 21),
                  tintColor:
                    tabSelection == 'CONNECTED INDIANS'
                      ? colors.primary_6a7e
                      : colors.neutral_900,
                }}
              />

              {/* <Text style={[tabSelection == 'CONNECTED INDIANS' ? styles.tabText : styles.tabText1, { bottom: 12 }]}>{'CONNECTED INDIANS'}</Text> */}
            </TouchableOpacity>
            {/* <Animated.View style={[styles.animationView, { left: tabSelection == 'ABOUT' ? 0 : tabSelection == 'ACTIVITIES' ? SCREEN_WIDTH / 3 : (SCREEN_WIDTH / 3) * 2, width: tabSelection == 'ABOUT' ? 130 : tabSelection == 'ACTIVITIES' ? 135 : `${80 / 3}%`, borderWidth: 0.9, borderColor: colors.primary_4574ca, },]} /> */}
          </View>
          {/* <PagerView
          style={{ flex: 1 }}
          initialPage={tabSelectionIndex}
          ref={ref}
          onPageSelected={e => {
            setTabSelection(e?.nativeEvent?.position == 0 ? 'ABOUT' : e?.nativeEvent?.position == 1 ? 'ACTIVITIES' : 'CONNECTED INDIANS',);
            setTabSelectionIndex(e?.nativeEvent?.position);
          }}> */}
          {tabSelection == 'ABOUT' && (
            <View>
              <View style={{ marginHorizontal: wp(12) }}>
                <Text style={styles.textView}>{pageDetail?.about}</Text>
                <View style={ApplicationStyles.row}>
                  <Text style={styles.text1}>Website</Text>
                  <Text style={styles.text2}>
                    {pageDetail?.websitelink !== ''
                      ? pageDetail?.websitelink
                      : 'Not Provided'}
                  </Text>
                </View>
                <View style={ApplicationStyles.row}>
                  <Text style={styles.text1}>City</Text>
                  <Text style={styles.text2}>{pageDetail?.city}</Text>
                </View>
                <View
                  style={[ApplicationStyles.row, { alignItems: 'flex-start' }]}>
                  <Text style={styles.text1}>Country</Text>
                  <Text style={styles.text2}>
                    {pageDetail?.countryId?.countryName}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {tabSelection == 'ACTIVITIES' && (
            <View>
              {allPagePost && (
                <FlatList
                  data={allPagePost}
                  onEndReachedThreshold={0.5}
                  onEndReached={fetchMoreData}
                  ListFooterComponent={() => {
                    return (
                      <View>
                        {allPagePost && loading && (
                          <ActivityIndicator
                            size={'large'}
                            color={colors.black}
                          />
                        )}
                        <View style={{ height: 50 }} />
                      </View>
                    );
                  }}
                  ListEmptyComponent={<NoDataFound />}
                  renderItem={renderItem}
                />
              )}
            </View>
          )}
          {tabSelection == 'CONNECTED INDIANS' && (
            <View>
              <View>
                <SearchBar
                  value={searchText}
                  onChangeText={text => {
                    setSearchText(text), onSearchName(text);
                  }}
                  placeholder={'Search Indians here'}
                  containerStyles={{
                    backgroundColor: colors.white,
                    marginTop: 5,
                  }}
                />
                {followList && (
                  <FlatList
                    data={followList}
                    renderItem={({ item }) => {
                      return (
                        <PageConnectedIndians
                          cardPress={() => {
                            dispatchAction(
                              dispatch,
                              OTHER_USER_INFO,
                              undefined,
                            );
                            navigation.push(screenName.indiansDetails, {
                              userId: item?._id,
                            });
                          }}
                          item={item}
                          onUpdate={() => onGetConnectedIndians()}
                        />
                      );
                    }}
                    ListEmptyComponent={<NoDataFound />}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            </View>
          )}
          {/* </PagerView> */}
        </ScrollView>
      </KeyboardAvoidingView>
      <DeletePopModal
        isVisible={deletePop}
        onClose={() => setDeletePop(false)}
      />
      {modalVisible && (
        <ImageModalShow
          modalVisible={modalVisible}
          url={selectURI}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
  },
  tabItemView: {
    flex: 1,
    padding: wp(10),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: wp(10),
    borderBottomWidth: 3,
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
    padding: hp(10),
  },
  userImage: {
    width: wp(100),
    height: wp(100),
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
    ...FontStyle(12, colors.white, '400'),
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
    ...FontStyle(15, colors.neutral_900, '400'),
  },
  textView: {
    lineHeight: 20,
    marginBottom: 12,
    ...FontStyle(15, colors.neutral_900, '700'),
  },
  text2: {
    lineHeight: 20,
    marginVertical: 6,
    ...FontStyle(15, colors.primary_8091ba, '400'),
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
    ...FontStyle(12, colors.primary_6a7e, '400'),
  },
  tabText1: {
    textAlign: 'center',
    ...FontStyle(12, colors.neutral_900, '400'),
  },
});
