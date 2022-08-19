import React, {Component} from 'react';

class AchievementsList extends Component{
    render(){
        const {item, courseImg, achievementDate} = this.props
        return(
            <div className={'mt-2'}>
                <div className="card course-single-group">
                    <div className="img-box">											
                    <div className="card-img-background achievements-certificate-image" style={{backgroundImage: `url(${courseImg})`}}></div>
                    </div>
                    <div className="card-body p-0 pt-3">
                    <h5 className="card-title achievements-title">
                    <a href={item.cred_url}>{item.c_title}</a>
                    </h5>
                    <div className="achievement-company-logo">
                    {/* <img src={cLogo} /> */}<p>{item.issuing_org}</p>
                    </div>
                    <div className="achievement-details">
                    <p>Issued {achievementDate} </p>
                    <p>{item.cred_number !== "" ? "Credential ID : " + item.cred_number : ''}</p>
                    </div>
                    {/* <div className="action-bottom-dots">
                    <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" ></a>
                    </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default AchievementsList;