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
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import {SCREEN_WIDTH, fontname, hp, wp} from '../../Themes/Fonts';
import {FontStyle, ImageStyle} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import ConnectCard from '../../Components/ConnectCard';
import {useNavigation} from '@react-navigation/native';
import {screenName} from '../../Navigation/ScreenConstants';
import RenderUserIcon from '../../Components/RenderUserIcon';
import {Icons} from '../../Themes/Icons';
import {Menu, MenuItem} from 'react-native-material-menu';

export default function BlockedUsers() {
  const {navigate, goBack} = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('INDIANS');
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  useEffect(() => {
    dispatch({type: 'PRE_LOADER', payload: {preLoader: true}});
  }, []);

  const renderItem = () => {
    return (
      <>
        <View style={[ApplicationStyles.row, styles.listView]}>
          <View style={[ApplicationStyles.row]}>
            <RenderUserIcon height={45} />
            <Text style={styles.listText}>das</Text>
          </View>
          <Menu
            visible={visible}
            anchor={
              <TouchableOpacity
                style={[ImageStyle(14, 14), {right: 15}]}
                onPress={showMenu}>
                <Image
                  source={Icons.more}
                  style={[ImageStyle(14, 14), {right: 15}]}
                />
              </TouchableOpacity>
            }
            onRequestClose={hideMenu}
            style={styles.menu}>
            <MenuItem
              textStyle={styles.itemText}
              onPress={() => {
                hideMenu();
              }}>
              Unblock
            </MenuItem>
          </Menu>
        </View>
        <View style={styles.lineStyle} />
      </>
    );
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header
        title={'IndiansAbroad'}
        showLeft={true}
        showRight={false}
        onLeftPress={() => goBack()}
      />
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingTop: 18,
          paddingBottom: 3,
          borderTopColor: colors.secondary_500,
          borderBlockColor: colors.secondary_500,
        }}>
        <Text style={styles.chatText}>Blocked Users</Text>
        <SearchBar
          value={searchText}
          onChangeText={text => setSearchText(text)}
          placeholder={'Search'}
          containerStyles={{top: -10}}
        />
      </View>
      <ScrollView style={{paddingHorizontal: 0, marginTop: 8,flex:1}}>
        <FlatList
          data={[1, 2, 1, 2, 3, 4, 5, 6,5,6,8,9,7,5,2,1,4,5,6,7,85]}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chatText: {
    top: -19,
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 18, colors.secondary_600, '700'),
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
    ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
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
    marginHorizontal: 8,
  },
  lineStyle: {
    borderWidth: 0.6,
    marginVertical: 6,
    borderColor: colors.secondary_500,
  },
  itemText: {
    top:-4,
    ...FontStyle(fontname.actor_regular, 16, colors.neutral_900),
  },
  menu: {
    backgroundColor: colors.neutral_300,
    borderWidth: 1,
    borderColor: colors.neutral_400,
    // marginTop: 12,
    height:42,
    width: 100,
  },
});
