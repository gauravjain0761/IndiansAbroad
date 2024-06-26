import { IS_LOADING, SET_ALL_POST, SET_BLOCK_USER_LIST, SET_LIKED_USER_LIST, SET_LIKE_DISLIKE, SET_USER, UPDATE_BLOCK_LIST, UPDATE_POST_LIST } from "./ActionTypes";

const initialState = {
  user: undefined,
  preLoader: false,
  allPost: undefined,
  allPostsCount: 0,
  likedUserList: undefined,
  blockUserList: undefined
};
export default function (state = initialState, action) {
  switch (action.type) {
    case IS_LOADING: {
      return { ...state, preLoader: action.payload };
    }
    case SET_ALL_POST: {
      return { ...state, allPost: action.payload.current_page == 1 ? action.payload.data : [...state.allPost, ...action.payload.data], allPostsCount: action.payload.allPostsCount };
    }
    case SET_USER: {
      return { ...state, user: action.payload }
    }
    case SET_LIKE_DISLIKE: {
      let allPost = Object.assign([], state.allPost)
      let index = allPost.findIndex(item => item._id == action.payload.postId)
      allPost[index].isLiked = action.payload.action == 'like' ? true : false
      allPost[index].likeCount = action.payload.action == 'like' ? allPost[index].likeCount + 1 : allPost[index].likeCount - 1
      return { ...state, allPost }
    }
    case SET_LIKED_USER_LIST: {
      return { ...state, likedUserList: action.payload }
    }
    case UPDATE_POST_LIST: {
      let allPost = Object.assign([], state.allPost)

      if (action.payload.type == 'unfollow') {
        let index = allPost.findIndex(item => item._id == action.payload.postId)
        allPost[index].isFollowing = !allPost[index].isFollowing
      } else if (action.payload.type == 'block') {
        let temp = allPost.filter(obj => obj.createdBy?._id !== action.payload.userId)
        allPost = temp
      }
      return {
        ...state,
        allPost: allPost
      }
    }
    case SET_BLOCK_USER_LIST: {
      return { ...state, blockUserList: action.payload }
    }
    case UPDATE_BLOCK_LIST: {
      let blockUserList = Object.assign([], state.blockUserList)
      blockUserList = blockUserList.filter(obj => obj.blockedUserId !== action.payload)
      return { ...state, blockUserList }
    }
    default:
      return state;
  }
}
