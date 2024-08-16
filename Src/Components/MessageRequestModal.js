import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, TouchableOpacity, Image, Keyboard } from 'react-native'
import React, { useState } from 'react'
import ModalContainer from './ModalContainer'
import colors from '../Themes/Colors'
import { hp, wp } from '../Themes/Fonts'
import { Icons } from '../Themes/Icons'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import ReactNativeModal from 'react-native-modal'

export default function MessageRequestModal({
    visible,
    onClose
}) {
    const [postText, setpostText] = useState('')

    const onPressPublish = () => {

    }
    return (
        <ReactNativeModal onBackButtonPress={() => Keyboard.dismiss()} onBackdropPress={() => Keyboard.dismiss()} avoidKeyboard isVisible={visible}
            style={{ justifyContent: 'flex-end', margin: 0 }} >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
                <View style={styles.modalView}>
                    <View style={styles.row}>
                        <View>
                            <Image source={Icons.question} style={ImageStyle(30, 30)} />
                        </View>
                        <Text style={styles.title}>Message request to connect</Text>
                        <TouchableOpacity onPress={() => onClose()} style={styles.backView}>
                            <Image source={Icons.close} style={ImageStyle(20, 20)} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.des}>To protect everyone's privacy, we encourage you to connect with users before messaging them. You can still send a one time message request to introduce yourself or explain why you would like to connect. Please write your connection request message below.</Text>
                    <View style={styles.inputBox}>
                        <TextInput onChangeText={text => setpostText(text)} value={postText} style={styles.input} placeholder="Write Here" multiline={true} placeholderTextColor={colors.neutral_500} />
                    </View>
                    <View style={styles.row1}>
                        <TouchableOpacity onPress={() => onClose()} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPressPublish()} style={styles.blueButton}>
                            <Text style={styles.publishText}>Send</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </TouchableWithoutFeedback>
        </ReactNativeModal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: colors.white,
        paddingHorizontal: 3,
    },
    title: {
        flex: 1,
        ...FontStyle(20, colors.neutral_900, '700')
    },
    backView: {
        padding: wp(10),
    },
    row: { flexDirection: 'row', alignItems: 'center', marginLeft: wp(10), paddingTop: wp(10), gap: 10 },
    des: {
        marginHorizontal: 30,
        ...FontStyle(14, colors.neutral_900),
        marginVertical: 5

    },
    inputBox: {
        // backgroundColor: colors.primary_100,
        borderRadius: 4,
        marginHorizontal: wp(14),
        marginBottom: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.neutral_400
    },
    input: {
        height: hp(170),
        textAlignVertical: 'top',
        padding: 15,
        ...FontStyle(14, colors.neutral_900),
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
    },
    publishText: {
        ...FontStyle(14, colors.white),
    },
    row1: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'
    },
    cancelBtn: {
        backgroundColor: colors.neutral_250,
        alignSelf: 'flex-end',
        marginBottom: 20,
        paddingVertical: 10,
        width: 87,
        alignItems: 'center',
        borderRadius: 4,
    },
    cancelText: {
        ...FontStyle(14, colors.neutral_900),
    },
})