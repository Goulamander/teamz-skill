import React, {Component} from 'react';
import { LeftSection } from './left';
import RightSection from './companysettings';
import { Row } from 'reactstrap';

class CompanySettings extends Component{
  render(){
    return(
      <div id="companySettingPage">
        <div className="tsz-container">
          <Row className="bg-container">
            <LeftSection />
            <RightSection />
          </Row>
        </div>
      </div>
    );
  }
}

export default CompanySettings;