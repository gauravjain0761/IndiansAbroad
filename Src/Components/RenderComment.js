import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
import React, { } from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import colors from '../Themes/Colors';
import RenderUserIcon from '../Components/RenderUserIcon';
import { useSelector } from 'react-redux';
import RenderText from './RenderText';
import { screenName } from '../Navigation/ScreenConstants';
import { useNavigation } from '@react-navigation/native';


export default function RenderComment({
    item,
    onLikeComment,
    onOpenReplies,
    onDelete,
    isThread = false,
}) {
    const { user } = useSelector(e => e.common)
    const navigation = useNavigation()
    let isUser = item?.user ? item?.user?._id : item?.createdBy?._id == user?._id

    const onOpenOtherUserDetails = () => {
        if (!isUser) {
            navigation.navigate(screenName.indiansDetails, { userId: item?.user ? item?.user?._id : item?.createdBy?._id })
        }
    }
    return (
        <View style={{ marginBottom: 10 }}>
            <View style={styles.headerView}>
                <View style={{ paddingTop: 8, }}>
                    <RenderUserIcon userId={item?.user ? item?.user?._id : item?.createdBy?._id} url={item?.user ? item?.user?.avtar : item?.createdBy?.avtar} height={53} isBorder />
                </View>
                <View style={styles.commentView}>
                    <View style={styles.commentBg}>
                        <TouchableOpacity onPress={() => {
                            onOpenOtherUserDetails()
                        }} activeOpacity={0.8} style={ApplicationStyles.flex}>
                            <Text numberOfLines={1} style={styles.username}>{item?.user ? item?.user?.first_Name : item?.createdBy?.first_Name} {item?.user ? item?.user?.last_Name : item?.createdBy?.last_Name}</Text>
                            <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                            {/* <Text style={styles.commentText2}>{item?.comment}</Text> */}
                        </TouchableOpacity>
                        <View style={styles.innerRow}>
                            {!isThread && <TouchableOpacity onPress={() => onLikeComment(item)} style={styles.likesRow}>
                                <Image source={item?.isCommentLiked ? Icons.heartFilled : Icons.heart} style={ImageStyle(15, 15)} />
                                <Text style={styles.likesText}>{item?.commentlikeCount} Likes</Text>
                            </TouchableOpacity>}
                            <TouchableOpacity onPress={() => onOpenReplies(item)} style={styles.likesRow}>
                                <Image source={Icons.replyIcon} style={ImageStyle(15, 15)} />
                                <Text style={styles.likesText}>{item?.replyCount} {isThread ? 'Respond' : 'Reply'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.commentBg}>
                        <RenderText style={[styles.commentText2]} text={item?.comment}></RenderText>
                        {(item?.user?._id == user._id || item?.createdBy?._id == user._id) &&
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
        ...FontStyle(14, colors.neutral_900),
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