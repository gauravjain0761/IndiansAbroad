import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ApplicationStyles from '../Themes/ApplicationStyles';
import Header from '../Components/Header';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import {fontname, hp, screen_width, wp} from '../Themes/Fonts';
import colors from '../Themes/Colors';
import {Icons} from '../Themes/Icons';

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

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.Container}>
        <Image
          source={item?.image}
          style={[ImageStyle(44, 44), {borderRadius: 100, overflow: 'hidden'}]}
          resizeMode="contain"
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {item?.name} {item?.content}
          </Text>
        </View>
        <Text>{item?.time}</Text>
      </View>
    );
  };

  return (
    <View style={ApplicationStyles.applicationView}>
      <Header logoShow={false} showLeft />
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
            {'Requests(4)'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newHeader}>
        <Text style={styles.HeaderTitle}>{'New'}</Text>
      </View>
      <View style={styles.notificationcontainer}>
        <FlatList data={Data} renderItem={renderItem} />
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
  categoriesTitle: {
    ...FontStyle(fontname.actor_regular, 14, colors.black, '400'),
    lineHeight: hp(22),
  },
  categoriesContainer: {
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
  notificationcontainer: {},
  Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...FontStyle(fontname.actor_regular, 14, colors.black, '400'),
  },
  nameContainer: {
    paddingLeft: wp(15),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'yellow',
    maxWidth: wp(screen_width * 0.7),
  },
});
