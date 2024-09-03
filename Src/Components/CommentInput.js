import { FlatList, ScrollView, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Text, View, Image, SafeAreaView, TextInput, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import PostCard from '../Components/PostCard';
import { FontStyle, ImageStyle, errorToast } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import { fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import RenderUserIcon from '../Components/RenderUserIcon';
import { useDispatch, useSelector } from 'react-redux';
import { onAddComment, onCommentLike, onDeleteComment, onGetAllComments, onGetSinglePost } from '../Services/PostServices';
import { api } from '../utils/apiConstants';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_LIKE_COMMENTS, SET_REPLIES_COMMENTS } from '../Redux/ActionTypes';
import { screenName } from '../Navigation/ScreenConstants';

export default function CommentInput({ onComment, commentText, onChangeText, placeholder }) {
    const { user } = useSelector(e => e.common)

    return (
        <KeyboardAvoidingView  {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
            <View style={styles.commnetInput}>
                <RenderUserIcon url={user?.avtar} type='user' height={46} isBorder={user?.subscribedMember} />
                <TextInput multiline={true} value={commentText} onChangeText={(text) => onChangeText(text)} style={styles.input} placeholder={placeholder} placeholderTextColor={colors.neutral_500} />
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