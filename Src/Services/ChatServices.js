import { GET_CHAT_MESSAGES, GET_CHAT_ROOMS, GET_GROUP_ROOMS, IS_LOADING, SET_CHAT_DETAIL, SET_CHAT_MEDIA_LINK, SET_UNREAD_MSG_COUNT } from '../Redux/ActionTypes';
import { POST, api } from '../utils/apiConstants';
import {
  dispatchAction,
  handleErrorRes,
  handleSuccessRes,
  makeAPIRequest,
} from '../utils/apiGlobal';

export const getChatRooms = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.chatRoom,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_CHAT_ROOMS, { ...response?.data, current_page: request?.data?.page });
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getChatMessage = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.messageList,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_CHAT_MESSAGES, { ...response?.data, current_page: request?.data?.page });
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getGroupRooms = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.groupRoom,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_GROUP_ROOMS, { ...response?.data, current_page: request?.data?.page });
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};


export const onGetUnreadMsgCount = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.getUnreadMessage,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_UNREAD_MSG_COUNT, response.data.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetChatDetail = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.chatDetails,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_CHAT_DETAIL, response.data.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetMediaLinks = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.getMediaFilesLinks,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_CHAT_MEDIA_LINK, response.data.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onClearAllChat = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.clearAllChat,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onLeaveFromGroup = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.leaveGroup,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};