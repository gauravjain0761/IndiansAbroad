import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import {useNavigation} from '@react-navigation/native';
import {FontStyle, ImageStyle, searchParticipantsName, searchUserByName} from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {screenName} from '../../Navigation/ScreenConstants';
import {wp} from '../../Themes/Fonts';
import {Icons} from '../../Themes/Icons';
import RenderUserIcon from '../../Components/RenderUserIcon';
import {
  getAttendeeGetByEventAction,
  getDetailsListAction,
} from '../../Services/PostServices';
import SearchBar from '../../Components/SearchBar';
export default function ListParticipantsScreen() {
  const navigation = useNavigation();
  const {activeEvent, user} = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');

  const [particpantsListData, setParticpantsListData] = useState([]);
  const [particpantsList, setParticpantsList] = useState([]);

  const onSearchName = (search) => {
    // let arr = searchParticipantsName(particpantsList, undefined, search)
    // setParticpantsList(arr)
    let text = search?.toLowerCase();
    let filteredData = particpantsList.filter(subItem => {
      return (
        subItem?.first_name?.toLowerCase()?.includes(text) ||
        subItem?.email?.toLowerCase()?.includes(text) || 
        subItem?.phone_no?.toLowerCase()?.includes(text)
      );
    });
    setParticpantsList(filteredData)
}

  useEffect(()=>{
    searchText==0 && setParticpantsList(particpantsListData)
  },[searchText])



  useEffect(() => {
    getEventList();
  }, [activeEvent?._id]);

  const getEventList = page => {
    let obj = {
      data: activeEvent?._id,
      onSuccess: res => {
        setParticpantsList(res?.data);
        setParticpantsListData(res?.data);
      },
    };
    dispatch(getAttendeeGetByEventAction(obj));
  };

  const renderItem = ({item}) => {
    console.log('itemitemitem', item);

    return (
      <View style={styles.rowItem}>
        <RenderUserIcon type="user" height={45} isBorder={true} />
        <View style={ApplicationStyles.flex}>
          <Text
            style={
              styles.nameText
            }>{`${item?.first_name} ${item?.last_name}`}</Text>
          <Text style={styles.nameText}>Confirmation Number: {item?._id}</Text>
          <Text style={styles.nameText}>
            No. of tickets : {item?.no_of_tickets}
          </Text>
          <Text style={styles.nameText}>Email ID : {item?.email}</Text>
          <Text style={styles.nameText}>Mob No : {item?.phone_no}</Text>
        </View>
        {item?.is_verified && (
          <Image
            source={Icons.checkRound}
            style={[
              ImageStyle(26, 26),
              {tintColor: colors.primary_500, marginHorizontal: 10},
            ]}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        showLeft={true}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      <View style={styles.row}>
        <Image
          source={Icons.group}
          style={[ImageStyle(26, 26), {tintColor: colors.primary_500}]}
        />
        <Text
          style={
            styles.totalText
          }>{`${particpantsList?.length} Particpants`}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(screenName.AnnouncementScreen)}>
          <Image
            source={Icons.megaphone}
            style={[ImageStyle(26, 26), {marginHorizontal: 10}]}
          />
        </TouchableOpacity>
      </View>
      <View style={{borderTopWidth: 1, borderTopColor: colors.secondary_500}}>
        <SearchBar
          value={searchText}
          onChangeText={text => {
            setSearchText(text), onSearchName(text);
          }}
          placeholder={'Search'}
        />
      </View>
      <View style={ApplicationStyles.flex}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={particpantsList}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.line} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(16),
    gap: 10,
    marginVertical:10
  },
  totalText: {
    flex: 1,
    ...FontStyle(16, colors.primary_500, '700'),
  },
  line: {
    height: 1,
    backgroundColor: colors.secondary_500,
  },
  rowItem: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.neutral_400,
    backgroundColor: colors.inputBg,
    marginVertical: 10,
    borderRadius: 4,
    padding: 8,
  },
  nameText: {
    ...FontStyle(14, colors.neutral_900),
  },
});
