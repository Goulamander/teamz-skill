import React from 'react'
import { Redirect } from 'react-router-dom';

import { ROUTES } from '../../constants/routeConstants'

const NoRoute = () => {
    return (
      <Redirect to={ROUTES.LOGIN}/>
    )
}

export default NoRoute