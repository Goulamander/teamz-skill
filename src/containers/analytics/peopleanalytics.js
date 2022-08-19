import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {  Nav, NavItem, NavLink, Row, Col, Input, Label, TabContent, TabPane } from 'reactstrap';
import * as d3 from "d3";

import { appConstant } from '../../constants/appConstants';
import { Chart } from '../../assets/js/d3script'
import { ChartTopPer } from '../../assets/js/d3script-tp'
import { ChartVisulization } from '../../assets/js/d3script-v'
import '../../assets/css/style-d3.css'

import { upload_CSV, getCSV } from '../../actions/admin'

const NavBarSecondary = ({
  activeTopNav,
  activeSubNav,
  _selectSubNav,
  _onChangeHandler,
  _resetHandler
}) => {
  return (
    <Row className="mt-4 sub-nav-container">
      <Col sm={12} className="pr-0 pl-0">
        <Nav tabs className="sub-nav">
          <NavItem className={activeSubNav === "your-people" ? "active" : ""}>
            <NavLink onClick={() => _selectSubNav('your-people')}>
              Your People
            </NavLink>
          </NavItem>
          <NavItem className={activeSubNav === "top-performers" ? "active" : ""}>
            <NavLink onClick={() => _selectSubNav('top-performers')}>
              Top Performers
            </NavLink>
          </NavItem>
          <NavItem className={activeSubNav === "employee-nps" ? "active" : ""}>
            <NavLink onClick={() => _selectSubNav('employee-nps')}>
              Employee NPS
            </NavLink>
          </NavItem>
        </Nav>
        <div className="ts-reset-button">
          <div className="input-file-container">
            <Label className="input-file-trigger btn btn-primary btn-ts" onClick={_resetHandler}>Reset</Label>
          </div>
        </div>
        <div className="ts-upload-button">
          <div className="input-file-container">  
            <Input id="csvUpload" className="input-file" type="file" name="file" onChange={_onChangeHandler} accept=".csv"/>
            <Label className="input-file-trigger btn btn-primary btn-ts" tabIndex="0" for="csvUpload">Upload CSV</Label>
          </div>
        </div>
      </Col>
    </Row>
  )
}

