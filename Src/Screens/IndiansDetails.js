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
import { useDispatch } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import { SCREEN_WIDTH, fontname, hp, wp } from '../Themes/Fonts';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import { useNavigation } from '@react-navigation/native';
import { Icons } from '../Themes/Icons';
import ConnectedIndians from '../Components/ConnectedIndians';
import RenderUserIcon from '../Components/RenderUserIcon';
import PostCard from '../Components/PostCard';
import { screenName } from '../Navigation/ScreenConstants';
import PostShareModal from '../Components/PostShareModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndiansDetails() {
  const tabs = [
    { id: 1, label: 'Posts' },
    { id: 2, label: 'Connected Indians' },
  ];
  const navigation = useNavigation()
  const [menuModal, setmenuModal] = useState(false)
  const { navigate, goBack } = useNavigation();
  const [tabType, setTabType] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('POST');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);

  const handleTabPress = (id, index) => {
    // setTabValue(id);
    Animated.spring(buttonTranslateX, {
      toValue: index * (SCREEN_WIDTH - 20) / 2, // Assuming each tab has a width of 100
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    tabSelection == 'POST' && handleTabPress(1, 0);
    tabSelection !== 'POST' && handleTabPress(2, 1);
  }, [tabSelection]);

  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate(screenName.PostDetail)}>
        <PostCard item={item} index={index} />
      </TouchableOpacity>
    )
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
      <ScrollView nestedScrollEnabled style={{ flex: 1, }} contentContainerStyle={{ flex: 1 }}>
        <View style={styles.userViewStyle}>
          <View style={styles.imageView}>
            <RenderUserIcon height={100} isBorder />

          </View>
          {/* <Image source={Icons.userImage} style={styles.userImage} /> */}
          <Text style={styles.userText}>Dhruv Solanki</Text>
          <Text style={styles.userText1}>
            (Believe in yourself no matter what)
          </Text>
          <View style={[ApplicationStyles.row, { alignSelf: 'center' }]}>
            <TouchableOpacity style={styles.btnView}>
              <Text style={styles.btnText}>Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnView, { marginLeft: 8, marginRight: 2 }]}>
              <Text style={styles.btnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ position: 'absolute', right: -22, }} onPress={() => setmenuModal(true)}>
              <Image
                source={Icons.more}
                resizeMode="contain"
                style={ImageStyle(22, 22)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.detailsView}>
          <Text style={[styles.text1, { ...FontStyle(fontname.actor_regular, 14, colors.neutral_900, '700') }]}>About</Text>
          <Text style={styles.text2}>From</Text>
          <Text style={styles.text1}>Mumbai,Maharshtra</Text>
          <Text style={styles.text2}>Now</Text>
          <Text style={styles.text1}>Seoul University, Seoul,Korea</Text>
          <Text style={styles.text2}>As</Text>
          <Text style={styles.text1}>PhD Student</Text>
          <Text style={styles.text2}>Link</Text>
          <Text style={styles.text1}>app.visily.ai</Text>
        </View>
        <View style={styles.tabMainView}>
          <TouchableOpacity
            onPress={() => {
              setTabSelection('POST');
              setIsLeftButtonActive(true);
              ref.current?.setPage(0);
            }} style={[{}, styles.tabItemView]}>
            <Text style={FontStyle(fontname.actor_regular, 14, tabSelection == 'POST' ? colors.primary_6a7e : colors.neutral_900, '700')}>{'Posts(7)'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTabSelection('INDIANS');
              ref.current?.setPage(1);
              setIsLeftButtonActive(false);
            }}
            style={styles.tabItemView}>
            <Text style={FontStyle(fontname.actor_regular, 14, tabSelection == 'INDIANS' ? colors.primary_6a7e : colors.neutral_900, '700')}>{'Connected Indians(79)'}</Text>
          </TouchableOpacity>
          <Animated.View style={[styles.animationView, { left: tabSelection == 'POST' ? 0 : 0, transform: [{ translateX: buttonTranslateX }], width: (SCREEN_WIDTH - 20) / 2, borderWidth: 0.9, borderColor: colors.primary_4574ca, },]} />
        </View>
        <PagerView
          style={{ flex: 1, }}
          initialPage={tabSelectionIndex}
          ref={ref}
          onPageSelected={e => {
            setTabSelection(e?.nativeEvent?.position == 0 ? 'POST' : 'INDIANS');
            setTabSelectionIndex(e?.nativeEvent?.position);
            setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
          }}>
          <View key={'1'}>
            {/* <ScrollView style={{flex:1}}> */}
            <FlatList data={[0, 1, 2, 3, 4]} renderItem={renderItem} />
            {/* </ScrollView> */}
          </View>
          <View key={'2'}>
            {/* <ScrollView> */}
            <SearchBar
              value={searchText}
              onChangeText={text => setSearchText(text)}
              placeholder={'Search Indians here'}
              containerStyles={{ backgroundColor: colors.white, marginTop: 5 }}
            />
            <FlatList
              data={[1, 2]}
              renderItem={({ item }) => {
                return <ConnectedIndians />;
              }}
              showsVerticalScrollIndicator={false}
            />
            {/* </ScrollView> */}
          </View>
        </PagerView>
      </ScrollView>
      <PostShareModal shareView={true} menuModal={menuModal} setmenuModal={() => setmenuModal(false)} />

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
    ...FontStyle(fontname.actor_regular, 11, colors.neutral_900, '400'),
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
    ...FontStyle(fontname.abeezee, 20, colors.neutral_900, '700'),
    textAlign: 'center',
  },
  userText1: {
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
    textAlign: 'center',
  },
  btnView: {
    backgroundColor: colors.primary_4574ca,
    width: wp(78),
    alignItems: 'center',
    height: hp(32),
    borderRadius: 4,
    marginVertical: hp(12),
    justifyContent: 'center',
  },
  btnText: {
    ...FontStyle(fontname.actor_regular, 12, colors.white, '400'),
    lineHeight: 20,
  },
  detailsView: {
    marginHorizontal: wp(16),
    marginTop: hp(10),
  },
  text1: {
    lineHeight: 20,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
  text2: {
    lineHeight: 20,
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_500, '400'),
  },
  animationView: {
    borderColor: colors.primary_500,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  imageView: {
    alignSelf: 'center'
  }
});
