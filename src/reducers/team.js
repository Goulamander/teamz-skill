import { teamsConstant } from '../constants/storeConstants'

const initialState = {
    isLoading: false,
    teamsData: [],
    error: null,
    isDeleteLoading: false,
    isDeleted: false,
    isDeleteError: null,
    isEditLoading: false,
    isEdited: false,
    isEditError: null,
    selectedTeam: null,
    isTmLoading: false,
    teamMembers: [],
    tmError: null,
    orgUsers: [] ,
    isOrgUsersLoading: false,
    isOrgUsersError: null,
    isAddTmLoading: false,
    isTeamMembersAdded: false,
    addTmError: null,
    isDeleteTmLoading: false,
    isTeamMembersDeleted: false,
    deleteTmError: null,
};

export default (state = initialState, action) => {
    switch (action.type) {  
  
        case teamsConstant.GETTING_TEAMS_LIST:
            return {
            ...state,
            isDeleted: false,
            isEdited: false,
            isLoading: true,
            }
      
        case teamsConstant.GET_TEAMS_LIST_SUCCESS:
            return {
                ...state,
                teamsData: action.payload,
                error: null,
                isLoading: false
            }
  
        case teamsConstant.GET_TEAMS_LIST_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
            
        case teamsConstant.DELTETING_TEAM:
            return {
            ...state,
            isDeleted: false,
            isDeleteLoading: true
            }
        
        case teamsConstant.DELETE_TEAM_SUCCESS:
            return {
                ...state,
                isDeleted: true,
                isDeleteError: null,
                isDeleteLoading: false
            }
    
        case teamsConstant.DELETE_TEAM_ERROR:
            return {
                ...state,
                isDeleted: false,
                isDeleteError: action.payload,
                isDeleteLoading: false
            }
            
        case teamsConstant.EDITING_TEAM:
            return {
            ...state,
            isEdited: false,
            isEditLoading: true
            }
        
        case teamsConstant.EDIT_TEAM_SUCCESS:
            return {
                ...state,
                isEdited: true,
                isEditError: null,
                isEditLoading: false
            }
    
        case teamsConstant.EDIT_TEAM_ERROR:
            return {
                ...state,
                isEdited: false,
                isEditError: action.payload,
                isEditLoading: false
            }  
         
        case teamsConstant.SET_SELECTED_TEAM:
            return {
            ...state,
            selectedTeam: action.payload
            } 
            
        case teamsConstant.GETTING_TEAM_MEMBERS:
            return {
            ...state,
                isTmLoading: false
            }
        
        case teamsConstant.GET_TEAM_MEMBERS_SUCCESS:
            return {
                ...state,
                teamMembers: action.payload,
                tmError: null,
                isTmLoading: false
            }
    
        case teamsConstant.GET_TEAM_MEMBERS_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            } 
            
        case teamsConstant.GETTING_ALL_ORG_USERS:
            return {
            ...state,
                isOrgUsersLoading: true
            }
        
        case teamsConstant.GET_ALL_ORG_USERS_SUCCESS:
            return {
                ...state,
                orgUsers: action.payload,
                isOrgUsersLoading: false,
                isOrgUsersError: null 
            }
    
        case teamsConstant.GET_ALL_ORG_USERS_ERROR:
            return {
                ...state,
                isOrgUsersLoading: false,
                isOrgUsersError: action.payload 
            }  
            
        case teamsConstant.ADDING_TEAM_MEMBERS:
            return {
            ...state,
                isAddTmLoading: false,
                isTeamMembersAdded: false
            }
        
        case teamsConstant.ADD_TEAM_MEMBERS_SUCCESS:
            return {
                ...state,
                isTeamMembersAdded: true,
                addTmError: null,
                isAddTmLoading: false
            }
    
        case teamsConstant.ADD_TEAM_MEMBERS_ERROR:
            return {
                ...state,
                addTmError: action.payload,
                isTmLoading: false
            }
        
        case teamsConstant.DELETING_TEAM_MEMBERS:
            return {
            ...state,
                isDeleteTmLoading: false,
                isTeamMembersDeleted: false
            }
        
        case teamsConstant.DELETE_TEAM_MEMBERS_SUCCESS:
            return {
                ...state,
                isTeamMembersDeleted: true,
                deleteTmError: null,
                isDeleteTmLoading: false
            }
    
        case teamsConstant.DELETE_TEAM_MEMBERS_ERROR:
            return {
                ...state,
                deleteTmError: action.payload,
                isDeleteTmLoading: false
            }

        case teamsConstant.SET_IS_TEAM_MEMBER_ADDED:
            return {
            ...state,
            isTeamMembersAdded: false
            }    
  
        default:
            return state   
    }
};