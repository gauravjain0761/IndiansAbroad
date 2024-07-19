import {
  IS_LOADING,
  OTHER_USER_INFO,
  SET_ALL_PAGE_FOLLOWER,
  SET_ALL_PAGE_POST,
  SET_ALL_POST,
  SET_BLOCK_USER_LIST,
  SET_LIKED_USER_LIST,
  SET_LIKE_DISLIKE,
  SET_OTHER_POST_LIST,
  SET_OTHER_USER_FOLLOWLIST,
  UPDATE_BLOCK_LIST,
  UPDATE_POST_LIST,
} from '../Redux/ActionTypes';
import { setAsyncUserInfo } from '../utils/AsyncStorage';
import { GET, POST, api } from '../utils/apiConstants';
import {
  dispatchAction,
  handleErrorRes,
  handleSuccessRes,
  makeAPIRequest,
} from '../utils/apiGlobal';
import { successToast } from '../utils/commonFunction';

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

export const onCancelRequest = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.cancelRequest,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onPagesConnectRequest = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.pageFollow,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        successToast(response?.data?.msg);
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

export const onGetOtherUserInfo = (request) => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.getUser,
    params: request?.params
  })
    .then(async (response) => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, OTHER_USER_INFO, response?.data?.data)
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getallpostsOfUser = (request) => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.getallpostsOfUser,
    data: request?.data
  })
    .then(async (response) => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_OTHER_POST_LIST, response?.data)
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getOtherUserFollowList = (request) => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.otherUserFollowList,
    data: request?.data
  })
    .then(async (response) => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_OTHER_USER_FOLLOWLIST, response?.data)
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};


export const getAllPagePost = (request) => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.getAllPagePostApi + request?.pageId,
    params: request?.params
  })
    .then(async (response) => {
      // handleSuccessRes(response, request, dispatch, () => {


      if (response?.status === 200 || response?.status === 201) {
        dispatchAction(dispatch, IS_LOADING, false)
        if (response?.data && response?.data?.err == 200) {
          dispatchAction(dispatch, SET_ALL_PAGE_POST, { ...response?.data, current_page: request?.params?.page })
        } else {
          if (response?.data && response?.data?.err == 300) {
            dispatchAction(dispatch, SET_ALL_PAGE_POST, { data: [], current_page: 1 })
          }
          if (request?.onFailure) request.onFailure(response?.data);
        }
      }


      // });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getAllPageFollower = (request) => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.getAllPageFollowerApi,
    params: request?.params
  })
    .then(async (response) => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_ALL_PAGE_FOLLOWER, response?.data?.data)
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};
