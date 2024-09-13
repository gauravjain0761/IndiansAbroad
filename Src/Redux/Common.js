import {
  IS_LOADING,
  SET_ACTIVE_POST,
  SET_ALL_INDIANS,
  SET_ALL_PAGES,
  SET_ACTIVE_POST_COMMENTS,
  SET_ALL_POST,
  SET_BLOCK_USER_LIST,
  SET_LIKED_USER_LIST,
  SET_LIKE_COMMENTS,
  SET_LIKE_DISLIKE,
  SET_REPLIES_COMMENTS,
  SET_USER,
  UPDATE_BLOCK_LIST,
  UPDATE_POST_LIST,
  SET_POST_CONNECT,
  SET_POST_DISCONNECT,
  SET_POST_CANCEL_REQUEST,
  SET_POST_PAGES_CONNECT,
  SET_POST_PAGES_DISCONNECT,
  OTHER_USER_INFO,
  SET_OTHER_POST_LIST,
  SET_OTHER_USER_FOLLOWLIST,
  SET_ALL_PAGE_POST,
  SET_ALL_PAGE_FOLLOWER,
  SET_GLOBAL_SEARCH,
  SET_FOLLOWER_LIST,
  SET_COUNTRY_DISCUSSION_LIST,
  SET_THREAD_LIST,
  UPDATE_COUNTRY_DISCUSSION_LIST,
  SET_COUNTRIES,
  SET_MAIN_FOLLOWER_LIST,
  GET_CHAT_ROOMS,
  GET_CHAT_MESSAGES,
  MY_PAGES,
  SET_PAGE_CONNECT_POST,
  SET_PAGE_DETAIL,
  SET_ACTIVE_CHAT_ROOM_USER,
  GET_GROUP_ROOMS,
  SET_UNREAD_MSG_COUNT,
  ADD_ONE_MESSAGE,
  SET_CHAT_DETAIL,
  SET_CHAT_MEDIA_LINK,
  SET_ALL_EVENTS,
  SET_ACTIVE_EVENT,
  SET_GROUP_CREATE_USERS,
  GET_ALL_CURRENCIES,
  DELETE_MESSAGE,
  SET_NOTIFICATION_LIST,
  SET_FCM_TOKEN,
  GET_SAVE_EVENT,
  SET_MY_PAGE_CHAT_USERS,
  ON_DELETE_CHAT,
  SET_CONNECT_REQUEST,
  SET_ALL_INDIANS_REGION,
  SET_GOOGLE_USER,
  LOG_OUT,
  SET_EVENT_FAVORITE,
  SET_PLAN_LIST,
} from './ActionTypes';

