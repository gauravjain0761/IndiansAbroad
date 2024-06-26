import { FlatList, ScrollView, StyleSheet, TouchableOpacity, Text, View, Image, SafeAreaView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header';
import ApplicationStyles from '../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import PostCard from '../Components/PostCard';
import { FontStyle, ImageStyle } from '../utils/commonFunction';
import { Icons } from '../Themes/Icons';
import { fontname } from '../Themes/Fonts';
import colors from '../Themes/Colors';
import RenderUserIcon from '../Components/RenderUserIcon';
import { useDispatch, useSelector } from 'react-redux';
import { onCommentLike, onGetAllComments, onGetSinglePost } from '../Services/PostServices';
import { api } from '../utils/apiConstants';
import { dispatchAction } from '../utils/apiGlobal';
import { SET_LIKE_COMMENTS, SET_REPLIES_COMMENTS } from '../Redux/ActionTypes';
import { screenName } from '../Navigation/ScreenConstants';

export default function PostDetail() {
    const navigation = useNavigation()
    const [commentText, setcommentText] = useState('')
    const { activePost, user, activePostAllComments } = useSelector(e => e.common)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(onGetSinglePost({
            data: {
                postId: activePost?._id,
                loginUserId: user._id
            }
        }))
        dispatch(onGetAllComments({
            data: {
                postId: activePost?._id,
                loginId: user._id
            }
        }))
    }, [])

    const onLikeComment = (item) => {
        const isLike = item?.isCommentLiked
        dispatchAction(dispatch, SET_LIKE_COMMENTS, { commentId: item?._id, action: isLike ? 'unlike' : 'like' })
        let obj = {
            data: {
                commentId: item?._id,
                postId: item?.postId,
                createdBy: user._id,
                action: isLike ? 'unlike' : 'like'
            },
            onFailure: () => {
                dispatchAction(dispatch, SET_LIKE_COMMENTS, { commentId: item?._id, action: item?.isCommentLiked ? 'unlike' : 'like' })
            }
        }
        dispatch(onCommentLike(obj))
    }


    const RenderReply = ({ item, index, isLastIndex }) => {
        return (
            <View style={styles.replyCommentView}>
                <View style={[styles.replyCommnt, { alignItems: isLastIndex ? 'flex-start' : 'center' }]}>
                    <View style={[styles.verticalLine, { height: isLastIndex ? '50%' : '100%' }]} />
                    <View style={styles.horizontalLine} />
                    <View style={styles.innerCommentRow}>
                        <RenderUserIcon height={38} isBorder />
                        <View style={styles.commentBg}>
                            <View style={ApplicationStyles.flex}>
                                <Text style={[styles.username, { fontSize: 15 }]}>Nikita Khairnar</Text>
                                <Text style={[styles.degreeText, { fontSize: 12 }]}>PhD Student, Seoul</Text>
                                <Text style={styles.commentText}>Nice</Text>
                            </View>
                            <View style={styles.innerRow}>
                                <TouchableOpacity style={styles.likesRow}>
                                    <Image source={Icons.heart} style={ImageStyle(15, 15)} />
                                    <Text style={styles.likesText}>1 Likes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const onOpenReplies = (item) => {
        dispatchAction(dispatch, SET_REPLIES_COMMENTS, undefined)
        navigation.navigate(screenName.RepliesComments, {
            commentId: item?._id,
            postId: item?.postId,
        })
    }

    const RenderItem = ({ item, itemIndex }) => {
        return <View style={{ marginBottom: 10 }}>
            <View style={styles.headerView}>
                <RenderUserIcon url={api.IMAGE_URL + item?.user?.avtar} height={53} isBorder />
                <View style={styles.commentBg}>
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
                </View>
            </View>
        </View>
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={'IndiansAbroad'} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
            <ScrollView>
                <View style={{ marginBottom: 10 }}>
                    <PostCard isDetailScreen={true} item={activePost} />
                </View>
                {activePostAllComments && activePostAllComments.length > 0 && <FlatList
                    data={activePostAllComments}
                    renderItem={({ item, index }) => {
                        return <RenderItem itemIndex={index} item={item} />
                    }}
                />}
            </ScrollView>
            <SafeAreaView>
                <View style={styles.commnetInput}>
                    <RenderUserIcon height={46} isBorder />
                    <TextInput style={styles.input} placeholder='Add Comment' placeholderTextColor={colors.neutral_500} />
                    <TouchableOpacity style={styles.sendButton}>
                        <Image source={Icons.send} style={ImageStyle(24, 24)} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        // paddingTop: 10
    },
    userImage: {
        height: 57, width: 57, borderRadius: 57 / 2
    },
    username: {
        ...FontStyle(fontname.actor_regular, 15, colors.neutral_900, '700'),
    },
    degreeText: {
        marginTop: 2,
        ...FontStyle(fontname.actor_regular, 12, colors.neutral_900)
    },
    commentBg: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: colors.inputBg,
        paddingVertical: 5,
        borderRadius: 4,
        paddingHorizontal: 3,
        alignItems: 'flex-start'
    },
    likesText: {
        ...FontStyle(fontname.abeezee, 12, colors.neutral_900)
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
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
        ...FontStyle(fontname.actor_regular, 14, colors.neutral_900)
    },
    commentText2: {
        ...FontStyle(fontname.actor_regular, 16, colors.neutral_900)
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
        alignItems: 'center',
        backgroundColor: colors.secondary_500,
        paddingLeft: 10,
        paddingVertical: 2
    },
    input: {
        backgroundColor: colors.inputBg,
        flex: 1,
        ...FontStyle(fontname.actor_regular, 14, colors.neutral_900),
        borderRadius: 4,
        height: 47,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    sendButton: {
        paddingHorizontal: 10
    }
})