import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import {FontStyle} from '../utils/commonFunction';
import {fontname, hp, wp} from '../Themes/Fonts';
import colors from '../Themes/Colors';

const NotificationScreen = () => {
  return (
    <View style={ApplicationStyles.applicationView}>
      <Header logoShow={false} showLeft />
      <Text style={styles.title}>{'Notifications'}</Text>
      <View style={styles.categoryContainer}>
        <TouchableOpacity>
          <Text style={styles.categoryTitle}>{'All(3)'}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.categoryTitle}>{'Requests(4)'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newHeader}>
        <Text style={styles.HeaderTitle}>{'New'}</Text>
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  title: {
    ...FontStyle(fontname.actor_regular, 17, colors.black, '400'),
    paddingLeft: wp(14),
    lineHeight: hp(26),
  },
  categoryTitle: {
    ...FontStyle(fontname.actor_regular, 14, colors.black, '400'),
    lineHeight: hp(22),
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: wp(10),
    marginLeft: wp(17),
    marginTop: hp(12),
  },
  newHeader: {
    backgroundColor: colors.secondary_500,
    marginTop: hp(3),
  },
  HeaderTitle: {
    ...FontStyle(fontname.actor_regular, 14, colors.black, '400'),
    lineHeight: hp(22),
    paddingVertical: hp(4),
    paddingLeft: wp(15),
  },
});
