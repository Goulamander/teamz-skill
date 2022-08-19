import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { addTeamsConstant } from '../constants/storeConstants'

export const list_teams = () => {
  return dispatch => {
    dispatch({
      type: addTeamsConstant.LIST_TEAMS
    })
  }
}

export const add_team = (team) => {
  return dispatch => {
    dispatch({
      type: addTeamsConstant.ADD_TEAM,
      payload: team
    })
  }
}

export const update_team = (id, team) => {
  return dispatch => {
    dispatch({
      type: addTeamsConstant.EDIT_TEAM,
      payload: team,
      teamId: id
    })
  }
}

export const remove_team = (id, team) => {
  return dispatch => {
    dispatch({
      type: addTeamsConstant.DELETE_TEAM,
      payload: team,
      teamId: id
    })
  }
}

export const insert_teams = () => {
  return (dispatch, getState) => {
    dispatch({
      type: addTeamsConstant.ADDING_TEAM,
    })
    let state = getState()
    let { teams } = state.addTeam
    
    // eliminate empty emails
    let teamsToSend = teams.filter(team => team.team_name != '')
    
    let url = `${appConstant.BASE_URL}${appConstant.TEAM_API}`;

    let token = getToken();
    let payload = {
        team: teamsToSend
    }
    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then((response) => {
        console.log("response : ", response)
        if(response.success) {
          dispatch({
            type: addTeamsConstant.ADD_TEAM_SUCCESS,
          })
          setTimeout(function() {
            dispatch({
              type: addTeamsConstant.RESET_TEAM,
            })
          }, 500)
        } else {
          dispatch({
            type: addTeamsConstant.ADD_TEAM_ERROR,
            payload: response.message
          })
        }
      },
      (error) => {
        dispatch({
          type: addTeamsConstant.ADD_TEAM_ERROR,
          payload: 'something went wrong'
        })

      }
    )
  }
}