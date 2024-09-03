import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../Themes/Colors';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import RenderUserIcon from './RenderUserIcon';
import { Icons } from '../Themes/Icons';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function RenderScanningTable({ data }) {
  const { user } = useSelector(e => e.common)
  return (
    <View style={styles.outerView}>
      <View style={styles.headerRow}>
        <View style={{ width: '40%', justifyContent: 'center' }}>
          <Text style={[styles.headerText]}>Name of the event</Text>
        </View>
        <View style={styles.line} />
        <View style={{ width: '18%', justifyContent: 'center' }}>
          <Text style={[styles.headerText]}>Date</Text>
        </View>
        <View style={styles.line} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.headerText]}>No. of tickets</Text>
        </View>
        <View style={styles.line} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.headerText]}>Download file</Text>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.headerRow}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
                <RenderUserIcon type='user' url={user?.avtar} isBorder={user?.subscribedMember} height={36} />
                <Text
                  style={[styles.desText, { flex: 1, textAlign: 'flex-start' }]}>
                  {item?.eventTitle}
                </Text>
              </View>
              <View style={styles.line} />
              <View style={{ width: '18%', justifyContent: 'center' }}>
                <Text style={[styles.desText]}>{moment(item?.eventDate).format("DD-MM-YYYY")}</Text>
              </View>
              <View style={styles.line} />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.ticketView}>
                  <Text style={[styles.desText, { color: colors.primary_500 }]}>
                    {item?.noOfTickets || 0}
                  </Text>
                </View>
              </View>
              <View style={styles.line} />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity style={styles.btn}>
                  <Text style={FontStyle(10, colors.white)}>Download</Text>
                </TouchableOpacity>
              </View>
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
    width: 30,
    height: 30
  },
  btn: {
    backgroundColor: colors.primary_500,
    justifyContent: 'center',
    borderRadius: 4,
    // paddingHorizontal: 10,
    margin: 4,
    alignItems: 'center',
    paddingVertical: 5,
  },
});
