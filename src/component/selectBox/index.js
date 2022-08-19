import React, {useState} from 'react'
import styled from 'styled-components'
import classnames from 'classnames'
import { QuizQuesTypesKey } from '../../constants/appConstants'

const SelectBoxWrapper = styled.div`
  .tzs-select-box{
    background-color: #ffffff;
    border: 1px solid #979797;
    color: #202020;
    max-width: 200px;
  }
  .tzs-select-box .sb-options {
    display: none
  }
  .tzs-select-box .sb-value {
    cursor: pointer;
    padding: 5px 10px;
  }
  .tzs-select-box .is-expand {
    display: block
  }
  .sb-item {
  padding: 10px;
  padding-left: 50px;
  cursor: pointer;
  color: #272727;
}
.sb-item:hover {
  background-color: #d8d8d8;
}
.sb-item.icon {
  background-repeat: no-repeat;
  background-position: 10px;
  background-size: 30px;
}
`;

const SelectBox = (props) => {

  const [isExpand, setIsExpand] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const setOption = (type) => {
    if(props.isRatingQueGenerate === true && type.key === QuizQuesTypesKey.RATING) {
      return false;
    }
    setSelectedItem(type); 
    setIsExpand(false)
    props.onChange(type)
  }

  return(
    <SelectBoxWrapper>
      <div className="tzs-select-box">
        <div className={'sb-value'} onClick={()=> setIsExpand(!isExpand)}>{(selectedItem? selectedItem.value : 'Select question type')}</div>
        <div className={classnames({'sb-options': true, 'is-expand': isExpand === true})}>
          {props.options.map((type, index) => {
            let icn = type.iconName || ''
            return (
              <div 
                style={{ color: (props.isRatingQueGenerate === true && type.key === QuizQuesTypesKey.RATING) && '#ccc' }}
                key={`q-type-${index}`} 
                className={`sb-item icon ${icn}`}
                value={type.key}
                onClick={()=> setOption(type)}
              >
                {type.value}
              </div>
            )
          })}
        </div>
      </div>
    </SelectBoxWrapper> 
  )
}

export default SelectBox