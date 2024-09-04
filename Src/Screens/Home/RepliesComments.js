import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import ApplicationStyles from '../../Themes/ApplicationStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontStyle, ImageStyle, errorToast } from '../../utils/commonFunction';
import colors from '../../Themes/Colors';
import RenderUserIcon from '../../Components/RenderUserIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAddCommentReply,
  onDeleteCommentReply,
  onGetAllComments,
  onGetRepliesComment,
  onGetSinglePost,
} from '../../Services/PostServices';
import { Icons } from '../../Themes/Icons';
import ConfirmationModal from '../../Components/ConfirmationModal';
import CommentInput from '../../Components/CommentInput';
import RenderText from '../../Components/RenderText';
import { screenName } from '../../Navigation/ScreenConstants';
import {
  onAddCommentReplyThread,
  onDeleteCommentReplyThread,
  onGetThreadRepliesComment,
} from '../../Services/DiscussionServices';

export default function RepliesComments() {
  const { goBack } = useNavigation();
  const [searchText, setSearchText] = useState('');
  const { repliesComments, activePostAllComments, user, activePost } = useSelector(
    e => e.common,
  );
  const dispatch = useDispatch();
  const { params } = useRoute();
  const [activeComment, setactiveComment] = useState(undefined);
  const [commentText, setcommentText] = useState('');
  const [deleteModal, setdeleteModal] = useState(false);
  const [selectedComment, setselectedComment] = useState(undefined);
  const navigation = useNavigation();
  useEffect(() => {
    setactiveComment(
      activePostAllComments?.filter(obj => obj._id == params?.commentId)[0],
    );
  }, [activePostAllComments]);

  useEffect(() => {
    if (params?.isThread) {
      dispatch(
        onGetThreadRepliesComment({
          id: params?.commentId,
        }),
      );
    } else {
      dispatch(
        onGetRepliesComment({
          data: { postId: params?.postId, commentId: params?.commentId },
        }),
      );
    }
  }, []);

  const deleteComment = id => {
    setdeleteModal(false);
    let obj = {
      data: {
        replyId: selectedComment._id,
      },
      onSuccess: () => {
        if (params?.isThread) {
          dispatch(
            onGetThreadRepliesComment({
              id: params?.commentId,
            }),
          );
        } else {
          dispatch(
            onGetRepliesComment({
              data: { postId: params?.postId, commentId: params?.commentId },
            }),
          );
        }
        onGetAllCommentCall()
      },
    };
    dispatch(
      params?.isThread
        ? onDeleteCommentReplyThread(obj)
        : onDeleteCommentReply(obj),
    );
  };

  const RenderReply = ({ item, index, isLastIndex }) => {
    let isUser = item?.createdBy?._id == user?._id;

    const onOpenOtherUserDetails = () => {
      if (!isUser) {
        navigation.navigate(screenName.indiansDetails, {
          userId: item?.createdBy?._id,
        });
      }
    };

    return (
      <View style={styles.replyCommentView}>
        <View style={[styles.replyCommnt, { alignItems: 'flex-start' }]}>
          <View
            style={[
              styles.verticalLine,
              { height: isLastIndex ? '15%' : '100%' },
            ]}
          />
          <View style={[styles.horizontalLine, { marginTop: '8%' }]} />
          <View style={styles.innerCommentRow}>
            <View style={{ marginTop: 5 }}>
              <RenderUserIcon
                userId={item?.createdBy?._id}
                url={item?.createdBy?.avtar}
                height={38}
                isBorder={item?.createdBy?.subscribedMember}
                type='user'
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onOpenOtherUserDetails()}
              style={styles.commentBg}>
              <View style={ApplicationStyles.flex}>
                <Text numberOfLines={1} style={styles.username}>
                  {item?.createdBy?.first_Name} {item?.createdBy?.last_Name}
                </Text>
                <Text style={styles.degreeText}>
                  {item?.createdBy?.profession}, {item?.createdBy?.region}
                </Text>
                <RenderText
                  style={styles.commentText2}
                  text={item?.reply}></RenderText>
                {/* <Text style={styles.commentText2}>{item?.reply}</Text> */}
              </View>
              {item?.createdBy?._id == user._id && (
                <TouchableOpacity
                  onPress={() => {
                    setselectedComment(item), setdeleteModal(true);
                  }}
                  style={{ padding: 5 }}>
                  <Image source={Icons.trash} style={ImageStyle(20, 20)} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const onComment = () => {
    if (commentText.trim() !== '') {
      if (params?.isThread) {
        let obj = {
          data: {
            threadId: params?.threadId,
            commentId: params?.commentId,
            createdBy: user._id,
            reply: commentText.trim(),
          },
          onSuccess: () => {
            setcommentText('');
            dispatch(
              onGetThreadRepliesComment({
                id: params?.commentId,
              }),
            );
            onGetAllCommentCall()
          },
        };
        dispatch(onAddCommentReplyThread(obj));
      } else {
        let obj = {
          data: {
            postId: params?.postId,
            commentId: params?.commentId,
            createdBy: user._id,
            reply: commentText.trim(),
          },
          onSuccess: () => {
            setcommentText('');
            dispatch(
              onGetRepliesComment({
                data: { postId: params?.postId, commentId: params?.commentId },
              }),
            );
            onGetAllCommentCall()
          },
        };
        dispatch(onAddCommentReply(obj));
      }
    } else {
      errorToast('Please enter a comment');
    }
  };

  const onGetAllCommentCall = () => {
    dispatch(
      onGetSinglePost({
        data: {
          postId: activePost?._id,
          loginUserId: user._id,
        },
      }),
    );
    dispatch(
      onGetAllComments({
        data: {
          postId: activePost?._id,
          loginUserId: user._id,
        },
      }),
    );

  };

  return (
    <SafeAreaView style={ApplicationStyles.applicationView}>
      <Header
        title={'IndiansAbroads'}
        showLeft={true}
        showRight={false}
        onLeftPress={() => goBack()}
      />
      <View style={{ borderTopWidth: 1, borderTopColor: colors.secondary_500 }}>
        <Text style={styles.chatText}>Replies</Text>
      </View>
      <ScrollView>
        <View style={{ paddingHorizontal: 0, marginTop: 8, flex: 1 }}>
          {activeComment && (
            <View style={{ marginBottom: 10 }}>
              <View style={styles.headerView}>
                <View style={{ paddingTop: 8 }}>
                  <RenderUserIcon
                    url={
                      activeComment?.user
                        ? activeComment?.user?.avtar
                        : activeComment?.createdBy?.avtar
                    }
                    type='user'
                    height={53}
                    isBorder={activeComment?.user
                      ? activeComment?.user?.subscribedMember
                      : activeComment?.createdBy?.subscribedMember}

                  />
                </View>
                <View style={styles.commentBg}>
                  <View style={ApplicationStyles.flex}>
                    <Text numberOfLines={1} style={styles.username}>
                      {activeComment?.user
                        ? activeComment?.user?.first_Name
                        : activeComment?.createdBy?.first_Name}{' '}
                      {activeComment?.user
                        ? activeComment?.user?.last_Name
                        : activeComment?.createdBy?.last_Name}
                    </Text>
                    <Text style={styles.degreeText}>
                      {activeComment?.user?.profession},{' '}
                      {activeComment?.user?.region}
                    </Text>
                    <Text style={styles.commentText2}>
                      {activeComment?.comment}
                    </Text>
                  </View>
                </View>
              </View>
              {repliesComments && repliesComments.length > 0 && (
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={repliesComments}
                  renderItem={({ item, index }) => {
                    return (
                      <RenderReply
                        item={item}
                        index={index}
                        isLastIndex={repliesComments.length - 1 == index}
                      />
                    );
                  }}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <CommentInput
        onComment={() => onComment()}
        onChangeText={text => setcommentText(text)}
        commentText={commentText}
        placeholder={'Add Comment'}
      />
      {deleteModal && (
        <ConfirmationModal
          visible={deleteModal}
          onClose={() => setdeleteModal(false)}
          title={`Are you sure, you want to delete this comment?`}
          successBtn={'Yes'}
          canselBtn={'No'}
          onPressCancel={() => setdeleteModal(false)}
          onPressSuccess={() => deleteComment(selectedComment?._id)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatText: {
    // top: -19,
    textAlign: 'center',
    ...FontStyle(18, colors.secondary_600, '700'),
    marginVertical: 5,
  },
  headerView: {
    flexDirection: 'row',
    // alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    // paddingTop: 10
  },
  userImage: {
    height: 57,
    width: 57,
    borderRadius: 57 / 2,
  },
  username: {
    ...FontStyle(14, colors.neutral_900, '700'),
  },
  degreeText: {
    marginTop: 2,
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
    ...FontStyle(14, colors.neutral_900),
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
    // alignItems: 'center',
    flex: 1,
    paddingTop: 5,
    gap: 5,
  },
  horizontalLine: {
    width: 5,
    backgroundColor: colors.neutral_400,
    height: 1,
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
