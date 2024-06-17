import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import {fontname, hp, wp} from '../Themes/Fonts';
import {FontStyle} from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';

export default function IndiansPage() {
  const tabs = [
    {id: 1, label: 'INDIANS'},
    {id: 2, label: 'PAGES'},
  ];
  const [tabType, setTabType] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('buyers');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  useEffect(() => {
    Animated.timing(buttonTranslateX, {
      toValue: isLeftButtonActive ? 0 : Dimensions.get('screen').width * 0.5,
      duration: 400,
    }).start();
  }, [isLeftButtonActive]);
  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);

  useEffect(() => {
    dispatch({type: 'PRE_LOADER', payload: {preLoader: true}});
  }, []);

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header title={'IndiansAbroad'} showRight={true} />
      <View style={styles.tabMainView}>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('INDIANS');
            setIsLeftButtonActive(true);
            ref.current?.setPage(0);
          }}
          style={[
            {
              marginRight: wp(5),
            },
            styles.tabItemView,
          ]}>
          {tabSelection == 'INDIANS' ? (
            <Text
              style={FontStyle(
                fontname.actor_regular,
                14,
                colors.primary_6a7e,
                '700',
              )}>
              {'INDIANS'}
            </Text>
          ) : (
            <Text
              style={FontStyle(
                fontname.actor_regular,
                14,
                colors.neutral_600,
                '700',
              )}>
              {'INDIANS'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('PAGES');
            ref.current?.setPage(1);
            setIsLeftButtonActive(false);
          }}
          style={[
            {
              marginLeft: wp(5),
              flex: 1,
            },
            styles.tabItemView,
          ]}>
          {tabSelection == 'PAGES' ? (
            <Text
              style={FontStyle(
                fontname.actor_regular,
                14,
                colors.primary_6a7e,
                '700',
              )}>
              {'PAGES'}
            </Text>
          ) : (
            <Text
              style={FontStyle(
                fontname.actor_regular,
                14,
                colors.neutral_600,
                '700',
              )}>
              {'PAGES'}
            </Text>
          )}
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.animationView,
            {
              left: tabSelection == 'INDIANS' ? 5 : 7,
              transform: [{translateX: buttonTranslateX}],
            },
          ]}
        />
      </View>
      <SearchBar
        value={searchText}
        onChangeText={text => setSearchText(text)}
        placeholder={'Search Indians here'}
      />
      <Text
        style={
          ([FontStyle(fontname.abeezee, 14, colors.neutral_900, '700')],
          {marginHorizontal: wp(16), marginVertical: 8})
        }>
        {'People may you know'}
      </Text>
      <PagerView
        style={{}}
        initialPage={tabSelectionIndex}
        ref={ref}
        onPageSelected={e => {
          setTabSelection(e?.nativeEvent?.position == 0 ? 'INDIANS' : 'PAGES');
          setTabSelectionIndex(e?.nativeEvent?.position);
          setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
        }}>
        <View key={'1'}>
          <FlatList
            style={{
              paddingHorizontal: wp(16),
              // marginBottom: wp(250),
            }}
            columnWrapperStyle={{
              // justifyContent: 'space-between',
              width: '100%',
              columnGap: wp(10),
              rowGap: hp(16),
            }}
            numColumns={2}
            bounces={false}
            data={[1, 2, 3]}
            renderItem={({item}) => {
              return <ConnectCard />;
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View key={'2'}>
          <FlatList
            style={{
              paddingHorizontal: wp(20),
              marginBottom: wp(250),
            }}
            bounces={false}
            data={[1, 2, 3]}
            renderItem={({item}) => {
              return <Text>sda</Text>;
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabMainView: {
    flexDirection: 'row',
  },
  tabItemView: {
    flex: 1,
    padding: wp(15),
    borderRadius: 50,
    alignItems: 'center',
  },
});
