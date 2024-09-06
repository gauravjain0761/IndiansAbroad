import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Icons } from '../Themes/Icons';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { SCREEN_WIDTH, fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import RenderUserIcon from './RenderUserIcon';
import PostMoreModal from './PostMoreModal';
import { useDispatch, useSelector } from 'react-redux';
import RenderText from './RenderText';
import PostCarousal from './PostCarousal';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { onDeleteThread, onGetThreadList } from '../Services/DiscussionServices';
import ConfirmationModal from './ConfirmationModal';

export default function DiscussionForumDetailCard({ item, index }) {
  const [menuModal, setmenuModal] = useState(false);
  const { user, discussionCountry } = useSelector(e => e.common)
  let isUser = item?.createdBy?._id == user._id;
  const [textShown, setTextShown] = useState(false);
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [deletePostModal, setDeletePostModal] = useState(false);

  const onPressDeleteThread = () => {
    setDeletePostModal(false);
    let obj = {
      data: {
        threadId: item._id,
      },
      onSuccess: () => {
        navigation.goBack()
        let temp = discussionCountry.filter(obj => obj.isSelected)
        let obj1 = {
          data: {
            page: 0,
            searchText: '',
            countryId: temp[0]._id,
            userId: user?._id
          }
        }
        dispatch(onGetThreadList(obj1))
      },
      onFailure: () => { },
    };
    dispatch(onDeleteThread(obj));
  }

  return (
    <View key={index}>
      <View style={styles.headerView}>
        <RenderUserIcon type='user' height={57} userId={item?.createdBy?._id} url={item?.createdBy?.avtar} isBorder={item?.createdBy?.subscribedMember} />
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate(screenName.indiansDetails, { userId: item?.createdBy?._id })} style={ApplicationStyles.flex}>
          <Text style={styles.username}>{item?.createdBy?.first_Name} {item?.createdBy?.last_Name}</Text>
          {!isUser && <Text style={styles.degreeText1}>{item?.createdBy?.profession}</Text>}
          <Text style={styles.degreeText}>{item?.createdDate ? item?.createdDate : item?.createdAt}</Text>
        </TouchableOpacity>
        {isUser && (
          <TouchableOpacity onPress={() => setDeletePostModal(true)} style={styles.messageView}>
            <Image source={Icons.trash} style={ImageStyle(30, 30, 'cover')} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={styles.description}>
          {item?.title}
        </Text>
        {item?.message && item?.message !== '' && (
          <RenderText
            style={styles.description1}
            text={item?.message}
            showReadMore
          />
        )}
        {/* {item?.message && item?.message !== '' &&
          <Text style={styles.description} >
            {item?.message.length > 120 && !textShown ? `${item?.message.substring(0, 120)}...` : item?.message}
          </Text>} */}
        {/* {item?.message && item?.message !== '' && item?.message.length > 120 ? (
          <TouchableOpacity
            onPress={() => {
              setTextShown(!textShown);
            }}>
            <Text style={styles.aboutTextMore}>{`${!textShown ? 'Read more' : 'Read less'
              }`}</Text>
          </TouchableOpacity>
        ) : null} */}
      </View>
      {item?.mediaFiles.length > 0 && (
        <PostCarousal
          // poster={item?.thumbNail}
          // isDetailScreen={isDetailScreen}
          images={item?.mediaFiles}
        />
      )}
      {deletePostModal && (
        <ConfirmationModal
          visible={deletePostModal}
          onClose={() => setDeletePostModal(false)}
          title={`Are you sure you want to delete this thread?`}
          successBtn={'Delete'}
          canselBtn={'No'}
          onPressCancel={() => setDeletePostModal(false)}
          onPressSuccess={() => onPressDeleteThread()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userImage: {
    height: 57,
    width: 57,
    borderRadius: 57 / 2,
  },
  username: {
    ...FontStyle(14, colors.neutral_900, "700"),
    // lineHeight:18
  },
  degreeText: {
    ...FontStyle(12, colors.neutral_900),
    // lineHeight:18
  },
  degreeText1: {
    ...FontStyle(12, colors.neutral_900),
    // lineHeight:18
  },
  messageView: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  description: {
    ...FontStyle(16, colors.neutral_900, '700'),
    paddingBottom: 4,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  description1: {
    ...FontStyle(14, colors.neutral_900, '400'),
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  postImage: {
    height: SCREEN_WIDTH - 5,
    resizeMode: 'contain',
    width: SCREEN_WIDTH - 5,
    borderRadius: 4,
    alignSelf: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: colors.secondary_500,
  },
  middlerow: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  modalView: {
    backgroundColor: colors.neutral_300,
    paddingHorizontal: 3,
  },
  modalUserName: {
    ...FontStyle(16, colors.neutral_900, '700'),
    paddingVertical: 15,
    textAlign: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral_800,
  },
  modalText: {
    ...FontStyle(18, colors.neutral_900),
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  aboutTextMore: {
    ...FontStyle(14, colors.primary_500),
    paddingBottom: 10,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: -25,
    paddingTop: 10,
  },
});
