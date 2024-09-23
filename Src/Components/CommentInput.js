import { StyleSheet, KeyboardAvoidingView, TouchableOpacity, View, Image, TextInput, Platform } from 'react-native'
import React, { } from 'react'
import { FontStyle, ImageStyle, renameKey } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import colors from '../Themes/Colors';
import RenderUserIcon from '../Components/RenderUserIcon';
import { useSelector } from 'react-redux';
import { useMentions } from 'react-native-controlled-mentions';
import TagUserInput from './TagUserInput';

export default function CommentInput({ onComment, commentText, onChangeText, placeholder }) {
    const { user, groupCreateAllUsers } = useSelector(e => e.common)
    const triggersConfig = {
        mention: {
            trigger: '@',
            textStyle: { ...FontStyle(15, colors.primary_4574ca, '700') },
            isInsertSpaceAfterMention: true,

        },
    };

    const { textInputProps, triggers } = useMentions({
        value: commentText,
        onChange: onChangeText,
        triggersConfig
    });

    return (
        <KeyboardAvoidingView  {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
            <TagUserInput {...triggers.mention} data={!groupCreateAllUsers ? [] : renameKey(groupCreateAllUsers.filter(obj => obj._id !== user._id))} />

            <View style={styles.commnetInput}>
                <RenderUserIcon url={user?.avtar} type='user' height={46} isBorder={user?.subscribedMember} />
                <TextInput multiline={true}
                    // value={commentText} 
                    // onChangeText={(text) => onChangeText(text)} 
                    // multiline={true}
                    {...textInputProps}
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.neutral_500} />
                <TouchableOpacity onPress={() => onComment()} style={styles.sendButton}>
                    <Image source={Icons.send} style={ImageStyle(24, 24)} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    commnetInput: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colors.secondary_500,
        paddingLeft: 10,
        paddingVertical: 2,
    },
    input: {
        backgroundColor: colors.inputBg,
        flex: 1,
        ...FontStyle(14, colors.neutral_900),
        borderRadius: 4,
        minHeight: 47,
        paddingHorizontal: 10,
        marginLeft: 10,
        textAlignVertical: 'center',
        maxHeight: 150,
        paddingVertical: 12
    },
    sendButton: {
        paddingHorizontal: 10,
        height: 47,
        justifyContent: 'center'
    }
})