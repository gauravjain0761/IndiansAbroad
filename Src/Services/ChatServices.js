import { DELETE_MESSAGE, GET_CHAT_MESSAGES, GET_CHAT_ROOMS, GET_GROUP_ROOMS, IS_LOADING, ON_DELETE_CHAT, SET_ACTIVE_CHAT_ROOM_USER, SET_CHAT_DETAIL, SET_CHAT_MEDIA_LINK, SET_GROUP_CREATE_USERS, SET_MY_PAGE_CHAT_USERS, SET_UNREAD_MSG_COUNT } from '../Redux/ActionTypes';
import { GET, POST, api } from '../utils/apiConstants';
import {
  dispatchAction,
  handleErrorRes,
  handleSuccessRes,
  makeAPIRequest,
} from '../utils/apiGlobal';
import { successToast } from '../utils/commonFunction';

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
      console.log('getChatMessage',response);
      
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
      console.log('onGetUnreadMsgCount',response?.data);
      
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

export const onOpenNewChatForUser = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.getChatCpMessage,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_CHAT_MESSAGES, undefined);
        if (request?.isPage) {
          dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser: response?.data?.data, chatId: response?.data?.data._id })

        } else {
          dispatchAction(dispatch, SET_ACTIVE_CHAT_ROOM_USER, { currentUser: response?.data?.data?.users?.filter(item => item._id !== request?.data?.userId)?.[0], chatId: response?.data?.data._id })

        }
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetGroupCreateUser = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: GET,
    url: api.groupCreateUser,
    params: request?.params,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_GROUP_CREATE_USERS, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onRemoveMember = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.removeMember,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => { });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onInviteMember = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.inviteMember,
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

export const onJoinGroupChat = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.joinGroup,
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

export const onDeleteMessage = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.deleteMessage,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, DELETE_MESSAGE, response?.data?.data)
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onDeleteMessageForUser = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.deleteMessageForMe,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, DELETE_MESSAGE, response?.data?.data)
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};


export const onOpemMyChatRoom = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.openChatList,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_MY_PAGE_CHAT_USERS, response?.data?.data)
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onDeleteChat = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true)
  return makeAPIRequest({
    method: POST,
    url: api.deleteChat,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {

        dispatchAction(dispatch, ON_DELETE_CHAT, { _id: request?.data?.chatId, isGroup: request?.isGroup })


      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};