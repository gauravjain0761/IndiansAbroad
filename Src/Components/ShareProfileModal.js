import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image, Linking, Alert, Share, } from 'react-native';
import ModalContainer from './ModalContainer';
import colors from '../Themes/Colors';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { SCREEN_HEIGHT, fontname, hp, wp } from '../Themes/Fonts';
import RenderUserIcon from './RenderUserIcon';
import { FontStyle, ImageStyle, errorToast, searchUserByName, } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFollowerList, onShareApi } from '../Services/PostServices';
import { dispatchAction } from '../utils/apiGlobal';
import { IS_LOADING, SET_MAIN_FOLLOWER_LIST } from '../Redux/ActionTypes';
import SearchBar from './SearchBar';
import NoDataFound from './NoDataFound';
import CommonButton from './CommonButton';
import { onProfileShareApi } from '../Services/OtherUserServices';

const ShareData = [
  { id: 1, name: 'Quick Share', icon: Icons.ic_sahre },
  { id: 2, name: 'WhatsApp', icon: Icons.ic_whatapp },
  { id: 3, name: 'Gmail', icon: Icons.ic_mail },
  { id: 4, name: 'WhatsApp\nBusiness', icon: Icons.ic_w_b },
  { id: 5, name: 'Messages', icon: Icons.ic_message },
];

export default function ShareProfileModal({ visible, onClose, postId, isThread, eventShare, item, }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { followerList, user, mainFollowerList } = useSelector(e => e.common);
  const [list, setlist] = useState(undefined);
  const [searchText, setSearchText] = useState('');
  const [mainList, setmainList] = useState(undefined);

  useEffect(() => {
    dispatch(getFollowerList({ data: { userId: user._id, search: '' }, }),);
  }, []);

  useEffect(() => {
    if (followerList && followerList.length > 0) {
      followerList.forEach(element => {
        element.isSelected = false;
      });
      setlist(followerList);
      dispatchAction(dispatch, SET_MAIN_FOLLOWER_LIST, followerList);
    }
  }, [followerList]);

  const setSelect = id => {
    let temp = Object.assign([], mainFollowerList);
    temp.forEach(element => {
      if (element._id == id) {
        element.isSelected = !element.isSelected;
      }
    });
    setlist(temp);
  };

  const onShareIconPress = list => {
    console.log('ayaaa---', list)
    // onClose()
    if (list.id == 1) {
      onShare()
    } else if (list.id == 2) {
      const message = 'Check out this awesome link!';
      const url = item; // Your link here
      const whatsAppUrl = `whatsapp://send?text=${encodeURIComponent(
        message,
      )}%20${encodeURIComponent(url)}`;
      onWhatsAppBusinessUrl(whatsAppUrl);
    } else if (list.id == 3) {
      const subject = 'Check this out!';
      const body = `Here's a great link I found: ${item}`; // Your link here
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      onLinkShare(mailtoUrl);
    } else if (list.id == 4) {
      const message = "Check out this awesome link!";
      const url = item; // Your link here
      const whatsAppBusinessUrl = `whatsapp-business://send?text=${encodeURIComponent(message)}%20${encodeURIComponent(url)}`;
      onWhatsAppBusinessUrl(whatsAppBusinessUrl);
    } else if (list.id == 5) {
      const message = `Check out this link:  ${item}`; // Your link here
      const phoneNumber = ''; // Optionally specify a phone number
      // Construct the URL for the SMS
      const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
      onLinkShare(smsUrl);
    }
  };

  const onLinkShare = url => {
    Linking.openURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Email client is not available');
        }
      })
      .catch(err => console.log('An error occurred', err));
  };
  const onWhatsAppBusinessUrl = url => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("WhatsApp Business is not installed on your device");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this link: ${item}`, // Your message with a link
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
  };

  const onPressShare = () => {
    let temp = mainFollowerList.filter(element => element.isSelected == true);
    if (temp.length > 0) {
      dispatchAction(dispatch, IS_LOADING, true);
      onClose();
      let idArray = [];
      temp.forEach(element => {
        idArray.push(element?.followingId?._id);
      });
      let obj = {
        data: {
          userIds: idArray.toString(),
          loginUserId: user._id,
          type: 'user',
          profileId: item._id,
        },
      };
      dispatch(onProfileShareApi(obj));
    } else {
      errorToast('Please select atleast one of the following');
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={[ApplicationStyles.row, { paddingHorizontal: hp(10) }]}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setSelect(item._id)}
          style={[ApplicationStyles.row, styles.listView]}>
          <RenderUserIcon
            type="user"
            url={item?.followingId?.avtar}
            height={48}
            isBorder={item?.followingId?.subscribedMember}
          />
          <Text style={styles.listText}>
            {item?.followingId?.first_Name} {item?.followingId?.last_Name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setSelect(item._id)}>
          <Image
            source={item?.isSelected ? Icons.checkbox1 : Icons.checkbox}
            style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onSearchName = search => {
    let arr = searchUserByName(mainFollowerList, 'followingId', search);
    setlist(arr);
  };

  return (
    <ModalContainer
      statusBarTranslucent={true}
      avoidKeyboard={false}
      isVisible={visible}
      onClose={() => onClose()}
      transparent={true}>
      <View
        style={[
          styles.modalView,
        ]}>
        <TouchableOpacity onPress={() => onClose()} style={styles.closeIcon}>
          <Image
            source={Icons.closeRound}
            style={[ImageStyle(36, 36)]}
          />
        </TouchableOpacity>
        <View style={styles.headerView}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={searchText}
              onChangeText={text => {
                setSearchText(text), onSearchName(text);
              }}
              placeholder={'Search'}
              containerStyles={{ backgroundColor: colors.neutral_300 }}
            />
          </View>
          {/* <CommonButton onPress={() => onPressShare()} extraStyle={{ width: 100, height: 45, marginRight: wp(12) }} title={'Share'} /> */}
        </View>

        {followerList && (
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={{ height: SCREEN_HEIGHT / 1.5 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoDataFound />}
          />
        )}
        {list && list.length > 0 && <TouchableOpacity onPress={() => onPressShare()} style={styles.blueButton}>
          <Text style={styles.publishText}>Share</Text>
        </TouchableOpacity>}
        {/* <View style={styles.rowStyle}>
          {ShareData.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  eventShare && onShareIconPress(item);
                }}>
                <Image
                  source={item.icon}
                  style={[styles.iconStyle, { top: item.id == 4 ? 9 : 0 }]}
                />
                <Text style={[styles.listText1, { top: item.id == 4 ? 14 : 7 }]}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View> */}
        <View style={{ paddingBottom: insets.bottom }} />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: colors.neutral_300,
    paddingTop: 10,
  },
  listText: {
    ...FontStyle(14, colors.neutral_900),
    marginLeft: 15,
    flex: 1,
  },
  listView: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: colors.neutral_400,
    // backgroundColor: colors.inputBg,
    flex: 1,
  },
  publishText: {
    ...FontStyle(14, colors.white),
  },
  blueButton: {
    backgroundColor: colors.buttonBlue,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    width: 87,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: hp(20),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    paddingHorizontal: hp(10),
  },
  iconStyle: {
    width: 53,
    height: 53,
    resizeMode: 'contain',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131318FF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    // paddingTop:1,
    paddingBottom: 20,
  },
  listText1: {
    ...FontStyle(10, colors.secondary_900),
    textAlign: 'center',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
