import cloneDeep from 'clone-deep'
import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { myCoursesConstants, recommendCoursesConstants, assignConstant, myAchievements, analyticsCourses, analyticsDirectReports, publicViewPage, analyticsMyLearning } from '../constants/storeConstants'

export const edit_course = (courseId, course) => {
  return (dispatch) => {
    dispatch({
      type: myCoursesConstants.EDIT_COURSE, 
      courseId: courseId,
      payload: course 
    })
  }
}

export const edit_new_course = (course) => {
  return (dispatch) => {
    dispatch({type: myCoursesConstants.EDIT_NEW_COURSE, payload: course })
  }
}

export const reset_new_course = () => {
  return (dispatch) => {
    dispatch({type: myCoursesConstants.RESET_COURSE })
  }
}

export const get_courses = () => {
  return (dispatch) => {
    // start loading
    dispatch({type: myCoursesConstants.GETTING_COURSES})

    let url = `${appConstant.BASE_URL}${appConstant.COURSES_API}`;
    let token = getToken();
    
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        // console.log("get courses response : ", response)
        if(response.success) {
          let { courses, recommendations } = response.result
          courses = response.result.courses || response.result
          dispatch({
            type: myCoursesConstants.GET_COURSES_SUCCESS,
            payload: courses
          })
          dispatch({
            type: myCoursesConstants.GET_USER_RECOMMEND_SUCCESS,
            payload: recommendations
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: myCoursesConstants.GET_COURSES_ERROR,
            payload: 'something went wrong'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: myCoursesConstants.GET_COURSES_ERROR,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const add_new_course = (course, cb) => {
  return (dispatch) => {

    // start loading
    dispatch({type: myCoursesConstants.ADDING_COURSE})
    
    let url = `${appConstant.BASE_URL}${appConstant.COURSES_API}`;
    let token = getToken();
    
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(course)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("add course response : ", response)
        if(response.success) {
          course.c_id = response.result.c_id
          dispatch({
            type: myCoursesConstants.ADD_COURSE_SUCCESS, 
            payload: course
          })
          cb()
          dispatch({type: myCoursesConstants.RESET_COURSE})
        } else {
          console.log("Error", response.message)
          dispatch({
            type: myCoursesConstants.ADD_COURSE_ERROR,
            payload: 'something went wrong'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: myCoursesConstants.ADD_COURSE_ERROR,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const recommend_new_course = (data, cb) => {
  return (dispatch) => {

    // start loading
    dispatch({type: myCoursesConstants.SENDING_RECOMMED})
    
    let url = `${appConstant.BASE_URL}${appConstant.RECOMMEND_COURSE_API}`;
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
        console.log("recommend new course response : ", response)
        if(response.success) {
          dispatch({
            type: myCoursesConstants.SEND_RECOMMED_SUCCESS, 
          })
          cb()
          dispatch({type: myCoursesConstants.RESET_RECOMMED})
        } else {
          console.log("Error", response.message)
          dispatch({
            type: myCoursesConstants.SEND_RECOMMED_ERROR,
            payload: 'something went wrong'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: myCoursesConstants.SEND_RECOMMED_ERROR,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const update_course = (course, cb) => {
  return (dispatch) => {

    // start loading
    dispatch({type: myCoursesConstants.UPDATING_COURSE})
    
    let url = `${appConstant.BASE_URL}${appConstant.COURSES_API}`;
    let token = getToken();
    
    fetch(url, {
      method: 'put',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(course)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("update course response : ", response)
        if(response.success) {
          dispatch({
            type: myCoursesConstants.UPDATE_COURSE_SUCCESS
          })
          cb()
          // dispatch({type: myCoursesConstants.RESET_COURSE})
        } else {
          console.log("Error", response.message)
          dispatch({
            type: myCoursesConstants.UPDATE_COURSE_ERROR,
            payload: 'something went wrong'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: myCoursesConstants.UPDATE_COURSE_ERROR,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const delete_course = (course_id, cb) => {
  return (dispatch, getState) => {

    let myCourses = cloneDeep(getState().myCourses);
    // start loading
    dispatch({type: myCoursesConstants.DELETING_COURSE})
    
    let url = `${appConstant.BASE_URL}${appConstant.COURSES_API}`;
    let token = getToken();

    fetch(url, {
      method: 'delete',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify({c_id : course_id})
    })
    .then(res => res.json())
    .then((response) => {
        console.log("delete course response : ", response)
        if(response.success) {
          dispatch({
            type: myCoursesConstants.DELETE_COURSE_SUCCESS, 
            payload: myCourses.courses.filter(course => course.c_id != course_id)
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: myCoursesConstants.DELETE_COURSE_ERROR,
            payload: 'something went wrong'
          })
        }
        cb()
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: myCoursesConstants.DELETE_COURSE_ERROR,
          payload: 'something went wrong'
        })
        cb()
      }
    )
  }
}

export const unfurling = (link, course, courseId='') => {
  return (dispatch) => {
    // start loading
    dispatch({type: myCoursesConstants.UNFURLING})

    let url = `${appConstant.BASE_URL}${appConstant.UNFURLING_API}?link=${link}`;
    let token = getToken();
    
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        console.log("get unfurling response : ", response)
        if(response.success) {
          let {image, description, logo} = response.result
          course.c_image = image
          course.c_short_des = description
          course.c_logo = logo
          
          if(courseId !== '') {
            // From edit form
            dispatch({
              type: myCoursesConstants.EDIT_COURSE, 
              courseId: courseId,
              payload: course 
            })
          } else {
            dispatch({
              type: myCoursesConstants.EDIT_NEW_COURSE, 
              payload: course 
            })
          }

          dispatch({
            type: myCoursesConstants.UNFURLING_SUCCESS,
          })
          
        } else {
          console.log("Error", response.message)
          dispatch({
            type: myCoursesConstants.UNFURLING_ERROR,
            // payload: 'Could not process link'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: myCoursesConstants.UNFURLING_ERROR,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const fetchRecommendCourses = () => {
  return (dispatch) => {
    dispatch({type: recommendCoursesConstants.FETCH_COURSES_START})
    let url = `${appConstant.BASE_URL}${appConstant.COURSE_RECOMMEND_API}`;
    let token = getToken();
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        // console.log("recommended courses : ", response)
        if(response.success) {
          dispatch({
            type: recommendCoursesConstants.FETCH_COURSES_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: recommendCoursesConstants.FETCH_COURSES_FAIL,
            // payload: 'Could not process link'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: recommendCoursesConstants.FETCH_COURSES_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_custom_assign_courses = () => {
  
  return dispatch => {
    dispatch({
      type: assignConstant.GETTING_CUSTOM_ASSIGN_COURSES
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_ASSIGN_CUSTOM_COURSE_API}`;
    let token = getToken();
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: assignConstant.GET_CUSTOM_ASSIGN_COURSES_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: assignConstant.GET_CUSTOM_ASSIGN_COURSES_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: assignConstant.GET_CUSTOM_ASSIGN_COURSES_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const start_custom_assign_course = (courseId, cb) => {
  
  return dispatch => {
    dispatch({
      type: assignConstant.STARTING_COURSE,
      payload: courseId
    })

    let url = `${appConstant.BASE_URL}${appConstant.START_ASSIGN_CUSTOM_COURSE}`;
    let token = getToken();
    
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify({c_id: courseId})
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: assignConstant.START_COURSE_SUCCESS
          })
          cb()
        } else {
          console.log("Error", response.message)
          dispatch({
            type: assignConstant.START_COURSE_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: assignConstant.START_COURSE_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const add_new_achievements = (course, cb) => {
  return (dispatch) => {

    // start loading
    dispatch({type: myAchievements.ADD_ACHIVEMENTS_START})
    
    let url = `${appConstant.BASE_URL}${appConstant.ACHIEVEMENTS_API}`;
    let token = getToken();
    
    fetch(url, {
      method: 'post',
      headers: {
        "JWTAuthorization": "Bearer "+ token
      },
      body: course
    })
    .then(res => res.json())
    .then((response) => {
        if(response.success) {
          course.c_id = response.result.c_id
          dispatch({
            type: myAchievements.ADD_ACHIVEMENTS_SUCCESS, 
            payload: course
          })
          cb()
        } else {
          dispatch({
            type: myAchievements.ADD_ACHIVEMENTS_FAIL,
            payload: 'something went wrong'
          })
        }
      },
      (error) => {
        dispatch({
          type: myAchievements.ADD_ACHIVEMENTS_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_new_achievements = () => {
  
  return dispatch => {
    dispatch({
      type: myAchievements.GET_ACHIVEMENTS_START
    })

    let url = `${appConstant.BASE_URL}${appConstant.ACHIEVEMENTS_API}`;
    let token = getToken();
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: myAchievements.GET_ACHIVEMENTS_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: myAchievements.GET_ACHIVEMENTS_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: myAchievements.GET_ACHIVEMENTS_FAIL,
          payload: 'something went wrong'
        })
      }
    )
  }
}

export const get_analytics_direct_reports = () => {
  
  return dispatch => {
    dispatch({
      type: analyticsDirectReports.GETTING_DIRECT_REPORTS
    })

    let url = `${appConstant.BASE_URL}${appConstant.DIRECT_REPORT_API}`;
    let token = getToken();
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: analyticsDirectReports.GET_DIRECT_REPORTS_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsDirectReports.GET_DIRECT_REPORTS_FAIL
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsDirectReports.GET_DIRECT_REPORTS_FAIL
        })

      }
    )
  }
}

export const get_my_learning_data = (cb) => {
  
  return dispatch => {
    dispatch({
      type: analyticsMyLearning.GETTING_MY_LEARNING
    })

    let url = `${appConstant.BASE_URL}${appConstant.MY_LEARNING}`;
    let token = getToken();
    fetch(url, {
      method: 'get',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: analyticsMyLearning.GETTING_MY_LEARNING_SUCCESS,
            payload: response.result
          })
          
        } else {
          console.log("Error", response.message)
          dispatch({
            type: analyticsMyLearning.GETTING_MY_LEARNING_FAIL,
            
            payload: response.message
          })
        }
        cb(response)
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: analyticsMyLearning.GETTING_MY_LEARNING_FAIL,
          payload: 'something went wrong'
          
        })

      }
    )
  }
}