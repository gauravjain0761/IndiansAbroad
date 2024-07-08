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
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import ConnectCard from '../../Components/ConnectCard';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { Icons } from '../../Themes/Icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onBlockUserApi, onGetBlockUserList } from '../../Services/OtherUserServices';
import { api } from '../../utils/apiConstants'
import ConfirmationModal from '../../Components/ConfirmationModal';
import { dispatchAction } from '../../utils/apiGlobal';
import { IS_LOADING } from '../../Redux/ActionTypes';
import NoDataFound from '../../Components/NoDataFound';
import RenderBlockedItem from '../../Components/RenderBlockedItem';

export default function BlockedUsers() {
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { blockUserList } = useSelector(e => e.common)
  const [blockModal, setblockModal] = useState(false)
  const [selectedItem, setselectedItem] = useState(undefined)

  useEffect(() => {
    setselectedItem(undefined)
    dispatch(onGetBlockUserList({}))
  }, [])

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <RenderBlockedItem item={item} index={index} />

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
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.secondary_500,
        }}>
        <Text style={styles.chatText}>Blocked Users</Text>
        <SearchBar
          value={searchText}
          onChangeText={text => setSearchText(text)}
          placeholder={'Search'}
        />
      </View>
      {blockUserList && <View style={{ paddingHorizontal: 0, marginTop: 8, flex: 1 }}>
        <FlatList
          data={blockUserList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoDataFound />}
          style={{ flex: 1 }}
        />
      </View>}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatText: {
    // top: -19,
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
    flex: 1,
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
  },
  itemText: {
    top: -4,
    ...FontStyle(16, colors.neutral_900),
  },
  menu: {
    backgroundColor: colors.neutral_300,
    borderWidth: 1,
    borderColor: colors.neutral_400,
    // marginTop: 12,
    height: 42,
    width: 100,
  },
});
