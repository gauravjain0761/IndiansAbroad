import { IS_LOADING, SET_ACTIVE_POST, SET_ALL_INDIANS, SET_ALL_PAGES, SET_ACTIVE_POST_COMMENTS, SET_ALL_POST, SET_LIKED_USER_LIST, SET_LIKE_DISLIKE, SET_REPLIES_COMMENTS } from "../Redux/ActionTypes";
import { setAsyncUserInfo } from "../utils/AsyncStorage";
import { GET, POST, api } from "../utils/apiConstants";
import { dispatchAction, handleErrorRes, handleSuccessRes, makeAPIRequest } from "../utils/apiGlobal";

export const getalluserposts = (request) =>
    async dispatch => {
        return makeAPIRequest({
            method: POST,
            url: api.getalluserposts,
            data: request?.data
        })
            .then(async (response) => {
                handleSuccessRes(response, request, dispatch, () => {
                    dispatchAction(dispatch, SET_ALL_POST, { ...response?.data, current_page: request?.data?.page })
                });
            })
            .catch(error => {
                handleErrorRes(error, request, dispatch);
            });
    };

export const onLikePost = (request) =>
    async dispatch => {
        return makeAPIRequest({
            method: POST,
            url: api.likedislike,
            data: request?.data
        })
            .then(async (response) => {
                handleSuccessRes(response, request, dispatch, () => {
                });
            })
            .catch(error => {
                handleErrorRes(error, request, dispatch);
            });
    };

export const onGetLikedUserList = (request) =>
    async dispatch => {
        return makeAPIRequest({
            method: POST,
            url: api.likeduserlist,
            data: request?.data
        })
            .then(async (response) => {
                handleSuccessRes(response, request, dispatch, () => {
                    dispatchAction(dispatch, SET_LIKED_USER_LIST, response?.data?.data)
                });
            })
            .catch(error => {
                handleErrorRes(error, request, dispatch);
            });
    };

export const getallIndianUser = (request) =>
    async dispatch => {
        return makeAPIRequest({
            method: POST,
            url: api.indiansList,
            data: request?.data
        })
            .then(async (response) => {
                console.log('getallIndianUser', JSON.stringify(response));
                handleSuccessRes(response, request, dispatch, () => {
                    dispatchAction(dispatch, SET_ALL_INDIANS, { ...response?.data, current_page: request?.data?.page })
                });
            })
            .catch(error => {
                console.log('getallIndianUser', error.response);

                handleErrorRes(error, request, dispatch);
            });
    };

export const getallPagesUser = (request) =>
    async dispatch => {
        return makeAPIRequest({
            method: GET,
            url: api.pageList,
            params: request?.params
        })
            .then(async (response) => {
                handleSuccessRes(response, request, dispatch, () => {
                    dispatchAction(dispatch, SET_ALL_PAGES, { ...response?.data, current_page: request?.params?.page })
                });
            })
            .catch(error => {
                handleErrorRes(error, request, dispatch);
            });
    };

export const onGetSinglePost = (request) =>
    async dispatch => {
        return makeAPIRequest({
            method: POST,
            url: api.getsinglepost,
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

export const onGetAllComments = (request) =>
    async dispatch => {
        dispatchAction(dispatch, IS_LOADING, true)
        return makeAPIRequest({
            method: POST,
            url: api.getallcomments,
            data: request?.data
        })
            .then(async (response) => {
                if (response?.status === 200 || response?.status === 201) {
                    dispatchAction(dispatch, IS_LOADING, false)
                    if (response?.data && response?.data?.err == 200) {
                        dispatchAction(dispatch, SET_ACTIVE_POST_COMMENTS, response?.data?.data)
                    } else {
                        if (request?.onFailure) request.onFailure(response?.data);
                    }
                }
            })
            .catch(error => {
                handleErrorRes(error, request, dispatch);
            });
    };

export const onCommentLike = (request) =>
    async dispatch => {
        return makeAPIRequest({
            method: POST,
            url: api.commentLike,
            data: request?.data
        })
            .then(async (response) => {
                handleSuccessRes(response, request, dispatch, () => {
                });
            })
            .catch(error => {
                handleErrorRes(error, request, dispatch);
            });
    };

export const onGetRepliesComment = (request) =>
    async dispatch => {
        dispatchAction(dispatch, IS_LOADING, true)
        return makeAPIRequest({
            method: POST,
            url: api.commentReplyList,
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
