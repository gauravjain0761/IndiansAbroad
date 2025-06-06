import { FlatList, ScrollView, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Text, View, Image, SafeAreaView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation } from '@react-navigation/native';
import PostCard from '../../Components/PostCard';
import { FontStyle, ImageStyle, errorToast } from '../../utils/commonFunction';
import { Icons } from '../../Themes/Icons';
import { fontname } from '../../Themes/Fonts';
import colors from '../../Themes/Colors';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { useDispatch, useSelector } from 'react-redux';
import { onAddComment, onCommentLike, onDeleteComment, onGetAllComments, onGetSinglePost } from '../../Services/PostServices';
import { api } from '../../utils/apiConstants';
import { dispatchAction } from '../../utils/apiGlobal';
import { SET_LIKE_COMMENTS, SET_REPLIES_COMMENTS } from '../../Redux/ActionTypes';
import { screenName } from '../../Navigation/ScreenConstants';
import PagePostCard from '../../Components/PagePostCard';
import CommentInput from '../../Components/CommentInput';
import RenderComment from '../../Components/RenderComment';
import ConfirmationModal from '../../Components/ConfirmationModal';
import { replaceTriggerValues } from 'react-native-controlled-mentions';

export default function PagesPostDetail() {
  const navigation = useNavigation()
  const [commentText, setcommentText] = useState('')
  const { activePost, user, activePostAllComments } = useSelector(e => e.common)
  const dispatch = useDispatch()
  const [deleteModal, setdeleteModal] = useState(false)
  const [selectedComment, setselectedComment] = useState(undefined)

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

  const onOpenReplies = (item) => {
    dispatchAction(dispatch, SET_REPLIES_COMMENTS, undefined)
    navigation.navigate(screenName.RepliesComments, {
      commentId: item?._id,
      postId: item?.postId,
    })
  }

  const RenderItem = ({ item, itemIndex }) => {
    return <RenderComment item={item} onLikeComment={() => onLikeComment(item)} onOpenReplies={() => onOpenReplies(item)} onDelete={() => {
      setselectedComment(item)
      setdeleteModal(true)
    }} />
  }

  const deleteComment = (id) => {
    setdeleteModal(false)
    let obj = {
      data: {
        postId: activePost._id,
        commentId: id
      },
      onSuccess: () => {
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
      }
    }
    dispatch(onDeleteComment(obj))
  }

  const onComment = () => {
    if (commentText.trim() !== '') {
      let obj = {
        data: {
          postId: activePost?._id,
          createdBy: user._id,
          comment: replaceTriggerValues(commentText.trim(), ({ id }) => `@${id}`)
        },
        onSuccess: () => {
          setcommentText('')
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
        }
      }
      dispatch(onAddComment(obj))
    } else {
      errorToast('Please enter comment');
    }
  }

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header title={'IndiansAbroad'} showLeft={true} onLeftPress={() => { navigation.goBack() }} />
      <ScrollView>
        <View style={{ marginBottom: 10 }}>
          <PagePostCard isDetailScreen={true} item={activePost} />
        </View>
        {activePostAllComments && activePostAllComments.length > 0 && <FlatList
          data={activePostAllComments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <RenderItem itemIndex={index} item={item} />
          }}
        />}
      </ScrollView>
      <CommentInput
        onComment={() => onComment()}
        onChangeText={(text) => setcommentText(text)}
        commentText={commentText}
        placeholder={'Add Comment'}
      />
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
  );
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
    height: 45,
    width: 45,
    resizeMode: 'contain'
  },
  username: {
    ...FontStyle(15, colors.neutral_900, '700'),
  },
  degreeText: {
    ...FontStyle(12, colors.neutral_900),
  },
  commentBg: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.inputBg,
    paddingVertical: 5,
    borderRadius: 4,
    paddingHorizontal: 3,
    alignItems: 'flex-start',
  },
  likesText: {
    ...FontStyle(12, colors.neutral_900),
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  replyCommentView: {
    alignSelf: 'flex-end',
  },
  commentText: {
    ...FontStyle(14, colors.neutral_900),
  },
  commentText2: {
    ...FontStyle(16, colors.neutral_900),
  },
  verticalLine: {
    width: 1,
    backgroundColor: colors.neutral_400,
    height: '50%',
  },
  replyCommnt: {
    width: '83%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  innerCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 5,
    gap: 5,
  },
  horizontalLine: {
    width: 5,
    backgroundColor: colors.neutral_400,
    height: 1,
    alignSelf: 'center',
  },
  commnetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary_500,
    paddingLeft: 10,
    paddingVertical: 2,
  },
  input: {
    backgroundColor: colors.inputBg,
    flex: 1,
    ...FontStyle(14, colors.neutral_900),
    borderRadius: 4,
    height: 47,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  sendButton: {
    paddingHorizontal: 10,
  },
});
