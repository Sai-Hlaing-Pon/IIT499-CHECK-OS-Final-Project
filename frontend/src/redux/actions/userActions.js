import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ
} from '../types';
import jwt_decode from "jwt-decode";
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({type: LOADING_UI });
    axios
    .post('/login', userData)
    .then(res=>{            
        // const FBIdToken = `Bearer ${res.data.token}`
        localStorage.setItem('access_token', res.data.access_token);
        // axios.defaults.headers.commom['Authorization'] = FBIdToken
        // setAuthorizationHeader(res.data.access_token)
        if (res.data.access_token) {
            var token_data = localStorage.getItem("access_token")
            var user_data = jwt_decode(token_data)
        }
        dispatch({
            type: SET_USER,
            payload: user_data
          });
        dispatch({ type: CLEAR_ERRORS})
        history.push('/')
    })
    .catch(err=> {
        dispatch({
            type: SET_ERRORS,
            payload: err.reponse.data
        })            
    });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/user/', newUserData)
    .then((res) => {
      // localStorage.setItem('access_token',  res.data.data[0]["access_token"]);
      // axios.defaults.headers.common['Authorization'] = res.data.data[0]["access_token"]
      setAuthorizationHeader(res.data.data[0]["access_token"]);
      if (res.data.access_token) {
          var token_data = localStorage.getItem("access_token")
          var user_data = jwt_decode(token_data)
      }
      dispatch({
          type: SET_USER,
          payload: user_data
        });
      dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('access_token');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get('/user/')
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user/image', formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user/', userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios
    .post('/notifications', notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ
      });
    })
    .catch((err) => console.log(err));
};

const setAuthorizationHeader = (token) => {
  const access_token = token;
  localStorage.setItem('access_token', access_token);
  axios.defaults.headers.common['Authorization'] = access_token;
};