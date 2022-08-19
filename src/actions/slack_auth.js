import { actions as authActions } from "../containers/app/auth"

import { logInConstant } from '../constants/storeConstants'
import { appConstant } from '../constants/appConstants'

export const slackAuth = (authCode, redirectURL) => {
  console.log("slack auth action")
  return dispatch => {

    dispatch({
      type: logInConstant.LOGGING_IN
    })

    let url = `${appConstant.BASE_URL}${appConstant.SLACK_AUTH_API}`;
    let data = {
      code: authCode,
      redirect_url: redirectURL
    }

    fetch(url, {
      method: 'post',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(
      (response) => {
        console.log("response : ", response)
        if(response.success) {
          let user = {
            ...response.result.user,
            slack_access_token: response.result.access_token,
            is_new_user: response.first_time_user,
            user_role: response.role,
          }
          let authResult = {
            access_token: response.token,
            token_type: 'Bearer',
            expires_in: 3600 * 24,
            user: user
          }
          
          authActions.saveSession(authResult)

          dispatch({
            type: logInConstant.LOGIN_SUCCESS,
            payload: user
          })
        } else {
          let errMsg = "Login Failed"
          try{
            errMsg = response.message
          } catch(e) {

          }

          dispatch({
            type: logInConstant.LOGIN_FAILURE,
            payload: errMsg
          })
        }
      },
      (error) => {
        // TODO: handle error
      }
    )
  }

}