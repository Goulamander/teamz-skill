import React from 'react'
import { Redirect } from 'react-router-dom'

import TenantRoutes from './Routes'
import { isTenantSite } from '../../transforms'
import { ROUTES } from '../../constants/routeConstants'

export const Tenant = () => {

  if(isTenantSite()){
    return (
      <TenantRoutes />    
    )
  } else {
    return <Redirect to={ROUTES.HOME} />
  }
}

export default Tenant