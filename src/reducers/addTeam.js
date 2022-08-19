import { addTeamsConstant } from '../constants/storeConstants'

const resetState = {
    sending: false,
    success: false,
    error: false,
    errMsg: null,
    teams: [
        {
            team_name: '',
            team_des: '',
            error: {
                team_name: null,
                team_des: null
            }
        },
        {
            team_name: '',
            team_des: '',
            error: {
            team_name: null,
            team_des: null
            }
        },
        {
            team_name: '',
            team_des: '',
            error: {
            team_name: null,
            team_des: null
            }
        },
    ],
};

const initialState = {
    sending: false,
    success: false,
    error: false,
    errMsg: null,
    teams: [
        {
            team_name: '',
            team_des: '',
            error: {
                team_name: null,
                team_des: null
            }
        },
        {
            team_name: '',
            team_des: '',
            error: {
            team_name: null,
            team_des: null
            }
        },
        {
            team_name: '',
            team_des: '',
            error: {
            team_name: null,
            team_des: null
            }
        },
    ],
};

export default (state = initialState, action) => {
  switch (action.type) {

    case addTeamsConstant.LIST_TEAMS:
      return {
        ...state
      }

    case addTeamsConstant.ADD_TEAM:
      return {
        ...state,
        teams: [...state.teams, action.payload ],
      }
    
    case addTeamsConstant.EDIT_TEAM:
      return {
        ...state,
        teams: [...state.teams.slice(0, action.teamId), action.payload, ...state.teams.slice(action.teamId + 1)]
      }
    
    case addTeamsConstant.DELETE_TEAM:
      return {
        ...state,
        teams: [...state.teams.slice(0, action.teamId), ...state.teams.slice(action.teamId +1)]
      }

    case addTeamsConstant.ADDING_TEAM:
        return {
          ...state,
          sending: true,
          success: false,
          error: false,
          errMsg: null, 
        }

    case addTeamsConstant.ADD_TEAM_SUCCESS:
      return {
        ...state,
        sending: false,
        success: true,
        error: false,
        errMsg: null,
      }

    case addTeamsConstant.ADD_TEAM_ERROR:
      return {
        ...state,
        sending: false,
        success: false,
        error: true,
        errMsg: action.payload,
      }
    
    case addTeamsConstant.RESET_TEAM:
      return {
        ...state,
        sending: false,
        success: false,
        error: false,
        errMsg: null,
        teams: [
          {
              team_name: '',
              team_des: '',
              error: {
                  team_name: null,
                  team_des: null
              }
          },
          {
              team_name: '',
              team_des: '',
              error: {
              team_name: null,
              team_des: null
              }
          },
          {
              team_name: '',
              team_des: '',
              error: {
              team_name: null,
              team_des: null
              }
          },
        ]
      }

    default:
      return state   
  }
};