import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Input } from 'reactstrap'

import userEdit from '../../../assets/img/user-edit.png'
import { set_work_highlights, get_work_highlights } from '../../../actions/user'

import { workHighlightsConstants } from '../../../constants/storeConstants'
import WorkHighlightsCommon from '../../../component/common/workHighlights'

class WorkHighlights extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      isError: false
    }
  }

  handleEdit = () => {
    this.prevState = this.props.profileUpdates.workHighlights;
    this.props._editing_work_highlights()
  }

  handleCancel = () => {
    this.setState({
      isError: false
    })
    if(this.prevState === undefined) {
      // get workhighlights from server
      this.props._get_work_highlights()
      return
    }

    this.props._cancel_edit_work_highlights(this.prevState)

  }

  handleChange = (e, type) => {
    this.validateForm(e.target.value)
    this.props._edit_work_highlights(e.target.value)
    
  }

  handleSave = () => {
    let { workHighlights } = this.props.profileUpdates
    if(this.validateForm(workHighlights)) {
      let data = {
        highlights: workHighlights
      }
      this.props._set_work_highlights(data)
    }
  }

  validateForm = (workHighlights) => {
    let isValid = false
    if(workHighlights.length > 0) {
      isValid = true
    }
    this.setState({
      isError: !isValid
    })
    return isValid
  }

  renderUpdateButton = () => {
    let { isWHEditMode } = this.props.profileUpdates
    if(isWHEditMode){
      return (
        <span className="actionBtn clearfix">
            <Button className="btn-theme" onClick={this.handleSave}>Save</Button>
            <Button className="btn-theme" onClick={this.handleCancel}>Cancel</Button>
        </span>
      )
    } else {
      return (
        <a href="javascript:void(0)" onClick={this.handleEdit}><img src={userEdit} alt="" /></a>
      )
    }
  }

  render() {
    let { isError } = this.state
    let { profileUpdates, viewMode } = this.props
    let errorBorder = (isError)? 'tsz-border-invalid': ''
    let workHighlights = profileUpdates.workHighlights;
    return (
      <div className="work-high">
          {/* <div className="work-box">
            <Input id="workHighlights" className={errorBorder} type="textarea" name="workHighlights" value={profileUpdates.workHighlights} onChange={(e) => this.handleChange(e, "workHighlights")} disabled={!profileUpdates.isWHEditMode} invalid={isError} placeholder={workHighlightPlaceholder.workHighlights} />
            { isError &&
            <span className={'tsz-error-msg'}>{errorMsg}</span>
            }
          </div> */}
          <WorkHighlightsCommon errorBorder={errorBorder} workHighlights={workHighlights} isError={isError} profileUpdates={profileUpdates} _edit_work_highlights={this.props._edit_work_highlights} _validateForm={this.validateForm} _renderUpdateButton={this.renderUpdateButton}/>
      </div>
    )
  }
}

const mapStateToProps = ( state ) => ({
  profileUpdates: state.profileUpdates,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_work_highlights: get_work_highlights,
      _set_work_highlights: set_work_highlights,
      _editing_work_highlights: () => dispatch({
        type: workHighlightsConstants.EDITING_WORK_HIGHLIGHTS
      }),
      _edit_work_highlights: (val) => dispatch({
        type: workHighlightsConstants.EDIT_WORK_HIGHLIGHTS,
        payload: val
      }),
      _cancel_edit_work_highlights: (val) => dispatch({
        type: workHighlightsConstants.CANCEL_EDITING_WORK_HIGHLIGHTS,
        payload: val
      })
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkHighlights)
