import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, FlatList, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontStyle, ImageStyle } from '../utils/commonFunction'
import { fontname } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import SearchBar from '../Components/SearchBar'
import RenderUserIcon from '../Components/RenderUserIcon'
import { useDispatch, useSelector } from 'react-redux'
import { onGetLikedUserList, onGetRepliesComment } from '../Services/PostServices'
import { api } from '../utils/apiConstants'
import { Icons } from '../Themes/Icons'


export default function RepliesComments() {
    const { goBack } = useNavigation()
    const [searchText, setSearchText] = useState('');
    const { repliesComments, activePostAllComments, user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const { params } = useRoute()
    const [activeComment, setactiveComment] = useState(undefined)

    useEffect(() => {
        setactiveComment(activePostAllComments?.filter(obj => obj._id == params?.commentId)[0])
    }, [activePostAllComments])

    useEffect(() => {
        dispatch(onGetRepliesComment({
            data: { postId: params?.postId, commentId: params?.commentId }
        }))
    }, [])
    const RenderReply = ({ item, index, isLastIndex }) => {
        return (
            <View style={styles.replyCommentView}>
                <View style={[styles.replyCommnt, { alignItems: isLastIndex ? 'flex-start' : 'center' }]}>
                    <View style={[styles.verticalLine, { height: isLastIndex ? '50%' : '100%' }]} />
                    <View style={styles.horizontalLine} />
                    <View style={styles.innerCommentRow}>
                        <RenderUserIcon url={item?.createdBy?.avtar} height={38} isBorder />
                        <View style={styles.commentBg}>
                            <View style={ApplicationStyles.flex}>
                                <Text numberOfLines={1} style={styles.username}>{item?.createdBy?.first_Name} {item?.createdBy?.last_Name}</Text>
                                <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                                <Text style={styles.commentText2}>{item?.reply}</Text>
                            </View>
                            {/* <View style={styles.innerRow}>
                                <TouchableOpacity style={styles.likesRow}>
                                    <Image source={Icons.heart} style={ImageStyle(15, 15)} />
                                    <Text style={styles.likesText}>1 Likes</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header
                title={'IndiansAbroad'}
                showLeft={true}
                showRight={false}
                onLeftPress={() => goBack()}
            />
            <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500, }}>
                <Text style={styles.chatText}>Replies</Text>
            </View>
            <View style={{ paddingHorizontal: 0, marginTop: 8, flex: 1 }}>
                {activeComment && <View style={{ marginBottom: 10 }}>
                    <View style={styles.headerView}>
                        <RenderUserIcon url={activeComment?.user?.avtar} height={53} isBorder />
                        <View style={styles.commentBg}>
                            <View style={ApplicationStyles.flex}>
                                <Text numberOfLines={1} style={styles.username}>{activeComment?.user?.first_Name} {activeComment?.user?.last_Name}</Text>
                                <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                                <Text style={styles.commentText2}>{activeComment?.comment}</Text>
                            </View>
                            {/* <View style={styles.innerRow}>
                                <TouchableOpacity onPress={() => onLikeComment(activeComment)} style={styles.likesRow}>
                                    <Image source={activeComment?.isCommentLiked ? Icons.heartFilled : Icons.heart} style={ImageStyle(15, 15)} />
                                    <Text style={styles.likesText}>{activeComment?.commentlikeCount} Likes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onOpenReplies(activeComment)} style={styles.likesRow}>
                                    <Image source={Icons.replyIcon} style={ImageStyle(15, 15)} />
                                    <Text style={styles.likesText}>{activeComment?.replyCount} Reply</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </View>
                    {repliesComments && repliesComments.length > 0 &&
                        <FlatList
                            data={repliesComments}
                            renderItem={({ item, index }) => {
                                return <RenderReply item={item} index={index} isLastIndex={repliesComments.length - 1 == index} />
                            }}
                        />
                    }

                </View>}

            </View>
            <View style={styles.commnetInput}>
                <RenderUserIcon url={user?.avtar} height={46} isBorder={user?.subscribedMember} />
                <TextInput style={styles.input} placeholder='Add Comment' placeholderTextColor={colors.neutral_500} />
                <TouchableOpacity style={styles.sendButton}>
                    <Image source={Icons.send} style={ImageStyle(24, 24)} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    chatText: {
        // top: -19,
        textAlign: 'center',
        ...FontStyle(fontname.actor_regular, 18, colors.secondary_600, '700'),
        marginVertical: 5
    },
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