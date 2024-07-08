import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import { fontname, hp, screen_width, wp } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import { Icons } from '../Themes/Icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Data = [
  {
    id: 1,
    name: 'Rutu M',
    content: 'has liked your post',
    type: 'general',
    image: Icons.userImage,
    time: '1 hour ago',
  },
  {
    id: 2,
    name: 'Rutu M',
    content: 'has accepted your request.',
    type: 'general',
    image: Icons.userImage,
    time: '1 hour ago',
  },
  {
    id: 3,
    name: 'Sakshi Bagwari',
    content: 'has sent you request',
    type: 'Requests',
    image: Icons.userImage,
    time: '1 hour ago',
  },
  {
    id: 4,
    name: 'SOURABH CHOUGULE',
    content: 'has accepted your request.',
    type: 'general',
    image: Icons.userImage,
    time: '1 day ago',
  },
  {
    id: 5,
    name: 'Saurabh Ghode',
    content: 'has liked your post.',
    type: 'general',
    image: Icons.userImage,
    time: '3 days ago',
  },
  {
    id: 6,
    name: 'Sakshi Bagwari',
    content: 'has liked your post.',
    type: 'general',
    image: Icons.userImage,
    time: '5 days ago',
  },
];

const NotificationScreen = () => {
  const [categories, setCategories] = useState('All');
  const { goBack } = useNavigation();

  const onPressBack = () => {
    goBack();
  };
  const renderItem = ({ item, index }) => {
    return (
      <>
        {item?.type == 'general' ? (
          <View style={styles.Container}>
            <View style={styles.leftSide}>
              <Image
                source={item?.image}
                style={[
                  ImageStyle(44, 44),
                  { borderRadius: 100, overflow: 'hidden' },
                ]}
                resizeMode="contain"
              />
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  {item?.name} {item?.content}
                </Text>
              </View>
            </View>
            <Text style={styles.time}>{item?.time}</Text>
          </View>
        ) : (
          <View style={styles.requestContainer}>
            <View style={styles.leftSide}>
              <Image
                source={item?.image}
                style={[
                  ImageStyle(44, 44),
                  { borderRadius: 100, overflow: 'hidden' },
                ]}
                resizeMode="contain"
              />
              <View style={styles.centerContainer}>
                <Text style={styles.name}>
                  {item?.name} {item?.content}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{'Accept'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{'Ignore'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.time}>{item?.time}</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header logoShow={false} onLeftPress={onPressBack} showLeft />
      <Text style={styles.title}>{'Notifications'}</Text>
      <View style={styles.categoriesContainer}>
        <TouchableOpacity onPress={() => setCategories('All')}>
          <Text
            style={[
              styles.categoriesTitle,
              {
                color:
                  categories == 'All' ? colors?.tertiary1_500 : colors?.black,
              },
            ]}>
            {'All(3)'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategories('Requests')}>
          <Text
            style={[
              styles.categoriesTitle,
              {
                color:
                  categories == 'Requests'
                    ? colors?.tertiary1_500
                    : colors?.black,
              },
            ]}>
            {'Connection Invite(4)'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {categories == 'All' ? (
          <>
            <View style={styles.newHeader}>
              <Text style={styles.HeaderTitle}>{'New'}</Text>
            </View>
            <View style={styles.notificationcontainer}>
              <FlatList
                data={Data}
                ItemSeparatorComponent={() => (
                  <View style={styles.separator}></View>
                )}
                renderItem={renderItem}
              />
            </View>
            <View style={styles.newHeader}>
              <Text style={styles.HeaderTitle}>{'Older'}</Text>
            </View>
            <View style={styles.notificationcontainer}>
              <FlatList
                data={Data}
                ItemSeparatorComponent={() => (
                  <View style={styles.separator}></View>
                )}
                renderItem={renderItem}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.newHeader}>
              <Text style={styles.HeaderTitle}>{'New'}</Text>
            </View>
            <View style={styles.notificationcontainer}>
              <FlatList
                data={Data}
                renderItem={({ item, index }) =>
                  item?.type == 'Requests' && renderItem({ item, index })
                }
              />
            </View>
            <View style={styles.newHeader}>
              <Text style={styles.HeaderTitle}>{'Older'}</Text>
            </View>
            <FlatList
              data={Data}
              renderItem={({ item, index }) =>
                item?.type == 'Requests' && renderItem({ item, index })
              }
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  title: {
    ...FontStyle(18, colors.black, '700'),
    paddingLeft: wp(14),
    lineHeight: hp(26),
    marginTop: -5
  },
  categoriesTitle: {
    ...FontStyle(14, colors.black, '700'),
    lineHeight: hp(22),
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: wp(10),
    marginLeft: wp(17),
    marginTop: hp(12),
    backgroundColor: colors.white,
  },
  newHeader: {
    backgroundColor: colors.secondary_500,
    marginTop: hp(3),
  },
  HeaderTitle: {
    ...FontStyle(14, colors.black, '400'),
    lineHeight: hp(22),
    paddingVertical: hp(4),
    paddingLeft: wp(15),
  },
  notificationcontainer: {
    flex: 1,
  },
  Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(8),
    paddingTop: hp(7),
    paddingBottom: hp(4),
  },
  name: {
    ...FontStyle(14, colors.black, '400'),
  },
  nameContainer: {
    paddingLeft: wp(15),
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: wp(screen_width * 0.7),
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    ...FontStyle(11, colors.neutral_500, '400'),
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary_500,
  },
  requestContainer: {
    backgroundColor: colors.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingTop: hp(5),
    paddingBottom: hp(4),
    marginVertical: hp(11),
    marginHorizontal: wp(4),
    borderWidth: 1,
    borderColor: colors.neutral_400,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
  },
  centerContainer: {
    marginLeft: wp(13),
  },
  button: {
    backgroundColor: colors.primary_500,
    // paddingHorizontal: wp(15),
    borderRadius: 3,
    marginTop: hp(1),
    height: 30,
    justifyContent: 'center',
    width: 80,
    alignItems: 'center'
  },
  buttonText: {
    ...FontStyle(13, colors.white, '400'),
    // lineHeight: hp(20),
  },
  footerTitle: {
    ...FontStyle(14, colors.black, '400'),
    alignSelf: 'center',
  },
});
