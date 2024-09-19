import { View, Text, StyleSheet, Pressable, Animated, Dimensions, TouchableOpacity, FlatList, ScrollView, RefreshControl, } from 'react-native';
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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getallIndianUser, getallPagesUser, getalluserposts, } from '../../Services/PostServices';
import NoDataFound from '../../Components/NoDataFound';
import RenderIndians from '../../Components/RenderIndians';
import RenderPages from '../../Components/RenderPages';

export default function IndiansPage() {
  const { navigate } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchTextPost, setSearchTextPost] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('INDIANS');
  const { user, allIndian, allPages } = useSelector(e => e.common);
  const [allIndianList, setallIndianList] = useState(undefined)
  const isFocuse = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [pagesRefreshing, setPagesRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);

  return (
    <View style={ApplicationStyles.applicationView}>
      <SafeAreaView edges={['top']}>
        <Header title={'IndiansAbroad'} showLeft showRight onRightPress={() => navigate(screenName.NotificationScreen)} />
      </SafeAreaView>
      <View style={styles.tabMainView}>
        <TouchableOpacity onPress={() => { setTabSelection('INDIANS'), ref.current?.setPage(0) }} style={[styles.tabItemView,]}>
          <Text style={FontStyle(14, tabSelection == 'INDIANS' ? colors.primary_6a7e : colors.neutral_600, '700',)}>
            {'INDIANS'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setTabSelection('PAGES'), ref.current?.setPage(1) }} style={styles.tabItemView}>
          <Text style={FontStyle(14, tabSelection == 'PAGES' ? colors.primary_6a7e : colors.neutral_600, '700',)}>
            {'PAGES'}
          </Text>
        </TouchableOpacity>
      </View>
      <PagerView style={{ flex: 1 }} initialPage={tabSelectionIndex} ref={ref} onPageSelected={e => {
        setTabSelection(e?.nativeEvent?.position == 0 ? 'INDIANS' : 'PAGES');
        setTabSelectionIndex(e?.nativeEvent?.position);
      }}>
        <View style={{ flex: 1 }} key={'1'}>
          <RenderIndians />
        </View>
        <View style={{ flex: 1 }} key={'2'}>
          <RenderPages />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItemView: {
    paddingBottom: wp(14),
    paddingHorizontal: wp(14),
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
    paddingVertical: 2,
    ...FontStyle(11, colors.neutral_900, '400'),
  },
  peopleText: [
    FontStyle(14, colors.neutral_900, '700'),
    { marginHorizontal: wp(16), marginVertical: 8, },
  ],
  flatList: {
    paddingHorizontal: wp(16),
    flex: 1,
  },
  column: {
    width: '100%',
    columnGap: wp(10),
  }
});