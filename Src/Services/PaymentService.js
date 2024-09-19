import { screenName } from "../Navigation/ScreenConstants";
import { IS_LOADING, MY_PAGES, SET_ALL_POST, SET_COUNTRIES, SET_FOLLOWER_LIST, SET_NOTIFICATION_LIST, SET_PLAN_LIST, SET_USER } from "../Redux/ActionTypes";
import { clearAsync, setAsyncToken, setAsyncUserInfo } from "../utils/AsyncStorage";
import { resetNavigation } from "../utils/Global";
import { GET, POST, api } from "../utils/apiConstants";
import { dispatchAction, handleErrorRes, handleSuccessRes, makeAPIRequest, removeAuthorization, setAuthorization } from "../utils/apiGlobal";
import { successToast } from "../utils/commonFunction";
import { getFollowerList } from "./PostServices";

export const onGetPlanList = (request) => async dispatch => {
    return makeAPIRequest({
        method: GET,
        url: api.getPlanList,
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, SET_PLAN_LIST, response?.data?.subsrciption_plans)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};


export const onBuyPlan = (request) => async dispatch => {
    return makeAPIRequest({
        method: POST,
        url: api.buyPlan,
        data: request?.data,
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                return response?.data
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};


export const onUpdatePaymentStatus = (request) => async dispatch => {
    return makeAPIRequest({
        method: POST,
        url: api.updatePaymentStatus,
        data: request?.data,
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {

            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};