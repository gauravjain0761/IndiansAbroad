import { StyleSheet, Text, SafeAreaView, View, ScrollView, TouchableOpacity, FlatList, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import ApplicationStyles from '../Themes/ApplicationStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontStyle, ImageStyle, errorToast } from '../utils/commonFunction'
import { fontname } from '../Themes/Fonts'
import colors from '../Themes/Colors'
import SearchBar from '../Components/SearchBar'
import RenderUserIcon from '../Components/RenderUserIcon'
import { useDispatch, useSelector } from 'react-redux'
import { onAddCommentReply, onDeleteCommentReply, onGetLikedUserList, onGetRepliesComment } from '../Services/PostServices'
import { api } from '../utils/apiConstants'
import { Icons } from '../Themes/Icons'
import ConfirmationModal from '../Components/ConfirmationModal'
import CommentInput from '../Components/CommentInput'
import RenderText from '../Components/RenderText'
import { screenName } from '../Navigation/ScreenConstants'

export default function RepliesComments() {
    const { goBack } = useNavigation()
    const [searchText, setSearchText] = useState('');
    const { repliesComments, activePostAllComments, user } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const { params } = useRoute()
    const [activeComment, setactiveComment] = useState(undefined)
    const [commentText, setcommentText] = useState('')
    const [deleteModal, setdeleteModal] = useState(false)
    const [selectedComment, setselectedComment] = useState(undefined)
    const navigation = useNavigation()
    useEffect(() => {
        setactiveComment(activePostAllComments?.filter(obj => obj._id == params?.commentId)[0])
    }, [activePostAllComments])

    useEffect(() => {
        dispatch(onGetRepliesComment({
            data: { postId: params?.postId, commentId: params?.commentId }
        }))
    }, [])

    const deleteComment = (id) => {
        setdeleteModal(false)
        let obj = {
            data: {
                replyId: selectedComment._id
            },
            onSuccess: () => {
                dispatch(onGetRepliesComment({
                    data: { postId: params?.postId, commentId: params?.commentId }
                }))
            }
        }
        dispatch(onDeleteCommentReply(obj))
    }

    const RenderReply = ({ item, index, isLastIndex }) => {
        let isUser = item?.createdBy?._id == user?._id

        const onOpenOtherUserDetails = () => {
            if (!isUser) {
                navigation.navigate(screenName.indiansDetails, { userId: item?.createdBy?._id })
            }
        }

        return (
            <View style={styles.replyCommentView}>
                <View style={[styles.replyCommnt, { alignItems: isLastIndex ? 'flex-start' : 'center' }]}>
                    <View style={[styles.verticalLine, { height: isLastIndex ? '50%' : '100%' }]} />
                    <View style={styles.horizontalLine} />
                    <View style={styles.innerCommentRow}>
                        <RenderUserIcon userId={item?.createdBy?._id} url={item?.createdBy?.avtar} height={38} isBorder />
                        <TouchableOpacity activeOpacity={0.8} onPress={() => onOpenOtherUserDetails()} style={styles.commentBg}>
                            <View style={ApplicationStyles.flex}>
                                <Text numberOfLines={1} style={styles.username}>{item?.createdBy?.first_Name} {item?.createdBy?.last_Name}</Text>
                                <Text style={styles.degreeText}>PhD Student, Seoul</Text>
                                <RenderText style={styles.commentText2} text={item?.reply}></RenderText>
                                {/* <Text style={styles.commentText2}>{item?.reply}</Text> */}
                            </View>
                            {item?.createdBy?._id == user._id &&
                                <TouchableOpacity onPress={() => {
                                    setselectedComment(item)
                                    setdeleteModal(true)
                                }} style={{ padding: 5 }}>
                                    <Image source={Icons.trash} style={ImageStyle(20, 20)} />
                                </TouchableOpacity>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const onComment = () => {
        if (commentText.trim() !== '') {
            let obj = {
                data: {
                    postId: params?.postId, commentId: params?.commentId,
                    createdBy: user._id,
                    reply: commentText.trim()
                },
                onSuccess: () => {
                    setcommentText('')
                    dispatch(onGetRepliesComment({
                        data: { postId: params?.postId, commentId: params?.commentId }
                    }))
                }
            }
            dispatch(onAddCommentReply(obj))
        } else {
            errorToast('Please enter a comment')
        }
    }

    return (
        <SafeAreaView style={ApplicationStyles.applicationView}>
            <Header title={'IndiansAbroad'} showLeft={true} showRight={false} onLeftPress={() => goBack()} />
            <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500, }}>
                <Text style={styles.chatText}>Replies</Text>
            </View>
            <ScrollView >
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
            </ScrollView>
            <CommentInput
                onComment={() => onComment()}
                onChangeText={(text) => setcommentText(text)}
                commentText={commentText}
                placeholder={'Add Comment'}
            />

            {/* <KeyboardAvoidingView  {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
                <View style={styles.commnetInput}>
                    <RenderUserIcon url={user?.avtar} height={46} isBorder={user?.subscribedMember} />
                    <TextInput value={commentText} onChangeText={(text) => setcommentText(text)} style={styles.input} placeholder='Add Comment' placeholderTextColor={colors.neutral_500} />
                    <TouchableOpacity onPress={() => onComment()} style={styles.sendButton}>
                        <Image source={Icons.send} style={ImageStyle(24, 24)} />
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView> */}
            {deleteModal && <ConfirmationModal
                visible={deleteModal}
                onClose={() => setdeleteModal(false)}
                title={`Are you sure, you want to delete this comment?`}
                successBtn={'Yes'}
                canselBtn={'No'}
                onPressCancel={() => setdeleteModal(false)}
                onPressSuccess={() => deleteComment(selectedComment?._id)}
            />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    chatText: {
        // top: -19,
        textAlign: 'center',
        ...FontStyle(18, colors.secondary_600, '700'),
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
        ...FontStyle(15, colors.neutral_900, '700'),
    },
    degreeText: {
        marginTop: 2,
        ...FontStyle(12, colors.neutral_900)
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
        ...FontStyle(12, colors.neutral_900)
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
        ...FontStyle(14, colors.neutral_900)
    },
    commentText2: {
        ...FontStyle(16, colors.neutral_900)
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
        ...FontStyle(14, colors.neutral_900),
        borderRadius: 4,
        height: 47,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    sendButton: {
        paddingHorizontal: 10
    }
})