import {
  IS_LOADING,
  SET_ALL_POST,
  SET_BLOCK_USER_LIST,
  SET_LIKED_USER_LIST,
  SET_LIKE_DISLIKE,
  UPDATE_BLOCK_LIST,
  UPDATE_POST_LIST,
} from '../Redux/ActionTypes';
import {setAsyncUserInfo} from '../utils/AsyncStorage';
import {GET, POST, api} from '../utils/apiConstants';
import {
  dispatchAction,
  handleErrorRes,
  handleSuccessRes,
  makeAPIRequest,
} from '../utils/apiGlobal';
import {successToast} from '../utils/commonFunction';

export const onConnectRequest = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.followRequest,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
        // dispatchAction(dispatch, SET_ALL_POST, { ...response?.data, current_page: request?.data?.page })
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onUnFollowRequest = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.unFollowRequest,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
        dispatchAction(dispatch, UPDATE_POST_LIST, {
          postId: request?.postId,
          type: 'unfollow',
        });
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onBlockUserApi = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.blockUser,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
        if (request?.data?.action == 'block') {
          dispatchAction(dispatch, UPDATE_POST_LIST, {
            ...request?.data,
            type: 'block',
          });
        } else {
          dispatchAction(dispatch, UPDATE_BLOCK_LIST, request?.data?.userId);
        }
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetBlockUserList = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: GET,
    url: api.blockUserList,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_BLOCK_USER_LIST, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onDisConnect = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.unFollowRequest,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
        // dispatchAction(dispatch, UPDATE_POST_LIST, { postId: request?.postId, type: 'unfollow' })
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onCancelRequest = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.cancelRequest,
    data: request?.data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
        // dispatchAction(dispatch, SET_ALL_POST, { ...response?.data, current_page: request?.data?.page })
      });
    })
    .catch(error => {
      console.log('cancelRequest', error.response);
      handleErrorRes(error, request, dispatch);
    });
};

export const onPagesConnectRequest = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.pageFollow,
    data: request?.data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
        // dispatchAction(dispatch, SET_ALL_POST, { ...response?.data, current_page: request?.data?.page })
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onPagesDisConnectRequest = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.pageUnFollow,
    data: request?.data,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
        // dispatchAction(dispatch, SET_ALL_POST, { ...response?.data, current_page: request?.data?.page })
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};
