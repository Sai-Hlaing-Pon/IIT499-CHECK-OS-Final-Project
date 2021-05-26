import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  SET_ERRORS,
  POST_SCREAM,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

// Get all screams
export const getShops = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/shop')
    .then((res) => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      });
    });
};
export const getShop = (id) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/shop/${id}`)
    .then((res) => {
      console.log("payload: ", res.data)
      dispatch({
        type: SET_SCREAM,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};
// Post a scream
export const postShop = (newScream) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/shop', newScream)
    .then((res) => {
      dispatch({
        type: POST_SCREAM,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
// Like a scream
export const likeScream = (id) => (dispatch) => {
  axios
    .get(`/shop/${id}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_SCREAM,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};
// Unlike a scream
export const unlikeScream = (id) => (dispatch) => {
  axios
    .get(`/shop/${id}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_SCREAM,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};
// Submit a comment
export const submitComment = (id, commentData) => (dispatch) => {
  console.log("id: ", id)
  console.log("commentData: ", commentData);
  axios
    .post(`/shop/${id}/review`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.data
      });
    });
};
export const deleteShop = (id) => (dispatch) => {
  axios
    .delete(`/shop/${id}`)
    .then(() => {
      dispatch({ type: DELETE_SCREAM, payload: id });
    })
    .catch((err) => console.log(err));
};

export const RateUser = (id, rateData) => (dispatch) => {
  console.log("id: ", id)
  console.log("commentData: ", rateData);
  axios
    .post(`/shop/${id}`, rateData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.data
      });
    });
};


export const getUserData = (id) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${id}`)
    .then((res) => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data.screams
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SCREAMS,
        payload: null
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
