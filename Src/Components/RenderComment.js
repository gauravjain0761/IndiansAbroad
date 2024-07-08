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
import { api } from '../utils/apiConstants';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_LIKE_COMMENTS, SET_REPLIES_COMMENTS } from '../Redux/ActionTypes';
import { screenName } from '../Navigation/ScreenConstants';
import ConfirmationModal from '../Components/ConfirmationModal';
import CommentInput from '../Components/CommentInput';


export default function RenderComment({
    item,
    onLikeComment,
    onOpenReplies,
    onDelete
}) {
    const { user } = useSelector(e => e.common)

    return (
        <View style={{ marginBottom: 10 }}>
            <View style={styles.headerView}>
                <View style={{ paddingTop: 8, }}>
                    <RenderUserIcon url={item?.user?.avtar} height={53} isBorder />
                </View>

                <View style={styles.commentView}>
                    <View style={styles.commentBg}>
                        <View style={ApplicationStyles.flex}>
                            <Text numberOfLines={1} style={styles.username}>{item?.user?.first_Name} {item?.user?.last_Name}</Text>
                            <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                            {/* <Text style={styles.commentText2}>{item?.comment}</Text> */}
                        </View>
                        <View style={styles.innerRow}>
                            <TouchableOpacity onPress={() => onLikeComment(item)} style={styles.likesRow}>
                                <Image source={item?.isCommentLiked ? Icons.heartFilled : Icons.heart} style={ImageStyle(15, 15)} />
                                <Text style={styles.likesText}>{item?.commentlikeCount} Likes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onOpenReplies(item)} style={styles.likesRow}>
                                <Image source={Icons.replyIcon} style={ImageStyle(15, 15)} />
                                <Text style={styles.likesText}>{item?.replyCount} Reply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.commentBg}>
                        <Text style={styles.commentText2}>{item?.comment}</Text>
                        {item?.user?._id == user._id &&
                            <TouchableOpacity onPress={() => onDelete()} style={{ paddingHorizontal: 10 }}>
                                <Image source={Icons.trash} style={ImageStyle(20, 20)} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>

                {/* <View style={styles.commentBg}>






                    <View style={ApplicationStyles.flex}>
                        <Text numberOfLines={1} style={styles.username}>{item?.user?.first_Name} {item?.user?.last_Name}</Text>
                        <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                        <Text style={styles.commentText2}>{item?.comment}</Text>
                    </View>
                    <View style={styles.innerRow}>
                        <TouchableOpacity onPress={() => onLikeComment(item)} style={styles.likesRow}>
                            <Image source={item?.isCommentLiked ? Icons.heartFilled : Icons.heart} style={ImageStyle(15, 15)} />
                            <Text style={styles.likesText}>{item?.commentlikeCount} Likes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onOpenReplies(item)} style={styles.likesRow}>
                            <Image source={Icons.replyIcon} style={ImageStyle(15, 15)} />
                            <Text style={styles.likesText}>{item?.replyCount} Reply</Text>
                        </TouchableOpacity>
                    </View>
                    {item?.user?._id == user._id &&
                        <TouchableOpacity onPress={() => onDelete()} style={{ position: 'absolute', bottom: 0, right: 0, padding: 10 }}>
                            <Image source={Icons.trash} style={ImageStyle(20, 20)} />
                        </TouchableOpacity>
                    }
                </View> */}
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        // alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        // paddingTop: 10
    },
    userImage: {
        height: 57, width: 57, borderRadius: 57 / 2
    },
    username: {
        ...FontStyle(14, colors.neutral_900, '700'),
    },
    degreeText: {
        marginTop: 2,
        ...FontStyle(12, colors.neutral_900)
    },
    commentBg: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start'
    },
    commentView: {
        backgroundColor: colors.inputBg,
        paddingVertical: 5,
        flex: 1,
        borderRadius: 4,
        paddingHorizontal: 3,
    },
    likesText: {
        ...FontStyle(12, colors.neutral_900)
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    likesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    replyCommentView: {
        alignSelf: 'flex-end'
    },
    commentText: {
        ...FontStyle(14, colors.neutral_900)
    },
    commentText2: {
        ...FontStyle(16, colors.neutral_900),
        // backgroundColor: 'red',
        flex: 1
    },
    verticalLine: {
        width: 1,
        backgroundColor: colors.neutral_400,
        height: '50%'
    },
    replyCommnt: {
        width: '83%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    innerCommentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 5,
        gap: 5,
    },
    horizontalLine: {
        width: 5, backgroundColor: colors.neutral_400, height: 1, alignSelf: 'center'
    },
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
        maxHeight: 150
    },
    sendButton: {
        paddingHorizontal: 10,
        height: 47,
        justifyContent: 'center'
    }
})