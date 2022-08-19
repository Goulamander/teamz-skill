import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Redirect } from 'react-router-dom'

import { verify_user } from '../../actions/login';
import { ROUTES } from '../../constants/routeConstants'

const VerifyUser = (props) => {
    const { match: { params } } = props;
    const { isUserLoggedIn, data } = props.login;

    const [isVerifyError, setIsVerifyError] = useState(false);
    const [alertClose, setAlertClose] = useState(false);
    const [verifyError, setVerifyError] = useState(null);

    useEffect(() => {
        props._verify_user(params.code);
    }, []);

    useEffect(() => {
        if(props.login.userVerifyError !== null) {
            console.log("dfd", props.login.userVerifyError)
            setIsVerifyError(true);
            setVerifyError(props.login.userVerifyError);
        }
    }, [props.login.userVerifyError]);

    const hideAlert = () => {
        setIsVerifyError(false);
        setVerifyError(null);
        setAlertClose(true);
    }

    return (
        <div className="container">
            <div className="verify-user">verifying</div>
            { isVerifyError && verifyError !== null &&
                <SweetAlert
                    danger
                    title="Error"
                    onConfirm={hideAlert}
                >
                {verifyError}
                </SweetAlert>
            }
            {  alertClose &&
               <Redirect to={ROUTES.HOME} />
            }
            { isUserLoggedIn && data.is_new_user &&
                <Redirect to={ROUTES.ONBOARDING} />
            }
            { isUserLoggedIn && !data.is_new_user &&
                <Redirect to={ROUTES.PROFILE} />
            }
        </div>
    )
}

const mapStateToProps = ({ router, login }) => ({
    router,
    login
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _verify_user: verify_user
    },
    dispatch
  )

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VerifyUser)