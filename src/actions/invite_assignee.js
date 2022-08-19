import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { assignConstant } from '../constants/storeConstants'

export const add_assignee = (user) => {
  return dispatch => {
    dispatch({
      type: assignConstant.ADD_ASSIGNEE,
      payload: user
    })
  }
}

export const update_assignee = (id, user) => {
  return dispatch => {
    dispatch({
      type: assignConstant.EDIT_ASSIGNEE,
      payload: user,
      assigneeId: id
    })
  }
}

export const delete_assignee = (id, user) => {
  return dispatch => {
    dispatch({
      type: assignConstant.DELETE_ASSIGNEE,
      payload: user,
      assigneeId: id
    })
  }
}

export const reset_assignee = () => {
  return dispatch => {
    dispatch({
      type: assignConstant.RESET_ASSIGNEE
    })
  }
}

export const send_assignee = (data, cb) => {
  return (dispatch, getState) => {
    dispatch({
      type: assignConstant.SENDING_ASSIGNEE
    })
    let state = getState()
    let { assignee } = state.inviteAssignee
    
    // eliminate empty emails
    let assigneeToSend = assignee.filter(user => user.email != '')
    assigneeToSend = assigneeToSend.map(user => user.email)
    
    let url = `${appConstant.BASE_URL}${appConstant.ASSIGN_CUSTOM_COURSE_API}`;

    let token = getToken();

    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify({c_id: data.c_id, c_title: data.c_title, emails: assigneeToSend})
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: assignConstant.SEND_ASSIGNEE_SUCCESS,
          })
          cb();
        } else {
          dispatch({
            type: assignConstant.SEND_ASSIGNEE_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        dispatch({
          type: assignConstant.SEND_ASSIGNEE_ERROR,
        })
        cb()
      }
    )
  }
}

export const send_team_assignee = (data, cb) => {
  return (dispatch, getState) => {
    dispatch({
      type: assignConstant.SENDING_TEAM_ASSIGNEE
    })
    
    let url = `${appConstant.BASE_URL}${appConstant.ASSIGN_CUSTOM_COURSE_TEAM_API}`;

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
            type: assignConstant.SEND_TEAM_ASSIGNEE_SUCCESS,
          })
          cb();
        } else {
          dispatch({
            type: assignConstant.SEND_TEAM_ASSIGNEE_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        dispatch({
          type: assignConstant.SEND_TEAM_ASSIGNEE_ERROR,
        })
        cb();
      }
    )
  }
}