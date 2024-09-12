import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  Share,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { currencyIcon, FontStyle, ImageStyle } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { screenName } from '../../Navigation/ScreenConstants';
import { hp, wp } from '../../Themes/Fonts';
import { Icons } from '../../Themes/Icons';
import CommonButton from '../../Components/CommonButton';
import RenderUserIcon from '../../Components/RenderUserIcon';
import RenderText from '../../Components/RenderText';
import moment from 'moment';
import {
  getCurrenciesListAction,
  getDetailsListAction,
  getToggleFavoriteAction,
} from '../../Services/PostServices';
import ShareProfileModal from '../../Components/ShareProfileModal';
import ShareEventModal from '../../Components/ShareEventModal';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const { activeEvent, user } = useSelector(e => e.common);
  const [isSelect, setIsSelect] = useState(activeEvent?.is_favorite);
  const [lastTap, setLastTap] = useState(0);
  const [shareModal, setshareModal] = useState(false);
  const [selectData, setSelectData] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrenciesListAction());
  }, []);

  useEffect(() => {
    getEventList();
  }, [activeEvent?._id,]);

  const getEventList = page => {
    let obj = {
      data: activeEvent?._id,
      onSuccess: res => {
        setIsSelect(res?.data?.is_favorite);
      },
    };
    dispatch(getDetailsListAction(obj));
  };

  const onStarPress = () => {
    const timeNow = Date.now();
    if (lastTap && timeNow - lastTap < 500) {
      console.log('Handle double press');
    } else {
      setLastTap(timeNow);
      setTimeout(() => {
        setLastTap(0);
        console.log('Handle single press');
      }, 1000);
      let obj = {
        data: {
          eventId: activeEvent?._id,
        },
        onSuccess: () => {
          setIsSelect(!isSelect);
        },
      };
      dispatch(getToggleFavoriteAction(obj));
    }
  };

  const RenderRowList = ({ icon, title }) => {
    return (
      <View style={[ApplicationStyles.row, { marginTop: 10 }]}>
        <Image source={icon} style={styles.iconRow} />
        <Text style={styles.titleDes}>{title}</Text>
      </View>
    );
  };

  const onSharePress = async link => {
    // setshareModal(true)
    // setSelectData(link)
    try {
      const result = await Share.share({
        message: `Check out this link: ${link}`, // Your message with a link
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Handle specific activity type if needed
        } else {
          // Alert.alert('Link shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        // Handle dismiss action
        Alert.alert('Share was dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }

    // try {
    //   const result = await Share.share({
    //     message: link,
    //   });
    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //     } else {
    //       // shared
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    // } catch (error) {
    //   alert(error.message);
    // }
  };
  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        showRight={user?._id == activeEvent?.createdBy?._id ? true : false}
        icon={Icons.editEvent}
        onRightPress={() => navigation.navigate(screenName.EditEventScreen,{createdBy: activeEvent?._id})}
        title={''}
        onlyLabel={'Event Details'}
        showLeft={true}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.postImage}>
          <Image
            source={
              activeEvent?.event_image?.location
                ? { uri: activeEvent?.event_image?.location }
                : require('../../assets/Icons/eventImage.jpg')
            }
            style={styles.image}
          />
        </View>
        <View style={styles.postDescriptionView}>
          <Text style={styles.title}>{activeEvent?.title}</Text>
          <RenderRowList
            icon={Icons.clock}
            title={`${moment(activeEvent.start_time).format(
              'HH:MM',
            )} - ${moment(activeEvent.end_time).format('HH:MM')} `}
          />
          <RenderRowList
            icon={Icons.calenderDate}
            title={moment(activeEvent.start_time).format('dddd, MM/DD/YYYY')}
          />
          <RenderRowList icon={Icons.map} title={activeEvent?.address} />
          <RenderRowList
            icon={Icons.tickets}
            title={`${currencyIcon(activeEvent?.currency)}${activeEvent?.event_fee
              }`}
          />
          <RenderRowList
            icon={Icons.contacts}
            title={activeEvent?.mobile || activeEvent?.email}
          />
          {/* <RenderRowList icon={Icons.contacts} title={'+44 7899653486'} /> */}
          <View style={styles.bottomRow}>
            <Text style={[styles.titleDes, { marginBottom: 10 }]}>
              {activeEvent?.attendeeCount}
            </Text>
            <Image source={Icons.group} style={styles.usersIcon} />
            {user?._id !== activeEvent?.createdBy?._id && (
              <TouchableOpacity
                onPress={() => onStarPress()}
                style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                <Image
                  source={isSelect ? Icons.star : Icons.starOutline}
                  style={ImageStyle(20, 20)}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                onSharePress(activeEvent?.share_link);
              }}
              style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
              <Image source={Icons.share} style={ImageStyle(24, 24)} />
            </TouchableOpacity>
          </View>
        </View>
        {user?._id !== activeEvent?.createdBy?._id && (
          <View style={styles.blueView}>
            <RenderUserIcon type="user" url={''} height={40} />
            <View style={ApplicationStyles.flex}>
              <Text style={styles.name}>By {activeEvent?.page_owner}</Text>
              <Text style={styles.address}>
                {activeEvent?.createdBy?.profession},
                {activeEvent?.createdBy?.region}
              </Text>
            </View>
            {/* <CommonButton
            title={'Connect'}
            extraStyle={{width: 110, height: 50}}
          /> */}
          </View>
        )}
        <View style={styles.postDescriptionView}>
          <Text style={FontStyle(14, colors.neutral_900, '700')}>
            Description
          </Text>
          <RenderText
            style={[FontStyle(12, colors.neutral_900), { marginVertical: hp(8) }]}
            text={activeEvent?.description}
          />
        </View>
        {user?._id !== activeEvent?.createdBy?._id && (
          <View style={[styles.blueView, { marginVertical: hp(30) }]}>
            <CommonButton
              onPress={() =>
                navigation.navigate(screenName.AttendanceRequestScreen)
              }
              title={'Attend'}
              extraStyle={{ width: 110, height: 50 }}
            />
          </View>
        )}
        {user?._id == activeEvent?.createdBy?._id && (
          <View style={[styles.blueView, { marginVertical: hp(30) }]}>
            <CommonButton
              onPress={() =>
                navigation.navigate(screenName.ListParticipantsScreen)
              }
              title={'List of Participants'}
              extraStyle={{ width: 170, height: 50 }}
            />
          </View>
        )}
        {shareModal && (
          <ShareEventModal
            visible={shareModal}
            postId={'item._id'}
            onClose={() => setshareModal(false)}
            item={selectData}
            eventShare={true}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: 236,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.neutral_800,
  },
  postImage: {
    backgroundColor: colors.secondary_500,
    padding: 3,
  },
  postDescriptionView: {
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.neutral_900,
    padding: 5,
  },
  title: {
    ...FontStyle(20, colors.neutral_900, '700'),
  },
  iconRow: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  titleDes: {
    ...FontStyle(14, colors.neutral_900),
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  usersIcon: {
    height: 23,
    width: 23,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  blueView: {
    backgroundColor: colors.secondary_500,
    paddingHorizontal: wp(20),
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 3,
    justifyContent: 'center',
  },
  name: {
    ...FontStyle(16, colors.neutral_900, '700'),
  },
  address: {
    ...FontStyle(11, colors.neutral_900),
  },
});
