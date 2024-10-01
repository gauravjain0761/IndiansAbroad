import { screenName } from "../Navigation/ScreenConstants";
import { IS_LOADING, MY_PAGES, SET_ALL_POST, SET_COUNTRIES, SET_FOLLOWER_LIST, SET_NOTIFICATION_LIST, SET_USER } from "../Redux/ActionTypes";
import { clearAsync, setAsyncToken, setAsyncUserInfo } from "../utils/AsyncStorage";
import { resetNavigation } from "../utils/Global";
import { GET, POST, api } from "../utils/apiConstants";
import { dispatchAction, handleErrorRes, handleSuccessRes, makeAPIRequest, removeAuthorization, setAuthorization } from "../utils/apiGlobal";
import { successToast } from "../utils/commonFunction";
import { getFollowerList } from "./PostServices";

export const oncheckSession = (request) => async dispatch => {
    return makeAPIRequest({
        method: GET,
        url: api.checkSession,
        params: request?.params
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};


export const onCallLogoutApi = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.onLogout,
    })
        .then(async (response) => {
            // removeAuthorization(dispatch)
            // resetNavigation(screenName.LoginScreen)
            handleSuccessRes(response, request, dispatch, () => {
                successToast(response?.data?.msg)
                removeAuthorization(dispatch)
                resetNavigation(screenName.LoginScreen)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};


export const onLoginApi = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.login,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, async () => {
                await setAsyncToken(response?.data?.token)
                setAuthorization(response?.data?.token)
                await setAsyncUserInfo(response?.data?.data)
                dispatchAction(dispatch, SET_USER, response?.data?.data)
                resetNavigation('Home')
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onGetUserInfoApi = (request) => async dispatch => {
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



export const onGetOtp = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.getOtp,
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

export const onVerifyOtp = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.verifyotp,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                successToast(response?.data?.msg);
                setAsyncToken(response?.data?.token)
                setAuthorization(response?.data?.token)
                setAsyncUserInfo(response?.data?.data)
                dispatchAction(dispatch, SET_USER, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onRetryOtp = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.retryotp,
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

export const onStepOneSignUp = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.registerstepone,
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

export const onStepTwoSignUp = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.registersteptwo,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                successToast(response?.data?.msg);
                setAsyncUserInfo(response?.data?.data)
                dispatchAction(dispatch, SET_USER, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onGetSignupCountry = (request) => async dispatch => {
    return makeAPIRequest({
        method: GET,
        url: api.getSignupCountries,
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, SET_COUNTRIES, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onForgotPass = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)

    return makeAPIRequest({
        method: POST,
        url: api.forgotPassword,
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

export const onResetPass = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)

    return makeAPIRequest({
        method: POST,
        url: api.resetPass,
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

export const onGetMyPage = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: GET,
        url: api.getMyPage + request?.id,
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, MY_PAGES, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onDeletePageApi = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.deletePage,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, () => {
                dispatchAction(dispatch, MY_PAGES, undefined)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onFeedback = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.feedbackform,
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

export const onEnquiry = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.enquiry,
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

export const onDeleteAccount = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.deleteUserAccount,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, async () => {
                successToast(response?.data?.msg);
                removeAuthorization(dispatch)
                await clearAsync()
                resetNavigation(screenName.LoginScreen)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};


export const onGetNotification = (request) => async dispatch => {

    return makeAPIRequest({
        method: POST,
        url: api.notificationList,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, async () => {
                dispatchAction(dispatch, SET_NOTIFICATION_LIST, response?.data?.data)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};

export const onUpdateFbToken = (request) => async dispatch => {
    return makeAPIRequest({
        method: POST,
        url: api.updateFbToken,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, async () => {
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};


export const onAcceptRejectRequest = (request) => async dispatch => {
    dispatchAction(dispatch, IS_LOADING, true)
    return makeAPIRequest({
        method: POST,
        url: api.acceptRejectRequest,
        data: request?.data
    })
        .then(async (response) => {
            handleSuccessRes(response, request, dispatch, async () => {
                dispatch(getFollowerList({ data: { userId: request?.data?.userId, search: '' } }));
                successToast(response?.data?.msg)
            });
        })
        .catch(error => {
            handleErrorRes(error, request, dispatch);
        });
};
