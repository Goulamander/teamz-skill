import { getToken } from '../transforms'
import { appConstant } from '../constants/appConstants'
import { contentPortalConstant } from '../constants/storeConstants'

export const add_gdrive_content = (docs, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.ADDING_GDRIVE_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GDRIVE_CONTENT}`;
        let token = getToken();
            
        let payload = {
            GDriveDocs: docs
        }
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
                        type: contentPortalConstant.ADD_GDRIVE_CONTENT_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "content added", null) 
                } else {
                    dispatch({
                        type: contentPortalConstant.ADD_GDRIVE_CONTENT_ERROR,
                        payload: "No Record found"
                    });
                    cb("No Record found", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: contentPortalConstant.ADD_GDRIVE_CONTENT_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: contentPortalConstant.ADD_GDRIVE_CONTENT_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const get_gdrive_content = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.GETTING_GDRIVE_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.GDRIVE_CONTENT}`;
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
                    type: contentPortalConstant.GET_GDRIVE_CONTENT_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: contentPortalConstant.GET_GDRIVE_CONTENT_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: contentPortalConstant.GET_GDRIVE_CONTENT_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: contentPortalConstant.GET_GDRIVE_CONTENT_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const get_popular_content_tags = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.GETTING_CONTENT_TAG
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.CONTENT_POPULAR_TAGS}`;
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
                    type: contentPortalConstant.GET_CONTENT_TAG_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: contentPortalConstant.GET_CONTENT_TAG_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: contentPortalConstant.GET_CONTENT_TAG_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: contentPortalConstant.GET_CONTENT_TAG_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const add_tags_to_content = (tags, documents, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.ADDING_TAGS_TO_CONTENTS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.ADD_TAGS}`;
        let token = getToken();
            
        let payload = {
            document_ids: documents,
            tags: tags
        }
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
                        type: contentPortalConstant.ADD_TAGS_TO_CONTENTS_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "tag added") 
                } else {
                    dispatch({
                        type: contentPortalConstant.ADD_TAGS_TO_CONTENTS_ERROR,
                        payload: "No Record found"
                    });
                    cb("No Record found", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: contentPortalConstant.ADD_TAGS_TO_CONTENTS_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: contentPortalConstant.ADD_TAGS_TO_CONTENTS_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const add_content_to_portal = (contents, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.ADDING_CONTENTS_TO_PORTAL
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.ADD_CONTENTS_TO_PORTAL}`;
        let token = getToken();
            
        let payload = {
            content_docs: contents
        }
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
                        type: contentPortalConstant.ADD_CONTENTS_TO_PORTAL_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "content added") 
                } else {
                    dispatch({
                        type: contentPortalConstant.ADD_CONTENTS_TO_PORTAL_ERROR,
                        payload: "No Record found"
                    });
                    cb("No Record found", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: contentPortalConstant.ADD_CONTENTS_TO_PORTAL_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: contentPortalConstant.ADD_CONTENTS_TO_PORTAL_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const edit_portal_content = (formData, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.EDITING_PORTAL_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.EDIT_CONTENT}`;
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
                        type: contentPortalConstant.EDIT_PORTAL_CONTENT_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "content edited", null) 
                } else {
                    dispatch({
                        type: contentPortalConstant.EDIT_PORTAL_CONTENT_ERROR,
                        payload: "No Record found"
                    });
                    cb("No Record found", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: contentPortalConstant.EDIT_PORTAL_CONTENT_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: contentPortalConstant.EDIT_PORTAL_CONTENT_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const delete_contents = (contents, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.DELETING_CONTENTS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.DELETE_CONTENTS}`;
        let token = getToken();
            
        let payload = {
            content_docs: contents
        }
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
                        type: contentPortalConstant.DELETE_CONTENTS_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "contents deleted") 
                } else {
                    dispatch({
                        type: contentPortalConstant.DELETE_CONTENTS_ERROR,
                        payload: response.message
                    });
                    cb(response.message, null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: contentPortalConstant.DELETE_CONTENTS_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: contentPortalConstant.DELETE_CONTENTS_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const add_my_content = (doc, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.ADDING_MY_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.MY_CONTENT}`;
        let token = getToken();
        
        let payload = {
            doc_id : doc.doc_id,
            doc_serial_id: doc.doc_serial_id
        }

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
                        type: contentPortalConstant.ADD_MY_CONTENT_SUCCESS,
                        payload: response.result
                    })
                    cb(null, "content added", null) 
                } else {
                    dispatch({
                        type: contentPortalConstant.ADD_MY_CONTENT_ERROR,
                        payload: "No Record found"
                    });
                    cb("No Record found", null) 
                } 
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: contentPortalConstant.ADD_MY_CONTENT_ERROR,
                    payload: response.message
                })
                cb(response.message, null)
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: contentPortalConstant.ADD_MY_CONTENT_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const get_my_content = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.GETTING_MY_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.MY_CONTENT}`;
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
                    type: contentPortalConstant.GET_MY_CONTENT_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: contentPortalConstant.GET_MY_CONTENT_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: contentPortalConstant.GET_MY_CONTENT_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: contentPortalConstant.GET_MY_CONTENT_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const get_library_images = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.GETTING_LIBRARY_IMAGES
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.LIBRARY_IMAGES}`;
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
                    type: contentPortalConstant.GET_LIBRARY_IMAGES_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: contentPortalConstant.GET_LIBRARY_IMAGES_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: contentPortalConstant.GET_LIBRARY_IMAGES_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: contentPortalConstant.GET_LIBRARY_IMAGES_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const set_selected_microsites_contents = (contents, selectedStyle) => {
    return dispatch => {
        dispatch({
            type: contentPortalConstant.SET_SELECTED_MICROSITE_CONTENTS,
            payload: {
                contents: contents,
                selectedStyle: selectedStyle
            }
        });
    }
}

