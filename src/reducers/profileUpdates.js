import { weeklyUpdatesConstants, workHighlightsConstants } from '../constants/storeConstants'

const initialState = {
  isWUEditMode: false,
  isWHEditMode: false,
  execution: '',
  craftsmanship: '',
  leadership: '',
  mentoring: '',
  workHighlights: '',
  selectedDays: []
}

export default (state = initialState, action) => {
  switch (action.type) {

    // Weekly updates
    case weeklyUpdatesConstants.EDIT_CRAFTSMANSHIP:
      return {
        ...state,
        craftsmanship: action.payload
      }
    case weeklyUpdatesConstants.EDIT_EXECUTION:
      return {
        ...state,
        execution: action.payload
      }
    case weeklyUpdatesConstants.EDIT_LEADERSHIP:
      return {
        ...state,
        leadership: action.payload
      }
    case weeklyUpdatesConstants.EDIT_MENTORING:
      return {
        ...state,
        mentoring: action.payload
      }
    case weeklyUpdatesConstants.EDITING_WEEKLY_UPDATE:
      return {
        ...state,
        isWUEditMode: true
      }
    case weeklyUpdatesConstants.CANCEL_EDITING_WEEKLY_UPDATE:
      return {
        ...state,
        ...action.payload
      }
    case weeklyUpdatesConstants.EDIT_WEEKLY_UPDATE:
      return {
        ...state,
        ...action.payload
      }
    case weeklyUpdatesConstants.SELECTED_DAYS:
      return {
        ...state,
        selectedDays: action.payload
      }

      // Work Highlights
    case workHighlightsConstants.EDIT_WORK_HIGHLIGHTS:
      return {
        ...state,
        workHighlights: action.payload
      }
    case workHighlightsConstants.CANCEL_EDITING_WORK_HIGHLIGHTS:
      return {
        ...state,
        workHighlights: action.payload,
        isWHEditMode: false
      }
    case workHighlightsConstants.EDIT_WORK_HIGHLIGHTS_SUCCESS:
      return {
        ...state,
        isWHEditMode: false
      }
    case workHighlightsConstants.EDIT_WORK_HIGHLIGHTS_ERROR:
      return {
        ...state,
        isWHEditMode: false
      }
    case workHighlightsConstants.EDITING_WORK_HIGHLIGHTS:
      return {
        ...state,
        isWHEditMode: true
      }

    default:
      return state   
  }
};
  
