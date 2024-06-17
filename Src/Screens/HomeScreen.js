import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import { fontname, hp, wp } from '../Themes/Fonts';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import PostCard from '../Components/PostCard';
import ModalContainer from '../Components/ModalContainer';
import { Icons } from '../Themes/Icons';
import CreatePost from '../Components/CreatePost';
export default function HomeScreen() {
  const dispatch = useDispatch();
  const [tabType, setTabType] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('Activity');
  const buttonTranslateX = useRef(new Animated.Value(0)).current;
  const [isLeftButtonActive, setIsLeftButtonActive] = useState(true);
  const [createPostModal, setcreatePostModal] = useState(false)
  const [postText, setpostText] = useState('')
  useEffect(() => {
    Animated.timing(buttonTranslateX, {
      toValue: isLeftButtonActive ? 0 : Dimensions.get('screen').width * 0.5,
      duration: 400,
    }).start();
  }, [isLeftButtonActive]);
  const ref = React.createRef(PagerView);

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  useEffect(() => {
    dispatch({ type: 'PRE_LOADER', payload: { preLoader: true } });
  }, []);

  const renderItem = ({ item, index }) => {
    return (<PostCard item={item} index={index} />)
  }

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header title={'IndianAbroad'} showRight={true} isHome={true} onClickPlus={() => setcreatePostModal(true)} />
      <View style={styles.tabMainView}>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('Activity');
            setIsLeftButtonActive(true);
            ref.current?.setPage(0);
          }}
          style={styles.tabItemView}>
          <Text style={tabSelection == 'Activity' ? styles.selectedText : styles.unSewlectedText}>{'Activity'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTabSelection('Events');
            ref.current?.setPage(1);
            setIsLeftButtonActive(false);
          }}
          style={styles.tabItemView}>
          <Text style={tabSelection == 'Events' ? styles.selectedText : styles.unSewlectedText}>{'Events'}</Text>
        </TouchableOpacity>
      </View>
      <SearchBar
        value={searchText}
        onChangeText={text => setSearchText(text)}
        placeholder={'Search users, posts, forums'}
      />
      <PagerView
        style={{ flex: 1 }}
        initialPage={tabSelectionIndex}
        ref={ref}
        onPageSelected={e => {
          setTabSelection(e?.nativeEvent?.position == 0 ? 'Activity' : 'Events');
          setTabSelectionIndex(e?.nativeEvent?.position);
          setIsLeftButtonActive(e?.nativeEvent?.position == 0 ? true : false);
        }}>
        <View key={'1'}>
          <FlatList
            data={[0, 1, 2, 3, 4]}
            renderItem={renderItem}
          />
        </View>
        <View key={'2'}>
          <FlatList
            data={[0, 1, 2, 3, 4]}
            renderItem={renderItem}
          />
        </View>
      </PagerView>
      <CreatePost createPostModal={createPostModal} setcreatePostModal={setcreatePostModal} />
    </View >
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
  selectedText: FontStyle(fontname.actor_regular, 14, colors.tertiary1_500, '700'),
  unSewlectedText: FontStyle(fontname.actor_regular, 14, colors.neutral_900, '700'),

});
