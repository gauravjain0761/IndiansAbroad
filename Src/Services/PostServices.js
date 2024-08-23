import {
  IS_LOADING,
  SET_ACTIVE_POST,
  SET_ALL_INDIANS,
  SET_ALL_PAGES,
  SET_ACTIVE_POST_COMMENTS,
  SET_ALL_POST,
  SET_LIKED_USER_LIST,
  SET_LIKE_DISLIKE,
  SET_REPLIES_COMMENTS,
  SET_GLOBAL_SEARCH,
  SET_PAGE_DETAIL,
  SET_ALL_EVENTS,
  GET_ALL_CURRENCIES,
  SET_ACTIVE_EVENT,
  GET_SAVE_EVENT,
} from '../Redux/ActionTypes';
import { getAsyncToken, setAsyncUserInfo } from '../utils/AsyncStorage';
import { GET, POST, api } from '../utils/apiConstants';
import {
  dispatchAction,
  handleErrorRes,
  handleSuccessRes,
  makeAPIRequest,
} from '../utils/apiGlobal';
import { successToast } from '../utils/commonFunction';

export const getalluserposts = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.getalluserposts,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_ALL_POST, {
          ...response?.data,
          current_page: request?.data?.page,
        });
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onLikePost = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.likedislike,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => { });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetLikedUserList = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.likeduserlist,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_LIKED_USER_LIST, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getallIndianUser = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.indiansList,
    data: request?.data,
  })
    .then(async response => {
      if (response?.status === 200 || response?.status === 201) {
        dispatchAction(dispatch, IS_LOADING, false);
        if (response?.data && response?.data?.err == 200) {
          dispatchAction(dispatch, SET_ALL_INDIANS, {
            ...response?.data,
            current_page: request?.data?.page,
          });
        } else {
          if (response?.data && response?.data?.err == 300) {
            dispatchAction(dispatch, SET_ALL_INDIANS, {
              data: [],
              current_page: 1,
            });
          }
          if (request?.onFailure) request.onFailure(response?.data);
        }
      }
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getallPagesUser = request => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.pageList,
    params: request?.params,
  })
    .then(async response => {
      if (response?.status === 200 || response?.status === 201) {
        dispatchAction(dispatch, IS_LOADING, false);
        if (response?.data && response?.data?.err == 200) {
          dispatchAction(dispatch, SET_ALL_PAGES, {
            ...response?.data,
            current_page: request?.params?.page,
          });
        } else {
          if (response?.data && response?.data?.err == 300) {
            dispatchAction(dispatch, SET_ALL_PAGES, {
              data: [],
              current_page: 1,
            });
          }
          if (request?.onFailure) request.onFailure(response?.data);
        }
      }
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetSinglePost = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.getsinglepost,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_ACTIVE_POST, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetAllComments = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.getallcomments,
    data: request?.data,
  })
    .then(async response => {
      if (response?.status === 200 || response?.status === 201) {
        dispatchAction(dispatch, IS_LOADING, false);
        if (response?.data && response?.data?.err == 200) {
          dispatchAction(
            dispatch,
            SET_ACTIVE_POST_COMMENTS,
            response?.data?.data,
          );
        } else {
          if (response?.data && response?.data?.err == 300) {
            dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, []);
          }
          if (request?.onFailure) request.onFailure(response?.data);
        }
      }
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onCommentLike = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.commentLike,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => { });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetRepliesComment = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.commentReplyList,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_REPLIES_COMMENTS, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onReportApi = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.onreport,
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

export const onGlobalSearchApi = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.globalSearch,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_GLOBAL_SEARCH, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onShareApi = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.share,
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

export const onAddComment = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.createComment,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        // successToast(response?.data?.msg);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onDeleteComment = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.deleteComment,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        // successToast(response?.data?.msg);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onAddCommentReply = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.addCommentReply,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        // successToast(response?.data?.msg);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onDeleteCommentReply = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.deleteCommentReply,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        // successToast(response?.data?.msg);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onCreatePost = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.createPost,
    data: request?.data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        // successToast(response?.data?.msg);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onDeletePost = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.deletePost,
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

export const onDeletePostMedia = request => async dispatch => {
  dispatchAction(dispatch, IS_LOADING, true);
  return makeAPIRequest({
    method: POST,
    url: api.deletepostmedia,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => { });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const onGetPageDetail = request => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.getPageDetail + request?.id,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_PAGE_DETAIL, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getalluserEvent = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.getAllEvents,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_ALL_EVENTS, {
          ...response?.data,
          current_page: request?.page,
        });
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getalluserEventCreate = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.eventCreate,
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

export const getCurrenciesListAction = request => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.getCurrencies,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, GET_ALL_CURRENCIES, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getDetailsListAction = request => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: `${api.getById}/${request?.data}`,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(dispatch, SET_ACTIVE_EVENT, response?.data?.data);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getAttendeeCreateAction = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.attendeeCreate,
    data: request?.data,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        // successToast(response?.data?.msg);
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getTransactionDashboardAction = request => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.transactionDashboard,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => { });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getAttendeePaymentAction = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.attendeePayment,
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

export const getAttendeeGetByEventAction = request => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: `${api.attendeeGetByEvent}/${request?.data}`,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => { });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getSaveListAction = request => async dispatch => {
  return makeAPIRequest({
    method: GET,
    url: api.attendeeGetUserEvents,
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {
        dispatchAction(
          dispatch,
          GET_SAVE_EVENT,
          response?.data?.data?.favoriteEvents,
        );
      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};

export const getToggleFavoriteAction = request => async dispatch => {
  return makeAPIRequest({
    method: POST,
    url: api.attendeeToggleFavorite,
    data: request?.data
  })
    .then(async response => {
      handleSuccessRes(response, request, dispatch, () => {

      });
    })
    .catch(error => {
      handleErrorRes(error, request, dispatch);
    });
};
