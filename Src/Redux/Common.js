import { IS_LOADING, SET_ALL_POST } from "./ActionTypes";

const initialState = {
  loading: false,
  preLoader: false,
  allPost: undefined,
  totalPostCount: 0
};
export default function (state = initialState, action) {
  switch (action.type) {
    case IS_LOADING: {
      return { ...state, preLoader: action.payload };
    }
    case SET_ALL_POST: {
      console.log('action---', action?.payload)
      return { ...state, allPost: action.payload, totalPostCount: action.paload };
    }
    default:
      return state;
  }
}
