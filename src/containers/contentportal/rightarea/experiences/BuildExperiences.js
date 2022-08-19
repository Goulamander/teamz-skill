import React, { Component, Fragment, useState }  from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Col, Input, Label, Form, Button } from 'reactstrap'
import { Link, Redirect } from 'react-router-dom';

import { ROUTES } from '../../../../constants/routeConstants'

const BuildExperience = () => {

    const openCreateExperience = () => {
        const win = window.open(`${ROUTES.CREATE_EXPERIENCE}`, "_blank");
        win.focus();
    }

    return (
        <div className="page-wrapper">
            <div className="page-title mb-5">Create experience</div>
            <Button type="button" className="btn btn-theme" onClick={openCreateExperience}>Create Experience</Button>
        </div>      
    )
}

const mapStateToProps = ({ contentPortal }) => ({
    contentPortal,
})
  
const mapDispatchToProps = dispatch =>
bindActionCreators(
    {

    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuildExperience)