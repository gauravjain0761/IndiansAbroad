import { SET_ALL_POST, SET_LIKED_USER_LIST, SET_LIKE_DISLIKE } from "../Redux/ActionTypes";
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