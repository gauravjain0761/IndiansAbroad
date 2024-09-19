import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, } from 'react-native';
import { hp, wp } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import { Icons } from '../Themes/Icons';
import { errorToast, FontStyle } from '../utils/commonFunction';
import DocumentPicker, { pick } from 'react-native-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchAction, formDataApiCall } from '../utils/apiGlobal';
import { api } from '../utils/apiConstants';
import { ADD_ONE_MESSAGE } from '../Redux/ActionTypes';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { createThumbnail } from 'react-native-create-thumbnail';
import TagUserInput from './TagUserInput';
import ActionSheet from '../Components/ActionSheet'
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';


const ChatInput = ({ message, setmessage, onSend, showMediaAdd = true }) => {
  const { user, activeChatRoomUser, groupCreateAllUsers } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [showTagModal, setshowTagModal] = useState(false)
  const [userList, setuserList] = useState([])
  const [actionSheet, setActionSheet] = useState(false);
  const closeActionSheet = () => setActionSheet(false);

  const actionItems = [
    {
      id: 1,
      label: 'Photo',
      onPress: () => {
        openGallery('photo');
      },
    },
    {
      id: 1,
      label: 'Video',
      onPress: () => {
        openGallery('video');
      },
    },
    {
      id: 2,
      label: 'File',
      onPress: () => {
        openPicker();
      },
    },
  ];

  const openGallery = async (type) => {
    closeActionSheet()
    setTimeout(async () => {
      ImageCropPicker.openPicker({ cropping: type == 'photo', mediaType: type, freeStyleCropEnabled: true, })
        .then(image => {
          console.log(image)
          let time = new Date().getTime()
          image = {
            ...image,
            uri: image.path,
            type: image.mime, // or photo.type image/jpg
            name: 'chatMedia_[' + time + '].' + image.path.split('.').pop()
          }
          if (type.includes('photo')) {
            navigation.navigate(screenName.MediaWithInputScreen, { result: image })
          } else if (type.includes('video')) {
            createThumbnail({
              url: image.path,
              timeStamp: 1000,
            }).then(response => {
              image.thumbnail = response
              navigation.navigate(screenName.MediaWithInputScreen, { result: image })
            }).catch(err => console.log('err---', err));
          }
        })
        .catch(err => {
          console.log('err---', err)
        });
    }, 500);

  }

  const openPicker = async () => {
    closeActionSheet()
    setTimeout(async () => {
      const [result] = await pick({
        // copyTo: DocumentPicker.
        type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.pdf]
      })
      if (result.type.includes('image')) {
        navigation.navigate(screenName.MediaWithInputScreen, { result: result })
      } else if (result.type.includes('video')) {
        createThumbnail({
          url: result.uri,
          timeStamp: 1000,
        }).then(response => {
          result.thumbnail = response
          navigation.navigate(screenName.MediaWithInputScreen, { result: result })
        }).catch(err => console.log('err---', err));
      } else {

        navigation.navigate(screenName.MediaWithInputScreen, { result: result })


        // let data = {}
        // data.createdBy = user?._id
        // data.content = ''
        // data.content_type = result.type.includes('pdf') ? 'file/*' : result.type.includes('image') ? 'image/*' : ''
        // data.chatId = activeChatRoomUser?.chatId
        // data.readBy = user?._id
        // data['file'] = {
        //   uri: result.uri,
        //   type: result.type, // or photo.type image/jpg
        //   name: result.name
        // }
        // console.log('data---', data)
        // formDataApiCall(api.addMessage, data, (res) => {
        //   dispatchAction(dispatch, ADD_ONE_MESSAGE, res?.data)
        // }, (err) => {
        //   console.log(err)
        //   errorToast('Please try again')
        // })
      }
    }, 500);
  }

  const onChangeText = (value, props) => {
    const lastChar = message.substr(message.length - 1)
    const currentChar = value.substr(value.length - 1)
    const spaceCheck = /[^@A-Za-z_]/g
    setmessage(value)
    if (value.length === 0) {
      setshowTagModal(false)
    } else {
      if (spaceCheck.test(lastChar) && currentChar != '@') {
        setshowTagModal(false)
      } else {
        const checkSpecialChar = currentChar.match(/[^@A-Za-z_]/)
        if (checkSpecialChar === null || currentChar === '@') {
          const pattern = new RegExp(`\\B@[a-z0-9_-]+|\\B@`, `gi`);
          const matches = value.match(pattern) || []
          if (matches.length > 0) {
            getUserSuggestions(matches[matches.length - 1])
            setshowTagModal(true)
          } else {
            setshowTagModal(false)
          }
        } else if (checkSpecialChar != null) {
          setshowTagModal(false)
        }
      }
    }
  }

  const getUserSuggestions = (keyword) => {
    if (Array.isArray(groupCreateAllUsers)) {
      if (keyword.slice(1) === '') {
        setuserList([...groupCreateAllUsers])
      } else {
        const userDataList = groupCreateAllUsers.filter(obj => obj.first_Name.toLowerCase().indexOf(keyword.toLowerCase().slice(1)) !== -1)
        setuserList([...userDataList])
      }
    }
  }

  return (
    <View>
      {showTagModal &&
        <View style={{}}>
          <TagUserInput data={userList} onPressUser={(user) => {
            console.log(user)
          }} />
        </View>
      }
      <View style={styles.conatiner}>
        {showMediaAdd && <TouchableOpacity onPress={() => setActionSheet(true)} style={styles.plusBoxStyle}>
          <Image
            style={styles.plusIconStyle}
            resizeMode="contain"
            source={Icons.plus}
          />
        </TouchableOpacity>}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Type Here"
            placeholderTextColor={colors.secondary_500}
            value={message}
            onChangeText={(text) => setmessage(text)}
            multiline={true}
          />
        </View>
        <TouchableOpacity onPress={() => onSend()}>
          <Image
            source={Icons.send}
            resizeMode="contain"
            style={styles.sendIconStyle}
          />
        </TouchableOpacity>
      </View>
      <Modal
        onBackdropPress={() => closeActionSheet()}
        isVisible={actionSheet}
        style={{ margin: 0, justifyContent: 'flex-end', }}>
        <ActionSheet actionItems={actionItems} onCancel={closeActionSheet} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(5),
    paddingHorizontal: wp(10),
    backgroundColor: colors.secondary_500,
  },
  plusIconStyle: {
    height: wp(15),
    width: wp(15),
    tintColor: colors.primary_4574ca,
  },
  plusBoxStyle: {
    height: wp(30),
    width: wp(30),
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary_4574ca,
  },
  inputContainer: {
    flex: 1,
    minHeight: hp(45),
    borderRadius: 5,
    marginHorizontal: wp(10),
    backgroundColor: colors.white,
    justifyContent: 'center',
    maxHeight: hp(130)
  },
  inputStyle: {
    paddingHorizontal: wp(10),
    ...FontStyle(15, colors.black, '600'),
  },
  sendIconStyle: {
    height: wp(25),
    width: wp(25),
  },
});

