import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { signUpConstant } from '../constants/storeConstants'


export const editSignUp = (data) => {
  return dispatch => {
    dispatch({
      type: signUpConstant.SIGNUP_EDIT,
      payload: data
    })
  }
}

export const signUp = (data, cb) => {
  return dispatch => {

    dispatch({
      type: signUpConstant.SIGNING_UP
    })

    let url = `${appConstant.BASE_URL}${appConstant.SIGNUP_API}`;
    let token = getToken();
    
    fetch(url, {
      method: 'post',
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
            type: signUpConstant.SIGNUP_SUCCESS,
            payload: data
          })

          // Also create login session
          // if(response.result){
          //   let user = {
          //     is_new_user: response.result.first_time_user,
          //     is_slack_user: response.result.is_slack_user,
          //     email: response.result.email
          //   }
          //   let authResult = {
          //     access_token: response.result.token,
          //     token_type: 'Bearer',
          //     expires_in: 3600 * 24,
          //     user: user
          //   }
            
          //   authActions.saveSession(authResult)

          //   dispatch({
          //     type: logInConstant.LOGIN_SUCCESS,
          //     payload: user
          //   })
          // }
          cb();
        } else {
          console.log("Error", response.message)
          dispatch({
            type: signUpConstant.SIGNUP_FAILURE,
            payload: response.message
          })
        }
      },
      (error) => {
        console.log("Error", error)
        dispatch({
          type: signUpConstant.SIGNUP_FAILURE,
          payload: 'something went wrong'
        })

      }
    )
  }
}