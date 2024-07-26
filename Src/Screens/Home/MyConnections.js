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
import { useDispatch } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../../Themes/Fonts';
import { FontStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import ConnectCard from '../../Components/ConnectCard';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../Navigation/ScreenConstants';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyConnections() {
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('INDIANS');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  const renderItem = () => {
    return (
      <>
        <TouchableOpacity style={[ApplicationStyles.row, styles.listView]}>
          <RenderUserIcon height={45} />
          <Text style={styles.listText}>das</Text>
        </TouchableOpacity>
        <View style={styles.lineStyle} />
      </>
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
          onChangeText={text => setSearchText(text)}
          placeholder={'Search'}
        />
      </View>
      <View style={{ paddingHorizontal: 0, marginTop: 8 }}>
        <FlatList
          data={[1, 2, 1, 2, 3, 4, 5, 6]}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
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
