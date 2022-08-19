// This component is for testing purpose so could not connect with backend for any operation.

import React, {Component, Fragment} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import cloneDeep from 'clone-deep'
import { Row, Col, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';

import Can from '../../component/Can'
import { getUserRoleName } from '../../transforms'
import { add_level, edit_level, delete_level } from '../../actions/careerLadder'
import { ConfirmationBox } from '../../component/ConfirmationBox'

const routeResource = "COMPONENT"
const levelDetailFixturer = [{
  label: 'Experience',
  content: ''
},
{
  label: 'Execution',
  content: ''
},
{
  label: 'Craftmanship',
  content: ''
},
{
  label: 'Leadership',
  content: ''
}]

const SubHeader = ({
  isShow,
  careerPathOptions,
  currentCareerPath,
  hideAddButton,
  hideDelButton,
  _toggleInput,
  _onChange,
  _addLevel,
  _deleteLevel
}) => {
  let showAddButton = hideAddButton? 'hide' : 'show',
      showDelButton = hideDelButton? 'hide' : 'show'
  return (
    <Fragment>
      <Col sm="6" className={'pl-0 pr-0'}>
        <Form className={'col-9 p-2 '}>
          <div className={`admin-feedback-group ${isShow}`}>	
            <Input id="sizevalue" placeholder="Please select professional career path" size="15" name="size" type="text" value={currentCareerPath.name} onChange={()=>console.log('')} />
            <a href="javascript:void(0)"className="fa fa-caret-down caret-btn" onClick={_toggleInput}></a>
            <ul className="feedback-list animated fadeInUp" id="sizelist">
              {
                careerPathOptions.map((option, i) => (
                  <li key={`cp-opt-${i}`} className="dropdown-item" >
                    <a href="javascript:void(0)" onClick={()=>_onChange(option)} >{option.name}</a>
                  </li>    
                ))
              }
            </ul>
          </div>
        </Form>
      </Col>

      <Can
        role={getUserRoleName()}
        resource={routeResource}
        action={"GROW:CARRERPATH:ACTIONS"}
        yes={(attr) => (
          <Col sm="6" className={'ts-career-btns'}>
            <div className={`btn btn-theme ts-add-level-btn ${showAddButton}`} onClick={_addLevel}>
              Add Level
            </div>
            <div className={`btn btn-theme ts-del-level-btn ${showDelButton}`} onClick={_deleteLevel}>
              Delete Level
            </div>
          </Col>
        )}
        no={() => (
          null
        )}
      />
    </Fragment>
  )
}

const LevelModal = ({
  isModalShow,
  level,
  levelDetails,
  isReadMode,
  _toggle,
  _onChange,
  _onSave,
  _changeMode,
  _addAnotherDetail
}) => (
  <Modal 
    className={'modal-dialog-centered'} 
    modalClassName={'modal-theme tzs-modal'} 
    id={'levelModal'}
    isOpen={isModalShow} 
    toggle={_toggle}
  >
    <ModalHeader toggle={_toggle}>
      {isReadMode ?
        `${level.level_title} - ${level.level_label}`
        :
        <Form>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label>Level Title</Label>
                <Input type="text" value={level.level_title} onChange={_onChange} name={'level_title'} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Level</Label>
                <Input type="text" value={level.level_label} onChange={_onChange} name={'level_label'}  />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      }
    </ModalHeader>
    <ModalBody>
      <Form className="modal-theme-form">
        {levelDetails && levelDetails.map((data, index) => {
          return (
            <FormGroup key={`careerDetail-${index}`}>
              
              {isReadMode?
              <Label placeholder="label">{data.label}</Label>
              :
              <Label>
                <Input 
                  type="text" 
                  placeholder="label"
                  data-index={index} 
                  name={'label'} 
                  value={data.label}
                  onChange={_onChange} />
              </Label>
              }

              <Input 
                type="textarea" 
                placeholder={'content'}
                data-index={index}
                name={'content'} 
                value={data.content} 
                onChange={_onChange} 
                disabled={isReadMode} />
            </FormGroup>    
          )
        })}

        { !isReadMode &&
          <div>
            <a href="javascript:void(0)" className="btn btn-link" onClick={_addAnotherDetail}>+ Add Details</a>
          </div>
        }

        <Can
          role={getUserRoleName()}
          resource={routeResource}
          action={"GROW:CARRERPATH:ACTIONS"}
          yes={(attr) => (
            <div className="form-actions full-form-actions">
              <button type="button" className="btn btn-gray" onClick={_toggle}>Cancel</button>
              
              {isReadMode ? 
              <button type="button" className="btn btn-theme" onClick={_changeMode}>Edit</button>
              :
              <button type="button" className="btn btn-theme" onClick={_onSave}>Save</button>
              }

            </div>
          )}
          no={() => (
            null
          )}
        />
      </Form>
    </ModalBody>
  </Modal>
)

class CareerLadderContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isInputOpen: false,
      currentCareerPath: this.props.careerLadder.careerPathOptions[0],
      hideAddButton: false,
      hideDelButton: false,
      isModalShow: false,
      openConfirmationBox: false,
      isReadMode: true,
      currentLevel: {},
      previousLevelData: {}
    }
  }

  togglePathInput = () => {
    this.setState({
      isInputOpen: !this.state.isInputOpen
    })
  }

  onPathChange = (option) => {
    this.setState({
      currentCareerPath: option
    })
    this.togglePathInput()
  }

  addCareerLadderLevel = () => {
    let nextLevel = {}
    let careerObj = this.getSelectedPathLevels()
    let careerData = careerObj.data
    let cp_id = careerObj.cp_id
    let careerDataIndex = this.props.careerLadder.careerLadderData.findIndex(v => v.cp_id === cp_id)
    let lastRow = careerData[careerData.length-1]

    // validate max records
    if(lastRow.level_no >= this.props.careerLadder.maxLadderSteps){
      // alert("User can add max " + this.props.careerLadder.maxLadderSteps + " levels");
      this.setAddButton(true)
      return
    }

    this.setDelButton(false)
    nextLevel.level_no = lastRow.level_no + 1
    nextLevel.level_label = lastRow.level_label
    nextLevel.level_title = lastRow.level_title
    nextLevel.details = levelDetailFixturer
    careerData.push(nextLevel)
    careerObj.data = careerData
    this.props._add_level(careerObj, careerDataIndex)
  }

  deleteCareerLadderLevel = () => {
    let careerObj = this.getSelectedPathLevels()
    let careerData = careerObj.data
    let cp_id = careerObj.cp_id
    let careerDataIndex = this.props.careerLadder.careerLadderData.findIndex(v => v.cp_id === cp_id)
    let lastRow = careerData[careerData.length-1]

    // validate min records
    if(lastRow.level_no <= this.props.careerLadder.minLadderSteps){
      // alert("User can add max " + this.props.careerLadder.maxLadderSteps + " levels");
      this.setDelButton(true)
      return
    }
    this.setAddButton(false)
    careerData.pop()
    careerObj.data = careerData
    this.props._delete_level(careerObj, careerDataIndex)
  }

  closeConfBox = () => {
    this.setState({openConfirmationBox: false})
  }

  deleteLevelConfirmation = () => {
    this.closeConfBox()
    this.deleteCareerLadderLevel()
  }