export const reset_selected_microsites_contents = () => {
    return dispatch => {
        dispatch({
            type: contentPortalConstant.RESET_SELECTED_MICROSITE_CONTENTS
        });
    }
}

export const get_popular_content = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.GETTING_POPULAR_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.POPULAR_CONTENT}`;
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
                    type: contentPortalConstant.GET_POPULAR_CONTENT_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: contentPortalConstant.GET_POPULAR_CONTENT_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: contentPortalConstant.GET_POPULAR_CONTENT_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: contentPortalConstant.GET_POPULAR_CONTENT_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const get_recommended_content = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.GETTING_RECOMMENDED_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.RECOMMENDED_CONTENT}`;
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
                    type: contentPortalConstant.GET_RECOMMENDED_CONTENT_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: contentPortalConstant.GET_RECOMMENDED_CONTENT_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: contentPortalConstant.GET_RECOMMENDED_CONTENT_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: contentPortalConstant.GET_RECOMMENDED_CONTENT_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}

export const send_recommended_content = (recommendationsData, cb) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.SENDING_RECOMMENDED_CONTENT
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.RECOMMENDED_CONTENT}`;
        let token = getToken();
        
        fetch(url, {
          method: 'post',
          headers: {
            "content-type": "application/json",
            "JWTAuthorization": "Bearer "+ token
          },
          body: JSON.stringify(recommendationsData)
        })
        .then(res => res.json())
        .then((response) => {
            console.log("response : ", response)
            if(response.success) {
                dispatch({
                    type: contentPortalConstant.SEND_RECOMMENDED_CONTENT_SUCCESS,
                    payload: response.result
                })
                cb();
            } else {
                console.log("Error", response.message)
                dispatch({
                    type: contentPortalConstant.SEND_RECOMMENDED_CONTENT_ERROR,
                    payload: response.message
                })
            }
        },
        (error) => {
            console.log("Error", error)
            dispatch({
                type: contentPortalConstant.SEND_RECOMMENDED_CONTENT_ERROR,
                payload: 'something went wrong'
            });
            cb('something went wrong');
        })
    }
}

export const reset_recommended_error = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.RESET_RECOMMENDED_CONTENT_ERROR
        });
    }
}

export const save_srch_content_tag = (data) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.SAVE_SRCH_CONTENT_TAG,
            payload: data
        });
    }
}

export const save_srch_when_to_share = (data) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.SAVE_SRCH_WHEN_TO_SHARE,
            payload: data
        });
    }
}

export const save_srch_date_modified = (data) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.SAVE_SRCH_DATE_MODIFIED,
            payload: data
        });
    }
}

export const handle_filter_search = (data) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.HANDLE_FILTER_SRCH,
            payload: data
        });
    }
}

export const handle_global_content_search = (data) => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.HANDLE_GLB_CONTENT_SRCH,
            payload: data
        });
    }
}

export const reset_srch_filter = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.RESET_SRCH_FILTER
        });
    }
}

export const reset_global_content_search = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.RESET_GLB_CONTENT_SRCH
        });
    }
}

export const get_content_analytics = () => {
  
    return (dispatch, getState) => {
        dispatch({
            type: contentPortalConstant.GETTING_CONTENT_ANALYTICS
        })
    
        let url = `${appConstant.BASE_URL}${appConstant.CONTENT_ANALYTICS}`;
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
                    type: contentPortalConstant.GET_CONTENT_ANALYTICS_SUCCESS,
                    payload: response.result
                })
                } else {
                dispatch({
                    type: contentPortalConstant.GET_CONTENT_ANALYTICS_ERROR,
                    payload: "No Record found"
                })
                }  
            } else {
                console.log("Error", response.message)
                dispatch({
                type: contentPortalConstant.GET_CONTENT_ANALYTICS_ERROR,
                payload: response.message
                })
            }
        },
        (error) => {
        console.log("Error", error)
        dispatch({
            type: contentPortalConstant.GET_CONTENT_ANALYTICS_ERROR,
            payload: 'something went wrong'
        })
        })
    }
}