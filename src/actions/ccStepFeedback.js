import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { feedbackConstant } from '../constants/storeConstants'

export const get_feedback_requests = () => {
  return dispatch => {
    dispatch({
      type: feedbackConstant.GETTING_FEEDBACK_REQUESTED
    })
    let url = `${appConstant.BASE_URL}${appConstant.COURSE_REVIEW_FEEDBACK_REQUESTED_API}`;

    let token = getToken();

    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      }
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: feedbackConstant.GET_FEEDBACK_REQUESTED_SUCCESS,
            payload: response.result
          })
        } else {
          dispatch({
            type: feedbackConstant.GET_FEEDBACK_REQUESTED_FAIL,
            payload: "Failed to fetch 'Feedback Requests' "
          })
        }
      },
      (error) => {
        dispatch({
          type: feedbackConstant.GET_FEEDBACK_REQUESTED_FAIL,
          payload: error.message
        })
      }
    )
  }
}

export const get_feedback_for_me = () => {
  return dispatch => {
    dispatch({
      type: feedbackConstant.GETTING_FEEDBACK_FOR_ME
    })
    let url = `${appConstant.BASE_URL}${appConstant.COURSE_REVIEW_FEEDBACK_FOR_ME_API}`;

    let token = getToken();

    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      }
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: feedbackConstant.GET_FEEDBACK_FOR_ME_SUCCESS,
            payload: response.result
          })
        } else {
          dispatch({
            type: feedbackConstant.GET_FEEDBACK_FOR_ME_FAIL,
            payload: "Failed to fetch 'Feedback For Me' "
          })
        }
      },
      (error) => {
        dispatch({
          type: feedbackConstant.GET_FEEDBACK_FOR_ME_FAIL,
          payload: error.message
        })
      }
    )
  }
}

export const save_feedback = (data, cb) => {
  return dispatch => {
    dispatch({
      type: feedbackConstant.SAVING_FEEDBACK
    })
    let url = `${appConstant.BASE_URL}${appConstant.COURSE_REVIEW_SAVE_FEEDBACK_API}`;

    let token = getToken();

    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: feedbackConstant.SAVE_FEEDBACK_SUCESS,
            payload: response.result
          })
        } else {
          dispatch({
            type: feedbackConstant.SAVE_FEEDBACK_FAIL,
            payload: response.message || "Failed to save 'Feedback Request'. Please try again "
          })
        }
        cb()
      },
      (error) => {
        dispatch({
          type: feedbackConstant.SAVE_FEEDBACK_FAIL,
          payload: error.message
        })
      }
    )
  }
}