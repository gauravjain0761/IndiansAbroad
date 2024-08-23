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

const ChatInput = ({ message, setmessage, onSend, showMediaAdd = true }) => {
  const { user, activeChatRoomUser } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const openPicker = async () => {
    const [result] = await pick({
      // copyTo: DocumentPicker.
      type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.pdf]
    })

    if (result.type !== DocumentPicker.types.pdf) {
      navigation.navigate(screenName.MediaWithInputScreen, { result: result })
    } else if (result.type === DocumentPicker.types.video) {
      createThumbnail({
        url: result.uri,
        timeStamp: 1000,
      }).then(response => {
        result.thumbnail = response
        navigation.navigate(screenName.MediaWithInputScreen, { result: result })

      }).catch(err => console.log('err---', err));
    } else {
      let data = {}
      data.createdBy = user?._id
      data.content = ''
      data.content_type = result.type == DocumentPicker.types.pdf ? 'file/*' : result.type == DocumentPicker.types.images ? 'image/*' : ''
      data.chatId = activeChatRoomUser?.chatId
      data.readBy = user?._id
      data['file[0]'] = [{
        uri: result.uri,
        type: result.type, // or photo.type image/jpg
        name: result.name
      }]
      formDataApiCall(api.addMessage, data, (res) => {
        console.log('red-----', res)
        dispatchAction(dispatch, ADD_ONE_MESSAGE, res?.data)
      }, (err) => {
        console.log(err)
        errorToast('Please try again')
      })
    }


  }

  return (
    <View style={styles.conatiner}>
      {showMediaAdd && <TouchableOpacity onPress={() => openPicker()} style={styles.plusBoxStyle}>
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
