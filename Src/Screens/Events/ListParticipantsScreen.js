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
import {FontStyle, ImageStyle} from '../../utils/commonFunction';
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
export default function ListParticipantsScreen() {
  const navigation = useNavigation();
  const {activeEvent, user} = useSelector(e => e.common);
  const dispatch = useDispatch();
  const [particpantsList, setParticpantsList] = useState([]);

  useEffect(() => {
    getEventList();
  }, [activeEvent?._id]);

  const getEventList = page => {
    let obj = {
      data: activeEvent?._id,
      onSuccess: res => {
        setParticpantsList(res?.data);
      },
    };
    dispatch(getAttendeeGetByEventAction(obj));
  };

  const renderItem = ({item}) => (
    <View style={styles.rowItem}>
      <RenderUserIcon height={45} isBorder={true} />
      <View style={ApplicationStyles.flex}>
        <Text
          style={
            styles.nameText
          }>{`${item?.first_name} ${item?.last_name}`}</Text>
        <Text style={styles.nameText}>Confirmation Number: {item?._id}</Text>
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
        {/* <TouchableOpacity
          onPress={() => navigation.navigate(screenName.AnnouncementScreen)}>
          <Image
            source={Icons.megaphone}
            style={[ImageStyle(26, 26), {marginHorizontal: 10}]}
          />
        </TouchableOpacity> */}
      </View>
      <View style={ApplicationStyles.flex}>
        <FlatList
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
    alignItems: 'center',
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
