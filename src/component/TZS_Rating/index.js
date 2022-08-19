import React, {useState, useEffect} from 'react'
import StarRatingComponent from 'react-star-rating-component'

import './style.css'

const TZS_Rating = (props) => {

  const [rating, setRating] = useState(props.rating)

  useEffect(() => {
    setRating(props.rating)
  }, [props.rating]) 

  const onStarChange = (nextValue, prevValue, name) => {
    setRating(nextValue)
  }

  const onStarHoverOut = (nextValue, prevValue, name) => {
    setRating(props.rating)
  }

  const renderStarIcon = (index, value) => {
    return(
      <span className="pr-2">
        <i className={index <= value ? 'tas ta-star' : 'tar ta-star'} />
      </span>
    )
  }

  return (
    <StarRatingComponent 
      name={props.name} /* name of the radio input, it is required */
      value={rating} /* number of selected icon (`0` - none, `1` - first) */
      starCount={props.starCount} /* number of icons in rating, default `5` */
      onStarClick={props._onStarClick} /* on icon click handler */
      onStarHover={onStarChange} /* on icon hover handler */
      onStarHoverOut={onStarHoverOut} /* on icon hover out handler */
      renderStarIcon={renderStarIcon} /* it should return string or react component */
      // renderStarIconHalf={Function(nextValue, prevValue, name)} /* it should return string or react component */
      // starColor={String} /* color of selected icons, default `#ffb400` */
      // emptyStarColor={String} /* color of non-selected icons, default `#333` */
      editing={props.editing} /* is component available for editing, default `true` */
    />
  )
}

export default TZS_Rating