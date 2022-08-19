import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { skillsConstant } from '../constants/storeConstants'

export const get_skills = () => {
  
  return dispatch => {
    dispatch({
      type: skillsConstant.GET_SKILLS
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_SKILLS}`;
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
          dispatch({
            type: skillsConstant.GET_SKILLS_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: skillsConstant.GET_SKILLS_ERROR,
            payload: 'something went wrong'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: skillsConstant.GET_SKILLS_ERROR,
          payload: 'something went wrong'
        })

      }
    )

  }
}

export const get_user_skills = () => {
  
  return dispatch => {
    dispatch({
      type: skillsConstant.GET_USER_SKILLS
    })

    let url = `${appConstant.BASE_URL}${appConstant.GET_USER_SKILLS_API}`;
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
          dispatch({
            type: skillsConstant.GET_USER_SKILLS_SUCCESS,
            payload: response.result
          })
        } else {
          console.log("Error", response.message)
          dispatch({
            type: skillsConstant.GET_USER_SKILLS_ERROR,
            payload: 'something went wrong'
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: skillsConstant.GET_USER_SKILLS_ERROR,
          payload: 'something went wrong'
        })

      }
    )

  }
}

export const edit_user_skills = (skills) => {
  return dispatch => {
    dispatch({
      type: skillsConstant.EDIT_USER_SKILLS,
      payload: skills
    })
  }
}

export const set_user_skills = (cb) => {
  
  return (dispatch, getState) => {
    dispatch({
      type: skillsConstant.SAVING_USER_SKILLS
    })

    let url = `${appConstant.BASE_URL}${appConstant.SET_USER_SKILLS_API}`
    let token = getToken()
    let state = getState()
    let { data } = state.profileSettings
    
    fetch(url, {
      method: 'put',
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
            type: skillsConstant.SAVE_USER_SKILLS_SUCCESS
          })

          cb(true)

        } else {
          console.log("Error", response.message)
          dispatch({
            type: skillsConstant.SAVE_USER_SKILLS_FAILED,
            payload: 'Failed to save profile skills'
          })

          cb(false)

        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: skillsConstant.SAVE_USER_SKILLS_FAILED,
          payload: 'Failed to save profile skills'
        })
        cb(false)
      }
    )

  }
}