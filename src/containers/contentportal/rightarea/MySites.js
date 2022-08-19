import React, {Component, Fragment, useState, useEffect} from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom';

import { get_microsites } from '../../../actions/microsites'
import { Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody, FormGroup, Alert } from 'reactstrap';
import { ROUTES } from '../../../constants/routeConstants'
import { appConstant } from '../../../constants/appConstants'
import cp_image_1 from '../../../assets/img/cp_image_1.jpg'
import microsite from '../createMicrosite/microsite';
const routeResource = "COMPONENT"

export const MySites = (props) => {
    let { getMicrosites, _get_microsites } = props;
    const history = useHistory();

    const [microsites, SetMicrosites] = useState([]);

    useEffect(() => {
        _get_microsites();
    }, []);

    useEffect(() => {
        if(getMicrosites.length) {
            SetMicrosites(getMicrosites);
        }
    }, [getMicrosites.length]);

    const handleTomicrosite = (link) => {
        history.push(`${ROUTES.MICROSITES}/${link}`);
    }

    return (
        <div className="page-wrapper">
            <div className="page-title mb-4">My Microsites</div>
            <Row className="microsite-cards">
                {   microsites.map((microsite, index) => {
                        return (
                            <Col md={4} sm={6} className="p-0" key={index}>
                                <div className="microsite-card" style={{backgroundImage: `url(${appConstant.BASE_URL + microsite.background_img.replace("dist", "")})`}} onClick={(e) => handleTomicrosite(microsite.link)} key={index}>
                                    <div className="microsite-card-title">{microsite.title}</div>
                                    <div className="short-des">{microsite.description}</div>
                                </div>
                            </Col>  
                        )
                    })
                }
            </Row>
        </div>    
    )
}

const mapStateToProps = ({ microSites }) => ({
    ...microSites
})
  
const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_microsites : get_microsites
    },
    dispatch
)
    
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MySites)