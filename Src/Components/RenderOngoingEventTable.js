import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../Themes/Colors';
import {currencyIcon, FontStyle, ImageStyle} from '../utils/commonFunction';
import RenderUserIcon from './RenderUserIcon';
import {Icons} from '../Themes/Icons';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { dispatchAction } from '../utils/apiGlobal';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { SET_ACTIVE_EVENT } from '../Redux/ActionTypes';

export default function RenderOngoingEventTable({showAction = true,data}) {
    const {user} = useSelector(e => e.common);
    const dispatch = useDispatch();
    const navigation = useNavigation();
  return (
    <View style={styles.outerView}>
      <View style={styles.headerRow}>
        <View style={{width: '40%', justifyContent: 'center'}}>
          <Text style={[styles.headerText]}>Name of the event</Text>
        </View>
        <View style={styles.line} />
        <View style={{width: '17%', justifyContent: 'center'}}>
          <Text style={[styles.headerText]}>Date</Text>
        </View>
        <View style={styles.line} />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[styles.headerText]}>No. of tickets</Text>
        </View>
        <View style={styles.line} />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[styles.headerText]}>Amount</Text>
        </View>
        {showAction && <View style={styles.line} />}
        {showAction && (
          <View style={{flex: 0.8, justifyContent: 'center'}}>
            <Text style={[styles.headerText]}>Action</Text>
          </View>
        )}
      </View>
      <FlatList
        data={data}
        keyExtractor={(item,index) =>index.toString()}
        renderItem={({item}) => {
          return (
            <View style={[styles.headerRow, {borderBottomWidth: 0}]}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
               <RenderUserIcon url={user?.avtar} height={32} isBorder={user?.subscribedMember} />
                <Text
                  style={[styles.desText, {flex: 1, textAlign: 'flex-start'}]}>
                  {item?.title}
                </Text>
              </View>
              <View style={styles.line} />
              <View style={{width: '17%', justifyContent: 'center'}}>
                <Text style={[styles.desText]}>{moment(item?.start_time).format("DD-MM-YYYY")}</Text>
              </View>
              <View style={styles.line} />
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.ticketView}>
                  <Text style={[styles.desText, {color: colors.primary_500}]}>
                    {item?.no_of_tickets}
                  </Text>
                </View>
              </View>
              <View style={styles.line} />
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={[styles.desText]}>{`${currencyIcon(item?.currency)}${item?.event_fee}`}</Text>
              </View>
              {showAction && <View style={styles.line} />}
              {showAction && (
                <View style={{flex: 0.8, justifyContent: 'center'}}>
                  <TouchableOpacity
                  onPress={()=>{
                    dispatchAction(dispatch, SET_ACTIVE_EVENT, item);
                    navigation.navigate(screenName.EventDetailScreen);
                  }}
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={Icons.edit} style={ImageStyle(12, 12)} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerView: {
    borderRadius: 4,
    borderColor: colors.neutral_300,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_300,
    // backgroundColor: colors.primary_300,
  },
  line: {
    width: 1,
    backgroundColor: colors.neutral_300,
  },
  headerText: {
    ...FontStyle(9, colors.neutral_600, '600'),
    textAlign: 'center',
    marginVertical: 3,
    // flex: 1
  },
  desText: {
    ...FontStyle(9, colors.neutral_900),
    textAlign: 'center',
    marginVertical: 3,
  },
  ticketView: {
    backgroundColor: colors.primary_300,
    padding: 5,
    borderRadius: 100,
    alignSelf: 'center',
    paddingHorizontal: 10,
    margin: 3,
  },
  btn: {
    backgroundColor: colors.primary_500,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});
