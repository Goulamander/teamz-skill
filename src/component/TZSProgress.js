import React, {Fragment} from 'react'
import { Label, Progress } from 'reactstrap'
export const TZSProgress = ({
  label,
  progressVal,
  _onProgressChange
}) => { 

  return (
    <Fragment>
      <Label>{label}
        <span 
          className="tsz-progress-controls tsz-progress-minus"
          onClick={() => { 
            if(progressVal > 0)
            _onProgressChange((progressVal-10))
          }}
        >
          {' - '}
        </span>
        <span 
          className="tsz-progress-controls tsz-progress-plus"
          onClick={() => { 
            if(progressVal < 100)
              _onProgressChange((progressVal+10))
          }}
        >
          {' + '}
        </span>
      </Label>
      <Progress className={'modal-progress'} value={progressVal}>
        <span className="progress-value">{`${progressVal}%`}</span>
      </Progress>
    </Fragment>
  )
}