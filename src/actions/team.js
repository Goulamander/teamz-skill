import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { teamsConstant } from '../constants/storeConstants'

export const get_teams_listing = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.GETTING_TEAMS_LIST
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.TEAM_API}`;
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
                if(response.success){
                dispatch({
                    type: teamsConstant.GET_TEAMS_LIST_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: teamsConstant.GET_TEAMS_LIST_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: teamsConstant.GET_TEAMS_LIST_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: teamsConstant.GET_TEAMS_LIST_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const delete_team = (team) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.DELTETING_TEAM
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.TEAM_API}`;
        let token = getToken();
        let teamId = {
            team_id : team.team_id
        }
        fetch(url, {
            method: 'delete',
            headers: {
            "content-type": "application/json",
            "JWTAuthorization": "Bearer "+ token
            },
            body: JSON.stringify(teamId)
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                if(response.success){
                dispatch({
                    type: teamsConstant.DELETE_TEAM_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: teamsConstant.DELETE_TEAM_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: teamsConstant.DELETE_TEAM_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: teamsConstant.DELETE_TEAM_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const edit_team = (team) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.EDITING_TEAM
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.TEAM_API}`;
        let token = getToken();
            
        fetch(url, {
            method: 'put',
            headers: {
            "content-type": "application/json",
            "JWTAuthorization": "Bearer "+ token
            },
            body: JSON.stringify(team)
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                if(response.success){
                dispatch({
                    type: teamsConstant.EDIT_TEAM_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: teamsConstant.EDIT_TEAM_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: teamsConstant.EDIT_TEAM_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: teamsConstant.EDIT_TEAM_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const set_selected_team = (team) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.SET_SELECTED_TEAM,
            payload: team
        })
    }
}

export const get_team_members = (teamId) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.GETTING_TEAM_MEMBERS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.TEAM_MEMBERS}/${teamId}`;
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
                if(response.success){
                dispatch({
                    type: teamsConstant.GET_TEAM_MEMBERS_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: teamsConstant.GET_TEAM_MEMBERS_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: teamsConstant.GET_TEAM_MEMBERS_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: teamsConstant.GET_TEAM_MEMBERS_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const add_team_members = (members) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.ADDING_TEAM_MEMBERS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.TEAM_MEMBERS}`;
        let token = getToken();
            
        let payload = {
            team_members: members
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
                if(response.success){
                dispatch({
                    type: teamsConstant.ADD_TEAM_MEMBERS_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: teamsConstant.ADD_TEAM_MEMBERS_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: teamsConstant.ADD_TEAM_MEMBERS_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: teamsConstant.ADD_TEAM_MEMBERS_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const delete_team_member = (teamMemberId, seletedTeamId) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.DELETING_TEAM_MEMBERS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.TEAM_MEMBERS}`;
        let token = getToken();
        let teamMember = {
            team_id : seletedTeamId,
            user_id : teamMemberId
        }
        fetch(url, {
            method: 'delete',
            headers: {
            "content-type": "application/json",
            "JWTAuthorization": "Bearer "+ token
            },
            body: JSON.stringify(teamMember)
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                if(response.success){
                dispatch({
                    type: teamsConstant.DELETE_TEAM_MEMBERS_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: teamsConstant.DELETE_TEAM_MEMBERS_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: teamsConstant.DELETE_TEAM_MEMBERS_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: teamsConstant.DELETE_TEAM_MEMBERS_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const get_all_org_users = (teamId) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.GETTING_ALL_ORG_USERS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.ALL_ORG_USERS}/${teamId}`;
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
                if(response.success){
                dispatch({
                    type: teamsConstant.GET_ALL_ORG_USERS_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: teamsConstant.GET_ALL_ORG_USERS_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: teamsConstant.GET_ALL_ORG_USERS_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: teamsConstant.GET_ALL_ORG_USERS_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const set_is_team_members_added = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: teamsConstant.SET_IS_TEAM_MEMBER_ADDED,
        })
    }
}