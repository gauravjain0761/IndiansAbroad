import { FlatList, ScrollView, StyleSheet, Platform, TouchableOpacity, Text, View, Image, SafeAreaView, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import { errorToast, FontStyle, ImageStyle } from '../../utils/commonFunction';
import { Icons } from '../../Themes/Icons';
import colors from '../../Themes/Colors';
import RenderUserIcon from '../../Components/RenderUserIcon';
import DiscussionForumDetailCard from '../../Components/DiscussionForumDetailCard';
import { useDispatch, useSelector } from 'react-redux';
import { onAddCommentThread, onDeleteCommentThread, onGetThreadAllComments, onGetThreadDetail } from '../../Services/DiscussionServices';
import RenderComment from '../../Components/RenderComment';
import { SET_REPLIES_COMMENTS } from '../../Redux/ActionTypes';
import { screenName } from '../../Navigation/ScreenConstants';
import { dispatchAction } from '../../utils/apiGlobal';
import ShareModal from '../../Components/ShareModal';
import ConfirmationModal from '../../Components/ConfirmationModal';

export default function DiscussionForumDetail() {
    const navigation = useNavigation()
    const [commentText, setcommentText] = useState('')
    const { activePost, user, activePostAllComments } = useSelector(e => e.common)
    const dispatch = useDispatch()
    const [shareModal, setshareModal] = useState(false);
    const [deleteModal, setdeleteModal] = useState(false)
    const [selectedComment, setselectedComment] = useState(undefined)

    useEffect(() => {
        dispatch(onGetThreadDetail({
            data: {
                threadId: activePost?._id,
            }
        }))
        dispatch(onGetThreadAllComments({
            id: activePost?._id
        }))
    }, [])

    console.log('activePostAllComments===', JSON.stringify(activePostAllComments))

    const onOpenReplies = (item) => {
        dispatchAction(dispatch, SET_REPLIES_COMMENTS, undefined)
        navigation.navigate(screenName.RepliesComments, {
            commentId: item?._id,
            isThread: true,
            threadId: activePost?._id,
        })
    }


    const RenderItem = ({ item, itemIndex }) => {
        return <RenderComment isThread={true} item={item} onOpenReplies={() => onOpenReplies(item)} onDelete={() => {
            setselectedComment(item)
            setdeleteModal(true)
        }} />
    }

    const onComment = () => {
        if (commentText.trim() !== '') {
            let obj = {
                data: {
                    threadId: activePost._id,
                    createdBy: user._id,
                    comment: commentText.trim()
                },
                onSuccess: () => {
                    dispatch(onGetThreadDetail({
                        data: {
                            threadId: activePost?._id,
                        }
                    }))
                    setcommentText('')
                    dispatch(onGetThreadAllComments({
                        id: activePost?._id
                    }))
                }
            }
            dispatch(onAddCommentThread(obj))
        } else {
            errorToast('Please enter a comment')
        }
    }

    const deleteComment = (id) => {
        setdeleteModal(false)
        let obj = {
            data: {
                commentId: id
            },
            onSuccess: () => {
                dispatch(onGetThreadDetail({
                    data: {
                        threadId: activePost?._id,
                    }
                }))
                dispatch(onGetThreadAllComments({
                    id: activePost?._id
                }))
            }
        }
        dispatch(onDeleteCommentThread(obj))
    }

    return (
        <View style={ApplicationStyles.flex}>
            <SafeAreaView style={ApplicationStyles.applicationView}>
                <Header title={''} showLeft={true} onLeftPress={() => { navigation.goBack(); }} />
                <ScrollView >
                    <View style={{ marginBottom: 10 }}>
                        <DiscussionForumDetailCard item={activePost} />
                    </View>
                    <Text style={styles.commentText1}>{activePost?.commentCount} Responses</Text>
                    {activePostAllComments && activePostAllComments.length > 0 && <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={activePostAllComments}
                        renderItem={({ item, index }) => {
                            return <RenderItem itemIndex={index} item={item} />
                        }}
                    />}
                </ScrollView>
                <KeyboardAvoidingView  {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
                    <View style={styles.commnetInput}>
                        <TextInput value={commentText} onChangeText={(text) => setcommentText(text)} multiline={true} style={styles.input} placeholder='Add Response' placeholderTextColor={colors.neutral_500} />
                        <TouchableOpacity onPress={() => onComment()} style={styles.sendButton}>
                            <Image source={Icons.send} style={ImageStyle(24, 24)} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setshareModal(true)} style={styles.sendButton}>
                            <Image source={Icons.share} style={ImageStyle(24, 24, 'cover')} />
                            <Text style={[styles.shareText, { lineHeight: 16 }]}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView >
            {shareModal && (
                <ShareModal
                    visible={shareModal}
                    postId={activePost._id}
                    onClose={() => setshareModal(false)}
                    item={activePost}
                    isThread={true}
                />
            )}
            {deleteModal && <ConfirmationModal
                visible={deleteModal}
                onClose={() => setdeleteModal(false)}
                title={`Are you sure, you want to delete this comment?`}
                successBtn={'Yes'}
                canselBtn={'No'}
                onPressCancel={() => setdeleteModal(false)}
                onPressSuccess={() => deleteComment(selectedComment?._id)}
            />}
        </View>

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
        ...FontStyle(15, colors.neutral_900, '700')
    },
    degreeText: {
        ...FontStyle(12, colors.neutral_900)
    },
    shareText: {
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
    commentText1: {
        textAlign: 'center',
        marginBottom: 8,
        ...FontStyle(13, colors.neutral_100)
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
        minHeight: 47,
        paddingHorizontal: 10,
        marginLeft: 10,
        textAlignVertical: 'center',
        maxHeight: 150,
        paddingVertical: 12
    },
    sendButton: {
        paddingHorizontal: 10,
        alignItems: 'center'
    }
})