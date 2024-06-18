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
import PagePostCard from '../Components/PagePostCard';

export default function PagesDetails() {
  const tabs = [
    { id: 1, label: 'Posts' },
    { id: 2, label: 'Connected Indians' },
  ];
  const showCurrent = false;

  const navigation = useNavigation();
  const [menuModal, setmenuModal] = useState(false);
  const { navigate, goBack } = useNavigation();
  const [tabType, setTabType] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('ABOUT');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);

  const dispatch = useDispatch();
  const ref = React.createRef(PagerView);

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate(screenName.PagesPostDetail)}>
        <PagePostCard item={item} index={index} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        showLeft={true}
        onLeftPress={() => {
          goBack();
        }}
      />
      <ScrollView>
        <View style={styles.userViewStyle}>
          <View style={styles.imageView}>
            <Image source={Icons.logo} style={styles.userImage} />
          </View>
          <Text style={styles.userText}>IndiansAbroad</Text>
          <Text style={styles.userText1}>(Connecting Indians Worldwide)</Text>
        </View>
        <View style={[ApplicationStyles.row, { alignSelf: 'center' }]}>
          {showCurrent ? (
            <TouchableOpacity style={styles.btnView}>
              <Text style={styles.btnText}>My page Chatroom</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.btnView}>
                <Text style={styles.btnText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnView, { marginLeft: 8, marginRight: 2 }]}>
                <Text style={styles.btnText}>Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* <View style={styles.detailsView}>
          <Text style={styles.text1}>About</Text>
          <Text style={styles.text2}>From</Text>
          <Text style={styles.text1}>Mumbai,Maharshtra</Text>
          <Text style={styles.text2}>Now</Text>
          <Text style={styles.text1}>Seoul University, Seoul,Korea</Text>
          <Text style={styles.text2}>As</Text>
          <Text style={styles.text1}>PhD Student</Text>
          <Text style={styles.text2}>Link</Text>
          <Text style={styles.text1}>app.visily.ai</Text>
        </View> */}

        <View style={styles.tabMainView}>
          <TouchableOpacity
            onPress={() => {
              setTabSelection('ABOUT');
              setIsLeftButtonActive(true);
              ref.current?.setPage(0);
            }}
            style={[
              {
                marginRight: wp(5),
              },
              styles.tabItemView,
            ]}>
            {tabSelection == 'ABOUT' ? (
              <Text style={styles.tabText}>{'ABOUT'}</Text>
            ) : (
              <Text style={styles.tabText1}>{'ABOUT'}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTabSelection('ACTIVITIES');
              setIsLeftButtonActive(true);
              ref.current?.setPage(1);
            }}
            style={[
              {
                marginRight: wp(5),
              },
              styles.tabItemView,
            ]}>
            {tabSelection == 'ACTIVITIES' ? (
              <Text style={styles.tabText}>{'ACTIVITIES'}</Text>
            ) : (
              <Text style={styles.tabText1}>{'ACTIVITIES'}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTabSelection('CONNECTED INDIANS');
              ref.current?.setPage(2);
              setIsLeftButtonActive(false);
            }}
            style={[
              {
                marginLeft: wp(5),
                flex: 1,
              },
              styles.tabItemView,
            ]}>
            {tabSelection == 'CONNECTED INDIANS' ? (
              <Text style={[styles.tabText, { bottom: 12 }]}>
                {'CONNECTED INDIANS'}
              </Text>
            ) : (
              <Text style={[styles.tabText1, { bottom: 12 }]}>
                {'CONNECTED INDIANS'}
              </Text>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.animationView,
              {
                left:
                  tabSelection == 'ABOUT'
                    ? 0
                    : tabSelection == 'ACTIVITIES'
                      ? SCREEN_WIDTH * 0.32
                      : SCREEN_WIDTH * 0.65,
                // transform: [{translateX: buttonTranslateX}],
                width:
                  tabSelection == 'ABOUT'
                    ? 130
                    : tabSelection == 'ACTIVITIES'
                      ? 135
                      : `${80 / tabs.length}%`,
                borderWidth: 0.9,
                borderColor: colors.primary_4574ca,
              },
            ]}
          />
        </View>
        <PagerView
          style={{}}
          initialPage={tabSelectionIndex}
          ref={ref}
          onPageSelected={e => {
            setTabSelection(
              e?.nativeEvent?.position == 0
                ? 'ABOUT'
                : e?.nativeEvent?.position == 1
                  ? 'ACTIVITIES'
                  : 'CONNECTED INDIANS',
            );
            setTabSelectionIndex(e?.nativeEvent?.position);
            setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
          }}>
          <View key={'1'}>
            <ScrollView style={{ marginHorizontal: wp(12) }}>
              <Text style={styles.textView}>This is a official page of IndiansAbroad app.</Text>
              <View style={ApplicationStyles.row}>
                <Text style={styles.text1}>Website</Text>
                <Text style={styles.text2}>http:www.indiansabroad.online</Text>
              </View>
              <View style={ApplicationStyles.row}>
                <Text style={styles.text1}>City</Text>
                <Text style={styles.text2}>Pune</Text>
              </View>
              <View style={ApplicationStyles.row}>
                <Text style={styles.text1}>Country</Text>
                <Text style={styles.text2}>India</Text>
              </View>
            </ScrollView>
          </View>
          <View key={'2'}>
            <ScrollView>
              <FlatList data={[0, 1, 2, 3, 4]} renderItem={renderItem} />
            </ScrollView>
          </View>
          <View key={'3'}>
            <ScrollView>
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
            </ScrollView>
          </View>
        </PagerView>
      </ScrollView>
      <PostShareModal
        shareView={true}
        menuModal={menuModal}
        setmenuModal={() => setmenuModal(false)}
      />
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
    width: wp(100),
    height: wp(100),
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
    ...FontStyle(fontname.actor_regular, 12, colors.white, '400'),
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
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
  textView: {
    lineHeight: 20,
    marginBottom: 12,
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900, '400'),
  },
  text2: {
    lineHeight: 20,
    ...FontStyle(fontname.actor_regular, 15, colors.primary_8091ba, '400'),
  },
  animationView: {
    borderColor: colors.primary_500,
    position: 'absolute',
    bottom: 20,
    left: 0,
  },
  imageView: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    padding: 5,
  },
  tabText: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 12, colors.primary_6a7e, '400'),
  },
  tabText1: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900, '400'),
  },
});
