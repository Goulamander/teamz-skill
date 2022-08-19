import React, { Component, Fragment, useState, useRef, useEffect } from 'react';
import { Row, Col, Input, Form, Button, Label, FormGroup } from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import {LinkedinShareButton, TwitterShareButton, EmailShareButton, LinkedinIcon, TwitterIcon, EmailIcon} from "react-share";

import { get_microsite_by_link, save_get_share_link } from '../../../actions/microsites'
import crossIcon from '../../../assets/img/crossIcon.png'
import { appConstant, MicrositeStyle } from '../../../constants/appConstants'
import { actions as authActions } from "../../../containers/app/auth";
import { ROUTES } from '../../../constants/routeConstants'

const ShareMicrositeForm = (props) => {
    const history = useHistory();
    let { _handleOpneShareModal, _getMSDataByLink } = props;
    let location = useLocation();
    let currentUrl = appConstant.BASE_URL + location.pathname;
    
    const [openCopyLink, SetOpenCopyLink] = useState(false);
    const [linkToCopy, SetLinkToCopy] = useState('');
    const [recipientEmail, SetRecipientEmail] = useState('');
    const [generatedSharedLink, SetGeneratedSharedLink] = useState('');
    const [isErr, setIsErr] = useState(false);
    const [error, setError] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        SetLinkToCopy(_getMSDataByLink.link);
    }, [])

    const cancelCross = () => {
        _handleOpneShareModal();
    }

    const handleGetLink = () => {
        if(!!recipientEmail === false) {
            setIsErr(true);
            setError("please enter recipient email");
            return false;
        }
        let json = {
            recipient_email : recipientEmail,
            microsite_id : _getMSDataByLink.microsite_id,
            share_via : 'LINK'
        }
        props._save_get_share_link(json, (err, data) => {
            if(err) {
                setIsErr(true);
                setError("Something went wrong");
                let generatedLink = `${linkToCopy}?s_id=${err}`;
                SetGeneratedSharedLink(generatedLink)
                SetOpenCopyLink(true);
                return false;
            }
            let generatedLink = `${linkToCopy}?s_id=${data}`;
            SetGeneratedSharedLink(generatedLink)
            SetOpenCopyLink(true);
            props._get_microsite_by_link(_getMSDataByLink.link);
        })
    }

    const handleEmailChange = (e) => {
        SetRecipientEmail(e.target.value);
    }

    const handleCopyLink = (linkname, text_to_display, micrositeData) => {
        let uri = `${appConstant.BASE_URL}/microsites/${linkname}`;

        if(micrositeData.style_type === MicrositeStyle.videoContent) {
            let aTag = document.createElement('a');
            aTag.setAttribute('href', `${uri}`);
            aTag.setAttribute("target", "_blank");
            aTag.setAttribute("class", "copy-anchor-link");
            // aTag.innerText = text_to_display;
            aTag.innerHTML = `<img style="max-width: 480px; height: 320px; width: 480px;" name="Teamzskill video" alt="Click To Play" classname="teamzskill_video_img" id="a6561abf-52ab-a93b-ec8a-1e6e02473d29" src=${micrositeData.video_gif} isvideoready="true" animated="1" animatedthumburl=${micrositeData.video_gif}>`;
            document.body.appendChild(aTag);
            const link = document.querySelector('.copy-anchor-link');
            const range = document.createRange();
            range.selectNode(link);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            aTag.remove();
            setLinkCopied(true);
        } else {
            let aTag = document.createElement('a');
            aTag.setAttribute('href', `${uri}`);
            aTag.setAttribute("class", "copy-anchor-link");
            aTag.innerText = text_to_display;
            document.body.appendChild(aTag);
            const link = document.querySelector('.copy-anchor-link');
            const range = document.createRange();
            range.selectNode(link);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            document.execCommand('copy');
            aTag.remove();
            setLinkCopied(true);
        }
    }

    return (
        <Col xs={10} sm={8} md={4} lg={3} className="customize-form share-form pt-0">
            <Fragment>
                <div className="background-heading p-2">
                    <div className="text-center">Share</div>
                    <div className="cancel-icon" onClick={cancelCross}>
                        <img src={crossIcon} width="10" height="10"/>
                    </div>
                </div>
                { _getMSDataByLink.style_type !== MicrositeStyle.videoContent &&   <>
                        <div className="display-link-text mt-4">
                            <div className="mb-1">Linkname to be displayed as hyperlink</div>
                            <div>{_getMSDataByLink.customize_link}</div>
                        </div>
                        <hr className="my-4" />
                    </>    
                }
                <div>
                    { authActions.isLoggedIn() &&
                        <div className="modal-form mt-3">
                            <FormGroup className="mb-4">
                                <Label>Personalize link for tracking</Label>
                                <div className="email-input">
                                    <Input type="text" placeholder="Rob@customer.com" className="email-inputbox" value={recipientEmail} onChange={handleEmailChange} />
                                    <div className="get-link">    
                                        <button className="btn btn-theme get-link-btn" onClick={handleGetLink}>Get link</button>
                                    </div>    
                                </div>
                            </FormGroup>
                        </div>
                    }
                    { (openCopyLink || !authActions.isLoggedIn()) && 
                        <div className="background-heading copy-link-popup py-3 px-4 mb-4">
                            <div className="title mb-3">Here is your link</div>
                            <div className="cryptic-link mb-4">{appConstant.BASE_URL}{ROUTES.MICROSITES}/{generatedSharedLink != '' ? generatedSharedLink : linkToCopy}</div>
                            <div className="text-right">
                                <button className="btn btn-theme get-link-btn" onClick={() => handleCopyLink(generatedSharedLink != '' ? generatedSharedLink : linkToCopy, _getMSDataByLink.customize_link, _getMSDataByLink)}>Copy link</button>
                            </div>     
                        </div>
                    }
                </div>    
                <div className="site-social-shares">
                    <div className="share-link email-share">
                        <EmailShareButton
                            url={currentUrl}
                            hashtag="#teamzskill"
                            className="w-100"
                        >
                            <div className="d-flex align-items-center">
                                <div className="share-title">Share via email</div>
                                <div className="ml-auto"> 
                                    <EmailIcon size={32} />
                                </div>    
                            </div>
                        </EmailShareButton>    
                    </div>
                    <hr />
                    <div className="share-link linkedIn-share">
                        <LinkedinShareButton 
                            url={currentUrl}
                            hashtag="#teamzskill"
                            className="w-100"
                        >
                            <div className="d-flex align-items-center">
                                <div className="share-title">Share on LinkedIn</div>
                                <div className="ml-auto"> 
                                    <LinkedinIcon size={32} />
                                </div>    
                            </div>    
                        </LinkedinShareButton>
                    </div>
                    <hr />
                    <div className="share-link twitter-share">
                        <TwitterShareButton 
                            url={currentUrl}
                            hashtag="#teamzskill"
                            className="w-100"
                        >
                            <div className="d-flex align-items-center">
                                <div className="share-title">Share on Twitter</div>
                                <div className="ml-auto"> 
                                    <TwitterIcon size={32} />
                                </div>    
                            </div>    
                        </TwitterShareButton>
                    </div>
                    <hr />    
                </div>    
                { isErr &&
                    <SweetAlert
                        danger
                        title="Error!"
                        onConfirm={() => {
                            setIsErr(false);
                            setError('');
                        }}
                        >
                        {error}
                    </SweetAlert>
                }
                { linkCopied &&
                    <SweetAlert
                    success
                    title="Woot!"
                    onConfirm={() => {
                        setLinkCopied(false)
                    }}
                    >
                    Link copied to clipboard
                    </SweetAlert>
                }
            </Fragment>   
        </Col>
    )
}

const mapStateToProps = ({ microSites }) => ({
    ...microSites
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_microsite_by_link : get_microsite_by_link,
        _save_get_share_link   : save_get_share_link
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShareMicrositeForm)