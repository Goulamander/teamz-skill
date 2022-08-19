import React, { useState, useEffect }  from 'react';
import { bindActionCreators } from 'redux'
import { Row, Col, Input, Form, Button, Label } from 'reactstrap';
import { connect } from 'react-redux'
import styled from 'styled-components'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import SweetAlert from 'react-bootstrap-sweetalert';

import { ConfirmationBox } from '../../../component/ConfirmationBox'
import SelectTable from '../../../component/SelectTable'
import { getUserRoleName, checkContentRowSelected, getRandomColor } from '../../../transforms'
import { appConstant } from '../../../constants/appConstants'
import defaultPP from '../../../assets/img/profile_default.png'
import expandIcon from '../../../assets/img/expandIcon.png'
import Can from '../../../component/Can'
import { ROUTES } from '../../../constants/routeConstants'
import { get_gdrive_content, get_popular_content_tags, add_tags_to_content, delete_contents, add_content_to_portal } from '../../../actions/contentPortal'
import delIcon from '../../../assets/img/quiz/del-icon.png'
import crossIcon from '../../../assets/img/crossIcon.png'
import AddTagIcon from '../../../assets/img/add_tag_icon.png'
import AddTagsBtnIcon from '../../../assets/img/add_tags_btn_icon.png'
import contentAdded from '../../../assets/img/stepcomplete.png'

const routeResource = "COMPONENT"   

const Styles = styled.div`
  padding: 1rem 0 1rem 0;

  table {
    border-spacing: 0;
    width: 100%;
    
    .table-header-analytics{
      background-color: #ffffff;
      
      .th-completion {
        margin-bottom: 0;
        margin-left: -30px;
        margin-right: 30px;
      }
    }
    tr {
       
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    & .table-content-analytics{
      box-shadow: none;
      td{
        :first-child {
          width: 107px;
        }
        :nth-child(2) {
          max-width: 240px;
        }
        padding-right: 25px;
        padding-left: 25px;
        line-height: 30px;
        
        .custom-multi-progress {
          margin-left: -30px;
        }
      }
      .cell-index {
        margin-bottom: 0
      }
      .tags {
        border-radius: 50px;
        padding: 0px 12px;
        font-size: 14px;
        text-align: center;
        color: #191919;
        white-space: nowrap; 
        width: 120px; 
        overflow: hidden;
        text-overflow: ellipsis; 
      }
      .doc-text {
        font-size: 14px;
        white-space: nowrap; 
        width: 240px; 
        overflow: hidden;
        text-overflow: ellipsis; 
      }
      &.selected-row, &:hover {
        background-color: #feefe9;
        
        .cell-index {
          display: none;
        }
        .select-row-input {
          display: flex !important;
          justify-content: space-between;
          align-items: center;

          .expand-btn {
            max-width: 30px;
            max-height: 30px;
            cursor: pointer;
            img {
              max-width: 100%;
              max-height: 100%;
              vertical-align: top;
            }
          }
        }
      }
    }

    th{
      font-size: 16px;
      font-weight: 700;
      color: #181818;
      border-bottom: 5px solid #edeffd!important;
      border-top: none;
      padding: 10px 25px 10px 25px!important;

      .fa {
        width: 40px;
        text-align: center;
        line-height: 38px;
        font-size: 24px;
        color: #5352ed;
        transition: all 0.3s ease-out;
        cursor: pointer
      }
      & .disable{
        color: #d2d6db;
      }
      .fa.fa-caret-down:before {
        content: "\f0d7";
      }
      .fa-caret-up:before {
        content: "\f0d8";
      }
    }
    td {
      font-size: 16px;
      font-weight: 400;
      vertical-align: middle;
      border-bottom: none;
      border-top: none!important;
      border-right: none;
      border-bottom: 5px solid #edeffd!important;
      line-height: 40px;
    }
  }
`

const columns = [
    {
      Header: ({ getToggleAllRowsSelectedProps, isAllRowsSelected, selectedFlatRows }) => {
        return (
        <div>
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        </div>
        )
      },
      accessor: 'index',
      disableSortBy: true,
      Cell: ({row, handleExpandClick, selectedFlatRows}) => {
        let isSelected = checkContentRowSelected(row, selectedFlatRows)
        return (
        <div className="d-flex">
          <p className={classnames({"cell-index": true, "d-none": isSelected})}>{row.index+1}</p>
          <div className={classnames({"select-row-input":true, "d-none" : !isSelected})}>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()}/>
            { row.original.is_content_added ?
              <div className="expand-btn ml-3" title="Added" onClick={() => handleExpandClick(row)}><img src={contentAdded} width="25" height="25" /></div> : ''
            }
          </div>
      </div>)},
    },
    {
      Header: 'Name',
      id: "link",
      disableSortBy: true,
      accessor: 'docName',
      Cell: ({ row }) => 
      <div className="d-flex align-items-center">
        <img src={row.original.doc_icon_url} />
        <a className="ml-3 doc-text" href={row.original.doc_url} target="blank">{row.original.doc_name}</a>
      </div>
    },
    {
      Header: 'Content Tag',
      accessor: 'contentTag',
      disableSortBy: true,
      id: 'contentTag',
      Cell: ({ row }) => {
        return (row.original.content_tags ? row.original.content_tags.length > 0 ? row.original.content_tags.map((val, index) => {
            return (
                <div className="tags mt-1" style={{backgroundColor: val.tag_color}} key={index}>{val.tag_name}</div>
            )
        }) : <div className="tags" style={{backgroundColor: '#EEEEEE'}}>None</div> : '')
      }, 
    },
    {
      Header: 'Permission',
      accessor: 'permission',
      disableSortBy: true,
      Cell: ({ row }) => ''
    },
    {
      Header: 'When to Share',
      accessor: 'contentStageTag',
      disableSortBy: true,
      Cell: ({ row }) => {
        return row.original.content_stage_tags ? row.original.content_stage_tags.map((val, index) => {
            return (
                <div className="tags mt-1" style={{backgroundColor: val.tag_color}} key={index}>{val.tag_name}</div>
            )
        }) : ''
      },
    }
  ]

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, handleExpandedClick, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)   

export const ContentPicker = (props) => {

    const [gDriveData, SetgDriveData] = useState([]);
    const [selectedCustomTags, SetSelectedCustomTags] = useState([]);
    const [selectedCustomStageTags, SetSelectedCustomStageTags] = useState([]);
    const [popularTags, SetPopularTags] = useState({});
    const [isContentRowSelected, setIsContentRowSelected] = useState(false);
    const [selectedContentRows, setSelectedContentRows] = useState([]);
    const [openConfirmationBox, setOpenConfirmationBox] = useState(false);
    const [isAddTag, setIsAddTag] = useState(false);
    const [newContentTagText, SetNewContentTagText] = useState('');
    const [newContentStageTagText, SetNewContentStageTagText] = useState('');
    const [addTagError, SetaddTagError] = useState(false);
    const [isContentAddedSuccess, SetIsContentAddedSuccess] = useState(false);
    const [isContentDeleteErr, SetIsContentDeleteErr] = useState(false);

    useEffect(() => {
      props._get_gdrive_content();
      props._get_popular_content_tags();
    }, [])

    useEffect(() => {
      if(props.gDriveContent.length)
      SetgDriveData(props.gDriveContent)
    }, [props.gDriveContent])

    useEffect(() => {
      SetPopularTags(props.popularContentTag)
    }, [props.popularContentTag])

    const handleContentSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(props.gDriveContent.length > 0) {
          SetgDriveData(props.gDriveContent)
        } else {
          SetgDriveData([])
        }
        return false
      }

      let filteredData = props.gDriveContent.filter(data => {
        if(data.doc_name != null)
        return data.doc_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
      })

      if(filteredData.length > 0) {
        SetgDriveData(filteredData)
      } else {
        SetgDriveData([])
      }
    }

    const handleDataModifySearch = (e) => {

    }

    const handleContentTagSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(props.gDriveContent.length > 0) {
          SetgDriveData(props.gDriveContent)
        } else {
          SetgDriveData([])
        }
        return false
      }

      let filteredData = getFilteredContentTags(searchTxt.toLowerCase(), props.gDriveContent);

      if(filteredData.length > 0) {
        SetgDriveData(filteredData)
      } else {
        SetgDriveData([])
      }
    }

    const getFilteredContentTags = (searchTxt, contentsData) => {
      let filteredContent = [];
      contentsData.forEach(content => {
        if(content.content_tags != null || content.content_tags != undefined) {
          content.content_tags.forEach(data => {
            if(!!data.tag_name === true) {
              if(data.tag_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1) {
                filteredContent.push(content);
              }
            }
          });
        }
      });
      return filteredContent;
    }

    const handleContentStageTagSearch = (e) => {
      e.preventDefault();
      let searchTxt = e.target.value

      if(!!searchTxt === false) {
        if(props.gDriveContent.length > 0) {
          SetgDriveData(props.gDriveContent)
        } else {
          SetgDriveData([])
        }
        return false
      }

      let filteredData = getFilteredContentStageTags(searchTxt.toLowerCase(), props.gDriveContent);

      if(filteredData.length > 0) {
        SetgDriveData(filteredData)
      } else {
        SetgDriveData([])
      }
    }

    const getFilteredContentStageTags = (searchTxt, contentsData) => {
      let filteredContent = [];
      contentsData.forEach(content => {
        if(content.content_stage_tags != null || content.content_stage_tags != undefined) {
          content.content_stage_tags.forEach(data => {
            if(!!data.tag_name === true) {
              if(data.tag_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1) {
                filteredContent.push(content);
              }
            }
          });
        }
      });
      return filteredContent;
    }

    const handleExpandClick = (row) => {
        
    }

    const getFlatedRowsArr = (data) => {
      processSelectedContentRows(data);
      if(!isContentRowSelected) {
        setIsContentRowSelected(true);
      }
    }

    const processSelectedContentRows = (selectedRows) => {
      if(selectedRows.length > 0) {
        let rows = [];
        for(let i=0; i<selectedRows.length; i++) {
          rows.push(selectedRows[i].original);
        }
        setSelectedContentRows(rows);
      } else {
        setSelectedContentRows([])
      }
    }

    const openConfirmationModal = () => {
      setOpenConfirmationBox(true);
    }
  
    const closeConfBox = () => {
      setOpenConfirmationBox(false);  
    }

    const onECDeleteHandler = () => {
      props._delete_contents(selectedContentRows, (err, success) => {
        if(err) {
          SetIsContentDeleteErr(true);
          closeConfBox();
          return false;
        }
        closeConfBox();
        props._get_gdrive_content();
        props._get_popular_content_tags();
      });
    }

    const addToPortal = () => {
      props._add_content_to_portal(selectedContentRows, (err, success) => {
        setIsContentRowSelected(false);
        SetIsContentAddedSuccess(true);
        setIsAddTag(false);
        SetSelectedCustomTags([]);
        SetSelectedCustomStageTags([]);
        props._get_gdrive_content();
        props._get_popular_content_tags();
      });
    }

    const openAddTagsModal = () => {
      if(selectedContentRows.length === 1 && isAddTag === false) {
        gDriveData.forEach(data => {
          if(data.doc_id === selectedContentRows[0].doc_id) {
            let newContentTag = popularTags.content_tags;
            let newContentStageTag = popularTags.content_stage_tags;

            SetSelectedCustomTags(data.content_tags);
            SetSelectedCustomStageTags(data.content_stage_tags);
            
            if(data.content_tags.length) {
              data.content_tags.forEach(tag => {
                newContentTag.forEach((pTag, i) => {
                  if(tag.id === pTag.id) {
                    newContentTag.splice(i, 1)
                  }
                })
              })
              console.log(newContentTag)
            }

            if(data.content_stage_tags.length) {
              data.content_stage_tags.forEach(tag => {
                newContentStageTag.forEach((pTag, i) => {
                  if(tag.id === pTag.id) {
                    newContentStageTag.splice(i, 1)
                  }
                })
              });
            }

            let json = {content_tags: newContentTag, content_stage_tags: newContentStageTag}
            SetPopularTags(json)
          } 
        })
      }
      setIsAddTag(true)
    }

    const cancelAddTags = () => {
      setIsContentRowSelected(false);
      setIsAddTag(false);
      SetSelectedCustomTags([]);
      SetSelectedCustomStageTags([]);
      props._get_gdrive_content();
      props._get_popular_content_tags();
    }

    const cancelAddTagsModal = () => {
      setIsAddTag(false);
      SetSelectedCustomTags([]);
      SetSelectedCustomStageTags([]);
      SetPopularTags(props.popularContentTag)
    }

    const handleOnchangeContentTag = (e) => {
      SetNewContentTagText(e.target.value);
    }

    const handleOnchangeContentStageTag = (e) => {
      SetNewContentStageTagText(e.target.value);
    }

    const addNewContentTag = (tagType) => {
      if(tagType === 'CONTENT_TAG') {
        let tagToAdd = selectedCustomTags;
        let tag = {
          id: Math.floor(Math.random() * 10000) + 1,
          tag_name: newContentTagText,
          tag_color: getRandomColor(),
          tag_type: 'CONTENT_TAG',
          isNewTag: true
        }
        tagToAdd.push(tag);
        SetSelectedCustomTags(tagToAdd);
        SetNewContentTagText('');
      } else {
        let tagToAdd = selectedCustomStageTags;
        let tag = {
          id: Math.floor(Math.random() * 10000) + 1,
          tag_name: newContentStageTagText,
          tag_color: getRandomColor(),
          tag_type: 'CONTENT_STAGE_TAG',
          isNewTag: true
        }
        tagToAdd.push(tag);
        SetSelectedCustomStageTags(tagToAdd);
        SetNewContentStageTagText('');
      }
    }

    const selectTags = (tag, tagType) => {
      if(tagType === 'CONTENT_TAG') {
        let tagToAdd = selectedCustomTags;
        tag.isNewTag = false;
        tagToAdd.push(tag);
        SetSelectedCustomTags(tagToAdd);
        let defaultTags = popularTags.content_tags;
        let newDefTag = defaultTags.filter(data => {
          return data.id != tag.id
        });
        let json = {content_tags: newDefTag, content_stage_tags: popularTags.content_stage_tags}
        SetPopularTags(json)
      } else {
        let tagToAdd = selectedCustomStageTags;
        tag.isNewTag = false;
        tagToAdd.push(tag);
        SetSelectedCustomStageTags(tagToAdd);
        let defaultTags = popularTags.content_stage_tags;
        let newDefTag = defaultTags.filter(data => {
          return data.id != tag.id
        });
        let json = {content_tags: popularTags.content_tags, content_stage_tags: newDefTag }
        SetPopularTags(json)
      }
    }

    const removeSelectedTags = (tag, i, tagType) => {
      if(tagType === 'CONTENT_TAG') {
        let tagToAdd = selectedCustomTags;
        let newTagToTag = tagToAdd.filter(data => {
          return data.id != tag.id
        });
        SetSelectedCustomTags(newTagToTag);
        if(tag.isNewTag === false || selectedContentRows.length === 1) {
          let defaultTags = popularTags.content_tags;
          defaultTags.push(tag);
          let json = {content_tags: defaultTags, content_stage_tags: popularTags.content_stage_tags}
          SetPopularTags(json)
        }
      } else {
        let tagToAdd = selectedCustomStageTags;
        let newTagToTag = tagToAdd.filter(data => {
          return data.id != tag.id
        });
        SetSelectedCustomStageTags(newTagToTag);
        if(tag.isNewTag === false || selectedContentRows.length === 1) {
          let defaultTags = popularTags.content_stage_tags;
          defaultTags.push(tag);
          let json = {content_tags: popularTags.content_tags, content_stage_tags: defaultTags }
          SetPopularTags(json)
        }
      }
    }

    const handleApplyTags = (tagType) => {
      let tagsIds = selectedContentRows.map(data => {
        return data.doc_id;
      });
      console.log("tagIds", tagsIds);
      const allSelectedTags = [...selectedCustomTags, ...selectedCustomStageTags];

      props._add_tags_to_content(allSelectedTags, tagsIds, (err, success) => {
        if(err) {
          SetaddTagError(true);
        } else {
          setIsContentRowSelected(false);
          setIsAddTag(false);
          SetSelectedCustomTags([]);
          SetSelectedCustomStageTags([]);
          props._get_gdrive_content();
          props._get_popular_content_tags();
        }
        
      })
    }

    const hideAlert = () => {
      SetaddTagError(false);
      SetIsContentAddedSuccess(false);
      SetIsContentDeleteErr(false)
    }

    return (
        <>
            <div id="page-wrapper">
                <div className="lable">Content Picker</div>
                <Row className="mt-4">
                    <Col md={6} sm={12}>
                        <div className="form-group has-search mt-2">
                            <Input type="search" className="form-control" placeholder="Search for content to add to site" onChange={handleContentSearch}  />
                            <span className="fa fa-search form-control-feedback"></span>
                        </div>
                    </Col>    
                </Row>
                <Row className="mt-4">
                    <Col md={5} sm={12}>
                        <Form className="srch-box ml-0">
                            <Label>Date modified</Label>
                            <Input type="search" className="search-input" placeholder="Any time" aria-label="Search" onChange={handleDataModifySearch} />
                        </Form>
                    </Col>
                    <Col md={5} sm={12}>
                        <Form className="srch-box">
                            <Label>Content Tag</Label>
                            <Input type="search" className="search-input" placeholder="Select Content Tag" aria-label="Search" onChange={handleContentTagSearch} />
                        </Form>
                    </Col>    
                </Row>
                <Row className="mt-4">
                    <Col md={5} sm={12}>
                        <Form className="srch-box ml-0">
                            <Label>When to Share</Label>
                            <Input type="search" className="search-input" placeholder="Opportunity stage" aria-label="Search" onChange={handleContentStageTagSearch} />
                        </Form>
                    </Col>   
                </Row>
                <div className="mb-5 mt-4">
                  <Styles>
                  <SelectTable columns={columns} data={gDriveData} handleExpandClick={handleExpandClick} getFlatedRows={getFlatedRowsArr} />
                  </Styles>
                </div>
                
                <div className="add-tags-wrapper">
                  { isAddTag && isContentRowSelected &&
                    <div className="container add-tags-modal">
                      <div className="modal-content">
                        <div className="add-tag-icons cross-icon" onClick={cancelAddTagsModal}>
                          <img src={crossIcon} className="" width="15" height="15" />
                        </div>
                        <Row>
                          <Col xs={6}>
                            <div className="custom-tags">
                              <div className="tag-title py-2 ">Use Popular Tags</div>
                              <div className="d-flex flex-wrap">
                                {
                                  popularTags.content_tags.map((tag, index) => {
                                    return (
                                      <div className="d-flex justify-content-center tags-wrapper px-2 py-1 ml-2 mt-2" key={index} onClick={() => selectTags(tag, 'CONTENT_TAG')}>
                                        <div className="tag-label">{tag.tag_name}</div>
                                        <div className="ml-2 add-tag-icon">
                                          <img src={AddTagIcon} width="10" height="10" />
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              
                              <Row className="mt-4">
                                  <Col xs={10}>
                                    <div className="form-group has-search mt-2">
                                      <Input type="search" className="form-control" placeholder="Add content tags" value={newContentTagText} onChange={handleOnchangeContentTag} />
                                      <img src={AddTagsBtnIcon} className="add-btn-icon" width="15" height="12" onClick={() => addNewContentTag('CONTENT_TAG')}/>
                                    </div>
                                  </Col>    
                              </Row>

                              <div className="d-flex flex-wrap mt-3">
                                {
                                  selectedCustomTags.map((tag, index) => {
                                    return (
                                      <div className="d-flex justify-content-center tags-wrapper px-2 py-1 ml-2 mt-2" style={{backgroundColor: tag.tag_color}} key={index}>
                                        <div className="tag-label">{tag.tag_name}</div>
                                        <div className="ml-2 add-tag-icon" onClick={() => removeSelectedTags(tag, index, 'CONTENT_TAG')}>
                                          <i className="fa fa-times" aria-hidden="true"></i>
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              {/* { selectedCustomTags.length ?
                                <div className="mt-3 pull-right mr-5">
                                  <button className="btn apply-tags-btn" onClick={() => {handleApplyTags()}}>Apply tags</button>
                                </div> : ''
                              } */}

                            </div>
                          </Col>

                          <Col xs={6} className="pl-5 content-stage-tags">
                            <div className="stage-tags">
                              <div className="tag-title py-2">Use Popular Tags</div>
                              <div className="d-flex flex-wrap">
                                {
                                  popularTags.content_stage_tags.map((tag, index) => {
                                    return (
                                      <div className="d-flex justify-content-center tags-wrapper px-2 py-1 ml-2 mt-2" key={index} onClick={() => selectTags(tag, 'CONTENT_STAGE_TAG')}>
                                        <div className="tag-label">{tag.tag_name}</div>
                                        <div className="ml-2 add-tag-icon">
                                          <img src={AddTagIcon} width="10" height="10" />
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>

                              <Row className="mt-4">
                                  <Col xs={10}>
                                    <div className="form-group has-search mt-2">
                                      <Input type="search" className="form-control" placeholder="Add when to share" value={newContentStageTagText} onChange={handleOnchangeContentStageTag} />
                                      <img src={AddTagsBtnIcon} className="add-btn-icon" width="15" height="12" onClick={() => addNewContentTag('CONTENT_STAGE_TAG')}/>
                                    </div>
                                  </Col>    
                              </Row>

                              <div className="d-flex flex-wrap mt-3">
                                {
                                  selectedCustomStageTags.map((tag, index) => {
                                    return (
                                      <div className="d-flex justify-content-center tags-wrapper px-2 py-1 ml-2 mt-2" style={{backgroundColor: tag.tag_color}} key={index}>
                                        <div className="tag-label">{tag.tag_name}</div>
                                        <div className="ml-2 add-tag-icon" onClick={() => removeSelectedTags(tag, index, 'CONTENT_STAGE_TAG')}>
                                          <i className="fa fa-times" aria-hidden="true"></i>
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              { selectedCustomStageTags.length || selectedCustomTags.length ?
                                <div className="mt-3 pull-right mr-5">
                                  <button className="btn apply-tags-btn" onClick={() => {handleApplyTags()}}>Apply tags</button>
                                </div> : ''
                              }

                            </div>
                          </Col>    
                        </Row>
                      </div>
                    </div>
                  }
                  <div className="container add-tags-popup-bar">
                    { isContentRowSelected && selectedContentRows.length > 0 ?
                      <div className="add-tags d-flex justify-content-around col-sm-12">
                          <div className="course-count">
                            <div className="count">[{selectedContentRows.length}]selected</div>
                          </div>
                          <div>
                            <button className="btn add-tags-btn" onClick={openAddTagsModal}>Add tag</button>
                          </div>
                          <div>
                            <button className="btn add-to-portal-btn" onClick={addToPortal}>Add to Portal</button>
                          </div>
                          <div className="add-tag-icons delete-icon" onClick={openConfirmationModal}>
                            <img src={delIcon} className="" width="15" />
                          </div>
                          <div className="add-tag-icons cross-icon" onClick={cancelAddTags}>
                            <img src={crossIcon} className="" width="15" height="15" />
                          </div>
                      </div> : ''
                    }
                  </div>
                </div>  
            </div>
            <ConfirmationBox 
              title="Are you sure?"
              bodyText="You want to delete these items?"
              isOpen={openConfirmationBox}
              _toggle={closeConfBox}
              _confirmed={onECDeleteHandler}
            />
            { addTagError &&
              <SweetAlert
              danger
              title="Error"
              onConfirm={hideAlert}
              >
              {props.addTagsError}
            </SweetAlert>
            }
            { isContentAddedSuccess &&
              <SweetAlert
              success
              title="Woot!"
              onConfirm={hideAlert}
              >
              Content has been added to the Portal Successfully
            </SweetAlert>
            }
            { isContentDeleteErr &&
              <SweetAlert
              danger
              title="Error!"
              onConfirm={hideAlert}
              >
              {props.deleteContentsErr}
            </SweetAlert>
            }
        </>
    )
}

const mapStateToProps = ({ contentPortal }) => ({
  ...contentPortal
})

const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
      _get_gdrive_content         :   get_gdrive_content,
      _get_popular_content_tags   :   get_popular_content_tags,
      _add_tags_to_content        :   add_tags_to_content,
      _add_content_to_portal      :   add_content_to_portal,
      _delete_contents            :   delete_contents
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContentPicker)