'use strict'

import React, { useEffect, useState } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

const ReactColorPicker = (props) => {

  const [color, setColor] = useState("#030303");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  useEffect(() => {
    setColor(props.initialValue);
  }, [])

  useEffect(() => {
    console.log(props.initialValue);
    setColor(props.initialValue);
    props._selectedColor(props.initialValue);
  }, [props.initialValue])

  const styles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: color,
      },
      swatch: {
        padding: '10px',
        background: '#fff',
        borderRadius: '1px',
        borderColor: '#bebebe',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        position: 'absolute',
        zIndex: '2',
        top:'30px',
        left:'432px', 
        height: '33px'
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
        right: '-220px',
        top: '30px'
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  const handleClick = () => {
    setDisplayColorPicker(prevState => !prevState);
  };

  const handleClose = () => {
    setDisplayColorPicker(prevState => !prevState);
  };

  const handleChange = (color) => {
    console.log(color);
    setColor(color.hex);
    props._selectedColor(color.hex);
  };

  return (
    <div>
      <div style={ styles.swatch } onClick={ handleClick }>
        <div style={ styles.color } />
      </div>
      { displayColorPicker ? <div style={ styles.popover }>
        <div style={ styles.cover } onClick={ handleClose }/>
        <SketchPicker color={ color } onChange={ handleChange } />
      </div> : null }

    </div>
  )
}

export default ReactColorPicker