// Level Modal callbacks start
  editLevel = (level, index) => {
    let current_cp_id = this.state.currentCareerPath.id
    this.setState({
      currentLevel: { index },
      isModalShow: true,
      previousLevelData: cloneDeep(this.props.careerLadder.careerLadderData[current_cp_id].data[index])
    })
  }

  toggleLevelModal = () => {

    // reset to previous state on cancel 
    let careerLadder = cloneDeep(this.props.careerLadder)
    let { currentCareerPath, currentLevel} = this.state
    careerLadder.careerLadderData[currentCareerPath.id].data[currentLevel.index] = this.state.previousLevelData

    this.props._edit_level(careerLadder.careerLadderData)

    this.setState(prevState => ({
      isModalShow: !prevState.isModalShow,
      previousLevelData: {},
      currentLevel: {},
      isReadMode: true
    }));
  }

  onChangeLevelDetails = (e) => {
    let { value, name } = e.target;
    let targetIndex = e.target.getAttribute('data-index')

    let { currentCareerPath, currentLevel } = this.state
    let current_cp_id = currentCareerPath.id
    let careerLadder = cloneDeep(this.props.careerLadder)

    careerLadder.careerLadderData.map((ladderData, index) => {
      if(ladderData.cp_id === current_cp_id) {
        if(targetIndex)
          ladderData.data[currentLevel.index].details[targetIndex][name] = value
        else
          ladderData.data[currentLevel.index][name] = value
      }
    })

    this.props._edit_level(careerLadder.careerLadderData)

  }

  addAnotherLevelDetail = () => {
    let newDetails = {
      label: '',
      content: ''
    }
    let { currentCareerPath, currentLevel } = this.state
    let current_cp_id = currentCareerPath.id
    let careerLadder = cloneDeep(this.props.careerLadder)

    careerLadder.careerLadderData.map((ladderData, index) => {
      if(ladderData.cp_id === current_cp_id) {
        ladderData.data[currentLevel.index].details.push(newDetails)
      }
    })
    this.props._edit_level(careerLadder.careerLadderData)
  }

  changeLevelModalMode = () => {
    this.setState({
      isReadMode: false
    })
  }

  onSaveLevelDetails = () => {
    // TODO: API call to save data
    this.setState(prevState => ({
      isModalShow: !prevState.isModalShow,
      previousLevelData: {},
      currentLevel: {},
      isReadMode: true
    }));
  }
