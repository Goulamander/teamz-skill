import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { micrositesConstant } from '../constants/storeConstants'

export const create_microsites = (formData, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.CREATING_MICROSITE
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.CREATE_MICROSITE}`;
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
                        type: micrositesConstant.CREATE_MICROSITE_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "Microsite created", null) 
                } else {
                    dispatch({
                        type: micrositesConstant.CREATE_MICROSITE_ERROR,
                        payload: "something went wrong"
                    });
                    cb("omething went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: micrositesConstant.CREATE_MICROSITE_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: micrositesConstant.CREATE_MICROSITE_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const get_microsite_by_link = (link) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.GETTING_MICROSITE_BY_LINK
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GET_MICROSITE_BY_LINK}/${link}`;
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
                    type: micrositesConstant.GET_MICROSITE_BY_LINK_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: micrositesConstant.GET_MICROSITE_BY_LINK_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: micrositesConstant.GET_MICROSITE_BY_LINK_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: micrositesConstant.GET_MICROSITE_BY_LINK_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const get_microsites = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.GETTING_MICROSITES
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GET_MICROSITES}`;
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
                    type: micrositesConstant.GET_MICROSITES_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: micrositesConstant.GET_MICROSITES_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: micrositesConstant.GET_MICROSITES_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: micrositesConstant.GET_MICROSITES_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const update_microsite = (formData, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.UPDATING_MICROSITE
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.UPDATE_MICROSITE}`;
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
                        type: micrositesConstant.UPDATE_MICROSITE_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "Microsite updated", null) 
                } else {
                    dispatch({
                        type: micrositesConstant.UPDATE_MICROSITE_ERROR,
                        payload: "something went wrong"
                    });
                    cb("omething went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: micrositesConstant.UPDATE_MICROSITE_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: micrositesConstant.UPDATE_MICROSITE_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const save_get_share_link = (data, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.SAVING_GET_SHARE_LINK
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.SAVE_SHARE_LINK_DATA}`;
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
                if(response.success){
                    dispatch({
                        type: micrositesConstant.SAVE_GET_SHARE_LINK_SUCCESS,
                        payload: response.result
                    })
                    cb(null, response.result) 
                } else {
                    dispatch({
                        type: micrositesConstant.SAVE_GET_SHARE_LINK_ERROR,
                        payload: "something went wrong"
                    });
                    cb("something went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: micrositesConstant.SAVE_GET_SHARE_LINK_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: micrositesConstant.SAVE_GET_SHARE_LINK_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const get_my_shares = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.GETTING_MY_SHARES
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GET_MYSHARES}`;
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
                    type: micrositesConstant.GET_MY_SHARES_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: micrositesConstant.GET_MY_SHARES_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: micrositesConstant.GET_MY_SHARES_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: micrositesConstant.GET_MY_SHARES_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const delete_microsite_contents = (payload, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.DELETING_MICROSITE_CONTENTS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.DELETE_MICROSITE_CONTENTS}`;
        let token = getToken();

        fetch(url, {
          method: 'delete',
          headers: {
            "content-type": "application/json",
            "JWTAuthorization": "Bearer "+ token
          },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                if(response.success){
                    dispatch({
                        type: micrositesConstant.DELETE_MICROSITE_CONTENTS_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "Microsite updated", null) 
                } else {
                    dispatch({
                        type: micrositesConstant.DELETE_MICROSITE_CONTENTS_ERROR,
                        payload: "something went wrong"
                    });
                    cb("omething went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: micrositesConstant.DELETE_MICROSITE_CONTENTS_ERROR,
                    payload: typeof response.message === 'string' ? response.message : 'something went wrong'
                })
                cb(typeof response.message === 'string' ? response.message : 'something went wrong', null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: micrositesConstant.UPDATE_MICROSITE_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const add_content_to_microsite = (payload, cb) => {
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.ADDING_CONTENT_TO_MICROSITE
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.ADD_CONTENT_TO_MICROSSITE}`;
        let token = getToken();

        fetch(url, {
            method: 'post',
            headers: {
                "content-type": "application/json",
                "JWTAuthorization": "Bearer "+ token
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                if(response.success){
                    dispatch({
                        type: micrositesConstant.ADD_CONTENT_TO_MICROSITE_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "Content added to microsite", null) 
                } else {
                    dispatch({
                        type: micrositesConstant.ADD_CONTENT_TO_MICROSITE_ERROR,
                        payload: "something went wrong"
                    });
                    cb("something went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: micrositesConstant.ADD_CONTENT_TO_MICROSITE_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: micrositesConstant.ADD_CONTENT_TO_MICROSITE_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const reset_add_contents_microsite_error = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.RESET_ADD_CONTENT_TO_MICROSITE_ERROR
        });
    }
}

export const save_upload_video_data = (data, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.SAVING_UPLOAD_VIDEO_DATA
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.SAVE_UPLOAD_VIDEO_DATA}`;
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
                if(response.success){
                    dispatch({
                        type: micrositesConstant.SAVE_UPLOAD_VIDEO_DATA_SUCCESS,
                        payload: response.result
                    })
                    cb(null, response.result) 
                } else {
                    dispatch({
                        type: micrositesConstant.SAVE_UPLOAD_VIDEO_DATA_ERROR,
                        payload: "something went wrong"
                    });
                    cb("something went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: micrositesConstant.SAVE_UPLOAD_VIDEO_DATA_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: micrositesConstant.SAVE_UPLOAD_VIDEO_DATA_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const save_CTA_text_data = (data, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: micrositesConstant.SAVING_CTA_TEXT_DATA
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.SAVE_CTA_TEXT_DATA}`;
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
                if(response.success){
                    dispatch({
                        type: micrositesConstant.SAVE_CTA_TEXT_DATA_SUCCESS,
                        payload: response.result
                    })
                    cb(null, response.result) 
                } else {
                    dispatch({
                        type: micrositesConstant.SAVE_CTA_TEXT_DATA_ERROR,
                        payload: "something went wrong"
                    });
                    cb("something went wrong", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: micrositesConstant.SAVE_CTA_TEXT_DATA_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: micrositesConstant.SAVE_UPLOAD_VIDEO_DATA_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const upload_microsite_recorded_video = (formData, cb) => {
  
    return dispatch => {
      dispatch({
        type: micrositesConstant.UPLOADING_MICROSITE_RECORDED_VIDEO
      })
  
      let url = `${appConstant.BASE_URL}${appConstant.UPLOAD_MICROSITE_RECORDED_VIDEO}`;
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
            dispatch({
              type: micrositesConstant.UPLOAD_MICROSITE_RECORDED_VIDEO_SUCCESS,
              payload: response.result
            })
          } else {
            console.log("Error", response.message)
            dispatch({
              type: micrositesConstant.UPLOAD_MICROSITE_RECORDED_VIDEO_FAIL,
              payload: response.message
            })
          }
          cb(response)
        },
        (error) => {
          console.log("Error", error)
          dispatch({
            type: micrositesConstant.UPLOAD_MICROSITE_RECORDED_VIDEO_FAIL,
            payload: 'something went wrong'
          })
  
        }
      )
    }
  }