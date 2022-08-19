import React from 'react'
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../constants/routeConstants'
import { getTenantSite } from '../../../transforms'

const NoTenant = () => {
    return (
      <div className="container text-center no-tenant-page m-5 p-5">
        <h1>Tenant "{getTenantSite()}" not configured. <br />Contact to your IT customer</h1>
        { process.env.REACT_APP_NODE_ENV !== 'sandbox' && <Link className="btn btn-theme mt-5" to={ROUTES.TENANT_LOGIN}>Login as IT admin</Link> }
      </div>
    )
}

export default NoTenant