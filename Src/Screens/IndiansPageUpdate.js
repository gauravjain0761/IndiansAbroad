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
  TextInput,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import PagerView from 'react-native-pager-view';
import {SCREEN_WIDTH, fontname, hp, wp} from '../Themes/Fonts';
import {FontStyle} from '../utils/commonFunction';
import colors from '../Themes/Colors';
import SearchBar from '../Components/SearchBar';
import ConnectCard from '../Components/ConnectCard';
import {useNavigation, useRoute} from '@react-navigation/native';
import {screenName} from '../Navigation/ScreenConstants';
import RenderUserIcon from '../Components/RenderUserIcon';
import {Icons} from '../Themes/Icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const TextInputView = ({value, onChangeText, placeholder, label}) => {
  return (
    <View style={styles.inputStyle}>
      <Text style={styles.labelText}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const DropView = ({value, onChangeText, placeholder, label}) => {
  return (
    <View style={styles.rowStyle}>
      <Text style={[styles.labelText, {flex: 1}]}>{label}</Text>
      <TouchableOpacity>
        <Image source={Icons.down_arrow} style={styles.downArrowStyle} />
      </TouchableOpacity>
    </View>
  );
};

export default function IndiansPageUpdate() {
  const {params} = useRoute();
  const [tabType, setTabType] = useState('All');
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        showRight={false}
        showLeft={true}
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{alignItems: 'center', marginBottom: 30}}>
          <RenderUserIcon height={100} />
        </View>
        <TextInputView value={'IndiansAbroad'} label="Title" />
        <TextInputView
          value={'This is a official page of IndiansAbroad a.'}
          label="About"
        />
        <TextInputView
          value={'Connecting Indians Worldwide'}
          label="Catchline"
        />
        <TextInputView value={'www.indiansabroad.online'} label="Website" />
        <Text style={styles.locationText}>Location</Text>
        <DropView value={'India'} label="India" />
        <TextInputView value={'Pune'} label="City" />

        <TouchableOpacity style={[styles.btnView, {}]} onPress={() => {}}>
          <Text style={styles.btnText}>Update Page</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
  inputStyle: {
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    marginHorizontal: wp(20),
    borderRadius: 5,
    paddingLeft: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  inputText: {
    ...FontStyle(fontname.actor_regular, 15, colors.neutral_900),
    // height:35,
    padding: 0,
  },
  labelText: {
    ...FontStyle(fontname.actor_regular, 12, colors.neutral_900),
  },
  locationText: {
    marginHorizontal: wp(20),
    marginVertical: 22,
    ...FontStyle(fontname.actor_regular, 16, colors.secondary_800),
  },
  downArrowStyle: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral_500,
    backgroundColor: colors.inputBg,
    paddingVertical: 4,
    marginHorizontal: wp(20),
    borderRadius: 5,
    paddingLeft: 12,
    paddingVertical: 6,
    marginBottom: 10,
    height: 55,
  },
  btnView: {
    backgroundColor: colors.buttonBlue,
    marginBottom: 10,
    borderRadius: 5,
    // width: '48%',
    marginHorizontal: wp(20),
    marginTop: 20,
  },
  btnText: {
    textAlign: 'center',
    ...FontStyle(fontname.actor_regular, 15, colors.white),
    paddingVertical: 15,
  },
});
