import React, {Component, Fragment} from 'react';
import { Input } from 'reactstrap';
import { workHighlightPlaceholder } from '../../constants/appConstants';

const errorMsg = "Please enter value"

class WorkHighlightsCommon extends Component{
    handleChange = (e, type) => {
        this.props._validateForm(e.target.value)
        this.props._edit_work_highlights(e.target.value)
    }

    render(){
        let {errorBorder, workHighlights, isError, profileUpdates, viewMode} = this.props;
        let EditAbleMode = viewMode === true ? '' : this.props._renderUpdateButton();
        let workhighlight = workHighlights && workHighlights.length > 0 ? workHighlights : '';
        
        return(
            <Fragment>
                <h4 className="common-head">Work Highlights {EditAbleMode}</h4>
                <div className="work-box">
                    <Input id="workHighlights" className={errorBorder} type="textarea" name="workHighlights" value={workhighlight} onChange={(e) => this.handleChange(e, "workHighlights")}  disabled={!profileUpdates.isWHEditMode} invalid={isError} placeholder={workHighlightPlaceholder.workHighlights} />
                    { isError &&
                    <span className={'tsz-error-msg'}>{errorMsg}</span>
                    }
                </div>
            </Fragment>
        );
    }
}

export default WorkHighlightsCommon;