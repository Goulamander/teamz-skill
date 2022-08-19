import React, {Component} from 'react';
import { Row } from 'reactstrap';

import LeftBar from './leftbar';
import RightArea from './rightarea';
import TopBanner from './topbanner'

class ContentPortal extends Component {
  render(){
    return(
      <div id="content-portal">
        <TopBanner />
        <div className="tsz-container">
          <Row className="bg-container">
            <LeftBar />
            <RightArea />
          </Row>
        </div>
      </div>
    );
  }
}

export default ContentPortal;