// Level Modal callbacks ends 

  setAddButton = (state) => {
    this.setState({
      hideAddButton: state
    })
  }
  setDelButton = (state) => {
    this.setState({
      hideDelButton: state
    })
  }

  getSelectedPathLevels = () => {
    let careerData = []
    let { currentCareerPath } = this.state
    let careerLadder = cloneDeep(this.props.careerLadder)
    
    // get ladder data based on currentCareerPath
    let careerDetails = careerLadder.careerLadderData.filter((data, index) => {
      return (data.cp_id === currentCareerPath.id)})
    if(careerDetails.length > 0)
      careerData = careerDetails[0]

    return careerData
  }

  render() {
    let { isInputOpen, currentCareerPath, hideAddButton, hideDelButton, isModalShow, currentLevel, isReadMode, openConfirmationBox } = this.state
    let { careerLadder } = this.props
    let show = isInputOpen? 'show' : ''
    let careerData = this.getSelectedPathLevels().data || []

    return (
      <div className={'txz-career'}>
        <Row className={'mt-4 m-0'}>
          <SubHeader 
            isShow={show} 
            careerPathOptions={careerLadder.careerPathOptions} 
            currentCareerPath={currentCareerPath}
            hideAddButton={hideAddButton}
            hideDelButton={hideDelButton}
            _toggleInput={this.togglePathInput} 
            _onChange={this.onPathChange}
            _addLevel={this.addCareerLadderLevel}
            _deleteLevel={()=>this.setState({openConfirmationBox: true})}
          />

        </Row>
        <Row className={'mt-4 m-0'}>
          <Col md="12" className="pl-0 pr-0">
            <div className="page-content">
                <div className="barchart-scroll">
              <div className="barchart-group">
                  <div className="barchart-content">

                    {careerData && careerData.map((level, index) => (
                      <div key={`c-level-${index}`} className={`barchart-single level${level.level_no}`}>
                        <div className="barchart-single-group">
                          <div className="level-btn-group" onClick={()=>this.editLevel(level, index)}>
                            <div className="level-btn">
                              <div className="level-id">{level.level_label}</div>
                              <div className="level-content">{level.level_title}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) }
                    
                  </div>
                </div>
              </div>
            </div>

            {currentLevel.index >= 0 &&
              <LevelModal
                isModalShow={isModalShow}
                level={careerData[currentLevel.index]}
                levelDetails={careerData[currentLevel.index].details}
                isReadMode={isReadMode}
                _toggle={this.toggleLevelModal}
                _onChange={this.onChangeLevelDetails}
                _onSave={this.onSaveLevelDetails}
                _changeMode={this.changeLevelModalMode}
                _addAnotherDetail={this.addAnotherLevelDetail}
              />
            }
            <ConfirmationBox 
              title="Confirmation"
              bodyText="You want to delete Level?"
              isOpen={openConfirmationBox}
              _toggle={this.closeConfBox}
              _confirmed={this.deleteLevelConfirmation}
            />

          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = ({ careerLadder }) => ({
  careerLadder
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _add_level    : add_level,
      _edit_level   : edit_level,
      _delete_level : delete_level
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CareerLadderContainer)
