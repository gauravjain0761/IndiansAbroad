import { IS_LOADING, SET_ACTIVE_POST, SET_ALL_INDIANS, SET_ALL_PAGES, SET_ACTIVE_POST_COMMENTS, SET_ALL_POST, SET_BLOCK_USER_LIST, SET_LIKED_USER_LIST, SET_LIKE_COMMENTS, SET_LIKE_DISLIKE, SET_REPLIES_COMMENTS, SET_USER, UPDATE_BLOCK_LIST, UPDATE_POST_LIST, SET_POST_CONNECT, SET_POST_DISCONNECT, SET_POST_CANCEL_REQUEST, SET_POST_PAGES_CONNECT, SET_POST_PAGES_DISCONNECT, OTHER_USER_INFO, SET_OTHER_POST_LIST, SET_OTHER_USER_FOLLOWLIST, SET_ALL_PAGE_POST, SET_ALL_PAGE_FOLLOWER, SET_GLOBAL_SEARCH, SET_FOLLOWER_LIST, SET_COUNTRY_DISCUSSION_LIST, SET_THREAD_LIST, UPDATE_COUNTRY_DISCUSSION_LIST, SET_COUNTRIES, SET_MAIN_FOLLOWER_LIST, } from './ActionTypes';

const initialState = {
  user: undefined,
  preLoader: false,
  allPost: undefined,
  allIndian: undefined,
  allPages: undefined,
  allPostsCount: 0,
  allIndianCount: 0,
  allPagesCount: 0,
  likedUserList: undefined,
  blockUserList: undefined,
  activePost: undefined,
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
  mainFollowerList: undefined
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
        allPostsCount: action.payload.allPostsCount,
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
        let index = otherUserAllPost.findIndex(item => item._id == action.payload.postId);
        if (index !== -1) {
          otherUserAllPost[index].isLiked = action.payload.action == 'like' ? true : false;
          otherUserAllPost[index].likeCount =
            action.payload.action == 'like'
              ? otherUserAllPost[index].likeCount + 1
              : otherUserAllPost[index].likeCount - 1;
        }
      }
      if (state.allPagePost) {
        let index = allPagePost.findIndex(item => item._id == action.payload.postId);
        if (index !== -1) {
          allPagePost[index].isLiked = action.payload.action == 'like' ? true : false;
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
      return { ...state, allPost, otherUserAllPost: state.otherUserAllPost ? { ...state.otherUserAllPost, data: otherUserAllPost } : undefined, activePost: state.activePost ? activePost : undefined, allPagePost: state.allPagePost ? allPagePost : undefined };
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
        if (index !== -1) { allPost[index].isFollowing = !allPost[index].isFollowing; }
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
      return { ...state, activePost: action.payload };
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
      return { ...state, allIndian: update };
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
      return { ...state, allIndian: updates };
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
      return { ...state, allIndian: updates };
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
      return { ...state, allPages: updates, };
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
      return { ...state, allPages: updates, };
    }
    case OTHER_USER_INFO: {
      if (action.payload) {
        return { ...state, otherUserInfo: action.payload };
      } else {
        return { ...state, otherUserInfo: action.payload, otherUserAllPost: undefined, otherUserFollowList: undefined };
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
      return { ...state, globalSearchData: action.payload, };
    }
    case SET_FOLLOWER_LIST: {
      return { ...state, followerList: action.payload, };
    }
    case SET_COUNTRY_DISCUSSION_LIST: {
      let temp = Object.assign([], action.payload)
      if (temp.length > 0) {
        temp.forEach((element, index) => {
          if (index == 0) {
            element.isSelected = true
          } else {
            element.isSelected = false
          }
        });
      }
      return { ...state, discussionCountry: temp }
    }
    case SET_THREAD_LIST: {
      return { ...state, threadList: action.payload, }
    }
    case UPDATE_COUNTRY_DISCUSSION_LIST: {
      let temp = Object.assign([], state.discussionCountry)
      if (temp.length > 0) {
        temp.forEach((element, index) => {
          if (element._id == action.payload) {
            element.isSelected = true
          } else {
            element.isSelected = false
          }
        });
      }
      return { ...state, discussionCountry: temp, }
    }
    case SET_COUNTRIES: {
      return { ...state, countries: action.payload, }
    }
    case SET_MAIN_FOLLOWER_LIST: {
      return { ...state, mainFollowerList: action.payload, }
    }
    default:
      return state;
  }
}
