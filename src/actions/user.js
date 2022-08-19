import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { userConstant, workHighlightsConstants, weeklyUpdatesConstants } from '../constants/storeConstants'

export const get_user_details = () => {
  
  return (dispatch, getState) => {
    dispatch({
      type: userConstant.GETTING_USER
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_PROFILE}`;
    let token = getToken();
    let { profileUpdates } = getState()
        
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
          if(response.result.user.length){
            dispatch({
              type: userConstant.GET_USER_SUCCESS,
              payload: response.result.user[0]
            })
          } else {
            dispatch({
              type: userConstant.GET_USER_ERROR,
              payload: "No Record found"
            })
          }

          // do not update workhighlight if edit mode enable
          if(response.result.workHighlights !== "" && !profileUpdates.isWHEditMode) {
            dispatch({
              type: workHighlightsConstants.EDIT_WORK_HIGHLIGHTS,
              payload: response.result.workHighlights
            })
          }

        } else {
          console.log("Error", response.message)
          dispatch({
            type: userConstant.GET_USER_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: userConstant.GET_USER_ERROR,
          payload: 'something went wrong'
        })

      }
    )

  }
}

export const set_user_details = (data, simpleRes) => {
  
  return (dispatch, getState) => {
    dispatch({
      type: userConstant.SAVING_USER
    })

    let url = `${appConstant.BASE_URL}${appConstant.UPDATE_PROFILE}`;
    let token = getToken();
    let header = {}
    if(simpleRes){
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
      method: 'put',
      headers: header,
      body: data
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          let { user } = getState()
          
          if(response.result.file_url){
            user.data.image = response.result.file_url
          }

          dispatch({
            type: userConstant.SAVE_USER_SUCCESS,
            payload: user.data
          })

        } else {
          console.log("Error", response.message)
          dispatch({
            type: userConstant.SAVE_USER_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: userConstant.SAVE_USER_ERROR,
          payload: 'something went wrong'
        })

      }
    )
  }
}

export const cancel_edit_weekly_update = (data) => {
  return dispatch => {
    dispatch({
      type: weeklyUpdatesConstants.CANCEL_EDITING_WEEKLY_UPDATE,
      payload: data
    })
  }
}

export const edit_weekly_update = (data) => {
  return dispatch => {
    dispatch({
      type: weeklyUpdatesConstants.EDIT_WEEKLY_UPDATE,
      payload: data
    })
  }
}

export const get_weekly_updates = (start_date, end_data) => {
  
  return dispatch => {

    let url = `${appConstant.BASE_URL}${appConstant.GET_WEEKLY_UPDATE}`;
    let token = getToken();
    let data = {
      start_date: start_date,
      end_date: end_data
    }
    
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
        // console.log("response : ", response)
        if(response.success) {
          if(response.result === "Record Not Found") {
            // Do nothing
            dispatch({
              type: weeklyUpdatesConstants.CANCEL_EDITING_WEEKLY_UPDATE,
              payload: {
                execution: '',
                craftsmanship: '',
                leadership: '',
                mentoring: '',
                isWUEditMode: false
              }
            })
          } else {
            dispatch({
              type: weeklyUpdatesConstants.EDIT_EXECUTION,
              payload: response.result.execution
            })
            dispatch({
              type: weeklyUpdatesConstants.EDIT_CRAFTSMANSHIP,
              payload: response.result.craftsmanship
            })
            dispatch({
              type: weeklyUpdatesConstants.EDIT_LEADERSHIP,
              payload: response.result.leadership
            })
            dispatch({
              type: weeklyUpdatesConstants.EDIT_MENTORING,
              payload: response.result.mentoring
            })
            dispatch({
              type: weeklyUpdatesConstants.CANCEL_EDITING_WEEKLY_UPDATE,
              payload: {isWUEditMode: false}
            })
          }

        } else {
          console.log("Error", response.message)
          // dispatch({
          //   type: userConstant.SAVE_USER_ERROR,
          //   payload: response.message
          // })
        }
      },
      (error) => {
        console.log("Error", error)
        // dispatch({
        //   type: userConstant.SAVE_USER_ERROR,
        //   payload: 'something went wrong'
        // })

      }
    )
  }
}

export const set_weekly_updates = (data) => {
  
  return dispatch => {
    dispatch({
      type: userConstant.LOADING,
      payload: true
    })

    let url = `${appConstant.BASE_URL}${appConstant.SAVE_WEEKLY_UPDATE}`;
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
          // cancel edit mode
          dispatch({
            type: weeklyUpdatesConstants.CANCEL_EDITING_WEEKLY_UPDATE,
            payload: {isWUEditMode: false}
          })

        } else {
          console.log("Error", response.message)
          alert(response.message)
        }
        dispatch({
          type: userConstant.LOADING,
          payload: false
        })
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: userConstant.LOADING,
          payload: false
        })

      }
    )
  }
}

export const get_work_highlights = () => {
  
  return dispatch => {
    dispatch({
      type: userConstant.LOADING,
      payload: true
    })

    let url = `${appConstant.BASE_URL}${appConstant.SAVE_WORK_HIGHLIGHTS}`;
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
        // console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: workHighlightsConstants.EDIT_WORK_HIGHLIGHTS,
            payload: response.result
          })
          dispatch({
            type: workHighlightsConstants.EDIT_WORK_HIGHLIGHTS_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
        }
        dispatch({
          type: userConstant.LOADING,
          payload: false
        })
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: userConstant.LOADING,
          payload: false
        })

      }
    )
  }
}

export const set_work_highlights = (data) => {
  
  return dispatch => {
    dispatch({
      type: userConstant.LOADING,
      payload: true
    })

    let url = `${appConstant.BASE_URL}${appConstant.SAVE_WORK_HIGHLIGHTS}`;
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
        // console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: workHighlightsConstants.EDIT_WORK_HIGHLIGHTS_SUCCESS
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: workHighlightsConstants.EDIT_WORK_HIGHLIGHTS_ERROR
          })
        }
        dispatch({
          type: userConstant.LOADING,
          payload: false
        })
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: workHighlightsConstants.EDIT_WORK_HIGHLIGHTS_ERROR
        })
        dispatch({
          type: userConstant.LOADING,
          payload: false
        })

      }
    )
  }
}