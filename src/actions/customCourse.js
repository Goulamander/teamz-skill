import cloneDeep from 'clone-deep'
import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { customCoursesConstants, assignConstant } from '../constants/storeConstants'

export const update_course_steps = (courseSteps) => {
  return (dispatch) => {
    dispatch({
      type: customCoursesConstants.UPDATE_STEP, 
      payload: courseSteps 
    })
  }
}

export const add_course_step = (courseStep) => {
  return (dispatch) => {
    dispatch({
      type: customCoursesConstants.ADD_STEP, 
      payload: courseStep 
    })
  }
}

export const delete_course_step = (stepIndex) => {
  return (dispatch) => {
    dispatch({
      type: customCoursesConstants.DELETE_STEP, 
      stepIndex 
    })
  }
}

export const edit_course_step = (stepIndex, course) => {
  return (dispatch) => {
    dispatch({
      type: customCoursesConstants.EDIT_STEP, 
      payload: course,
      stepIndex
    })
  }
}

export const update_course = (obj) => {
  return (dispatch) => {
    dispatch({
      type: customCoursesConstants.UPDATE_COURSE, 
      payload: obj
    })
  }
}

export const reset_form = () => {
  return (dispatch) => {
    dispatch({
      type: customCoursesConstants.RESET_CUSTOM_COURSE, 
    })
  }
}

export const save_course = (data, reqType, withCourseImage, cb) => {
  
  return (dispatch, getState) => {
    dispatch({
      type: customCoursesConstants.SAVING_COURSE
    })

    let url = `${appConstant.BASE_URL}${appConstant.CREATE_CUSTOM_COURSE_API}`;
    let token = getToken();
    let header = {}
    if(!withCourseImage){
      header = {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      }
    } else {
      header = {
      "JWTAuthorization": "Bearer "+ token
      }
    }

    fetch(url, {
      method: reqType,
      headers: header,
      body: data
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          
          dispatch({
            type: customCoursesConstants.SAVE_COURSE_SUCCESS
          })
          // callback func
          let newCourseId = response.result.func_insert_custom_courses || null
          cb(newCourseId)

        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.SAVE_COURSE_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.SAVE_COURSE_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const get_custom_courses = () => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.GETTING_CUSTOM_COURSES
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_CUSTOM_COURSE_API}`;
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
            type: customCoursesConstants.GET_CUSTOM_COURSES_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.GET_CUSTOM_COURSES_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.GET_CUSTOM_COURSES_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const get_custom_course = (courseId) => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.GETTING_CUSTOM_COURSE
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_CUSTOM_COURSE_API}`;
    let token = getToken();

    if(!!courseId === true) {
      url += `/${courseId}` 
    } 
    
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
            type: customCoursesConstants.GET_CUSTOM_COURSE_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.GET_CUSTOM_COURSE_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.GET_CUSTOM_COURSE_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const delete_draft_custom_course = (courseId, cb) => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.DELETING_DRAFT_CUSTOM_COURSE
    })

    let url = `${appConstant.BASE_URL}${appConstant.DELETE_DRAFT_CUSTOM_COURSE_API}`;
    let token = getToken();

    if(!!courseId === true) {
      url += `/${courseId}` 
    } 
    
    fetch(url, {
      method: 'delete',
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
            type: customCoursesConstants.DELETE_DRAFT_CUSTOM_COURSE_SUCCESS,
            payload: response.result
          })
          cb(true);
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.DELETE_DRAFT_CUSTOM_COURSE_FAIL,
            payload: response.message
          })
          cb(false);
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.DELETE_DRAFT_CUSTOM_COURSE_FAIL,
          payload: 'something went wrong'
        })
        cb(false);
      }
    )
  }
}

export const delete_custom_course = (courseId, cb) => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.DELETING_CUSTOM_COURSE
    })

    let url = `${appConstant.BASE_URL}${appConstant.DELETE_CUSTOM_COURSE_API}`;
    let token = getToken();

    if(!!courseId === true) {
      url += `/${courseId}` 
    } 
    
    fetch(url, {
      method: 'delete',
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
            type: customCoursesConstants.DELETE_CUSTOM_COURSE_SUCCESS,
            payload: response.result
          })
          cb(response);
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.DELETE_CUSTOM_COURSE_FAIL,
            payload: response.message
          })
          cb(response);
        }
      },
      (error) => {
        console.log("Error 500", error)
        dispatch({
          type: customCoursesConstants.DELETE_CUSTOM_COURSE_FAIL,
          payload: 'something went wrong'
        })
        cb({success: false, error: 'Something went wrong'});
      }
    )
  }
}

