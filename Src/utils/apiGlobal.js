import axios from "axios";
import { api } from "./apiConstants";
import { IS_LOADING, actions } from "../Redux/ActionTypes";
import { errorToast } from "./commonFunction";
import { getAsyncToken } from "./AsyncStorage";

export const makeAPIRequest = ({
    method,
    url,
    data,
    params,
    headers
}) =>
    new Promise((resolve, reject) => {
        const option = {
            method,
            baseURL: api.BASE_URL,
            url,
            data: data,
            headers: {
                Accept: "application/json",
                ...headers,
                Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzMzMWVjZGQyNzMwNGU1YzM5MzE2NyIsInR5cGUiOiJhcHB1c2VyIiwiaWF0IjoxNzE4NzA1MTQ4LCJleHAiOjE3MjA3Nzg3NDh9.KcqAcnemPMYjFGjSIr-XghGto59K7RDUHPMzXP-4Hlc'
                // "Content-Type": "application/json",
            },
            params: params
        };
        axios(option)
            .then((response) => {
                console.log("res--->", api.BASE_URL + url, data, params, response?.data, response.status);
                if (response.status === 200 || response.status === 201) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch((error) => {
                console.log("err--->", api.BASE_URL + url, data, params, error, error?.response?.status);
                reject(error);
            });
    });


export const setAuthorization = async (authToken) => {
    const token = await getAsyncToken();
    if (authToken == '') {
        axios.defaults.headers.common['Authorization'] = `${token}`;
    } else {
        axios.defaults.headers.common['Authorization'] = `${authToken}`;
    }
};

export const removeAuthorization = async () => {
    await clearAsync()
    delete axios.defaults.headers.common.Authorization;
};


export const formDataApiCall = async (url, data, onSuccess, onFailure) => {

    let formData = new FormData()
    const token = await getAsyncToken();
    if (data) {
        Object.keys(data).map((element) => {
            if (data[element] !== undefined) {
                formData.append(element, data[element]);
            }
        });
    }
    if (data?.language == undefined) {
        formData.append("language", i18n.language);
    }
    return fetch(api.BASE_URL + url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            // "Content-Type": "multipart/form-data",
            Authorization: token,
        },
        body: formData,
    })
        .then((response) => {
            console.log('response--------', response)
            return response.json().then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == true) {
                    onSuccess(responseJson)
                } else {
                    if (onFailure) onFailure()
                    if (responseJson?.message) {
                        errorToast(responseJson?.message)
                    } else errorToast('Please try again')
                }
            });
        })
        .catch((err) => {
            console.log(err)
            if (onFailure) onFailure()
            errorToast('Please try again')
        });
}


export const dispatchAction = (dispatch, action, data) => {
    dispatch({ type: action, payload: data })
}


export const handleSuccessRes = (res, req, dispatch, fun) => {
    if (res?.status === 200 || res?.status === 201) {
        dispatchAction(dispatch, IS_LOADING, false)
        if (res?.data && res?.data?.err == 200) {
            if (fun) fun()
            if (req?.onSuccess) req?.onSuccess(res?.data);
        } else {
            if (req?.onFailure) req.onFailure(res?.data);
            errorToast(res?.data?.message)
        }
    }
}

export const handleErrorRes = (err, req, dispatch, fun) => {
    if (err?.response?.status == 401) {
        dispatchAction(dispatch, IS_LOADING, false)
        removeAuthorization()
        errorToast('Please login again')
    } else {
        dispatchAction(dispatch, IS_LOADING, false)
        if (err?.response?.data?.errors) {
            errorToast(err?.response?.data?.message);
        } else if (err?.response?.data?.message) {
            errorToast(err?.response?.data?.message);
        } else if (err?.response?.data?.error) {
            errorToast(err?.response?.data?.error?.message);
        } else if (err?.message) {
            errorToast(err?.message)
        } else {
            errorToast('Something went wrong! Please try again')
        }
        if (fun) fun()
        if (req?.onFailure) req.onFailure(err?.response);
    }

}