const ChartUI = () => {
  return (
    <Fragment>
      <Row className="mt-4">
        <Col sm="6" xs="12">
          <h3 className="main-head">Hire Date By Site</h3>
          <div id="vertical-stacked-bar-1">
          </div>
        </Col>
        <Col sm="6" xs="12" className="mt-2 mt-sm-0">
          <h3 className="main-head">Headcount Growth per Site</h3>
          <div id="bubble-chart-2">              
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col sm="6" xs="12">
          <h3 className="main-head">Diversity by Level</h3>
          <div id="horizontal-stacked-bar-1">
          </div>
        </Col>
        <Col sm="6" xs="12">
          <h3 className="main-head">Diversity by Site</h3>
          <div id="horizontal-stacked-bar-2">
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col sm="12" xs="12">
          <h3 className="main-head">Employee Details</h3>
          <div id="employee-details-1">
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

const ChartUI2 = () => {
  return (
    <Fragment>
      <Row className="mt-4">
        <Col sm="6" xs="12">
          <h3 className="main-head">Performance - Potential</h3>
          <div id="potential-heatmap">
          </div>
        </Col>
        <Col sm="6" xs="12" className="mt-2 mt-sm-0">
          <h3 className="main-head">Performance - Engagement </h3>
          <div id="engagement-heatmap">              
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col xs="12">
          <div id="dot-visualization">
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col sm="12" xs="12">
          <h3 className="main-head">Employee Performance Details</h3>
          <div id="employee-performance-details">
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

const ChartUI3 = () => {
  return (
    <Fragment>
      <Row className="mt-4">
        <h3 className="chart-title">Employee NPS</h3>
        <Col sm="12" xs="12" className="px-5 mb-5">
          <h4>Which Manager has more promoters?</h4>
          <div id="employee-nps-first-row">
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col sm="12" xs="12" className="px-5 mb-5">
          <h4>Which Site has more promoters?</h4>
          <div id="employee-nps-second-row">
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col sm="12" xs="12" className="px-5 mb-5">
          <h4>Which Department has more promoters?</h4>
          <div id="employee-nps-third-row">
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col sm="12" xs="12" className="px-5 mb-5">
          <h4>Are Women Employees Promoters?</h4>
          <div id="employee-nps-fourth-row">
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

class AnalyticsPeople extends Component {
  constructor(props) {
    super(props)

    let { location } = this.props
    this.draftData = location.state || null 
    this.state = {
      activeTopNav: 'analytics/people',
      activeSubNav: 'your-people'
    }
  }

  componentDidMount() {
    this.props._getCSV()
  }

  componentDidUpdate(prevProps) {
    let { activeTopNav } = this.state
    if (this.props.admin.data.uploadFileUrl[activeTopNav] !== prevProps.admin.data.uploadFileUrl[activeTopNav]) {
      this.renderChats(this.props.admin.data.uploadFileUrl[activeTopNav]);
    }
  }

  renderChats = (url) => {
    let { activeSubNav } = this.state
    switch(activeSubNav){
      case 'your-people':
        this.renderchart1(url);
        break;
      case 'top-performers':
        this.renderchart2(url);
        break;
      case 'employee-nps':
        this.renderchart3(url);
    }
  }

  renderchart1 = (url) => {
    let chart;
    url = appConstant.BASE_URL + url.replace('dist', '')
    d3.csv(url)
    .then(data => {
        chart = Chart()
        .container(['#vertical-stacked-bar-1', '#bubble-chart-2', '#horizontal-stacked-bar-1', '#horizontal-stacked-bar-2', '#employee-details-1'])
        .data(data)
        .initialData(data)
        .colors(["#75E2A0", "#E3E3FF", "#99B2FF", "#FFAE8D", "#FFEAAF"])
        .genderColors(['#C27EC0', '#B9B9B9'])
        .render()
    });
  }

  renderchart2 = (url) => {
    let chart;
    url = appConstant.BASE_URL + url.replace('dist', '')
    d3.csv(url)
    .then(data => {
        chart = ChartTopPer()
        .container(['#potential-heatmap', '#engagement-heatmap', '#dot-visualization', '#employee-performance-details'])
        .data(data)
        .initialData(data)
        .heatmapColors({ lowest: '#FCD7C7', highest: '#FC6222' })
        .dotColors({ performance: '#5352ED', potential: '#FF824E' })
        .genderColors({ female: '#C27EC0', male: '#B9B9B9' })
        .render()
    });
  }

  renderchart3 = (url) => {
    let chart;
    url = appConstant.BASE_URL + url.replace('dist', '')
    d3.csv(url)
    .then(data => {
      chart = ChartVisulization()
          .container(['#employee-nps-first-row', '#employee-nps-second-row', '#employee-nps-third-row', '#employee-nps-fourth-row'])
          .data(data)
          .bubbleChartColors({ total: '#E3E3FF', promoter: '#FF824E', passive: '#5352ED', detractor: '#B9B9B9' })
          .render()
    });
  }

  fetchCSV = (filename) => {
    this.props._get_CSV(filename);
  }

  selectSubNav = (navMenu) => {
    this.setState({
      activeSubNav: navMenu
    })
  }

  onChangeHandler = event => {
    this.uplaodCSV(event.target.files[0])
  }

  onResetHandler = () => {
    let { activeTopNav } = this.state
    if(this.props.admin.data.uploadFileUrl[activeTopNav])
      this.renderChats(this.props.admin.data.uploadFileUrl[activeTopNav]);
  }

  uplaodCSV = (file) => {
    let { activeTopNav } = this.state
    if(file) {
      const data = new FormData()
      data.append('file', file)
      this.props._upload_CSV(data, activeTopNav)
    }
  }

  render() {
    const { activeTopNav, activeSubNav } = this.state
    if(this.props.admin.data.uploadFileUrl[activeTopNav])
      this.renderChats(this.props.admin.data.uploadFileUrl[activeTopNav]);

    return (
      <Fragment>
        <NavBarSecondary 
          activeTopNav={activeTopNav}
          activeSubNav={activeSubNav}
          _selectSubNav={this.selectSubNav}
          _onChangeHandler={this.onChangeHandler}
          _resetHandler={this.onResetHandler}
        />
        <TabContent className="page-content mt-4" activeTab={this.state.activeSubNav}>
          <TabPane tabId="top-performers">
          { this.props.admin.data.uploadFileUrl[activeTopNav] &&
              <Row className="page-bg">
                <Col>
                  <ChartUI2 />
                </Col>
              </Row>
          }
          </TabPane>
          <TabPane tabId="your-people">
          { this.props.admin.data.uploadFileUrl[activeTopNav] &&
              <Row className="page-bg">
                <Col>
                  <ChartUI />
                </Col>
              </Row>
          }
          </TabPane>

          <TabPane tabId="employee-nps">
          { this.props.admin.data.uploadFileUrl[activeTopNav] &&
              <Row className="page-bg visulization">
                <Col>
                  <ChartUI3 />
                </Col>
              </Row>
          }
          </TabPane>
        </TabContent>
      </Fragment>
    )
  }
}

const mapStateToProps = ({ admin }) => ({
  admin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _getCSV   : getCSV,
      _upload_CSV   : upload_CSV,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsPeople)