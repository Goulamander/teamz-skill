import React, {Component} from 'react';
import { Col } from 'reactstrap';
import AchievementsPublicView from './achievements';
import CoursesPublicView from './courses';
import AssignedPublicView from './assignedCourses';
import WorkHighlightsCommon from '../../../component/common/workHighlights';

class PublicMainView extends Component{
    state={
        readMode: true
    }
    render(){
        const { readMode } = this.state;
        const {workHighlights, achievements, assignCourses, courses} = this.props;
        return(
            <Col xl="8" lg="8" md="7" className="col-xxl-8">
                <div className="content-right">
                    <WorkHighlightsCommon viewMode={readMode} workHighlights={workHighlights} profileUpdates={false} />
                    <AchievementsPublicView achievements={achievements} />
                    <CoursesPublicView courses={courses}/>
                    <AssignedPublicView assignCourses={assignCourses}/>
                </div>
            </Col>
        );
    }
}

export default PublicMainView;