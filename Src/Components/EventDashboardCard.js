import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../Themes/Colors';
import ApplicationStyles from '../Themes/ApplicationStyles';
import {Icons} from '../Themes/Icons';
import {wp} from '../Themes/Fonts';
import {FontStyle, ImageStyle} from '../utils/commonFunction';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {screenName} from '../Navigation/ScreenConstants';
import {useNavigation} from '@react-navigation/native';
import {dispatchAction} from '../utils/apiGlobal';
import {SET_ACTIVE_EVENT} from '../Redux/ActionTypes';
import {
  getSaveListAction,
  getToggleFavoriteAction,
} from '../Services/PostServices';
import ShareProfileModal from './ShareProfileModal';

export default function EventDashboardCard({item, index, onRefresh}) {
  const {user} = useSelector(e => e.common);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isSelect, setIsSelect] = useState(item?.is_favorite);
  const [lastTap, setLastTap] = useState(0);
  const [shareModal, setshareModal] = useState(false);
  const [selectData, setSelectData] = useState("");

  const onSharePress = async link => {
    setshareModal(true)
    setSelectData(link)
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

  const onStarPres = () => {
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
          eventId: item?._id,
        },
        onSuccess: () => {
          onRefresh && onRefresh();
        },
      };
      dispatch(getToggleFavoriteAction(obj));
    }
  };

  return (
    <View key={index} style={styles.cardView}>
      <View style={styles.innerCard}>
        <Image
          style={styles.cardImage}
          source={
            item?.event_image?.location
              ? {uri: item?.event_image?.location}
              : require('../assets/Icons/eventImage.jpg')
          }
        />
        <View style={styles.footer}>
          <View style={ApplicationStyles.row}>
            <View style={ApplicationStyles.flex}>
              <Text style={styles.title}>{item?.title}</Text>
              <Text style={styles.organizerText}>By {item?.page_owner}</Text>
            </View>
            <View style={ApplicationStyles.row}>
              <Text style={FontStyle(14, colors.neutral_900)}>
                {item?.attendeeCount || 0}
              </Text>
              <Image source={Icons.group} style={styles.usersIcon} />
            </View>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.addressText}>
              {item?.address}, {moment(item?.start_time).format('MM/DD/YYYY')}
            </Text>
            {user?._id !== item?.createdBy && (
              <TouchableOpacity
                onPress={() => {
                  dispatchAction(dispatch, SET_ACTIVE_EVENT, item);
                  navigation.navigate(screenName.AttendanceRequestScreen);
                }}
                style={{paddingHorizontal: 10, paddingBottom: 10}}>
                <Image source={Icons.checkSquare} style={ImageStyle(20, 20)} />
              </TouchableOpacity>
            )}
            {user?._id !== item?.createdBy && (
              <TouchableOpacity
                onPress={onStarPres}
                style={{paddingHorizontal: 10, paddingBottom: 10}}>
                <Image
                  source={item?.is_favorite ? Icons.star : Icons.starOutline}
                  style={ImageStyle(20, 20)}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onSharePress(item?.share_link)}
              style={{paddingHorizontal: 10, paddingBottom: 10}}>
              <Image source={Icons.share} style={ImageStyle(24, 24)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {shareModal && (
        <ShareProfileModal 
          visible={shareModal}
          postId={"item._id"}
          onClose={() => setshareModal(false)}
          item={selectData}
          eventShare={true}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    borderBottomWidth: 3,
    borderBottomColor: colors.secondary_500,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  innerCard: {
    borderWidth: 1,
    borderColor: colors.neutral_800,
    borderRadius: 4,
  },
  cardImage: {
    resizeMode: 'cover',
    height: 236,
    width: '100%',
  },
  footer: {
    paddingLeft: 5,
    paddingVertical: 5,
    paddingRight: wp(5),
  },
  usersIcon: {
    height: 23,
    width: 23,
    resizeMode: 'contain',
    marginLeft: 5,
    marginRight: 10,
  },
  title: {
    ...FontStyle(16, colors.neutral_900, '700'),
    marginRight: 10,
  },
  organizerText: {
    ...FontStyle(12, colors.neutral_900, '700'),
    marginRight: 10,
  },
  addressText: {
    ...FontStyle(12, colors.neutral_900),
    flex: 1,
    paddingBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
