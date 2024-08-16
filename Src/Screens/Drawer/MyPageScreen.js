import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import colors from '../../Themes/Colors';
import {
  FontStyle,
  ImageStyle,
  searchUserByName,
} from '../../utils/commonFunction';
import { SCREEN_WIDTH, wp, hp } from '../../Themes/Fonts';
import CommonButton from '../../Components/CommonButton';
import CreatePage from '../../Components/CreatePage';
import CreatePageDescription from '../../Components/CreatePageDescription';
import { onDeletePageApi, onGetMyPage } from '../../Services/AuthServices';
import PagesDetails from '../Indian/PagesDetails';
import RenderUserIcon from '../../Components/RenderUserIcon';
import UpdateDeleteMenu from '../../Components/UpdateDeleteMenu';
import Animated from 'react-native-reanimated';
import { Icons } from '../../Themes/Icons';
import { screenName } from '../../Navigation/ScreenConstants';
import DeletePopModal from '../../Components/DeletePopModal';
import NoDataFound from '../../Components/NoDataFound';
import {
  getAllPageFollower,
  getAllPagePost,
} from '../../Services/OtherUserServices';
import { dispatchAction } from '../../utils/apiGlobal';
import {
  OTHER_USER_INFO,
  SET_ACTIVE_POST,
  SET_ACTIVE_POST_COMMENTS,
} from '../../Redux/ActionTypes';
import PagePostCard from '../../Components/PagePostCard';
import SearchBar from '../../Components/SearchBar';
import PageConnectedIndians from '../../Components/PageConnectedIndians';
import CreatePost from '../../Components/CreatePost';
import ImageModalShow from '../../Components/ImageModal';
import { onOpemMyChatRoom, onOpenNewChatForUser } from '../../Services/ChatServices';

export default function MyPageScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showDetail, setshowDetail] = useState(true);
  const { myPage, user, preLoader, allPagePost, allPageFollowerList } =
    useSelector(e => e.common);
  const [deletePop, setDeletePop] = useState(false);
  const [followList, setfollowList] = useState([]);
  const [tabSelection, setTabSelection] = useState('ABOUT');
  const [loading, setloading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const isFocused = useIsFocused();
  const [createPostModal, setcreatePostModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectURI, setSelectURI] = useState('');

  useEffect(() => {
    dispatch(onGetMyPage({ id: user?._id }));
  }, []);
  useEffect(() => {
    if (myPage && myPage.length !== 0 && isFocused) {
      getPostList(1);
      onGetConnectedIndians();
    } else {
      setshowDetail(true);
    }
  }, [myPage, isFocused]);
  const onGetConnectedIndians = () => {
    dispatch(
      getAllPageFollower({
        params: {
          cpId: myPage[0]._id,
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
      },
      pageId: myPage[0]._id,
      onSuccess: () => {
        setloading(false);
      },
    };
    dispatch(getAllPagePost(obj));
  };
  useEffect(() => {
    setfollowList(allPageFollowerList);
  }, [allPageFollowerList]);
  const onSearchName = search => {
    let arr = searchUserByName(allPageFollowerList, undefined, search);
    setfollowList(arr);
  };
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
  const fetchMoreData = () => {
    // if (allPost) {
    //   if (allPost.length < allPostsCount) {
    //     setloading(true);
    //     getPostList(page + 1);
    //   }
    // }
  };
  const onDeletePage = () => {
    setDeletePop(false);
    let obj = {
      data: {
        cpId: myPage[0]._id,
        userId: user?._id,
      },
      onSuccess: () => {
        setshowDetail(true);
      },
    };
    dispatch(onDeletePageApi(obj));
  };
  const onOpenPostModal = () => {
    setcreatePostModal(true);
  };

  const openChatRoom = () => {
    navigation.navigate(screenName.ChatRoomUsersScreen)
  }

  return (
    <View style={ApplicationStyles.applicationView}>
      {!preLoader ? (
        myPage && myPage.length ? (
          <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header
              title={''}
              showLeft={true}
              showRight={false}
              onLeftPress={() => goBack()}
            />
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
              <ScrollView style={{ flex: 1 }}>
                <View style={styles.userViewStyle}>
                  <UpdateDeleteMenu
                    containerStyle={{ position: 'absolute', right: 10 }}
                    onDeletePress={() => {
                      setDeletePop(true);
                    }}
                    onUpdatePress={() => {
                      navigation.navigate(screenName.IndiansPageUpdate);
                    }}
                    icon={
                      <Image
                        source={Icons.more1}
                        style={[ImageStyle(28, 28)]}
                      />
                    }
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSelectURI(myPage[0]?.logo);
                      setModalVisible(true);
                    }}
                    style={styles.imageView}>
                    <RenderUserIcon height={wp(100)} url={myPage[0]?.logo} />
                  </TouchableOpacity>
                  <Text style={styles.userText}>{myPage[0]?.title}</Text>
                  {myPage[0]?.catchline && (
                    <Text style={styles.userText1}>{myPage[0]?.catchline}</Text>
                  )}
                </View>
                <View style={[ApplicationStyles.row, { alignSelf: 'center' }]}>
                  <TouchableOpacity onPress={() => openChatRoom()} style={styles.btnView}>
                    <Text style={styles.btnText}>My page Chatroom</Text>
                  </TouchableOpacity>
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
                {tabSelection == 'ABOUT' && (
                  <View>
                    <View style={{ marginHorizontal: wp(12) }}>
                      <Text style={styles.textView}>{myPage[0]?.about}</Text>
                      <View style={ApplicationStyles.row}>
                        <Text style={styles.text1}>Website</Text>
                        <Text style={styles.text2}>
                          {myPage[0]?.websitelink !== ''
                            ? myPage[0]?.websitelink
                            : 'Not Provided'}
                        </Text>
                      </View>
                      <View style={ApplicationStyles.row}>
                        <Text style={styles.text1}>City</Text>
                        <Text style={styles.text2}>{myPage[0]?.city}</Text>
                      </View>
                      <View
                        style={[
                          ApplicationStyles.row,
                          { alignItems: 'flex-start' },
                        ]}>
                        <Text style={styles.text1}>Country</Text>
                        <Text style={styles.text2}>
                          {myPage[0]?.countryId?.countryName}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                {tabSelection == 'ACTIVITIES' && (
                  <View>
                    {allPagePost ? (
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
                    ) : (
                      <NoDataFound />
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
              </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity
              onPress={() => onOpenPostModal()}
              style={{ position: 'absolute', bottom: wp(20), right: wp(20) }}>
              <Image
                source={Icons.plusPost}
                style={[ImageStyle(46, 46), { tintColor: '#5278D9FF' }]}
              />
            </TouchableOpacity>
          </SafeAreaView>
        ) : !showDetail ? (
          <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header
              title={''}
              showLeft={true}
              showRight={false}
              onLeftPress={() => goBack()}
            />
            <CreatePage />
          </SafeAreaView>
        ) : (
          <SafeAreaView>
            <Header
              showLeft={true}
              title={''}
              showRight={false}
              onLeftPress={() => goBack()}
            />
            <View>
              <CreatePageDescription onPress={() => setshowDetail(false)} />
            </View>
          </SafeAreaView>
        )
      ) : null}
      {deletePop && (
        <DeletePopModal
          isVisible={deletePop}
          onClose={() => setDeletePop(false)}
          onPressYes={() => onDeletePage()}
        />
      )}
      {createPostModal && (
        <CreatePost
          createPostModal={createPostModal}
          setcreatePostModal={setcreatePostModal}
          isMyPage={true}
          page={myPage[0]}
        />
      )}
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
    bottom: 10,
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
