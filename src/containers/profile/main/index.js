import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { MyProfile } from './MyProfile'
import MyCourses from './MyCourses/'
import Library from './Library/'
import { ROUTES } from '../../../constants/routeConstants';

export const MainSection = () => {

  return (
    <Switch>
      <Route 
        exact 
        path={ROUTES.PROFILE}
        component={MyProfile}
      />
      <Route 
        exact 
        path={ROUTES.MY_COURSES}
        component={MyCourses} 
        />
        <Route 
        exact 
        path={ROUTES.COURSES_LIBRARY}
        component={Library}
        />
    </Switch>
  )
}