export default ChatInput;



// import * as React from 'react';
// import { FC, useState } from 'react';
// import { Pressable, SafeAreaView, Text, View } from 'react-native';
// import { MentionInput, MentionSuggestionsProps, Suggestion, replaceMentionValues } from 'react-native-controlled-mentions';

// const users = [
//   { id: '1', name: 'David Tabaka' },
//   { id: '2', name: 'Mary' },
//   { id: '3', name: 'Tony' },
//   { id: '4', name: 'Mike' },
//   { id: '5', name: 'Grey' },
// ];

// const hashtags = [
//   { id: 'todo', name: 'todo' },
//   { id: 'help', name: 'help' },
//   { id: 'loveyou', name: 'loveyou' },
// ];

// const renderSuggestions = (suggestions) => (
//   { keyword, onSuggestionPress },
// ) => {
//   if (keyword == null) {
//     return null;
//   }

//   return (
//     <View>
//       {suggestions
//         .filter(one => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
//         .map(one => (
//           <Pressable
//             key={one.id}
//             onPress={() => onSuggestionPress(one)}

//             style={{ padding: 12 }}
//           >
//             <Text>{one.name}</Text>
//           </Pressable>
//         ))
//       }
//     </View>
//   );
// };

// const renderMentionSuggestions = renderSuggestions(users);

// const renderHashtagSuggestions = renderSuggestions(hashtags);

// const App = () => {
//   const [value, setValue] = useState('Hello @[Mary](2)! How are you?');

//   console.log(value)
//   console.log(replaceMentionValues(value, ({ id }) => `@${id}`))

//   return (
//     <SafeAreaView>
//       <MentionInput
//         value={value}
//         onChange={setValue}

//         partTypes={[
//           {
//             trigger: '@',
//             renderSuggestions: renderMentionSuggestions,
//           },
//           {
//             pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
//             textStyle: { color: 'blue' },
//           },
//         ]}
//         placeholder="Type here..."
//         style={{ padding: 12 }}
//       />
//     </SafeAreaView>
//   );
// };

// export default App;
