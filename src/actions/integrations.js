import { actions as authActions } from "../containers/app/auth"

import { integrationsConstants } from '../constants/storeConstants'
import { appConstant } from '../constants/appConstants'
import { getToken } from '../transforms'

export const getSalesforceEmail = () => {
    return dispatch => {
  
      dispatch({
        type: integrationsConstants.GETTING_SALESFORCE_EMAIL
      })
  
      
      let url = appConstant.BASE_URL + appConstant.SALESFORCE_EMAIL;
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
              type: integrationsConstants.GET_SALESFORCE_EMAIL_SUCCESS,
              payload: response.result
            })
          } else {
            dispatch({
              type: integrationsConstants.GET_SALESFORCE_EMAIL_FAIL,
              payload: response.message
            })
          }
        },
        (error) => {
          console.log(error)
          dispatch({
            type: integrationsConstants.GET_SALESFORCE_EMAIL_FAIL,
            payload: 'Something went wrong!'
          })
        }
      )
    }
}

export const setSalesforceEmail = (payload, cb) => {
  return dispatch => {

    dispatch({
      type: integrationsConstants.SETTING_SALESFORCE_EMAIL
    })

    
    let url = appConstant.BASE_URL + appConstant.SALESFORCE_EMAIL;
    let token = getToken();

    fetch(url, {
      method: 'post',
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
        console.log("set salesforce email : ", response)
        if(response.success) {
          dispatch({
            type: integrationsConstants.SET_SALESFORCE_EMAIL_SUCCESS,
            payload: response.result
          });
          cb(null, response.result);
        } else {
          dispatch({
            type: integrationsConstants.SET_SALESFORCE_EMAIL_FAIL,
            payload: response.message
          });
          cb(response.message);
        }
      },
      (error) => {
        console.log(error)
        dispatch({
          type: integrationsConstants.SET_SALESFORCE_EMAIL_FAIL,
          payload: 'Something went wrong!'
        });
        cb('Something went wrong!');
      }
    )
  }
}