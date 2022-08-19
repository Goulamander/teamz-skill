import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Button, Input } from 'reactstrap'
import moment from 'moment'
import 'react-day-picker/lib/style.css';

import {get_weekly_updates, set_weekly_updates, cancel_edit_weekly_update, edit_weekly_update} from '../../../actions/user'
import calendar from '../../../assets/img/calendar.png'
import closeCal from '../../../assets/img/close.png'
import rocketImg from '../../../assets/img/rocket.png'
import cutImg from '../../../assets/img/cut.png'
import usersImg from '../../../assets/img/users.png'
import chalkboardTeacherImg from '../../../assets/img/chalkboard-teacher.png'
import WeekPicker from  '../../../component/WeekPicker'
import { weeklyUpdatesConstants } from '../../../constants/storeConstants'
import { weeklyUpdatesPlaceholder } from '../../../constants/appConstants'
import { getWeekRange, getWeekDays } from '../../../transforms'

class WeeklyUpdates extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      openCal: false,
      validationError: {
        execution: false,
        craftsmanship: false,
        leadership: false,
        mentoring: false
      }
    }
    // Set selected days in store, if not selected
    if(this.props.profileUpdates.selectedDays.length === 0) {
      let date = new Date();
      this.props._set_selected_days(getWeekDays(getWeekRange(date).from))
    }
  }

  componentDidMount() {
    if(!this.props.profileUpdates.isWUEditMode)
      this.getWeeklyUpdates()
  }

  getWeeklyUpdates = () => {
    let from_date = moment().startOf('week');
    let to_date = moment().endOf('week');
    let { selectedDays } = this.props.profileUpdates

    if(selectedDays.length) {
      from_date = moment(selectedDays[0]);
      to_date = moment(selectedDays[6])
    }

    this.performAPI(from_date.toDate(), to_date.toDate())
  }

  resetValidationError = () => {
    let vErr = {
      execution: false,
      craftsmanship: false,
      leadership: false,
      mentoring: false
    }
    this.setState({
      validationError: vErr
    })
  }

  performAPI = (startDate, endDate) => {
    this.props._get_weekly_updates(moment(startDate).format(), moment(endDate).format())
  }

  handleChange = (e, type) => {
    let { validationError } = this.state
    let { profileUpdates } = this.props
    profileUpdates[type] = e.target.value
    
    // Test Required validation
    if(e.target.value.length === 0) {
      validationError[type] = true
    } else {
      validationError[type] = false
    }

    this.setState({
      validationError: validationError
    })

    this.props._edit_weekly_update(profileUpdates)

  }

  handleWeeklyEdit = () => {
    this.prevWeeklyState = Object.assign({}, this.props.profileUpdates);
    this.props._editing_weekly_updates()
  }

  handleWeeklySave = () => {
    if(this.isValidate() === 'YES'){

      let data = {
        ...this.props.profileUpdates,
        start_date: this.getStartDate()
      }
      
      this.props._set_weekly_updates(data)
    }
  }

  handleWeeklyCancel = () => {

    this.resetValidationError()

    if(this.prevWeeklyState === undefined) {
      // get workhighlights from server
      this.getWeeklyUpdates()
      return
    }

    let prevData = {
      execution: this.prevWeeklyState.execution,
      craftsmanship: this.prevWeeklyState.craftsmanship,
      leadership: this.prevWeeklyState.leadership,
      mentoring: this.prevWeeklyState.mentoring,
      isWUEditMode: false
    }
    this.props._cancel_edit_weekly_update(prevData)

  }
  
  toogleCal = () => {
    this.setState(previousState => ({
      openCal: !previousState.openCal
    }))
  }

  closeCal= () => {
    console.log("closeCal");
  }

  date_change = (dates) => {
    this.props._set_selected_days(dates)
    if(dates[0] && dates[6])
      this.performAPI(dates[0], dates[6])
  }

  renderWeekInterval = () => {
    let from_date = moment().startOf('week');
    let to_date = moment().endOf('week');
    let { selectedDays } = this.props.profileUpdates

    if(selectedDays.length) {
      from_date = moment(selectedDays[0]);
      to_date = moment(selectedDays[6])
    }

    return <span>{`${from_date.format("MMM")} ${from_date.format("DD")} - ${to_date.format("MMM")} ${to_date.format("DD")}`}</span>
  }

  renderUpdateButton = (disable) => {
    let { isWUEditMode } = this.props.profileUpdates
    if(isWUEditMode){
      return (
        <div className="d-inline-block">
          <Button className="btn-theme" onClick={this.handleWeeklyCancel}>Cancel</Button>
          <Button className="btn-theme" onClick={this.handleWeeklySave}>Save</Button>
        </div>
      )
    } else {
      return (
        <Button className="btn-theme" onClick={this.handleWeeklyEdit} disabled={disable}>Update Weekly</Button>
      )
    }
  }

  render() {
    let { openCal, validationError } = this.state
    let { profileUpdates } = this.props
    let { isWUEditMode, selectedDays } = this.props.profileUpdates
    let allowedUpdate = false;
    let calendarIcon = openCal? closeCal : calendar
    let curWeekNumber = moment().isoWeek();
    let selectedWeekNumber = curWeekNumber;
    // let to_date = moment().endOf('week');
    let allowedDays = 12;
    if(selectedDays[3]) {
      selectedWeekNumber = moment(selectedDays[3]).isoWeek()
    }
    // Allow update for this week
    if(curWeekNumber === selectedWeekNumber) {
      allowedUpdate = true
    } else if (curWeekNumber-1 === selectedWeekNumber) {
      // last week
      let toDate = moment();
      let fromDate = moment(selectedDays[0]);
      let diff = moment.duration(toDate.diff(fromDate)).asDays()

      if( diff < allowedDays ) {
        allowedUpdate = true
      }
    }
    return (
      <div className="weekly-box">
        <Row>
          <Col sm="4">
            <h4 className="common-head">Weekly update</h4>
          </Col>

          <Col sm="8" className="text-right weekly-calendar" style={{'position': 'relative'}}>
            <div className="weekly-right">
              

              <div className="landing-btns">
                {this.renderWeekInterval()}
                <a onClick={this.toogleCal}><img src={calendarIcon} alt="calendar img" /></a>
                {allowedUpdate ? this.renderUpdateButton(false) : this.renderUpdateButton(true)}
              </div>

              { openCal && 
                <div id="tzsDatePicker" style={{'top': '40px','right': '39px'}}>
                  <WeekPicker selectedDays={selectedDays} onChange={this.date_change} onBlur={this.closeCal} />
                </div>
              }

            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <div className="card update-text">
              <div className="row no-gutters">
                <div className="update-text-theme">
                  <div className="update-text-img">
                    <img src={rocketImg} className="card-img" alt="..." />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Execution</h5>
                    {(isWUEditMode)?
                      <Input className="card-text-default" type="textarea" onChange={(e) => this.handleChange(e, 'execution')} value={profileUpdates.execution} invalid={validationError.execution} placeholder={weeklyUpdatesPlaceholder.execution} />
                      :
                      (profileUpdates.execution.length === 0)?
                        <p className="card-text-default">{weeklyUpdatesPlaceholder.execution}</p>
                        :
                        <p className="card-text">{profileUpdates.execution}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <div className="card update-text">
              <div className="row no-gutters">
                <div className="update-text-theme">
                  <div className="update-text-img">
                    <img src={cutImg} className="card-img" alt="..." />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Craftsmanship</h5>
                    {(isWUEditMode)?
                      <Input className="card-text-default" type="textarea" value={profileUpdates.craftsmanship} onChange={(e) => this.handleChange(e, 'craftsmanship')} invalid={validationError.craftsmanship} placeholder={weeklyUpdatesPlaceholder.craftsmanship} />
                      :
                      (profileUpdates.craftsmanship.length === 0) ? 
                      <p className="card-text-default">{weeklyUpdatesPlaceholder.craftsmanship}</p>
                      :
                      <p className="card-text">{profileUpdates.craftsmanship}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="12">
            <div className="card update-text">
              <div className="row no-gutters">
                <div className="update-text-theme">
                  <div className="update-text-img">
                    <img src={usersImg} className="card-img" alt="..." />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Leadership</h5>
                    {(isWUEditMode)?
                      <Input className="card-text-default" type="textarea" value={profileUpdates.leadership} onChange={(e) => this.handleChange(e, 'leadership')} invalid={validationError.leadership} placeholder={weeklyUpdatesPlaceholder.leadership} />
                      :
                      (profileUpdates.leadership.length === 0) ? 
                        <p className="card-text-default">{weeklyUpdatesPlaceholder.leadership}</p>
                        :
                        <p className="card-text">{profileUpdates.leadership}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="12">
            <div className="card update-text">
              <div className="row no-gutters">
                <div className="update-text-theme">
                  <div className="update-text-img">
                    <img src={chalkboardTeacherImg} className="card-img" alt="..." />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Mentoring</h5>
                    {(isWUEditMode)?
                      <Input className="card-text-default" type="textarea" value={profileUpdates.mentoring} onChange={(e) => this.handleChange(e, 'mentoring')} invalid={validationError.mentoring} placeholder={weeklyUpdatesPlaceholder.mentoring} />
                      :
                      (profileUpdates.mentoring.length === 0) ?
                      <p className="card-text-default">{weeklyUpdatesPlaceholder.mentoring}</p>
                      :
                      <p className="card-text">{profileUpdates.mentoring}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
      </div>
    )
  }

  getStartDate = () => {
    let { selectedDays } = this.props.profileUpdates
    let from_date = moment().startOf('week');
    let start_date = from_date.format()
    if(selectedDays[0]) {
      start_date = moment(selectedDays[0]).format()
    }
    return start_date
  }
  isValidate = () => {
    let { validationError } = this.state
    let { profileUpdates } = this.props
    let isValid = 'YES'

    Object.keys(validationError).map((value, key) => {
      if(profileUpdates[value] === ""){
        validationError[value] = true
        isValid = 'No'
      }    
    })

    this.setState({
      validationError: validationError
    })
    return isValid
  }
}

const mapStateToProps = ( state ) => ({
  profileUpdates: state.profileUpdates,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _update_date: (date) => {dispatch({
        type: weeklyUpdatesConstants.WEEK_CHANGE,
        payload: date
      })},
      _editing_weekly_updates: () => dispatch({
        type: weeklyUpdatesConstants.EDITING_WEEKLY_UPDATE
      }),
      _set_selected_days: (days) => dispatch({
        type: weeklyUpdatesConstants.SELECTED_DAYS,
        payload: days
      }),
      _get_weekly_updates         : get_weekly_updates,
      _set_weekly_updates         : set_weekly_updates,
      _cancel_edit_weekly_update  : cancel_edit_weekly_update,
      _edit_weekly_update         : edit_weekly_update
    },
    
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeeklyUpdates)
