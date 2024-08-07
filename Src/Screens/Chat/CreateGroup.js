import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Header from '../../Components/Header';
import { hp, SCREEN_WIDTH, wp } from '../../Themes/Fonts';
import { errorToast, FontStyle, ImageStyle, searchUserByName } from '../../utils/commonFunction';
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
import { SET_MAIN_FOLLOWER_LIST } from '../../Redux/ActionTypes';
import { dispatchAction } from '../../utils/apiGlobal';
import NoDataFound from '../../Components/NoDataFound';
import CommonButton from '../../Components/CommonButton';


export default function CreateGroup() {
  const { navigate, goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tabSelectionIndex, setTabSelectionIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState('INDIANS');
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState(false);
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
  const { followerList, user, mainFollowerList } = useSelector(e => e.common)
  const [list, setlist] = useState(undefined)

  useEffect(() => {
    if (followerList && followerList.length > 0) {
      followerList.forEach(element => {
        element.isSelected = false
      });
      setlist(followerList)
      dispatchAction(dispatch, SET_MAIN_FOLLOWER_LIST, followerList)
    }
  }, [followerList])
  const setSelect = (id) => {
    let temp = Object.assign([], mainFollowerList)
    temp.forEach(element => {
      if (element._id == id) {
        element.isSelected = !element.isSelected
      }

    });
    setlist(temp)
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
    }, 500);
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
        setimage(image)
      }).catch(error => { console.log('err---', error); });
    }, 500);

  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={[ApplicationStyles.row, { paddingHorizontal: hp(10) }]}>
        <View style={[ApplicationStyles.row, styles.listView]}>
          <RenderUserIcon url={item?.followingId?.avtar} height={48} isBorder={item?.followingId?.subscribedMember} />
          <Text style={styles.listText}>{item?.followingId?.first_Name} {item?.followingId?.last_Name}</Text>
        </View>
        <TouchableOpacity onPress={() => setSelect(item._id)}>
          <Image
            source={item?.isSelected ? Icons.checkbox1 : Icons.checkbox}
            style={[ImageStyle(20, 20), { top: 1, marginRight: 6 }]}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const onSearchName = (search) => {
    // let tempList = Object.assign([], mainFollowerList)

    let arr = searchUserByName(mainFollowerList, 'followingId', search)
    setlist(arr)
    // const filtered = tempList.filter((val) =>
    //     val.followingId.first_Name.toLowerCase().includes(search.toLowerCase())
    // );
    // const filter2 = tempList.filter((val) =>
    //     val.followingId.last_Name.toLowerCase().includes(search.toLowerCase())
    // );
    // let searchTextContact = Object.values(
    //     filtered.concat(filter2).reduce((r, o) => {
    //         r[o._id] = o;
    //         return r;
    //     }, {})
    // );
    // setlist(searchTextContact)
  }

  const onCreateGroup = () => {
    let temp = mainFollowerList.filter(element => element.isSelected == true)
    if (groupName.trim() == '') {
      errorToast('Please enter group name')
    } else if (temp.length == 0) {
      errorToast('Please select at least one member')
    } else {

    }
  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={''}
        showLeft={true}
        showRight={false}
        onLeftPress={() => goBack()}
      />

      <Text style={styles.chatText}>Create Group</Text>
      <View
        style={{
          marginHorizontal: wp(20),
          flexDirection: 'row',
          alignItems: 'center',
        }}>

        <TouchableOpacity onPress={() => setActionSheet(true)} style={styles.addImage}>
          {image ?
            <Image style={{
              width: 66,
              height: 66,
              borderRadius: 66 / 2
            }} source={image ? { uri: image.path } : Icons.camera} />
            :
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image source={Icons.addImage1} style={styles.addImage1} />
            </View>
          }
          <ReactNativeModal
            onBackdropPress={() => closeActionSheet()}
            isVisible={actionSheet}
            style={{ margin: 0, justifyContent: 'flex-end', }}>
            <ActionSheet actionItems={actionItems} onCancel={closeActionSheet} />
          </ReactNativeModal>
        </TouchableOpacity>


        {/* <TouchableOpacity style={styles.addImage}>
          <Image source={Icons.addImage1} style={styles.addImage1} />
        </TouchableOpacity> */}
        {/* <Input placeholder={'Group Name'} style={styles.inputText} /> */}
        <Input onChangeText={setgroupName} value={groupName} placeholder={'Group Name'} extraStyle={styles.inputText} />
        {/* <TextInput placeholder={'Group Name'} style={styles.inputText} /> */}
      </View>
      <Input extraStyle={styles.inputText1} onChangeText={setdes} value={des} placeholder={'Description of group'} />
      {/* <Input placeholder={'Description of group'} extraStyle={styles.inputText1} /> */}

      <Text style={styles.searchText}>Add Group Member</Text>
      <SearchBar
        value={searchText}
        onChangeText={text => { setSearchText(text), onSearchName(text) }}
        placeholder={'Search'}
        containerStyles={{ marginVertical: 5 }}
      />
      {list && <FlatList
        data={list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoDataFound />}

      />}
      <View style={styles.footer}>
        <TouchableOpacity style={{
          height: 55,
          justifyContent: 'center'
        }} onPress={() => goBack()}>
          <Text style={styles.cancelBtn}>Cancel</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.createBtn}>
          <Text>Create</Text>
        </TouchableOpacity> */}
        <CommonButton onPress={() => onCreateGroup()} title={'Create'} extraStyle={{ paddingHorizontal: 20 }} />
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
