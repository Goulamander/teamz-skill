// import { appConstant } from '../constants/appConstants'
import { careerLadderConstants } from '../constants/storeConstants'


export const add_level = (nextLevel, index) => {
  return (dispatch) => {
    dispatch({
      type: careerLadderConstants.ADD_LADDER, 
      payload: nextLevel,
      index: index
    })
  }
}

export const delete_level = (level, index) => {
  return (dispatch) => {
    dispatch({
      type: careerLadderConstants.DELETE_LADDER, 
      payload: level,
      index: index
    })
  }
}

export const edit_level = (data) => {
  return (dispatch) => {
    dispatch({
      type: careerLadderConstants.EDIT_LADDER, 
      payload: data
    })
  }
}