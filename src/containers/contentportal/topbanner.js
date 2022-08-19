import React, {useState, useEffect, useRef} from 'react'
import { Row, Container, Col, Input, Form, Button, FormGroup, Label,  Modal, ModalHeader, ModalBody } from 'reactstrap'
import crossIcon from '../../assets/img/crossIcon.png'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import homeBanner from '../../assets/img/home_default_banner.jpg'
import bannerEditIcon from '../../assets/img/bannerEditIcon.png'
import { isTenantSite, getTenantSite } from '../../transforms'
import { save_srch_content_tag, save_srch_when_to_share, save_srch_date_modified, reset_srch_filter, handle_filter_search, handle_global_content_search } from '../../actions/contentPortal'
import auditboardBanner from '../../assets/img/auditboard_banner.png';

const TopBanner = (props) => {
    const filterRef = useRef(null);
    const [isModalShow, setIsShowModal] = useState(false) 
    const [isShowFilterOption, SetIsShowFilterOption] = useState(false) 
    const [conetntTagSrch, SetConetntTagSrch] = useState('') 
    const [dateModifiedSrch, SetDateModifiedSrch] = useState('') 
    const [whenToShareSrch, SetWhenToShareSrch] = useState('')
    const [contentSearchTxt, SetContentSearchTxt] = useState('');
    const [bannerUrl, setBannerUrl] = useState(''); 

    useEffect(() => {
        setCustomerName();
    }, [])

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);

    const setCustomerName = () => {
        let cust = getTenantSite();
        if(cust === 'auditboard' && process.env.REACT_APP_NODE_ENV === 'sandbox') {
            setBannerUrl(auditboardBanner);
        } else {
            setBannerUrl(homeBanner);
        }
    }

    const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            handleShowFilterOption();
        }
    }

    const handleContentSearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value;
        props._handle_global_content_search(searchTxt);
        SetContentSearchTxt(searchTxt);
    }

    const _toggle = () => {
        setIsShowModal(false)
    }

    const onBannerChange = () => {
        setIsShowModal(true);
    }

    const handleShowFilterOption = () => {
        SetIsShowFilterOption(prevState => !prevState);
        SetContentSearchTxt('');
        props._handle_global_content_search('');
    }

    const handleContentTagSearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value
        SetConetntTagSrch(searchTxt);
    }

    const handleDateModifySearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value;
        SetDateModifiedSrch(searchTxt)
    }

    const handleContentStageTagSearch = (e) => {
        e.preventDefault();
        let searchTxt = e.target.value
        SetWhenToShareSrch(searchTxt);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        let json = {
            srchContentTag: conetntTagSrch,
            srchWhenToShare: whenToShareSrch,
            dateModifiedSearchInput : dateModifiedSrch
        }
        props._handle_filter_search(json)
    }

    const handleResetSearch = () => {
        props._reset_srch_filter();
        SetConetntTagSrch('');
        SetWhenToShareSrch('');
        SetDateModifiedSrch('');
    }

    const handleOnClick = () => {
        if(isShowFilterOption) {
            SetIsShowFilterOption(false)
        }
    }

    const handleCrossicon = () => {
        handleShowFilterOption();
    }

    return (
    <section className="banner" style={{
        backgroundImage:`url(${bannerUrl})`,
        backgroundSize:'cover',
        backgroundColor: 'unset'
    }}>
        <div className="tsz-container">
            <Container>
                <div className="banner-image">
                    <Row>
                        <div className="col-lg-6 col-md-12">
                        <div className="banner-left">
                            <h3>Discover Contents</h3>
                        </div>
                        </div>
                    </Row>
                    <Row className="mt-5">
                        <Col sm={5}></Col> 
                        <Col sm={6}>
                            <div className="form-group has-search my-2">
                                <Input type="search" className="form-control" placeholder="Find your content" onChange={handleContentSearch} value={contentSearchTxt} onClick={handleOnClick} />
                                <span className="fa fa-search form-control-feedback"></span>
                                <i className="fa fa-caret-down" aria-hidden="true" onClick={handleShowFilterOption}></i>
                                {   isShowFilterOption &&
                                    <div className="filter-option pl-4 pr-3 py-2" ref={filterRef}>
                                        <div className="cancel-icon pull-right" onClick={handleCrossicon}>
                                            <img className="cross-icon" src={crossIcon} />    
                                        </div>
                                        <Form className="modal-theme-form" onSubmit={handleSearch}> 
                                            <Row className="mt-4">
                                                <Col md={8} sm={12}>
                                                    <FormGroup className="srch-box ml-0">
                                                        <Label>Content Tag</Label>
                                                        <Input type="search" className="search-input pr-2" placeholder="Select Content Tag" aria-label="Search" onChange={handleContentTagSearch} value={conetntTagSrch} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row className="mt-4">
                                                <Col md={8} sm={12}>
                                                    <FormGroup className="srch-box ml-0">
                                                        <Label>When to Share</Label>
                                                        <Input type="search" className="search-input pr-2" placeholder="Select Content Tag" aria-label="Search" onChange={handleContentStageTagSearch}
                                                        value={whenToShareSrch} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row className="mt-4">
                                                <Col md={8} sm={12}>
                                                    <FormGroup className="srch-box ml-0">
                                                        <Label>Date modified</Label>
                                                        <Input type="search" className="search-input pr-2" placeholder="Any time" aria-label="Search" onChange={handleDateModifySearch}
                                                        value={dateModifiedSrch} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <div className="search-btn mb-4">
                                                <Row>
                                                    <Col xs={4}></Col>
                                                    <Col xs={8}>
                                                        <div className="pull-right">
                                                            <Button color="primary" className="serach-reset-btn" onClick={handleResetSearch}>Reset</Button>
                                                            <Button type="submit" className="serach-filter-btn">Search</Button>
                                                        </div>    
                                                    </Col>    
                                                </Row>    
                                            </div>
                                        </Form>    
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>
                    <div className="banner-edit-icon" onClick={onBannerChange}>
                        <img src={bannerEditIcon} width="25" height="25" />
                    </div> 
                </div>    
            </Container>
        </div>
        <Modal 
            className={'modal-dialog-centered modal-team-member'} 
            modalClassName={'modal-theme tzs-modal'} 
            
            isOpen={isModalShow} 
            toggle={_toggle}
        >
            <ModalHeader toggle={_toggle}>Change Banner</ModalHeader>
            <ModalBody>
                <FormGroup >
                    <Label for="firstname">Upload banner image: </Label>
                    <Input id="firstname" type="file" capture />
                </FormGroup>
            </ModalBody>
        </Modal>
    </section>
  )
}

const mapStateToProps = ({ contentPortal }) => ({
    ...contentPortal
  })
  
  const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
    _save_srch_content_tag                 :   save_srch_content_tag,
    _save_srch_when_to_share               :   save_srch_when_to_share,
    _save_srch_date_modified               :   save_srch_date_modified,
    _handle_filter_search                  :   handle_filter_search,
    _handle_global_content_search          :   handle_global_content_search,
    _reset_srch_filter                     :   reset_srch_filter
    },
    dispatch
  )
    
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopBanner)