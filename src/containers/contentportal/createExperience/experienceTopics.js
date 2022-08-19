import React, { Component, Fragment, useState, useRef, useEffect } from 'react';
import { Row, Col, Input, Form, Button, Label, FormGroup,Modal,ModalHeader,ModalBody } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import InputColor from 'react-input-color';
import SweetAlert from 'react-bootstrap-sweetalert';

import editIcon from '../../../assets/img/edit_icon.png'
import addIcon from '../../../assets/img/add_tag_icon.png'
import delIcon from '../../../assets/img/quiz/del-icon.png'
import { experiencesDefaultTopics, experienceTopicLinkType } from '../../../constants/appConstants'
import ReactColorPicker from '../../../component/ReactColorPicker'

const ExperienceTopics = (props) => {

    const [ defExperiences, SetDefExperiences ] = useState([]);
    const [isEditTopicModalShow, SetIsEditTopicModalShow] = useState(false);
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [isExpMinError, setIsExpMinError] = useState(false);
    const [isExpMaxError, setIsExpMaxError] = useState(false);

    useEffect(() => {
        SetDefExperiences(experiencesDefaultTopics);
    }, [])

    useEffect(() => {
        if(Object.keys(props.expDataByLink).length > 0 ) {
            let topicsData = props.expDataByLink.topics;
            topicsData.sort((a, b) => {
                return a.topic_id - b.topic_id
            })
            SetDefExperiences(props.expDataByLink.topics)
        }
    }, [props.expDataByLink])

    useEffect(() => {
        if(props._topics)
        props._topics(defExperiences);
    }, [defExperiences])

    const handleAddNewTopic = () => {
        let newTopic = {
            topic_name: 'new topic',
            topic_bgcolor: '#979797',
            topic_text_color: '#000000',
            topic_link: '',
            topic_link_type: null
        };
        if(defExperiences.length < 9) {
            SetDefExperiences(prevArray => [...prevArray, newTopic])
        } else {
            setIsExpMaxError(true);
        }
    }

    const handleEditTopic = (event, data, index) => {
        event.stopPropagation();
        SetIsEditTopicModalShow(true);
        setSelectedEditItem({
            index: index,
            topic: data
        });
    }


    const handleDelTopic = (event, index) => {
        event.stopPropagation();
        if(defExperiences.length !== 1) {
            let filterTopic = defExperiences.filter((data, i) => {
                return i != index;
            });
            SetDefExperiences(filterTopic);
        } else {
            setIsExpMinError(true);
        }
    }

    const toggleEditTopicModal = () => {
        if(isEditTopicModalShow) {
            SetIsEditTopicModalShow(false);
        } else {
            SetIsEditTopicModalShow(true);
        }
    }

    const onSaveHandler = (data, i) => {
        let editedExp = [...defExperiences];
        editedExp[i] = data;
        SetDefExperiences(editedExp);
        SetIsEditTopicModalShow(false);
    }

    const handleTopicLink = (event, link, linkType, isDraft) => {
        event.stopPropagation();
        if(isDraft) {
            if(!!link === true && props.reEdit) {
                props._handleTopicLink(link, linkType);
            }
        } else {
            props._handleTopicLink(link, linkType);
        }
    }

    return (
        <Fragment>
            <div className="exp-topics-wrapper mt-3">
                {!props.userView ?
                <Fragment>
                    <div className="topics">
                        <Row className="d-flex align-items-center justify-content-center">
                            {defExperiences.map((data, index) =>  {
                                return (
                                    <Col className="topic-col d-flex justify-content-center align-items-center my-3" style={{ cursor: !!data.topic_link ? 'pointer' : 'auto'}} key={index} sm={12} md={6} lg={4}>
                                        <div className="topic" style={{backgroundColor: data.topic_bgcolor, color: data.topic_text_color}}  onClick={(e) => handleTopicLink(e, data.topic_link, data.topic_link_type, true)}>
                                            <div className="topic-icons">
                                                <div className="topic-del-icon"onClick={(e) => handleDelTopic(e, index)}>
                                                    <img src={delIcon} width="14" />
                                                </div>
                                                <div className="topic-edit-icon" onClick={(e) => handleEditTopic(e, data, index)}>
                                                    <img src={editIcon} width="14" height="14" />
                                                </div>
                                            </div>
                                            <div className="topic-name">{data.topic_name}</div>
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>
                        <div className="new-topic-btn">
                            <Button className="btn btn-new-topic" onClick={handleAddNewTopic}><img src={addIcon} /></Button>
                        </div>
                        <ExperienceEditModal 
                            isModalShow={isEditTopicModalShow}
                            _toggle={toggleEditTopicModal}
                            _onSave={onSaveHandler}
                            _selectedEditItem={selectedEditItem} 
                        />
                    </div>
                </Fragment> : 
                <div className="topics">
                    <Row className="d-flex align-items-center justify-content-center">
                    {defExperiences.map((data, index) =>  {
                        return (
                            <Col className="topic-col d-flex justify-content-center align-items-center my-3" key={index} sm={12} md={6} lg={4}>
                                <div className="topic" style={{backgroundColor: data.topic_bgcolor, color: data.topic_text_color}} onClick={(e) => handleTopicLink(e, data.topic_link, data.topic_link_type, false)}>
                                    <div className="topic-name">{data.topic_name}</div>
                                </div>
                            </Col>
                        )
                    })}
                    </Row>
                </div>
            }
            </div>
            { isExpMaxError &&
                <SweetAlert
                danger
                title="Error!"
                onConfirm={() => {
                    setIsExpMaxError(false)
                }}
                >
                    Topics could not be more than 9
                </SweetAlert>
            }
            { isExpMinError &&
                <SweetAlert
                danger
                title="Error!"
                onConfirm={() => {
                    setIsExpMinError(false)
                }}
                >
                    Topic could not be less than 1
                </SweetAlert>
            }
        </Fragment>

        
    )

}

const ExperienceEditModal =({
    isModalShow,
    _toggle,
    _onSave,
    _selectedEditItem
}) =>  { 

    const [bgColor, setBgColor] = useState({});
    const [textColor, setTextColor] = useState({});
    const [ topicName, setTopicName ] = useState('');
    const [ topicFileLink, setTopicFileLink ] = useState('');
    const [ topicMicrositeLink, setTopicMicrositeLink ] = useState('');
    const [ initialBgColor, setInitialBgColor ] = useState('');
    const [ initialTextColor, setInitialTextColor ] = useState('');

    useEffect(() => {
        if(_selectedEditItem) {
            setTopicName(_selectedEditItem.topic.topic_name);
            console.log(_selectedEditItem.topic)
            if(_selectedEditItem.topic.topic_link != '') {
                if(_selectedEditItem.topic.topic_link_type === experienceTopicLinkType.fileLink) {
                    setTopicFileLink(_selectedEditItem.topic.topic_link);
                } else {
                    setTopicMicrositeLink(_selectedEditItem.topic.topic_link);
                }
            } else {
                setTopicFileLink('');
                setTopicMicrositeLink('');
            }
            setInitialBgColor(_selectedEditItem.topic.topic_bgcolor);
            setInitialTextColor(_selectedEditItem.topic.topic_text_color);
        }
    }, [_selectedEditItem])

    const onSave = () => {
        console.log(topicFileLink, topicFileLink)
        if((!!topicFileLink === true && !!topicMicrositeLink === true)) {
            alert('please enter either file link or microsite link');
            return false;
        }
        let topicData = {
            topic_name : topicName,
            topic_bgcolor: bgColor,
            topic_text_color: textColor,
            topic_link: topicFileLink !== '' ? topicFileLink : topicMicrositeLink,
            topic_link_type: topicFileLink !== '' ? experienceTopicLinkType.fileLink : experienceTopicLinkType.micrositeLink || null
        }
        _onSave(topicData, _selectedEditItem.index);
    }

    const changeTopicName = (e) => {
        setTopicName(e.target.value);
    }

    const changeTopicLink = (e, type) => {
        console.log(type, experienceTopicLinkType.fileLink)
        if(type === experienceTopicLinkType.fileLink) {
            setTopicFileLink(e.target.value);
        } else {
            setTopicMicrositeLink(e.target.value);
        }
    }

    return(
    <Modal 
        className={'modal-dialog-centered modal-edit-team-member'} 
        modalClassName={'modal-theme tzs-modal'} 
        isOpen={isModalShow} 
        toggle={_toggle}
    >
        <ModalHeader toggle={_toggle}>Edit journey step</ModalHeader>
        <ModalBody>
        <Form className="modal-theme-form edit-team-form">
            <div className="edit-team">
                <FormGroup>
                    <Label for="journeyName">Name</Label>
                    <Input type="text" name="journeyname" id="journeyName"  placeholder="Name of the buyer journey step based on your process" value={topicName} onChange={changeTopicName}  />
                </FormGroup>
                <FormGroup>
                    <Label for="fileLink">Link to a single file (pdf,slides or powerpoint)</Label>
                    <Input type="text" name="filelink" placeholder="https://docs.google.com/presentation/d/YYY" value={topicFileLink} onChange={(e) => changeTopicLink(e, experienceTopicLinkType.fileLink)} />
                </FormGroup>
                <FormGroup>
                    <Label for="or">Or,</Label>
                </FormGroup>
                <FormGroup>
                    <Label for="micrositeLink">Link to the microsite URL this topic should point to </Label>
                    <Input type="text" name="micrositeLink"  placeholder="https://yourcompany.teamzskill.com/microsites/xxx" value={topicMicrositeLink} onChange={(e) => changeTopicLink(e, experienceTopicLinkType.micrositeLink)} />
                </FormGroup>
                <FormGroup>
                    <div className="color-label" style={{position:'relative'}}>
                        <Label for="backgroungColor">Color Picker for the background</Label>
                        <Input type="text" name="bgColor" id="bg-color"  placeholder="#D8D8D8" value={bgColor} />  
                        {/* <InputColor 
                        style={{top:'-34px',left:'441px', height: '33px'}}
                        initialValue={initialBgColor}
                        onChange={setBgColor}
                        placement="right" /> */}
                        <ReactColorPicker initialValue={initialBgColor} _selectedColor={(color) => setBgColor(color)} />
                    </div>    
                </FormGroup>
                <FormGroup>
                    <Label for="text-color">Color Picker for the text</Label>
                    <div className="color-label" style={{position:'relative'}}>
                        <Input type="text" name="textColor" id="text-color"  placeholder="#D8D8D8" value={textColor} />
                        {/* <InputColor 
                        style={{top:'-34px',left:'441px', height: '33px'}}
                        initialValue={initialTextColor}
                        onChange={setTextColor}
                        placement="right" /> */}
                        <ReactColorPicker initialValue={initialTextColor} _selectedColor={(color) => setTextColor(color)} />
                    </div>
                </FormGroup>
            </div>

            <div className="form-actions d-flex justify-content-around">
            <Button className="btn-cancel" data-dismiss="modal" onClick={_toggle}>Cancel</Button>
            <Button className="btn-theme" onClick={onSave}>Save</Button>
            </div>
        </Form>
        </ModalBody>
    </Modal>
    )
}

const mapStateToProps = ({ experiences }) => ({
    ...experiences
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
)(ExperienceTopics)