import { actions as authActions } from "../containers/app/auth"

import { peopleAccessConstants } from '../constants/storeConstants'
import { appConstant } from '../constants/appConstants'
import { getToken } from '../transforms'

export const getPeopleAccess = () => {
    return dispatch => {
  
      dispatch({
        type: peopleAccessConstants.GETTING_PEOPLE_ACCESS
      })
  
      
      let url = appConstant.BASE_URL + appConstant.GET_PEOPLE_ACCESS;
      let token = getToken();
  
      fetch(url, {
        method: 'get',
        headers: {
          "content-type": "application/json",
          "JWTAuthorization": "Bearer "+ token
        }
      })
      .then(res => {
        return res.json();
      })
      .then(
        (response) => {
          console.log("get people access : ", response)
          if(response.success) {
            dispatch({
              type: peopleAccessConstants.GET_PEOPLE_ACCESS_SUCCESS,
              payload: response.result
            })
          } else {
            dispatch({
              type: peopleAccessConstants.GET_PEOPLE_ACCESS_FAIL,
              payload: response.message
            })
          }
        },
        (error) => {
          console.log(error)
          dispatch({
            type: peopleAccessConstants.GET_PEOPLE_ACCESS_FAIL,
            payload: 'Something went wrong!'
          })
        }
      )
    }
}

export const updatePeopleAccess = (payload) => {
  return dispatch => {

    dispatch({
      type: peopleAccessConstants.UPDATING_PEOPLE_ACCESS
    })

    
    let url = appConstant.BASE_URL + appConstant.UPDATE_PEOPLE_ACCESS;
    let token = getToken();

    fetch(url, {
      method: 'put',
      headers: {
        "content-type": "application/json",
        "JWTAuthorization": "Bearer "+ token
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      return res.json();
    })
    .then(
      (response) => {
        console.log("get people access : ", response)
        if(response.success) {
          dispatch({
            type: peopleAccessConstants.UPDATE_PEOPLE_ACCESS_SUCCESS,
            payload: response.result
          })
        } else {
          dispatch({
            type: peopleAccessConstants.UPDATE_PEOPLE_ACCESS_FAIL,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log(error)
        dispatch({
          type: peopleAccessConstants.UPDATE_PEOPLE_ACCESS_FAIL,
          payload: 'Something went wrong!'
        })
      }
    )
  }
}