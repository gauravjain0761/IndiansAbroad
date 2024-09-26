import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { hp, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { errorToast, FontStyle, ImageStyle, searchUserByName, successToast } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import SearchBar from '../../Components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { Icons } from '../../Themes/Icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../Components/Input';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from '../../Components/ActionSheet';
import ReactNativeModal from 'react-native-modal';
import { IS_LOADING, SET_ACTIVE_CHAT_ROOM_USER } from '../../Redux/ActionTypes';
import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal';
import NoDataFound from '../../Components/NoDataFound';
import CommonButton from '../../Components/CommonButton';
import { onGetChatDetail, onGetGroupCreateUser } from '../../Services/ChatServices';
import { api } from '../../utils/apiConstants';


export default function EditGroup() {
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const { chatMessageList, user, groupCreateAllUsers, activeChatRoomUser, activeChatDetails, activeChatMediaLinks } = useSelector(e => e.common);

  const actionItems = [
    {
      id: 1,
      label: 'Open Camera',
      onPress: () => {
        openPicker();
      },
    },
    {
      id: 2,
      label: 'Open Gallery',
      onPress: () => {
        openGallery();
      },
    },
  ];
  const [actionSheet, setActionSheet] = useState(false);
  const closeActionSheet = () => setActionSheet(false);
  const [image, setimage] = useState(undefined)
  const [groupName, setgroupName] = useState('')
  const [des, setdes] = useState('')
  const [list, setlist] = useState(undefined)
  const [selectedUsers, setselectedUsers] = useState([])

  useEffect(() => {
    setselectedUsers([])
    let obj = {
      params: {
        search: '',
        groupId: 'NA'
      },
      onSuccess: (res) => {
        setlist(res?.data)
      }
    }
    dispatch(onGetGroupCreateUser(obj))
  }, [])
  console.log(activeChatDetails, image, activeChatRoomUser?.chatId)

  useEffect(() => {
    setgroupName(activeChatDetails?.chatName)
    setdes(activeChatDetails?.chatDesc)
    if (activeChatDetails?.users?.length > 0) {
      let user = activeChatDetails?.users?.filter(obj => obj._id !== user?._id)
      let temp = []
      user.forEach(element => {
        temp.push(element?._id)
      });
      setselectedUsers(temp)
    }
    setimage(activeChatDetails?.chatLogo?.length > 0 ? activeChatDetails?.chatLogo[0]?.location : undefined)
  }, [])



  const setSelect = (id) => {
    let temp = Object.assign([], selectedUsers)
    if (temp.includes(id)) {
      const index = temp.indexOf(id);
      if (index > -1) { // only splice array when item is found
        temp.splice(index, 1); // 2nd parameter means remove one item only
      }
      setselectedUsers(temp)
    } else {
      temp.push(id)
      setselectedUsers(temp)
    }
  }

  const openPicker = () => {
    closeActionSheet();
    setTimeout(() => {
      ImageCropPicker.openCamera({
        mediaType: 'photo',
        multiple: false,
        cropping: true,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
      }).then(image => {
        setimage(image)
      }).catch(error => { console.log('err---', error); });
    }, 1000);
  };
  const openGallery = () => {
    closeActionSheet()
    setTimeout(() => {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        multiple: false,
        cropping: true,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
      }).then(image => {
        if (image.size <= 20000000) {
          setimage(image)
        } else {
          errorToast('Image should be less than 20 MB')
        }
      }).catch(error => { console.log('err---', error); });
    }, 1000);

  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={[ApplicationStyles.row, { paddingHorizontal: hp(10) }]}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setSelect(item._id)} style={[ApplicationStyles.row, styles.listView]}>
          <RenderUserIcon type='user' url={item?.avtar} height={48} isBorder={item?.subscribedMember} />
          <Text style={styles.listText}>{item?.first_Name} {item?.last_Name}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setSelect(item._id)}>
          <Image
            source={selectedUsers.includes(item?._id) ? Icons.checkbox1 : Icons.checkbox}
            style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const onSearchName = (search) => {
    let arr = searchUserByName(groupCreateAllUsers, undefined, search)
    setlist(arr)
  }

  const onEditGroup = () => {
    if (groupName.trim() == '') {
      errorToast('Please enter group name')
    } else if (des.trim() == '') {
      errorToast('Please enter group description')
    } else if (selectedUsers.length == 0) {
      errorToast('Please select at least one member')
    } else {
      let data = {}
      data.chatId = activeChatRoomUser?.chatId
      data.chatName = groupName.trim()
      data.chatDesc = des.trim()
      data.isGroupChat = true
      data.createdBy = user?._id
      if (image?.path) {
        let time = new Date().getTime()
        data['chatLogo'] = {
          uri: image.path,
          type: image.mime, // or photo.type image/jpg
          name: 'chatLogo_[' + time + '].' + image.path.split('.').pop()
        }
      }
      selectedUsers.map((element, index) => {
        data['users' + "[" + index + "]"] = element
      })
      // data['users' + "[" + selectedUsers.length + "]"] = user?._id
      dispatchAction(dispatch, IS_LOADING, true)
      formDataApiCall(api.editGroup, data, (res) => {
        let obj = { data: { userId: user?._id, chatId: activeChatRoomUser?.chatId } }
        dispatch(onGetChatDetail(obj))
        dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser: { ...activeChatRoomUser?.currentUser, chatName: res?.chatName, chatLogo: res?.chatLogo }, chatId: activeChatRoomUser.chatId })
        dispatchAction(dispatch, IS_LOADING, false)
        successToast(res.msg)
        goBack()
      }, () => {
        dispatchAction(dispatch, IS_LOADING, false)
      })
    }
  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={''} showLeft={true} showRight={false} onLeftPress={() => goBack()} />
      <Text style={styles.chatText}>Edit Group</Text>
      <View style={{ marginHorizontal: wp(20), flexDirection: 'row', alignItems: 'center', }}>
        <TouchableOpacity onPress={() => setActionSheet(true)} style={styles.addImage}>
          {image ?
            <Image style={{ width: 66, height: 66, borderRadius: 66 / 2 }} source={image?.path ? { uri: image.path } : { uri: image }} />
            :
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image source={Icons.addImage1} style={styles.addImage1} />
            </View>
          }
          <ReactNativeModal onBackdropPress={() => closeActionSheet()} isVisible={actionSheet} style={{ margin: 0, justifyContent: 'flex-end', }}>
            <ActionSheet actionItems={actionItems} onCancel={closeActionSheet} />
          </ReactNativeModal>
        </TouchableOpacity>
        <Input maxLength={100} onChangeText={setgroupName} value={groupName} placeholder={'Group Name'} extraStyle={styles.inputText} />
      </View>
      <Input maxLength={300} extraStyle={styles.inputText1} onChangeText={setdes} value={des} placeholder={'Description of group'} />
      {/* <Text style={styles.searchText}>Add Group Member</Text>
      <SearchBar value={searchText} onChangeText={text => { setSearchText(text), onSearchName(text) }} placeholder={'Search'} containerStyles={{ marginVertical: 5 }} />
      {list && <FlatList keyExtractor={(item, index) => index.toString()} data={list} renderItem={renderItem} showsVerticalScrollIndicator={false} ListEmptyComponent={<NoDataFound />} />} */}
      <View style={styles.footer}>
        <TouchableOpacity style={{ height: 55, justifyContent: 'center' }} onPress={() => goBack()}>
          <Text style={styles.cancelBtn}>Cancel</Text>
        </TouchableOpacity>
        <CommonButton onPress={() => onEditGroup()} title={'Edit'} extraStyle={{ paddingHorizontal: 20 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatText: {
    top: -19,
    textAlign: 'center',
    ...FontStyle(16, colors.neutral_900, '400'),
  },
  searchText: {
    marginHorizontal: wp(22),
    ...FontStyle(13, colors.neutral_900, '400'),
  },
  addImage1: {
    width: 24,
    height: 24,
  },
  addImage: {
    borderWidth: 1,
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 68,
    backgroundColor: colors.neutral_300,
    borderStyle: 'dashed',
    borderColor: colors.neutral_500,
  },
  inputText: {
    flex: 1,
    marginLeft: 20,
  },
  inputText1: {
    paddingVertical: wp(20),
    marginHorizontal: wp(20),
  },
  tabMainView: {
    flexDirection: 'row',
  },
  tabItemView: {
    flex: 1,
    padding: wp(15),
    borderRadius: 50,
    alignItems: 'center',
  },
  listText: {
    ...FontStyle(14, colors.neutral_900),
    marginLeft: 15,
  },
  listView: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: colors.neutral_400,
    // backgroundColor: colors.inputBg,
    flex: 1,
  },
  lineStyle: {
    borderWidth: 0.6,
    marginVertical: 6,
    borderColor: colors.secondary_500,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: wp(20),
    paddingVertical: wp(20),
    alignItems: 'center',
  },
  cancelBtn: {
    ...FontStyle(16, colors.neutral_900),
    paddingHorizontal: 20,
  },
  createBtn: {

  }
});
