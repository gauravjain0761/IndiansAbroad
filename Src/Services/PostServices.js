import { SET_ALL_POST } from "../Redux/ActionTypes";
import { setAsyncUserInfo } from "../utils/AsyncStorage";
import { GET, POST, api } from "../utils/apiConstants";
import { dispatchAction, handleErrorRes, handleSuccessRes, makeAPIRequest } from "../utils/apiGlobal";

export const getalluserposts =
    (request) =>
        async dispatch => {
            return makeAPIRequest({
                method: POST,
                url: api.getalluserposts,
                data: request?.data
            })
                .then(async (response) => {
                    handleSuccessRes(response, request, dispatch, () => {
                        console.log('ayaaaaaaa', response)
                        dispatchAction(dispatch, SET_ALL_POST, response?.data)
                    });
                })
                .catch(error => {
                    console.log('errrrr', error)
                    handleErrorRes(error, request, dispatch);
                });
        };