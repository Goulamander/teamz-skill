import { inviteConstant } from '../constants/storeConstants'

const resetState = {
  sending: false,
  success: false,
  error: false,
  invites: [
    {
      email: '',
      name: '',
      error: {
        email: null,
        name: null
      }
    },
    {
      email: '',
      name: '',
      error: {
        email: null,
        name: null
      }
    },
    {
      email: '',
      name: '',
      error: {
        email: null,
        name: null
      }
    },
  ],
};

const initialState = {
  sending: false,
  success: false,
  error: false,
  invites: [
    {
      email: '',
      name: '',
      error: {
        email: null,
        name: null
      }
    },
    {
      email: '',
      name: '',
      error: {
        email: null,
        name: null
      }
    },
    {
      email: '',
      name: '',
      error: {
        email: null,
        name: null
      }
    },
  ],
};

export default (state = initialState, action) => {
  switch (action.type) {

    case inviteConstant.LIST_INVITES:
      return {
        ...state
      }

    case inviteConstant.ADD_INVITE:
      return {
        ...state,
        invites: [...state.invites, action.payload ],
      }
    
    case inviteConstant.EDIT_INVITE:
      return {
        ...state,
        invites: [...state.invites.slice(0, action.inviteId), action.payload, ...state.invites.slice(action.inviteId + 1)]
      }
    
    case inviteConstant.DELETE_INVITE:
      return {
        ...state,
        invites: [...state.invites.slice(0, action.inviteId), ...state.invites.slice(action.inviteId +1)]
      }

    case inviteConstant.SENDING_INVITE:
        return {
          ...state,
          sending: true,
          success: false,
          error: false,
        }

    case inviteConstant.SEND_INVITE_SUCCESS:
      return {
        ...state,
        sending: false,
        success: true,
        error: false,
      }

    case inviteConstant.SEND_INVITE_ERROR:
      return {
        ...state,
        sending: false,
        success: false,
        error: true,
      }
    
    case inviteConstant.RESET_INVITE:
      return resetState

    default:
      return state   
  }
};

