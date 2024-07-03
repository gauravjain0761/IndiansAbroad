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