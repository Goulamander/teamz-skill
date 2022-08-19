import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { analyticsCourses, analyticsMyLearning, analyticsLearners, deleteLearningAnalyticsCourses } from '../constants/storeConstants'

export const get_analytics_courses = (params) => {
  
  return dispatch => {
    dispatch({
      type: analyticsCourses.GETTING_ANALYTICS_COURSES
    })

    let url = `${appConstant.BASE_URL}${appConstant.ANALYTICS_COURSES_API}`;
    let token = getToken();
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: analyticsCourses.GET_ANALYTICS_COURSES_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsCourses.GET_ANALYTICS_COURSES_FAIL,           
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsCourses.GET_ANALYTICS_COURSES_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_analytics_course_by_id = (c_id) => {
  
  return dispatch => {
    dispatch({
      type: analyticsCourses.GETTING_ANALYTICS_COURSE
    })

    let url = `${appConstant.BASE_URL}${appConstant.ANALYTICS_COURSE_BY_ID_API}${c_id}`;
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
            type: analyticsCourses.GET_ANALYTICS_COURSE_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsCourses.GET_ANALYTICS_COURSE_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsCourses.GET_ANALYTICS_COURSE_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_analytics_learners = (params) => {
  
  return dispatch => {
    dispatch({
      type: analyticsLearners.GETTING_ANALYTICS_LEARNERS
    })

    let url = `${appConstant.BASE_URL}${appConstant.ANALYTICS_LEARNERS_API}`;
    let token = getToken();
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: analyticsLearners.GET_ANALYTICS_LEARNERS_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsLearners.GET_ANALYTICS_LEARNERS_FAIL,           
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsLearners.GET_ANALYTICS_LEARNERS_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_analytics_learner_by_id = (params) => {
  
  return dispatch => {
    dispatch({
      type: analyticsLearners.GETTING_ANALYTICS_LEARNER
    })

    let url = `${appConstant.BASE_URL}${appConstant.ANALYTICS_LEARNER_BY_ID_API}`;
    let token = getToken();

    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: analyticsLearners.GET_ANALYTICS_LEARNER_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsLearners.GET_ANALYTICS_LEARNER_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsLearners.GET_ANALYTICS_LEARNER_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_analytics_my_learning = (params) => {
  
  return dispatch => {
    dispatch({
      type: analyticsMyLearning.GETTING_MY_LEARNING
    })

    let url = `${appConstant.BASE_URL}${appConstant.ANALYTICS_MY_LEARNING_API}`;
    let token = getToken();
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: analyticsMyLearning.GET_MY_LEARNING_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsMyLearning.GET_MY_LEARNING_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsMyLearning.GET_MY_LEARNING_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_analytics_my_learning_by_id = (c_id) => {
  
  return dispatch => {
    dispatch({
      type: analyticsMyLearning.GETTING_TOP_LEARNINGS
    })

    let url = `${appConstant.BASE_URL}${appConstant.ANALYTICS_MY_LEARNING_BY_ID_API}${c_id}`;
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
            type: analyticsMyLearning.GET_TOP_LEARNINGS_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsMyLearning.GET_MY_LEARNING_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsMyLearning.GET_MY_LEARNING_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const delete_learning_analytics_courses = (course_ids, cb) => {
  
  return dispatch => {
    dispatch({
      type: deleteLearningAnalyticsCourses.DELETING_LEARNING_ANALYTICS_COURSES
    })

    let url = `${appConstant.BASE_URL}${appConstant.DELETE_ANALYTICS_COURSE_API}`;
    let token = getToken();
    fetch(url, {
      method: 'delete',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(course_ids)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: deleteLearningAnalyticsCourses.DELETE_LEARNING_ANALYTICS_COURSES_SUCCESS,
            payload: response.result
          });
          cb(null, response.result);
        } else {
          console.log("Error", response.message)
          dispatch({
            type: deleteLearningAnalyticsCourses.DELETE_LEARNING_ANALYTICS_COURSES_FAIL,
            payload: response.message
          })
          cb(response.message);
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: deleteLearningAnalyticsCourses.DELETE_LEARNING_ANALYTICS_COURSES_FAIL,
          payload: 'something went wrong'
        })
        cb('something went wrong');
      }
    )
  }
}