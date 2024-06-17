import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import {wp} from '../Themes/Fonts';

export default function IndiansPage() {
  const tabs = [
    {id: 1, label: 'INDIANS'},
    {id: 2, label: 'PAGES'},
  ];
  const [tabType, setTabType] = useState('All');
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
            <Text>{'INDIANS'}</Text>
          ) : (
            <Text>{'INDIANS'}</Text>
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
            <Text>{'PAGES'}</Text>
          ) : (
            <Text textColor1>{'PAGES'}</Text>
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
          <Text>asdasd</Text>
        </View>
        <View key={'2'}>
          <Text>asdasd</Text>
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
