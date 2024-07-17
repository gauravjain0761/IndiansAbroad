import { IS_LOADING, SET_ACTIVE_POST, SET_ALL_INDIANS, SET_ALL_PAGES, SET_ACTIVE_POST_COMMENTS, SET_ALL_POST, SET_LIKED_USER_LIST, SET_LIKE_DISLIKE, SET_REPLIES_COMMENTS, SET_GLOBAL_SEARCH, SET_COUNTRY_DISCUSSION_LIST, SET_THREAD_LIST } from "../Redux/ActionTypes";
import { setAsyncUserInfo } from "../utils/AsyncStorage";
import { GET, POST, api } from "../utils/apiConstants";
import { dispatchAction, handleErrorRes, handleSuccessRes, makeAPIRequest } from "../utils/apiGlobal";
import { successToast } from "../utils/commonFunction";

export const getDiscussionCountry = (request) => async dispatch => {
    return makeAPIRequest({
        method: GET,
        url: api.countriesList,
        // data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, SET_COUNTRY_DISCUSSION_LIST, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onGetThreadList = (request) => async dispatch => {
    return makeAPIRequest({
        method: POST,
        url: api.threadList,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, SET_THREAD_LIST, response?.data?.Threads)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onGetThreadDetail = (request) => async dispatch => {
    return makeAPIRequest({
        method: POST,
        url: api.getThreadDetail,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, SET_ACTIVE_POST, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onGetThreadAllComments = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: GET,
        url: api.getThreadCommentList + request?.id,
        // data: request?.data
    })
        .then(async (response) => {
            if (response?.status === 200 || response?.status === 201) {
                dispatchAction(dispatch, IS_LOADING, false)
                if (response?.data && response?.data?.err == 200) {
                    dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, response?.data?.data)
                } else {
                    if (response?.data && response?.data?.err == 300) {
                        dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, [])
                    }
                    if (request?.onFailure) request.onFailure(response?.data);
                }
            }
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onGetThreadRepliesComment = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: GET,
        url: api.getThreadReplyList + request?.id,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, SET_REPLIES_COMMENTS, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onAddCommentThread = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.createThreadComment,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                // successToast(response?.data?.msg);
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onDeleteCommentThread = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.deleteThreadComment,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                // successToast(response?.data?.msg);
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onAddCommentReplyThread = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.addThreadCommentReply,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                // successToast(response?.data?.msg);
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onDeleteCommentReplyThread = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.deleteThreadCommentReply,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                // successToast(response?.data?.msg);
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onDeleteThread = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.deleteThread,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                successToast(response?.data?.msg);
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};
