import React, { Component } from 'react';
import {  Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import DetailSetup from './DetailSetup'
import MetaDataUpload from './MetaUpload'

const Heading = (props) => (
  <Row>
    <Col className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pb-2">
      <div className="company-section-title">SAML Single Sign-On ({props.type})</div>
    </Col>
  </Row>
)

const NavBar = ({
  activeTopNav,
  _selectTopNav
}) => {
  return (
    <Row className="mt-2">
      <Col sm={12} className="pr-0">
        <div className="tab-bar-company" style={{background: '#ffffff'}}>
          <Nav tabs className="top-nav">
            <NavItem className={activeTopNav === "getting-started" ? "active" : ""} onClick={ () => _selectTopNav('getting-started')}>
              <NavLink href="javascript:void(0)" className="">Getting Started</NavLink>
            </NavItem>
            <NavItem className={activeTopNav === "metadata" ? "active" : ""} onClick={ () => _selectTopNav('metadata')}>
              <NavLink href="javascript:void(0)" className="">Metadata Upload</NavLink>
            </NavItem>
            <NavItem className={activeTopNav === "details-setup" ? "active" : ""} onClick={ () => _selectTopNav('details-setup')}>
              <NavLink href="javascript:void(0)" className="">Details Setup</NavLink>
            </NavItem>
          </Nav>
        </div> 
      </Col>
    </Row>
  )
}

class SingleSignOn extends Component{
  constructor(props) {
    super(props)

    let { location } = this.props
    this.state = {
      activeTopNav: 'getting-started',
    }
  }


  componentDidMount() {    
  }

  selectTopNav = (navMenu) => {
    this.setState({
      activeTopNav: navMenu
    })
  }

  render(){
    const { activeTopNav } = this.state
    const { type, gettingStartedText } = this.props;

    return(
      <div className="page-admin saml-section">
        <Heading type={type} />
        <NavBar activeTopNav={activeTopNav} _selectTopNav={this.selectTopNav} />
        { activeTopNav === 'getting-started' ?
            <Row className="page-bg">
              <Col className="meta-data-container">
                <div className="pt-4">
                  <h4 className="meta-data-heading">Please refer to <a href={gettingStartedText} target="_blank">setup instructions.</a></h4>
                </div>
              </Col>  
            </Row> : ''
        }
        { activeTopNav === 'metadata' &&
            <MetaDataUpload type={type} />
        }
        { activeTopNav === 'details-setup' &&
          <DetailSetup />
        }
      </div>
    );
  }
}

export default SingleSignOn