import React, { Component, Fragment, useState }  from 'react';
import GooglePicker from 'react-google-picker';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import { add_gdrive_content, get_gdrive_content } from '../../../actions/contentPortal'
import { ROUTES } from '../../../constants/routeConstants';
import { Loader } from '../../../component/Loader'

const AddGdriveContent = (props) => {
    
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const getGDriveDocuments = (gDriveData) => {
        console.log("gDriveData", gDriveData);
        if(gDriveData.action === 'picked') {
            setIsLoading(true);
            props._add_gdrive_content(gDriveData.docs, (err, success) => {
                if(success) {
                    history.push(ROUTES.CONTENT_PORTAL_CONTENT_PICKER);
                }
                setIsLoading(false);
                if(err) {
                    setIsError(true);
                }
            });
        }
    }

    const hideAlert = () => {
        setIsError(false);
    }

    return (
        <div className="page-wrapper">
            <div className="page-title mb-5">Add content from Google Drive</div>
            <GooglePicker 
                clientId={`343368979319-86chuc1lmflh81ok9la615i16raljnid.apps.googleusercontent.com`}
                developerKey={`AIzaSyCOY5orlD3JA9yh2RwC6vePmnpLUO5U0lc'`}
                scope={['https://www.googleapis.com/auth/drive.readonly']}
                onChange={data => console.log('on change:', data)}
                onAuthFailed={data => console.log('on auth failed:', data)}
                multiselect={true}
                navHidden={true}
                authImmediate={false}
                viewId={'FOLDERS'}
                createPicker={ (google, oauthToken) => {
                const googleViewId = google.picker.ViewId.FOLDERS;
                const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS)
                    // .setIncludeFolders(true)
                    // .setMimeTypes('application/vnd.google-apps.folder')
                    // .setSelectFolderEnabled(true)
                    .setEnableDrives(true)
                    // .setEnableTeamDrives(true);    

                const picker = new window.google.picker.PickerBuilder().
                addView(google.picker.ViewId.DOCS).
                    addView(docsView)
                    // .enableFeature(google.picker.Feature.NAV_HIDDEN)
                    .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
                    // .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
                    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                    .setOAuthToken(oauthToken)
                    .setDeveloperKey('AIzaSyCOY5orlD3JA9yh2RwC6vePmnpLUO5U0lc')
                    .setCallback((data)=>{
                        getGDriveDocuments(data);
                    });

                    picker.build().setVisible(true);
                // addViewGroup(
                //     new google.picker.ViewGroup(google.picker.ViewId.DOCS).
                //     addView(google.picker.ViewId.DOCUMENTS).
                //     addView(docsView).
                //     addView(google.picker.ViewId.PRESENTATIONS))
                //     // .enableFeature(google.picker.Feature.NAV_HIDDEN)
                //     // .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
                //     .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
                //     // .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
                //     .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                //     .setOAuthToken(oauthToken)
                //     .setDeveloperKey('AIzaSyCOY5orlD3JA9yh2RwC6vePmnpLUO5U0lc')
                //     .setCallback((data)=>{
                //         getGDriveDocuments(data);
                //     });

                //     picker.build().setVisible(true);
                // }}
                }}
            >
            <button type="button" className="btn btn-theme">Add From Google</button>
            <div className="google"></div>
            </GooglePicker>

            {isLoading &&
                <Loader isLoading={isLoading} />
            }

            {isError && 
                <SweetAlert
                    danger
                    title="Error"
                    onConfirm={hideAlert}
                >
                {props.addgDriveCntError}
                </SweetAlert>
            }
        </div>
    )
}

const mapStateToProps = ({ contentPortal }) => ({
    contentPortal,
})
  
const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
        _get_gdrive_content : get_gdrive_content,
        _add_gdrive_content : add_gdrive_content
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddGdriveContent)