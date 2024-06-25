import { SET_ALL_POST, SET_USER } from "../Redux/ActionTypes";
import { setAsyncUserInfo } from "../utils/AsyncStorage";
import { GET, POST, api } from "../utils/apiConstants";
import { dispatchAction, handleErrorRes, handleSuccessRes, makeAPIRequest, setAuthorization } from "../utils/apiGlobal";

export const oncheckSession =
    (request) =>
        async dispatch => {
            return makeAPIRequest({
                method: GET,
                url: api.checkSession,
                params: request?.params
            })
                .then(async (response) => {
                    handleSuccessRes(response, request, dispatch, () => {
                        // dispatchAction(dispatch, SET_ALL_POST, { ...response?.data, current_page: request?.data?.page })
                    });
                })
                .catch(error => {
                    handleErrorRes(error, request, dispatch);
                });
        };

export const onLoginApi =
    (request) =>
        async dispatch => {
            return makeAPIRequest({
                method: POST,
                url: api.login,
                data: request?.data
            })
                .then(async (response) => {
                    handleSuccessRes(response, request, dispatch, () => {
                        setAuthorization(response?.data?.token)
                        setAsyncUserInfo(response?.data?.data)
                        dispatchAction(dispatch, SET_USER, response?.data?.data)
                    });
                })
                .catch(error => {
                    handleErrorRes(error, request, dispatch);
                });
        };

export const onGetUserInfoApi =
    (request) =>
        async dispatch => {
            return makeAPIRequest({
                method: GET,
                url: api.getUser,
                params: request?.params
            })
                .then(async (response) => {
                    handleSuccessRes(response, request, dispatch, () => {
                        setAsyncUserInfo(response?.data?.data)
                        dispatchAction(dispatch, SET_USER, response?.data?.data)
                    });
                })
                .catch(error => {
                    handleErrorRes(error, request, dispatch);
                });
        };