import React, { Component, Fragment } from 'react'
import '../../../assets/css/style-d3.css'
import {  Nav, NavItem, NavLink, Row, Col, TabContent, TabPane } from 'reactstrap';

import  OpportunityAmount  from './oppAmt';
import QuotaAttainment from './qtaAttmn';

const SUB_ROUTES = {
  OPP_AMT: 'OPPORTUNITY_AMOUNT',
  QTA_ATTMN: 'QUOTA_ATTAINMENT',
}

const NavBarSecondary = ({
  activeSubNav,
  _selectSubNav
}) => {
  return (
    <Row className="mt-4 sub-nav-container">
      <Col sm={12} className="pr-0 pl-0">
        <Nav tabs className="sub-nav">
          <NavItem className={activeSubNav === "ramp-time" ? "active" : ""}>
            <NavLink onClick={() => _selectSubNav('ramp-time')}>
              Ramp Time
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
    </Row>
  )
}

class RampTime extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeRoute: SUB_ROUTES.OPP_AMT,
      activeSubNav: 'ramp-time',
      selectedFilterTeam: 'All Teams',
      selectedFilterDuration: 'Last 8 Months'
    }
  }

  setHash = (hash) => {
    let activeHash = SUB_ROUTES.OPP_AMT
    switch(hash) {
      case SUB_ROUTES.OPP_AMT:
        activeHash = SUB_ROUTES.OPP_AMT
        break;
      case SUB_ROUTES.QTA_ATTMN:
        activeHash = SUB_ROUTES.QTA_ATTMN
        break;
      default:
        activeHash = SUB_ROUTES.OPP_AMT
        window.location.hash = SUB_ROUTES.OPP_AMT
    }
    this.setState({
      activeRoute: activeHash
    })
  }

  selectSubNav = (navMenu) => {
    this.setState({
      activeSubNav: navMenu
    })
  }

  setSelectedFilterTeam = (team) => {
    this.setState({
      selectedFilterTeam: team
    })
  }

  setSelectedFilterDuration = (duration) => {
    this.setState({
      selectedFilterDuration: duration
    })
  }

  componentDidMount() {
    const { activeRoute } = this.state;
    let hash = window.location.hash.replace('#', '')

    if(hash != activeRoute) {
      this.setHash(hash)
    }
  }

  componentDidUpdate(prevProps) {
    const { activeRoute } = this.state;
    let hash = window.location.hash.replace('#', '')
    if(hash != activeRoute) {
      this.setHash(hash)
    }
  }

  render() {
    const { activeRoute, activeSubNav, selectedFilterTeam, selectedFilterDuration } = this.state;
    console.log("selectedFilterTeam", selectedFilterTeam);
    return (
      activeRoute === SUB_ROUTES.OPP_AMT ? <Fragment>
        <NavBarSecondary 
          activeSubNav={activeSubNav}
          _selectSubNav={this.selectSubNav}
        />
        <TabContent className="page-content mt-4" activeTab={this.state.activeSubNav}>
          <TabPane tabId="ramp-time">
            <Row className="">
              <Col>
                <OpportunityAmount selectedFilterTeam={selectedFilterTeam} selectedFilterDuration={selectedFilterDuration} setSelectedFilterTeam={this.setSelectedFilterTeam} setSelectedFilterDuration={this.setSelectedFilterDuration} />
              </Col>
            </Row>
          </TabPane> 
        </TabContent>
      </Fragment> : <Fragment>
        <NavBarSecondary 
          activeSubNav={activeSubNav}
          _selectSubNav={this.selectSubNav}
        />
        <TabContent className="page-content mt-4" activeTab={this.state.activeSubNav}>
          <TabPane tabId="ramp-time">
            <Row className="">
              <Col>
                <QuotaAttainment selectedFilterTeam={selectedFilterTeam} selectedFilterDuration={selectedFilterDuration} setSelectedFilterTeam={this.setSelectedFilterTeam} setSelectedFilterDuration={this.setSelectedFilterDuration} />
              </Col>
            </Row>
          </TabPane> 
        </TabContent>
      </Fragment>
    )
  }
}

export default RampTime