import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
} from 'react-native';
import ChatHeader from '../../Components/ChatHeader';
import ReciverMsg from '../../Components/ReceiverMsg';
import colors from '../../Themes/Colors';
import SenderMsg from '../../Components/SenderMsg';
import ChatInput from '../../Components/ChatInput';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { screenName } from '../../Navigation/ScreenConstants';
import { sendData, socket } from '../../Socket/Socket';
import { getChatMessage, onGetUnreadMsgCount } from '../../Services/ChatServices';
import { ADD_ONE_MESSAGE, IS_LOADING, SET_CHAT_DETAIL } from '../../Redux/ActionTypes';
import { dispatchAction, formDataApiCall } from '../../utils/apiGlobal';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import Video, { VideoRef } from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import DocumentPicker, { pick } from 'react-native-document-picker';
import { api } from '../../utils/apiConstants';
import { errorToast } from '../../utils/commonFunction';
import Pdf from 'react-native-pdf';
import CommonButton from '../../Components/CommonButton';
import { wp } from '../../Themes/Fonts';
import { replaceMentionValues } from 'react-native-controlled-mentions';

export default function MediaWithInputScreen() {
    const { chatMessageList, user, followerList, activeChatRoomUser, allChatMessageCount } = useSelector(e => e.common);
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { params } = useRoute()
    const [message, setmessage] = useState('')
    const [thumbnail, setthumbnail] = useState('')

    const onSendMessage = () => {
        let data = {}
        data.createdBy = user?._id
        data.content = replaceMentionValues(message.trim(), ({ id }) => `@${id}`)
        data.content_type = params?.result.type.includes('pdf') ? 'file/*' : params?.result?.type?.includes('image') ? 'image/*' : 'video/*'
        data.chatId = activeChatRoomUser?.chatId
        data.readBy = user?._id
        data['file'] = {
            uri: params?.result.uri,
            type: params?.result.type, // or photo.type image/jpg
            name: params?.result.name
        }
        dispatchAction(dispatch, IS_LOADING, true)
        formDataApiCall(api.addMessage, data, (res) => {
            console.log('red-----', res)
            navigation.goBack()
            dispatchAction(dispatch, IS_LOADING, false)
            dispatchAction(dispatch, ADD_ONE_MESSAGE, res?.data)
        }, (err) => {
            console.log(err)
            dispatchAction(dispatch, IS_LOADING, false)
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={''} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <View style={[ApplicationStyles.flex]}>
                {params?.result?.type?.includes('image') ?
                    <Image source={{ uri: params?.result?.uri }} style={styles.image} />
                    :
                    params?.result?.type?.includes('pdf') ?
                        <Pdf
                            trustAllCerts={false}
                            source={{ uri: params?.result?.uri }}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`Number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log('error---', error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link pressed: ${uri}`);
                            }}
                            style={{ flex: 1, backgroundColor: colors.white }} />
                        :
                        <Video
                            // Can be a URL or a local file.
                            source={{ uri: params?.result?.uri }}
                            playInBackground={false}
                            paused={true}
                            muted={false}
                            controls={true}
                            resizeMode={'contain'}
                            poster={params?.result?.thumbnail}
                            posterResizeMode='cover'
                            onError={(err) => console.log(err)}
                            style={styles.backgroundVideo}
                        />
                }
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                {params?.result?.type?.includes('pdf') ?
                    <CommonButton onPress={() => onSendMessage()} title={'Send'} extraStyle={{ marginHorizontal: wp(20) }} />
                    :
                    <ChatInput isGroup={params?.isGroup} showMediaAdd={false} message={message} setmessage={setmessage} onSend={() => onSendMessage()} />

                }
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
    backgroundVideo: {
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        alignSelf: 'center'
    },
})