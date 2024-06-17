const initialState = {
  loading: false,
  preLoader: false,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case 'PRE_LOADER': {
      console.log(action.payload);
      return {...state, preLoader: action.payload.preLoader};
    }
    default:
      return state;
  }
}