export const get_custom_assign_course = (courseId, cb) => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.GETTING_CUSTOM_COURSE
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_ASSIGN_CUSTOM_COURSE_BY_ID_API}`;
    let token = getToken();

    if(!!courseId === true) {
      url += `/${courseId}` 
    } 
    
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
            type: customCoursesConstants.GET_CUSTOM_COURSE_SUCCESS,
            payload: response.result
          })
          if(cb) cb()
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.GET_CUSTOM_COURSE_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.GET_CUSTOM_COURSE_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const get_custom_assign_course_complete = (courseId, cb) => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.GETTING_CUSTOM_COURSE
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_ASSIGN_CUSTOM_COMPLETE_COURSE_BY_ID_API}`;
    let token = getToken();

    if(!!courseId === true) {
      url += `/${courseId}` 
    } 
    
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
            type: customCoursesConstants.GET_CUSTOM_COURSE_SUCCESS,
            payload: response.result
          })
          if(cb) cb()
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.GET_CUSTOM_COURSE_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.GET_CUSTOM_COURSE_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const custom_course_step_complete = (data, cb) => {
  
  return dispatch => {
    dispatch({
      type: assignConstant.MARKING_COURSE_STEP
    })

    let url = `${appConstant.BASE_URL}${appConstant.COMPLETE_ASSIGN_CUSTOM_COURSE_STEP}`;
    let token = getToken();
    
    fetch(url, {
      method: 'put',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: data
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: assignConstant.MARK_COURSE_STEP_SUCCESS
          })
          cb()
        } else {
          console.log("Error", response.message)
          dispatch({
            type: assignConstant.MARK_COURSE_STEP_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: assignConstant.MARK_COURSE_STEP_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const custom_course_complete = (data, cb) => {
  
  return dispatch => {

    dispatch({
      type: assignConstant.COMPELETING_CUSTOM_COURSE
    })

    // setTimeout(() => {
    //       dispatch({
    //         type: assignConstant.COMPELETE_CUSTOM_COURSE_SUCCESS
    //       })  
    // }, 2000);

    let url = `${appConstant.BASE_URL}${appConstant.COMPLETE_ASSIGN_CUSTOM_COURSE}`;
    let token = getToken();
    
    fetch(url, {
      method: 'put',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: data
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          // Successfully completed course
          console.log("Successfully completed course")
          dispatch({
            type: assignConstant.COMPELETE_CUSTOM_COURSE_SUCCESS
          })
          cb();
        } else {
          console.log("Error", response.message)
          dispatch({
            type: assignConstant.COMPELETE_CUSTOM_COURSE_FAIL
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: assignConstant.COMPELETE_CUSTOM_COURSE_FAIL
        })
      }
    )
  }
}

export const get_custom_courses_library = () => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.GETTING_CUSTOM_COURSES_LIBRARY
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_CUSTOM_COURSES_LIBRARY_API}`;
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
            type: customCoursesConstants.GET_CUSTOM_COURSES_LIBRARY_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.GET_CUSTOM_COURSES_LIBRARY_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.GET_CUSTOM_COURSES_LIBRARY_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const get_oembed = (embedUrl, cb) => {
  
  return dispatch => {
    
    embedUrl = window.encodeURIComponent(embedUrl)
    let url = `${appConstant.BASE_URL}${appConstant.GET_OEMBED}?url=${embedUrl}`;
    let token = getToken();
    
    try {
      fetch(url, {
        method: 'get',
        headers: {
          "content-type": "application/json",
          "JWTAuthorization": "Bearer "+ token
        },
      })
      .then(res => res.json())
      .then((response) => {
        console.log("response oembed", response)
        cb(response)
      })
     
    } catch (err) {
      console.trace(err);
      cb(false)
    }
  }
}

export const upload_step_pitch = (formData, cb) => {
  
  return dispatch => {
    dispatch({
      type: customCoursesConstants.UPLOADING_STEP_PITCH
    })

    let url = `${appConstant.BASE_URL}${appConstant.UPLOAD_VIDEO}`;
    let token = getToken();
    fetch(url, {
      method: 'post',
      headers: {
        "JWTAuthorization": "Bearer "+ token
      },
      body: formData
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: customCoursesConstants.UPLOAD_STEP_PITCH_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.UPLOAD_STEP_PITCH_FAIL,
            payload: response.message
          })
        }
        cb(response)
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.UPLOAD_STEP_PITCH_FAIL,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const add_step_pitch = (data, cb) => {
  return dispatch => {
    dispatch({
      type: customCoursesConstants.ADDING_STEP_INFO
    })

    let url = `${appConstant.BASE_URL}${appConstant.ASSIGN_CUSTOM_COURSE_STEP_ADD_PITCH}`;
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
            type: customCoursesConstants.ADD_STEP_INFO_SUCCESS
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: customCoursesConstants.ADD_STEP_INFO_FAIL
          })
        }
        cb(response)
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: customCoursesConstants.ADD_STEP_INFO_FAIL
        })

      }
    )
  }
}

export const get_custom_course_quiz_answers = (c_id, step_id, cb) => {

    let url = `${appConstant.BASE_URL}${appConstant.GET_COURSE_STEP_QUIZ_ANSWERS}`;
    let token = getToken();
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify({c_id, step_id})
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response && !response.success) {
          console.log("Error", response.message)
        }
        cb(response)
      },
      (error) => {
        console.log("Error", error)
        cb({success: false})
      }
    )
}

export const save_custom_course_quiz_answers = (data, cb) => {

  let url = `${appConstant.BASE_URL}${appConstant.SAVE_COURSE_STEP_QUIZ_ANSWERS}`;
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
      if(response && !response.success) {
        console.log("Error", response.message)
      }
      cb(response)
    },
    (error) => {
      console.log("Error", error)
      cb({success: false})
    }
  )
}

export const update_iframe_url = (courseSteps) => {
  return (dispatch) => {
    dispatch({
      type: customCoursesConstants.UPDATE_STEP_IFRAME_URL, 
      payload: courseSteps 
    })
  }
}