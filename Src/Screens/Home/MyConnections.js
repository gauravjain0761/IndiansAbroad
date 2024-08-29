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
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts';
import { FontStyle, searchUserByName } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import ConnectCard from '../../Components/ConnectCard';
import { StackActions, useNavigation } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IS_LOADING } from '../../Redux/ActionTypes';
import { dispatchAction } from '../../utils/apiGlobal';
import { onOpenNewChatForUser } from '../../Services/ChatServices';
import { getFollowerList } from '../../Services/PostServices';

export default function MyConnections() {
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('INDIANS');
  const dispatch = useDispatch();
  const { followerList, user } = useSelector(e => e.common)
  const [followList, setfollowList] = useState([])
  const navigation = useNavigation();

  const onSearchName = (search) => {
    let arr = searchUserByName(followerList, 'followingId', search)
    setfollowList(arr)
  }

  useEffect(() => {
    setfollowList(followerList)
  }, [followerList])

  useEffect(() => {
    dispatchAction(dispatch, IS_LOADING, true)
    dispatch(getFollowerList({
      data: { userId: user?._id, search: '' }
    }))
  }, []);

  // console.log()
  const openChatScreen = (item) => {
    let obj = {
      data: {
        CpUserId: item?.followingId?._id,
        userId: user?._id,
        communityPageId: 'NA'
      },
      onSuccess: () => {
        navigation.dispatch(
          StackActions.replace(screenName.Messaging)
        );
      }
    }
    dispatch(onOpenNewChatForUser(obj))
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => openChatScreen(item)} style={[ApplicationStyles.row, styles.listView]}>
          <RenderUserIcon url={item?.followingId?.avtar} height={45} isBorder={item?.followingId?.subscribedMember} />
          <Text numberOfLines={1} style={styles.listText}>
            {item?.followingId.first_Name} {item?.followingId.last_Name}
          </Text>
        </TouchableOpacity>
        <View style={styles.lineStyle} />
      </View>
    );
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={'IndiansAbroad'}
        showLeft={true}
        showRight={false}
        onLeftPress={() => goBack()}
      />
      <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500, }}>
        <Text style={styles.chatText}>My connections</Text>
        <SearchBar
          value={searchText}
          onChangeText={text => { setSearchText(text), onSearchName(text) }}
          placeholder={'Search'}
        // containerStyles={{ backgroundColor: colors.white, marginTop: 5 }}
        />
      </View>
      <View style={{ paddingHorizontal: 0, marginTop: 8, flex: 1 }}>
        {followList && <FlatList
          data={followList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatText: {
    textAlign: 'center',
    ...FontStyle(18, colors.secondary_600, '700'),
    marginVertical: 5
  },
  tabMainView: {
    flexDirection: 'row',
  },
  tabItemView: {
    flex: 1,
    padding: wp(15),
    borderRadius: 50,
    alignItems: 'center',
  },
  listText: {
    ...FontStyle(14, colors.neutral_900),
    marginLeft: 15,
  },
  listView: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: colors.neutral_400,
    backgroundColor: colors.inputBg,
    marginHorizontal: 8
  },
  lineStyle: {
    borderWidth: 0.6,
    marginVertical: 6,
    borderColor: colors.secondary_500
  }
});
