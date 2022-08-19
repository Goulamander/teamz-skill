import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { experiencesConstant } from '../constants/storeConstants'

export const create_experiences = (formData, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: experiencesConstant.CREATING_EXPERIENCE
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.CREATE_EXPERIENCE}`;
        let token = getToken();

        fetch(url, {
          method: 'post',
          headers: {
            "JWTAuthorization": "Bearer "+ token
          },
          body: formData
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                if(response.success){
                    dispatch({
                        type: experiencesConstant.CREATE_EXPERIENCE_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "Experience created", null) 
                } else {
                    dispatch({
                        type: experiencesConstant.CREATE_EXPERIENCE_ERROR,
                        payload: "something went wrong"
                    });
                    cb("something went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: experiencesConstant.CREATE_EXPERIENCE_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: experiencesConstant.CREATE_EXPERIENCE_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const get_experiences = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: experiencesConstant.GETTING_EXPERIENCES
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GET_EXPERIENCES}`;
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
                if(response.success){
                dispatch({
                    type: experiencesConstant.GET_EXPERIENCES_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: experiencesConstant.GET_EXPERIENCES_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: experiencesConstant.GET_EXPERIENCES_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: experiencesConstant.GET_EXPERIENCES_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const get_experience_by_link = (link) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: experiencesConstant.GETTING_EXPERIENCE_BY_LINK
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GET_EXPERIENCE_BY_LINK}/${link}`;
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
                if(response.success){
                dispatch({
                    type: experiencesConstant.GET_EXPERIENCE_BY_LINK_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: experiencesConstant.GET_EXPERIENCE_BY_LINK_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: experiencesConstant.GET_EXPERIENCE_BY_LINK_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: experiencesConstant.GET_EXPERIENCE_BY_LINK_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const update_experiences = (formData, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: experiencesConstant.UPDATING_EXPERIENCE
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.UPDATE_EXPERIENCE}`;
        let token = getToken();

        fetch(url, {
          method: 'put',
          headers: {
            "JWTAuthorization": "Bearer "+ token
          },
          body: formData
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                if(response.success){
                    dispatch({
                        type: experiencesConstant.UPDATE_EXPERIENCE_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "Experience created", null) 
                } else {
                    dispatch({
                        type: experiencesConstant.UPDATE_EXPERIENCE_ERROR,
                        payload: "something went wrong"
                    });
                    cb("something went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: experiencesConstant.UPDATE_EXPERIENCE_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: experiencesConstant.UPDATE_EXPERIENCE_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const reset_exp_data_by_link = () => {
    return (dispatch) => {
      dispatch({
        type: experiencesConstant.RESET_EXP_BY_LINK_DATA, 
      })
    }
}

export const get_def_exp_templates = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: experiencesConstant.GETTING_DEF_EXP_TEMPLATES
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GET_DEF_EXP_TEMPLATES}`;
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
                if(response.success){
                dispatch({
                    type: experiencesConstant.GET_DEF_EXP_TEMPLATES_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: experiencesConstant.GET_DEF_EXP_TEMPLATES_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: experiencesConstant.GET_DEF_EXP_TEMPLATES_ERROR,
                    payload: response.message
                })
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: experiencesConstant.GET_EXPERIENCES_ERROR,
                payload: 'something went wrong'
            })
        })
    }
}

export const get_def_exp_templates_by_link = (link) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: experiencesConstant.GETTING_DEF_EXP_TEMPLATES_BY_LINK
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GET_DEF_EXP_TEMPLATES_BY_LINK}/${link}`;
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
                if(response.success){
                    dispatch({
                        type: experiencesConstant.GET_DEF_EXP_TEMPLATES_BY_LINK_SUCCESS,
                        payload: response.result
                    })
                } else {
                    dispatch({
                        type: experiencesConstant.GET_DEF_EXP_TEMPLATES_BY_LINK_ERROR,
                        payload: "No Record found"
                    })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: experiencesConstant.GET_DEF_EXP_TEMPLATES_BY_LINK_ERROR,
                    payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: experiencesConstant.GET_EXPERIENCE_BY_LINK_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const reset_def_exp_templates_by_link = () => {
    return (dispatch) => {
      dispatch({
        type: experiencesConstant.RESET_DEF_EXP_TEMPLATES_BY_LINK, 
      })
    }
}