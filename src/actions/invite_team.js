import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { inviteConstant } from '../constants/storeConstants'

export const list_team_members = () => {
  return dispatch => {
    dispatch({
      type: inviteConstant.LIST_INVITES
    })
  }
}

export const add_team_member = (user) => {
  return dispatch => {
    dispatch({
      type: inviteConstant.ADD_INVITE,
      payload: user
    })
  }
}

export const update_team_member = (id, user) => {
  return dispatch => {
    dispatch({
      type: inviteConstant.EDIT_INVITE,
      payload: user,
      inviteId: id
    })
  }
}

export const delete_team_member = (id, user) => {
  return dispatch => {
    dispatch({
      type: inviteConstant.DELETE_INVITE,
      payload: user,
      inviteId: id
    })
  }
}

export const send_invites = () => {
  return (dispatch, getState) => {
    dispatch({
      type: inviteConstant.SENDING_INVITE,
    })
    let state = getState()
    let { invites } = state.inviteTeam
    
    // eliminate empty emails
    let invitesToSend = invites.filter(user => user.email != '')
    
    let url = `${appConstant.BASE_URL}${appConstant.SEND_INVITES_API}`;

    let token = getToken();
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(invitesToSend)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: inviteConstant.SEND_INVITE_SUCCESS,
          })
          setTimeout(function() {
            dispatch({
              type: inviteConstant.RESET_INVITE,
            })
          }, 500)
        } else {
          dispatch({
            type: inviteConstant.SEND_INVITE_ERROR,
          })
        }
      },
      (error) => {
        dispatch({
          type: inviteConstant.SEND_INVITE_ERROR,
        })

      }
    )
  }
}