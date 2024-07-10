import {GET_CHAT_MESSAGES, GET_CHAT_ROOMS} from '../Redux/ActionTypes';
import {POST, api} from '../utils/apiConstants';
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
        dispatchAction(dispatch, GET_CHAT_ROOMS, response.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getChatMessage = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.message,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_CHAT_MESSAGES, response.data.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};
