import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { FontStyle } from '../../utils/commonFunction';
import { fontname, hp, wp } from '../../Themes/Fonts';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import { Icons } from '../../Themes/Icons';
import RenderUserIcon from '../../Components/RenderUserIcon';
import ConnectCard from '../../Components/ConnectCard';
import { screenName } from '../../Navigation/ScreenConstants';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ChatCard from '../../Components/ChatCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessage, getChatRooms, getGroupRooms } from '../../Services/ChatServices';
import { dispatchAction } from '../../utils/apiGlobal';
import { GET_CHAT_MESSAGES, SET_ACTIVE_CHAT_ROOM_USER } from '../../Redux/ActionTypes';
import PagerView from 'react-native-pager-view';
import NoDataFound from '../../Components/NoDataFound';

export default function ChatScreen() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const { navigate } = useNavigation();
  const { user, chatRoomList, groupRoomList, allChatRoomCount, allGroupRoomCount } = useSelector(e => e.common);
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('personal');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1)
  const isFocuse = useIsFocused();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData(1)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (isFocuse) { getData(1, searchText.trim() !== '' ? searchText : undefined) }
  }, [tabSelection, isFocuse])
  const getData = (page, search) => {
    if (tabSelection == 'personal') {
      getPersonalchats(page, search);
    } else {
      ongetGroupRooms(page, search)
    }
  }

  const getPersonalchats = (page, search) => {
    let obj = {
      data: {
        curruntUser: user._id,
        searchText: search ? search : '',
        page: page,
        // limit: 5
      },
      onSuccess: () => {
        setpage(page);
      },
    };
    dispatch(getChatRooms(obj));
  }

  const ongetGroupRooms = (page, search) => {
    let obj = {
      data: {
        curruntUser: user._id,
        searchText: search ? search : '',
        page: page,
      },
      onSuccess: () => {
        setpage(page);
      },
    };
    dispatch(getGroupRooms(obj));
  }
  useEffect(() => {
    Animated.timing(buttonTranslateX, {
      toValue: isLeftButtonActive ? 0 : Dimensions.get('screen').width * 0.5,
      duration: 400,
    }).start();
  }, [isLeftButtonActive]);
  const ref = React.createRef(PagerView);

  const fetchMoreData = () => {
    if (tabSelection == 'personal') {
      if (chatRoomList) {
        if (chatRoomList.length < allChatRoomCount) {
          setloading(true);
          getPersonalchats(page, searchText.trim() !== '' ? searchText : undefined);
        }
      }
    } else {
      if (groupRoomList) {
        if (groupRoomList.length < allGroupRoomCount) {
          setloading(true);
          ongetGroupRooms(page, searchText.trim() !== '' ? searchText : undefined);
        }
      }
    }
  };

  const onPressItem = (item, currentUser) => {
    dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
    dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser, chatId: item._id })
    navigate(screenName.Messaging);
  };

  const onPressGroupChat = (item) => {
    dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
    dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser: item, chatId: item._id })
    navigate(screenName.GroupMessaging);
  }

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}>
        <Header
          title={'IndiansAbroad'}
          showRight={true}
          isChat={true}
          chatLeftPress={() => navigate(screenName.MyConnections)}
          chatRightPress={() => navigate(screenName.CreateGroup)}
        />
      </SafeAreaView>
      <View style={styles.tabMainView}>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('personal');
            setIsLeftButtonActive(true);
            ref.current?.setPage(0);
          }}
          style={styles.tabItemView}>
          <Text style={tabSelection == 'personal' ? styles.selectedText : styles.unSewlectedText}>
            {'Chat Room'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('group');
            ref.current?.setPage(1);
            setIsLeftButtonActive(false);
          }}
          style={styles.tabItemView}>
          <Text style={tabSelection == 'group' ? styles.selectedText : styles.unSewlectedText}>
            {'Group Room'}
          </Text>
        </TouchableOpacity>
      </View>

      <PagerView
        style={{ flex: 1 }}
        initialPage={tabSelectionIndex}
        ref={ref}
        onPageSelected={e => {
          setTabSelection(
            e?.nativeEvent?.position == 0 ? 'personal' : 'group',
          );
          setTabSelectionIndex(e?.nativeEvent?.position);
          setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
        }}>
        <View key={'1'}>
          <SearchBar
            value={searchText}
            onChangeText={text => { setSearchText(text), getData(1, text) }}
            placeholder={'Search Chats here'}
          />
          {/* <ChatList /> */}
          {chatRoomList && <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.flatlist}
            columnWrapperStyle={styles.column}
            numColumns={2}
            bounces={false}
            data={chatRoomList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <ChatCard
                  data={item}
                  cardPress={currentUser => onPressItem(item, currentUser)}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() => {
              return (
                <View>
                  {chatRoomList && loading && (
                    <ActivityIndicator size={'large'} color={colors.black} />
                  )}
                  <View style={{ height: 60 }} />
                </View>
              );
            }}
            ListEmptyComponent={<NoDataFound text={'Your new friend could be one message away. Start chatting!'} />}
          />}
        </View>
        <View key={'2'}>
          <SearchBar
            value={searchText}
            onChangeText={text => { setSearchText(text), getData(1, text) }}
            placeholder={'Search Chats here'}
          />
          {/* <ChatList /> */}
          {groupRoomList &&
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatlist}
              columnWrapperStyle={styles.column}
              numColumns={2}
              bounces={false}
              data={groupRoomList}
              renderItem={({ item }) => {
                return (
                  <ChatCard
                    data={item}
                    isGroup={item?.isGroupChat}
                    cardPress={() => onPressGroupChat(item)}
                  />
                );
              }}
              showsVerticalScrollIndicator={false}
              onEndReached={fetchMoreData}
              onEndReachedThreshold={0.3}
              ListFooterComponent={() => {
                return (
                  <View>
                    {groupRoomList && loading && (
                      <ActivityIndicator size={'large'} color={colors.black} />
                    )}
                    <View style={{ height: 60 }} />
                  </View>
                );
              }}
              ListEmptyComponent={<NoDataFound text={'Your group could be the next big thing. Create it now!'} />}
            />}
        </View>
      </PagerView>

    </View>
  );
}

const styles = StyleSheet.create({
  chatText: {
    top: -8,
    textAlign: 'center',
    ...FontStyle(14, colors.secondary_600, '700'),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    backgroundColor: colors.neutral_200,
    marginHorizontal: wp(8),
    borderRadius: 5,
    marginVertical: 5,
    paddingVertical: 10,
  },
  text: {
    lineHeight: 14,
    ...FontStyle(9, colors.neutral_900),
  },
  text1: {
    marginTop: 1,
    ...FontStyle(12, colors.neutral_900, '700'),
  },
  text2: {
    lineHeight: 18,
    ...FontStyle(12, colors.neutral_900),
  },
  text3: {
    top: -8,
    ...FontStyle(12, colors.neutral_600),
  },
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
  selectedText: FontStyle(14, colors.tertiary1_500, '700'),
  unSewlectedText: FontStyle(14, colors.neutral_900, '700'),
  flatlist: {
    paddingHorizontal: wp(8),
    paddingTop: hp(10),
  },
  column: {
    width: '100%',
    columnGap: wp(5),
    rowGap: hp(10),
  }
});