const initialState = {
  user: undefined,
  googleUser: undefined,
  preLoader: false,
  allPost: undefined,
  allEvent: undefined,
  allSave: undefined,
  allIndian: undefined,
  allPages: undefined,
  allPostsCount: 0,
  allEventCount: 0,
  allSaveCount: 0,
  allIndianCount: 0,
  allPagesCount: 0,
  likedUserList: undefined,
  blockUserList: undefined,
  activePost: undefined,
  activeEvent: undefined,
  activePostAllComments: undefined,
  repliesComments: undefined,
  otherUserInfo: undefined,
  otherUserAllPost: undefined,
  otherUserFollowList: undefined,
  allPagePost: undefined,
  allPagePostCount: 0,
  allPageFollowerList: undefined,
  globalSearchData: undefined,
  followerList: undefined,
  discussionCountry: undefined,
  threadList: undefined,
  countries: undefined,
  mainFollowerList: undefined,
  chatRoomList: undefined,
  allChatRoomCount: 0,
  groupRoomList: undefined,
  allGroupRoomCount: 0,
  chatMessageList: undefined,
  allChatMessageCount: 0,
  myPage: undefined,
  pageDetail: undefined,
  activeChatRoomUser: undefined,
  unreadMsgCount: 0,
  activeChatDetails: undefined,
  activeChatMediaLinks: undefined,
  groupCreateAllUsers: undefined,
  getCurrenciesList: undefined,
  notificationList: undefined,
  fcmToken: null,
  myPageChatUsers: undefined,
  allIndianRegion: undefined,
  allIndianRegionCount: 0,
  planList: undefined
};
export default function (state = initialState, action) {
  switch (action.type) {
    case IS_LOADING: {
      return { ...state, preLoader: action.payload };
    }
    case SET_ALL_POST: {
      return {
        ...state,
        allPost:
          action.payload.current_page == 1
            ? action.payload.data
            : [...state.allPost, ...action.payload.data],
        allPostsCount: action.payload.totalCount,
      };
    }
    case SET_ALL_EVENTS: {
      return {
        ...state,
        allEvent:
          action.payload.current_page == 1
            ? action.payload.data
            : [...state.allEvent, ...action.payload.data],
        allEventCount: action.payload.count,
      };
    }
    case GET_SAVE_EVENT: {
      return {
        ...state,
        allSave: action.payload,
      };
    }
    case SET_ALL_INDIANS: {
      return {
        ...state,
        allIndian:
          action.payload.current_page == 1
            ? action.payload.data
            : [...state.allIndian, ...action.payload.data],
        allIndianCount: action.payload.total,
      };
    }
    case SET_ALL_INDIANS_REGION: {
      return {
        ...state,
        allIndianRegion:
          action.payload.current_page == 1
            ? action.payload.data
            : [...state.allIndianRegion, ...action.payload.data],
        allIndianRegionCount: action.payload.total,
      };
    }
    case SET_ALL_PAGES: {
      return {
        ...state,
        allPages:
          action.payload.current_page == 1
            ? action.payload.data
            : [...state.allPages, ...action.payload.data],
        allPagesCount: action.payload.totalCount,
      };
    }
    case SET_USER: {
      return { ...state, user: action.payload };
    }
    case SET_LIKE_DISLIKE: {
      let allPost = Object.assign([], state.allPost);
      let index = allPost.findIndex(item => item._id == action.payload.postId);
      let otherUserAllPost = Object.assign([], state?.otherUserAllPost?.data);
      let allPagePost = Object.assign([], state.allPagePost);
      let activePost = Object.assign({}, state.activePost);
      if (index !== -1) {
        allPost[index].isLiked = action.payload.action == 'like' ? true : false;
        allPost[index].likeCount =
          action.payload.action == 'like'
            ? allPost[index].likeCount + 1
            : allPost[index].likeCount - 1;
      }
      if (state.otherUserAllPost) {
        let index = otherUserAllPost.findIndex(
          item => item._id == action.payload.postId,
        );
        if (index !== -1) {
          otherUserAllPost[index].isLiked =
            action.payload.action == 'like' ? true : false;
          otherUserAllPost[index].likeCount =
            action.payload.action == 'like'
              ? otherUserAllPost[index].likeCount + 1
              : otherUserAllPost[index].likeCount - 1;
        }
      }
      if (state.allPagePost) {
        let index = allPagePost.findIndex(
          item => item._id == action.payload.postId,
        );
        if (index !== -1) {
          allPagePost[index].isLiked =
            action.payload.action == 'like' ? true : false;
          allPagePost[index].likeCount =
            action.payload.action == 'like'
              ? allPagePost[index].likeCount + 1
              : allPagePost[index].likeCount - 1;
        }
      }
      if (state.activePost) {
        activePost.isLiked = action.payload.action == 'like' ? true : false;
        activePost.likeCount =
          action.payload.action == 'like'
            ? activePost.likeCount + 1
            : activePost.likeCount - 1;
      }
      return {
        ...state,
        allPost,
        otherUserAllPost: state.otherUserAllPost
          ? { ...state.otherUserAllPost, data: otherUserAllPost }
          : undefined,
        activePost: state.activePost ? activePost : undefined,
        allPagePost: state.allPagePost ? allPagePost : undefined,
      };
    }
    case SET_LIKED_USER_LIST: {
      return { ...state, likedUserList: action.payload };
    }
    case UPDATE_POST_LIST: {
      let allPost = Object.assign([], state.allPost);
      if (action.payload.type == 'unfollow') {
        let index = allPost.findIndex(
          item => item._id == action.payload.postId,
        );
        if (index !== -1) {
          allPost[index].isFollowing = 'notfollowing'
        }
      } if (action.payload.type == 'follow') {
        let index = allPost.findIndex(
          item => item._id == action.payload.postId,
        );
        if (index !== -1) {
          allPost[index].isFollowing = 'requested'
        }
      } else if (action.payload.type == 'block') {
        let temp = allPost.filter(
          obj => obj.createdBy?._id !== action.payload.userId,
        );
        allPost = temp;
      }
      return {
        ...state,
        allPost: allPost,
      };
    }
    case SET_BLOCK_USER_LIST: {
      return { ...state, blockUserList: action.payload };
    }
    case UPDATE_BLOCK_LIST: {
      let blockUserList = Object.assign([], state.blockUserList);
      blockUserList = blockUserList.filter(
        obj => obj.blockedUserId !== action.payload,
      );
      return { ...state, blockUserList };
    }
    case SET_ACTIVE_POST: {
      const updateData = state.allPost.map((list) => {
        if (list?._id == action.payload?._id) {
          return {
            ...list,
            commentCount: action.payload?.commentCount
          }
        } else {
          return {
            ...list
          }
        }
      })
      return { ...state, activePost: action.payload, allPost: updateData };
    }
    case SET_ACTIVE_EVENT: {
      return { ...state, activeEvent: action.payload };
    }
    case SET_ACTIVE_POST_COMMENTS: {
      return { ...state, activePostAllComments: action.payload };
    }
    case SET_LIKE_COMMENTS: {
      let activePostAllComments = Object.assign(
        [],
        state.activePostAllComments,
      );
      let index = activePostAllComments.findIndex(
        item => item._id == action.payload.commentId,
      );
      if (index !== -1) {
        activePostAllComments[index].isCommentLiked =
          action.payload.action == 'like' ? true : false;
        activePostAllComments[index].commentlikeCount =
          action.payload.action == 'like'
            ? activePostAllComments[index].commentlikeCount + 1
            : activePostAllComments[index].commentlikeCount - 1;
      }
      return { ...state, activePostAllComments };
    }
    case SET_REPLIES_COMMENTS: {
      return { ...state, repliesComments: action.payload };
    }
    case SET_POST_CONNECT: {
      const update = state.allIndian.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isFollowingRequested: action.payload.action,
          };
        } else {
          return { ...item };
        }
      });
      const update2 = state.allIndianRegion.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isFollowingRequested: action.payload.action,
          };
        } else {
          return { ...item };
        }
      });

      return { ...state, allIndian: update, allIndianRegion: update2 };
    }
    case SET_CONNECT_REQUEST: {
      const update = state.allPost.map(item => {
        if (item.createdBy._id == action.payload.followingId && (action?.payload?.type && action?.payload?.type == 'accept')) {
          return {
            ...item,
            requestSent: false,
            isFollowing: action?.payload?.type && action?.payload?.type == 'accept' ? 'following' : action?.payload?.type == 'remove' ? 'notfollowing' : action?.payload?.type == 'disconnect' ? 'notfollowing' : 'requested',
          };
        } else if (item.createdBy._id == action.payload.followingId) {
          return {
            ...item,
            isFollowing: action?.payload?.type && action?.payload?.type == 'accept' ? 'following' : action?.payload?.type == 'remove' ? 'notfollowing' : action?.payload?.type == 'disconnect' ? 'notfollowing' : 'requested',
          };
        } else {
          return { ...item };
        }
      });
      let activePost = Object.assign({}, state.activePost)
      if (Object.keys(activePost).length > 0) {
        if (activePost.createdBy._id == action.payload.followingId && (action?.payload?.type && action?.payload?.type == 'accept')) {
          activePost.requestSent = false
          activePost.isFollowing = action?.payload?.type && action?.payload?.type == 'accept' ? 'following' : action?.payload?.type == 'remove' ? 'notfollowing' : action?.payload?.type == 'disconnect' ? 'notfollowing' : 'requested'
        }
        else if (activePost.createdBy._id == action.payload.followingId) {
          activePost.isFollowing = action?.payload?.type && action?.payload?.type == 'accept' ? 'following' : action?.payload?.type == 'remove' ? 'notfollowing' : action?.payload?.type == 'disconnect' ? 'notfollowing' : 'requested'
        }
      }
      return { ...state, allPost: update, activePost: activePost }
    }
    case SET_POST_CANCEL_REQUEST: {
      const updates = state.allIndian.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isFollowingRequested: action.payload.action,
          };
        } else {
          return { ...item };
        }
      });
      const updates2 = state.allIndianRegion.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isFollowingRequested: action.payload.action,
          };
        } else {
          return { ...item };
        }
      });
      return { ...state, allIndian: updates, allIndianRegion: updates2 };
    }
    case SET_POST_DISCONNECT: {
      const updates = state.allIndian.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isFollowing: action.payload.action,
          };
        } else {
          return { ...item };
        }
      });
      const updates2 = state.allIndianRegion.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isFollowing: action.payload.action,
          };
        } else {
          return { ...item };
        }
      });
      return { ...state, allIndian: updates, allIndianRegion: updates2 };
    }
    case SET_PAGE_CONNECT_POST: {
      let allPost = Object.assign([], state.allPost);
      let index = allPost.findIndex(item => item._id == action.payload.postId);
      if (allPost[index].followingCommunityPage == 'following') {
        allPost[index].followingCommunityPage = 'not_following';
      } else {
        allPost[index].followingCommunityPage = 'following';
      }
      return { ...state, allPost: allPost };
    }
    case SET_POST_PAGES_CONNECT: {
      const updates = state.allPages.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isfollowing: true,
          };
        } else {
          return { ...item };
        }
      });
      return { ...state, allPages: updates };
    }
    case SET_POST_PAGES_DISCONNECT: {
      const updates = state.allPages.map(item => {
        if (item._id == action.payload.postId) {
          return {
            ...item,
            isfollowing: false,
          };
        } else {
          return { ...item };
        }
      });
      return { ...state, allPages: updates };
    }
    case OTHER_USER_INFO: {
      if (action.payload) {
        return { ...state, otherUserInfo: action.payload };
      } else {
        return {
          ...state,
          otherUserInfo: action.payload,
          otherUserAllPost: undefined,
          otherUserFollowList: undefined,
        };
      }
    }
    case SET_OTHER_POST_LIST: {
      return { ...state, otherUserAllPost: action.payload };
    }
    case SET_OTHER_USER_FOLLOWLIST: {
      return { ...state, otherUserFollowList: action.payload };
    }
    case SET_ALL_PAGE_POST: {
      // return {
      //   ...state,
      //   allPagePost:
      //     action.payload.current_page == 1
      //       ? action.payload.data
      //       : [...state.allPagePost, ...action.payload.data],
      //   allPagePostCount: action.payload.totalPosts,
      // };
      return {
        ...state,
        allPagePost: action.payload.data,
        allPagePostCount: action.payload.totalPosts,
      };
    }
    case SET_ALL_PAGE_FOLLOWER: {
      return {
        ...state,
        allPageFollowerList: action.payload,
      };
    }
    case SET_GLOBAL_SEARCH: {
      return { ...state, globalSearchData: action.payload };
    }
    case SET_FOLLOWER_LIST: {
      return { ...state, followerList: action.payload };
    }
    case SET_COUNTRY_DISCUSSION_LIST: {
      let temp = Object.assign([], action.payload);
      if (temp.length > 0) {
        temp.forEach((element, index) => {
          if (index == 0) {
            element.isSelected = true;
          } else {
            element.isSelected = false;
          }
        });
      }
      return { ...state, discussionCountry: temp };
    }
    case SET_THREAD_LIST: {
      return { ...state, threadList: action.payload };
    }
    case UPDATE_COUNTRY_DISCUSSION_LIST: {
      let temp = Object.assign([], state.discussionCountry);
      if (temp.length > 0) {
        temp.forEach((element, index) => {
          if (element._id == action.payload) {
            element.isSelected = true;
          } else {
            element.isSelected = false;
          }
        });
      }
      return { ...state, discussionCountry: temp };
    }
    case SET_COUNTRIES: {
      return { ...state, countries: action.payload };
    }
    case SET_MAIN_FOLLOWER_LIST: {
      return { ...state, mainFollowerList: action.payload };
    }
    case GET_CHAT_ROOMS: {
      return {
        ...state,
        chatRoomList:
          action.payload.current_page == 1
            ? action.payload.data
            : [...state.chatRoomList, ...action.payload.data],
        allChatRoomCount: action.payload.count,
      };
    }
    case GET_GROUP_ROOMS: {
      return {
        ...state,
        groupRoomList:
          action.payload.current_page == 1
            ? action.payload.data
            : [...state.groupRoomList, ...action.payload.data],
        allGroupRoomCount: action.payload.count,
      };
    }
    case GET_CHAT_MESSAGES: {
      if (action?.payload) {
        return {
          ...state,
          chatMessageList:
            action.payload.current_page == 1
              ? action.payload.data
              : [...state.chatMessageList, ...action.payload.data],
          allChatMessageCount: action.payload.totalDocuments,
        };
      } else {
        return {
          ...state,
          chatMessageList: action.payload,
        };
      }
    }
    case MY_PAGES: {
      return { ...state, myPage: action.payload };
    }
    case SET_PAGE_DETAIL: {
      return { ...state, pageDetail: action.payload };
    }
    case SET_ACTIVE_CHAT_ROOM_USER: {
      return { ...state, activeChatRoomUser: action.payload };
    }
    case SET_UNREAD_MSG_COUNT: {
      return { ...state, unreadMsgCount: action.payload };
    }
    case ADD_ONE_MESSAGE: {
      if (
        action?.payload?.room == state?.activeChatRoomUser?.chatId &&
        state.chatMessageList.filter(
          obj => obj?._id == action.payload.message?.messageId,
        ).length == 0
      ) {
        let chatMessageList = Object.assign([], state.chatMessageList);
        chatMessageList.unshift({
          ...action.payload.message,
          _id: action.payload.message.messageId,
        });
        return { ...state, chatMessageList };
      } else if (
        action?.payload?.chatId == state?.activeChatRoomUser?.chatId &&
        state.chatMessageList.filter(
          obj => obj?._id == action.payload?.messageId,
        ).length == 0
      ) {
        let chatMessageList = Object.assign([], state.chatMessageList);
        chatMessageList.unshift({
          ...action.payload,
          _id: action.payload.messageId,
        });
        return { ...state, chatMessageList };
      }
    }
    case SET_CHAT_DETAIL: {
      if (action.payload == undefined) {
        return {
          ...state,
          activeChatDetails: action.payload,
          activeChatMediaLinks: action.payload,
        };
      } else {
        return { ...state, activeChatDetails: action.payload };
      }
    }
    case SET_CHAT_MEDIA_LINK: {
      return { ...state, activeChatMediaLinks: action.payload };
    }
    case SET_GROUP_CREATE_USERS: {
      return { ...state, groupCreateAllUsers: action.payload };
    }
    case GET_ALL_CURRENCIES: {
      return { ...state, getCurrenciesList: action.payload };
    }
    case DELETE_MESSAGE: {
      let chatMessageList = Object.assign([], state.chatMessageList);
      chatMessageList = chatMessageList.filter(
        obj => obj?._id !== action.payload?._id,
      );
      return { ...state, chatMessageList };
    }
    case SET_NOTIFICATION_LIST: {
      return { ...state, notificationList: action.payload.reverse() };
    }
    case SET_FCM_TOKEN: {
      return { ...state, fcmToken: action.payload };
    }
    case SET_MY_PAGE_CHAT_USERS: {
      return { ...state, myPageChatUsers: action.payload };
    }
    case ON_DELETE_CHAT: {
      if (action.payload.isGroup) {
        let groupRoomList = Object.assign([], state.groupRoomList);
        groupRoomList = groupRoomList.filter(
          obj => obj?._id !== action.payload?._id,
        );
        return {
          ...state,
          groupRoomList,
          allGroupRoomCount: state?.allGroupRoomCount - 1,
        };
      } else {
        let chatRoomList = Object.assign([], state.chatRoomList);
        chatRoomList = chatRoomList.filter(
          obj => obj?._id !== action.payload?._id,
        );
        return {
          ...state,
          chatRoomList,
          allChatRoomCount: state?.allChatRoomCount - 1,
        };
      }
    }
    case SET_GOOGLE_USER: {
      return { ...state, googleUser: action.payload };
    }
    case SET_EVENT_FAVORITE: {
      const updateData = state.allEvent.map((item) => {
        if (item._id == action.payload) {
          return {
            ...item,
            is_favorite: !item.is_favorite
          }
        } else {
          return {
            ...item
          }
        }
      })
      return { ...state, allEvent: updateData };
    }
    case SET_PLAN_LIST: {
      return { ...state, planList: action.payload };
    }
    case LOG_OUT: {
      return initialState
    }
    default:
      return state;
  }
}
