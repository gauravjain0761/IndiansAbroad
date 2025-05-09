import axios from 'axios';
import { api } from './apiConstants';
import { IS_LOADING, LOG_OUT, actions } from '../Redux/ActionTypes';
import { errorToast } from './commonFunction';
import { clearAsync, getAsyncToken } from './AsyncStorage';

export const makeAPIRequest = ({ method, url, data, params, headers }) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      baseURL: api.BASE_URL,
      url,
      data: data,
      headers: headers ? headers : { Accept: 'application/json', ...headers, },
      params: params,
    };
    axios(option)
      .then(response => {
        if (!url.includes('groupcreate') && !url.includes('getalluserposts')) {
          console.log("res--->", api.BASE_URL + url, data, params, response?.data, response.status);
        }

        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(error => {
        console.log('err--->', api.BASE_URL + url, data, params, error?.response?.status, error?.response);
        reject(error);
      });
  });

export const setAuthorization = async authToken => {
  const token = await getAsyncToken();
  if (authToken == '') {
    axios.defaults.headers.common['Authorization'] = `${token}`;
  } else {
    axios.defaults.headers.common['Authorization'] = `${authToken}`;
  }
};

export const removeAuthorization = async (dispatch) => {
  dispatchAction(dispatch, LOG_OUT, {})
  await clearAsync();
  delete axios.defaults.headers.common.Authorization;
};

export const formDataApiCall = async (url, data, onSuccess, onFailure) => {
  let formData = new FormData();
  const token = await getAsyncToken();
  console.log('data---', data)
  if (data) {
    Object.keys(data).map(element => {
      if (data[element] !== undefined) {
        formData.append(element, data[element]);
      }
    });
  }
  return fetch(api.BASE_URL + url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data', Authorization: token, },
    body: formData,
  })
    .then(response => {
      return response.json().then(responseJson => {
        console.log("responseJson", url, data, responseJson);
        if (responseJson.err == 200 || responseJson.statusCode == 200) {
          onSuccess(responseJson);
        } else {
          if (onFailure) onFailure();
          if (responseJson?.message) {
            errorToast(responseJson?.message);
          } else if (responseJson?.msg) {
            errorToast(responseJson?.msg);
          } else errorToast('Please try again');
        }
      });
    })
    .catch(err => {
      console.log('err---', url, data, err.message)
      if (onFailure) onFailure(err);
      errorToast(err ? err.message : 'Please try again');
    });
};

export const dispatchAction = (dispatch, action, data) => {
  dispatch({ type: action, payload: data });
};

export const handleSuccessRes = (res, req, dispatch, fun) => {
  if (res?.status === 200 || res?.status === 201) {
    dispatchAction(dispatch, IS_LOADING, false);
    if (res?.data && (res?.data?.err == 200 || res?.data?.error == 200 || res?.data?.statusCode == 200)) {
      if (fun) fun();
      if (req?.onSuccess) req?.onSuccess(res?.data);
    } else {
      if (res?.data && res?.data?.err == 300) {
        if (Array.isArray(res?.data?.data)) {
          if (fun) fun();
          if (req?.onSuccess) req?.onSuccess(res?.data);
          return;
        } else {
          if (req?.onFailure) req.onFailure(res?.data);
          errorToast(res?.data?.msg);
        }
      } else {
        if (req?.onFailure) req.onFailure(res?.data);
        errorToast(res?.data?.msg);
      }
    }
  }
};

export const handleErrorRes = (err, req, dispatch, fun) => {
  dispatchAction(dispatch, IS_LOADING, false);
  if (err?.response?.status == 401) {
    removeAuthorization(dispatch);
    errorToast('Please login again');
  } else {
    if (err?.response?.data?.errors) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.msg) {
      errorToast(err?.response?.data?.msg);
    } else if (err?.response?.data?.message) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.error) {
      errorToast(err?.response?.data?.error?.message);
    } else if (err?.message) {
      errorToast(err?.message);
    } else {
      errorToast('Something went wrong! Please try again');
    }
    if (fun) fun();
    if (req?.onFailure) req.onFailure(err?.response);
  }
};

export const handleErrorRes1 = (err, req, dispatch, fun) => {
  if (err?.response?.status == 401) {
    dispatchAction(dispatch, IS_LOADING, false);
    removeAuthorization(dispatch);
    errorToast('Please login again');
  } else if (err?.response?.status == 404) {

  } else {
    dispatchAction(dispatch, IS_LOADING, false);
    if (err?.response?.data?.errors) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.msg) {
      errorToast(err?.response?.data?.msg);
    } else if (err?.response?.data?.message) {
      errorToast(err?.response?.data?.message);
    } else if (err?.response?.data?.error) {
      errorToast(err?.response?.data?.error?.message);
    } else if (err?.message) {
      errorToast(err?.message);
    } else {
      errorToast('Something went wrong! Please try again');
    }
    if (fun) fun();
    if (req?.onFailure) req.onFailure(err?.response);
  }
};
