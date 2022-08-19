import React, { Fragment, useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter, useHistory } from 'react-router-dom';

import Can from '../../../../component/Can'
import { get_experiences, get_def_exp_templates } from '../../../../actions/experiences'
import { ROUTES } from '../../../../constants/routeConstants'
import { appConstant } from '../../../../constants/appConstants'
import { getUserRoleName } from '../../../../transforms'
const routeResource = "COMPONENT"

const Experiences = (props) => {
  const history = useHistory();
  const [ draftExperiencesData, setDraftExperiencesData ] = useState([]);
  const [ publishExperiencesData, setPublishExperiencesData ] = useState([]);
  const [ templatesData, setTemplatesData ] = useState([]);
  
  useEffect(() => {
    props._get_experiences();
    props._get_def_exp_templates();
  }, []);

  const handleToexperience = (link) => {
    // history.push(`${ROUTES.EXPERIENCES}/${link}`);
    const win = window.open(`${ROUTES.EXPERIENCES}/${link}`, "_blank");
    win.focus();
  }

  useEffect(() => {
    if(props.experiencesData.length) {
      processExpData(props.experiencesData);
    }
  }, [props.experiencesData]);

  useEffect(() => {
    if(props.defExpTemData.length) {
      setTemplatesData(props.defExpTemData);
    }
  }, [props.defExpTemData]);

  const processExpData = (data) => {
    let draftExperiences = data.filter(exp => {
      return exp.exp_state === "Draft"
    });
    let publishExperiences = data.filter(exp => {
      return exp.exp_state === "Save"
    });

    publishExperiences.sort((a, b) => {
      return new Date(b.exp_created) - new Date(a.exp_created)
    });
    draftExperiences.sort((a, b) => {
      return new Date(b.exp_created) - new Date(a.exp_created)
    })
    setPublishExperiencesData(publishExperiences);
    setDraftExperiencesData(draftExperiences);
  }

  return (
    <div className="page-wrapper mb-4">
      <div className="page-title mb-4">Experiences</div>
      <div className="experiences-cards">
        <Row>
          {publishExperiencesData.length ? publishExperiencesData.map((data, index) => {
            return (
              <Col md="4" sm={6} className="p-0" key={index}>
                <div className="experience-card" onClick={() => handleToexperience(data.link)} style={{backgroundImage: `url(${appConstant.BASE_URL + data.background_img.replace("dist", "")})`}}>
                <div className="experience-card-title">{data.title}</div>
                <div className="short-des">{data.description}</div>
                </div>
              </Col>
            );
          }) : <Col>no experiences found</Col>}
        </Row>
      </div>
      <Can
        role={getUserRoleName()}
        resource={routeResource}
        action={"CONTENTS:EXPERINCES"}
        yes={(attr) => (
          <>
          <div className="page-title mb-4 mt-4">Draft Experiences</div>
          <div className="experiences-cards">
            <Row>
              {draftExperiencesData.length ? draftExperiencesData.map((data, index) => {
                return (
                  <Col md="4" sm={6} className="p-0" key={index}>
                    <Link to={{pathname:ROUTES.CREATE_EXPERIENCE, state:{goTo: 'create-experience', exp_link: data.link}}} >
                      <div className="experience-card" style={{backgroundImage: `url(${appConstant.BASE_URL + data.background_img.replace("dist", "")})`}}>
                        <div className="experience-card-title">{data.title}</div>
                        <div className="short-des">{data.description}</div>
                      </div>
                    </Link>    
                  </Col>
                );
              }) : <Col>no draft experiences found</Col>}
            </Row>
          </div>
          </>  
        )}
        no={() => (
          null
        )}
      />

      <Can
        role={getUserRoleName()}
        resource={routeResource}
        action={"CONTENTS:TEMPLATES"}
        yes={(attr) => (
          <>
          <div className="page-title mb-4 mt-4">Templates</div>
          <div className="experiences-cards">
            <Row>
              {templatesData.length ? templatesData.map((data, index) => {
                return (
                  <Col md={4} sm={6} className="p-0" key={index}>
                    <Link to={{pathname:`${ROUTES.TEMPLATES}/${data.link}`}} >
                      <div className="experience-card" style={{backgroundImage: `url(${appConstant.BASE_URL + data.background_img.replace("dist", "")})`}}>
                        <div className="experience-card-title">{data.title}</div>
                        <div className="short-des">{data.description}</div>
                      </div>
                    </Link>    
                  </Col>
                );
              }) : <Col>no template found</Col>}
            </Row>
          </div>
          </>  
        )}
        no={() => (
          null
        )}
      />
    </div> 
  );

};

const mapStateToProps = ({ experiences }) => ({
  ...experiences
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
  {
    _get_experiences : get_experiences,
    _get_def_exp_templates : get_def_exp_templates
  },
  dispatch
)
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Experiences)
