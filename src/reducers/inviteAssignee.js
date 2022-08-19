import cloneDeep from 'clone-deep'
import { assignConstant } from '../constants/storeConstants'

const resetState = {
  sending: false,
  success: false,
  error: false,
  assignErrorMsg: null,
  assignee: [
    {
      email: '',
      error: {
        email: null
      }
    },
    {
      email: '',
      error: {
        email: null
      }
    },
    {
      email: '',
      error: {
        email: null
      }
    },
  ],
  sendingTeamAssignee: false,
  teamAssigneeError: null,
  isTeamAssigneeError: false,
  teamAssigneeSuccess: false
};

const initialState = {
  sending: false,
  success: false,
  error: false,
  assignErrorMsg: null,
  assignee: [
    {
      email: '',
      error: {
        email: null
      }
    },
    {
      email: '',
      error: {
        email: null
      }
    },
    {
      email: '',
      error: {
        email: null
      }
    },
  ],
  sendingTeamAssignee: false,
  teamAssigneeError: null,
  isTeamAssigneeError: false,
  teamAssigneeSuccess: false
};

export default (state = initialState, action) => {
  switch (action.type) {

    case assignConstant.ADD_ASSIGNEE:
      return {
        ...state,
        assignee: [...state.assignee, action.payload ],
      }
    
    case assignConstant.EDIT_ASSIGNEE:
      return {
        ...state,
        assignee: [...state.assignee.slice(0, action.assigneeId), action.payload, ...state.assignee.slice(action.assigneeId + 1)]
      }
    
    case assignConstant.DELETE_ASSIGNEE:
      return {
        ...state,
        assignee: [...state.assignee.slice(0, action.assigneeId), ...state.assignee.slice(action.assigneeId +1)]
      }

    case assignConstant.SENDING_ASSIGNEE:
        return {
          ...state,
          sending: true,
          success: false,
          error: false,
          assignErrorMsg: null
        }

    case assignConstant.SEND_ASSIGNEE_SUCCESS:
      return {
        ...state,
        sending: false,
        success: true,
        error: false,
        assignErrorMsg: null
      }

    case assignConstant.SEND_ASSIGNEE_ERROR:
      return {
        ...state,
        sending: false,
        success: false,
        error: true,
        assignErrorMsg: action.payload
      }

      case assignConstant.SENDING_TEAM_ASSIGNEE:
        return {
          ...state,
          sendingTeamAssignee: true,
          teamAssigneeSuccess: false,
          teamAssigneeError: null,
          isTeamAssigneeError: false
        }

    case assignConstant.SEND_TEAM_ASSIGNEE_SUCCESS:
      return {
        ...state,
        sendingTeamAssignee: false,
        teamAssigneeSuccess: true,
        teamAssigneeError: null,
        isTeamAssigneeError: false
      }

    case assignConstant.SEND_TEAM_ASSIGNEE_ERROR:
      return {
        ...state,
        sendingTeamAssignee: false,
        teamAssigneeSuccess: false,
        teamAssigneeError: action.payload,
        isTeamAssigneeError: true,
      }  
    
    case assignConstant.RESET_ASSIGNEE:
      return cloneDeep(resetState)

    default:
      return state   
  }
};

