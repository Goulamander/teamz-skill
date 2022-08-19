import React from 'react'
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../constants/routeConstants'

const NoTenantRoute = () => {
    return (
      <div className="container text-center no-tenant-page m-5 p-5">
        <h1>Page Not Found!!</h1>
        <Link className="btn btn-theme mt-5" to={ROUTES.HOME}>Home</Link>
      </div>
    )
}

export default NoTenantRoute