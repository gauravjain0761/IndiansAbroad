import { IS_LOADING, SET_ALL_POST, SET_USER } from "./ActionTypes";

const initialState = {
  loading: false,
  user: undefined,
  preLoader: false,
  allPost: undefined,
  allPostsCount: 0
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
    default:
      return state;
  }
}
