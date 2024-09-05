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
  Platform,
  KeyboardAvoidingView,
  Alert,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getOtherUserFollowList,
  getallpostsOfUser,
  onBlockUserApi,
  onCancelRequest,
  onConnectRequest,
  onGetOtherUserInfo,
  onUnFollowRequest,
} from '../../Services/OtherUserServices';
import { dispatchAction } from '../../utils/apiGlobal';
import {
  IS_LOADING,
  OTHER_USER_INFO,
  SET_ACTIVE_POST,
  SET_ACTIVE_POST_COMMENTS,
} from '../../Redux/ActionTypes';
import NoDataFound from '../../Components/NoDataFound';
import IndianDetailShareModal from '../../Components/IndianDetailShareModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import ImageModalShow from '../../Components/ImageModal';
import { onOpenNewChatForUser } from '../../Services/ChatServices';
import MessageRequestModal from '../../Components/MessageRequestModal';

export default function IndiansDetails() {
  const navigation = useNavigation();
  const [menuModal, setmenuModal] = useState(false);
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelection, setTabSelection] = useState('POST');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  // const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const { params } = useRoute();
  const [followList, setfollowList] = useState([]);
  const { otherUserInfo, user, otherUserAllPost, otherUserFollowList } =
    useSelector(e => e.common);
  const handleTabPress = (id, index) => {
    Animated.spring(buttonTranslateX, {
      toValue: (index * (SCREEN_WIDTH - 20)) / 2, // Assuming each tab has a width of 100
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    tabSelection == 'POST' && handleTabPress(1, 0);
    tabSelection !== 'POST' && handleTabPress(2, 1);
  }, [tabSelection]);
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);
  const isFocused = useIsFocused();
  const [blockModal, setblockModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectURI, setSelectURI] = useState('');
  const [messageRequestModal, setmessageRequestModal] = useState(false)

  const onSearchName = search => {
    let arr = searchUserByName(otherUserFollowList, 'followingId', search);
    setfollowList(arr);
  };

  useEffect(() => {
    setfollowList(otherUserFollowList?.data);
  }, [otherUserFollowList]);

  useEffect(() => {
    if (!isFocused) {
      dispatchAction(dispatch, OTHER_USER_INFO, undefined);
    } else {
      dispatchAction(dispatch, OTHER_USER_INFO, undefined);
      dispatchAction(dispatch, IS_LOADING, true);
      dispatch(onGetOtherUserInfo({ params: { userId: params?.userId } }));
      dispatch(getallpostsOfUser({ data: { createdBy: params?.userId } }));
      onGetOtherUserFollower();
    }
  }, [isFocused]);

  const onGetOtherUserFollower = () => {
    dispatch(
      getOtherUserFollowList({ data: { userId: params?.userId, search: '' } }),
    );
  };
  const onPressConnect = () => {
    let obj = {
      data: { userId: user._id, followingId: otherUserInfo._id },
      onSuccess: () => {
        dispatch(onGetOtherUserInfo({ params: { userId: otherUserInfo._id } }));
      },
    };
    if (otherUserInfo?.isFollowing == 'notfollowing') {
      dispatch(onConnectRequest(obj));
    } else if (otherUserInfo?.isFollowing == 'requested') {
      dispatch(onCancelRequest(obj));
    } else {
      dispatch(onUnFollowRequest(obj));
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={item._id}
        activeOpacity={1}
        onPress={() => {
          dispatchAction(dispatch, SET_ACTIVE_POST, item);
          dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, undefined);
          navigation.navigate(screenName.PostDetail);
        }}>
        <PostCard showRequestBtns={false} item={item} index={index} />
      </TouchableOpacity>
    );
  };

  const onBlockuser = () => {
    setblockModal(false);
    let obj = {
      data: {
        userId: otherUserInfo?._id,
        action: 'block',
      },
      onSuccess: () => {
        navigation.goBack();
      },
    };
    dispatch(onBlockUserApi(obj));
  };

  const onOpenMessage = () => {
    if (otherUserInfo?.isFollowing == 'following') {
      let obj = {
        data: {
          CpUserId: otherUserInfo?._id,
          userId: user?._id,
          communityPageId: 'NA'
        },
        onSuccess: () => {
          navigation.navigate(screenName.Messaging)
        }
      }
      dispatch(onOpenNewChatForUser(obj))
    } else if (otherUserInfo?.isFollowing == 'notfollowing') {
      setmessageRequestModal(true)

    } else if (otherUserInfo?.isFollowing == 'requested') {
      Alert.alert('You already requested to this user')
    }

  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        showLeft={true}
        onLeftPress={() => {
          goBack();
        }}
      />
      {otherUserInfo && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.userViewStyle}>
              <TouchableOpacity
                onPress={() => {
                  setSelectURI(otherUserInfo?.avtar);
                  setModalVisible(true);
                }}
                style={styles.imageView}>
                <RenderUserIcon
                  url={otherUserInfo?.avtar}
                  height={100}
                  isBorder={otherUserInfo?.subscribedMember}
                  type='user'
                />
              </TouchableOpacity>
              <Text style={styles.userText}>
                {otherUserInfo?.first_Name} {otherUserInfo?.last_Name}
              </Text>
              {otherUserInfo?.catchLine !== '' && (
                <Text style={styles.userText1}>{otherUserInfo?.catchLine}</Text>
              )}
              <View style={[ApplicationStyles.row, { alignSelf: 'center' }]}>
                {otherUserInfo?.isFollowing == 'notfollowing' && (
                  <TouchableOpacity
                    onPress={() => onPressConnect()}
                    style={styles.btnView}>
                    <Text style={styles.btnText}>
                      {otherUserInfo?.isFollowing == 'notfollowing'
                        ? 'Connect'
                        : otherUserInfo?.isFollowing == 'requested'
                          ? 'Cancel Request'
                          : 'Disconnect'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => onOpenMessage()}
                  style={[styles.btnView, { marginLeft: 8, marginRight: 2 }]}>
                  <Text style={styles.btnText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ position: 'absolute', right: -22 }}
                  onPress={() => setmenuModal(true)}>
                  <Image
                    source={Icons.more}
                    resizeMode="contain"
                    style={ImageStyle(22, 22)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailsView}>
              <Text
                style={[
                  styles.text1,
                  { ...FontStyle(14, colors.neutral_900, '700') },
                ]}>
                About
              </Text>
              <Text style={styles.text2}>From</Text>
              <Text style={styles.text1}>
                {otherUserInfo?.city}, {otherUserInfo?.state}
              </Text>
              <Text style={styles.text2}>Now</Text>
              <Text style={styles.text1}>
                {otherUserInfo?.region}, {otherUserInfo?.country}
              </Text>
              <Text style={styles.text2}>At</Text>
              <Text style={styles.text1}>
                {otherUserInfo?.universityORcompany}
              </Text>
              {otherUserInfo?.profession && <Text style={styles.text2}>As</Text>}
              {otherUserInfo?.profession && <Text style={styles.text1}>{otherUserInfo?.profession}</Text>}
              {/* <Text style={styles.text2}>Link</Text>
          <Text style={styles.text1}>app.visily.ai</Text> */}
            </View>
            <View style={styles.tabMainView}>
              <TouchableOpacity
                onPress={() => {
                  setTabSelection('POST');
                  ref.current?.setPage(0);
                }}
                style={[{}, styles.tabItemView]}>
                <Image
                  source={Icons.imagelist}
                  style={{
                    ...ImageStyle(21, 21),
                    tintColor:
                      tabSelection == 'POST'
                        ? colors.primary_6a7e
                        : colors.neutral_900,
                  }}
                />
                <Text
                  style={FontStyle(
                    14,
                    tabSelection == 'POST'
                      ? colors.primary_6a7e
                      : colors.neutral_900,
                    '700',
                  )}>
                  {' (' +
                    (otherUserAllPost ? otherUserAllPost?.totalPosts : 0) +
                    ')'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setTabSelection('INDIANS');
                  ref.current?.setPage(1);
                  setSearchText('');
                }}
                style={styles.tabItemView}>
                <Image
                  source={Icons.users}
                  style={{
                    ...ImageStyle(21, 21),
                    tintColor:
                      tabSelection == 'INDIANS'
                        ? colors.primary_6a7e
                        : colors.neutral_900,
                  }}
                />
                <Text
                  style={FontStyle(
                    14,
                    tabSelection == 'INDIANS'
                      ? colors.primary_6a7e
                      : colors.neutral_900,
                    '700',
                  )}>
                  {' (' +
                    (otherUserFollowList
                      ? otherUserFollowList?.connectedIndiansCount
                      : 0) +
                    ')'}
                </Text>
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.animationView,
                  {
                    left: tabSelection == 'POST' ? 0 : 0,
                    transform: [{ translateX: buttonTranslateX }],
                    width: (SCREEN_WIDTH - 20) / 2,
                    borderWidth: 0.9,
                    borderColor: colors.primary_4574ca,
                  },
                ]}
              />
            </View>
            {tabSelection == 'POST' ? (
              <View>
                {otherUserAllPost && (
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={5}
                    data={otherUserAllPost.data}
                    renderItem={renderItem}
                    ListEmptyComponent={<NoDataFound />}
                  />
                )}
              </View>
            ) : (
              <View>
                {/* <ScrollView> */}
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
                        <ConnectedIndians
                          cardPress={() => {
                            dispatchAction(
                              dispatch,
                              OTHER_USER_INFO,
                              undefined,
                            );
                            navigation.push(screenName.indiansDetails, {
                              userId: item?.followingId?._id,
                            });
                          }}
                          item={item}
                          onUpdate={() => onGetOtherUserFollower()}
                        />
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<NoDataFound />}
                    showsVerticalScrollIndicator={false}
                  />
                )}
                {/* </ScrollView> */}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {menuModal && <IndianDetailShareModal
        item={otherUserInfo}
        onPressBlock={() => setblockModal(true)}
        shareView={true}
        menuModal={menuModal}
        setmenuModal={() => setmenuModal(false)}
      />}

      {blockModal && <ConfirmationModal
        visible={blockModal}
        onClose={() => setblockModal(false)}
        title={`Do you want to block ${otherUserInfo?.first_Name} ${otherUserInfo?.last_Name}?`}
        successBtn={'Yes'}
        canselBtn={'No'}
        onPressCancel={() => setblockModal(false)}
        onPressSuccess={() => onBlockuser()}
      />}
      {modalVisible && (
        <ImageModalShow
          modalVisible={modalVisible}
          url={selectURI}
          onClose={() => {
            setModalVisible(false);
          }}
          type='user'
        />
      )}
      {messageRequestModal &&
        <MessageRequestModal visible={messageRequestModal} userId={otherUserInfo?._id}
          onClose={() => setmessageRequestModal(false)} />
      }
    </SafeAreaView>
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
    justifyContent: 'center',
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
    paddingVertical: hp(10),
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
    // width: wp(78),
    alignItems: 'center',
    height: hp(32),
    borderRadius: 4,
    marginVertical: hp(12),
    justifyContent: 'center',
    paddingHorizontal: 10,
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
    ...FontStyle(12, colors.neutral_900, '400'),
  },
  text2: {
    lineHeight: 20,
    ...FontStyle(12, colors.neutral_500, '400'),
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
