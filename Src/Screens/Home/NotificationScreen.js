import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { FontStyle, ImageStyle } from '../../utils/commonFunction';
import { fontname, hp, screen_width, wp } from '../../Themes/Fonts';
import colors from '../../Themes/Colors';
import { Icons } from '../../Themes/Icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { onGetNotification } from '../../Services/AuthServices';
import NoDataFound from '../../Components/NoDataFound';
import RenderUserIcon from '../../Components/RenderUserIcon';

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
  const { user, notificationList } = useSelector(e => e.common)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onGetNotification({
      data: {
        loginUserId: user?._id
      }
    }))
  }, [])
  console.log('notificationList--', notificationList)

  const onPressBack = () => {
    goBack();
  };
  const renderItem = ({ item, index }) => {
    console.log(item)
    return (
      <>
        {item?.type !== 'follow-request' ? (
          <View style={styles.Container}>
            <View style={styles.leftSide}>
              <RenderUserIcon url={item?.createdBy?.avtar} height={45} />
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  {item?.createdBy?.first_Name} {item?.createdBy?.last_Name} {item?.type == 'message' ? 'has sent you a message' : item?.title}
                </Text>
              </View>
              <Text style={styles.time}>{item?.createdAt}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.requestContainer}>
            <View style={styles.leftSide}>
              <RenderUserIcon url={item?.createdBy?.avtar} height={45} />
              <View style={styles.centerContainer}>
                <Text style={styles.name}>
                  {item?.createdBy?.first_Name} {item?.createdBy?.last_Name} {item?.title}
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
              <Text style={styles.time}>{item?.createdAt}</Text>
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header logoShow={false} onLeftPress={onPressBack} showLeft />
      <Text style={styles.title}>{'Notifications'}</Text>
      {notificationList && <View style={styles.categoriesContainer}>
        <TouchableOpacity onPress={() => setCategories('All')}>
          <Text style={[styles.categoriesTitle, { color: categories == 'All' ? colors?.tertiary1_500 : colors?.black, },]}>
            {`All(${notificationList?.totalNotifications})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCategories('Requests')}>
          <Text style={[styles.categoriesTitle, { color: categories == 'Requests' ? colors?.tertiary1_500 : colors?.black, },]}>
            {`Connection Invite(${notificationList?.data.filter(obj => obj?.type == 'follow-request').length})`}
          </Text>
        </TouchableOpacity>
      </View>}
      {notificationList && <ScrollView>
        {notificationList?.data?.length > 0 ?

          <View>
            {categories == 'All' ? (
              <>
                <View style={styles.newHeader}>
                  <Text style={styles.HeaderTitle}>{'New'}</Text>
                </View>
                <View style={styles.notificationcontainer}>
                  <FlatList
                    inverted
                    data={notificationList?.data}
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
                  {/* <FlatList
                data={Data}
                ItemSeparatorComponent={() => (
                  <View style={styles.separator}></View>
                )}
                renderItem={renderItem}
              /> */}
                </View>
              </>
            ) : (
              <>
                <View style={styles.newHeader}>
                  <Text style={styles.HeaderTitle}>{'New'}</Text>
                </View>
                <View style={styles.notificationcontainer}>
                  {/* <FlatList
                data={Data}
                renderItem={({ item, index }) =>
                  item?.type == 'Requests' && renderItem({ item, index })
                }
              /> */}
                </View>
                <View style={styles.newHeader}>
                  <Text style={styles.HeaderTitle}>{'Older'}</Text>
                </View>
                {/* <FlatList
              data={Data}
              renderItem={({ item, index }) =>
                item?.type == 'Requests' && renderItem({ item, index })
              }
            /> */}
              </>
            )}
          </View>
          :

          <NoDataFound text={'No notifications yet – exciting updates coming soon!'} />
        }


      </ScrollView>}
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
    paddingHorizontal: 10,
    // paddingTop: hp(7),
    // paddingBottom: hp(4),
    paddingVertical: 10
  },
  name: {
    ...FontStyle(14, colors.black, '400'),
  },
  nameContainer: {
    flex: 1
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  time: {
    ...FontStyle(11, colors.neutral_500, '400'),
  },
  separator: {
    // borderBottomWidth: 1,
    backgroundColor: colors.secondary_500,
    height: 1,

  },
  requestContainer: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: wp(4),
    paddingVertical: hp(4),
    margin: 5,
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
    flex: 1
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
