import { ROUTES } from './constants/routeConstants'

const IC_USER_GRANTS = [
  {
    resource: 'COMP:HEADER', 
    action: 'LIST_ITEMS', 
    attributes: ['*'],
    condition: (context) => {
      let list = ['you', 'grow', 'praise']
      return list.indexOf(context.item) !== -1
    }
  },
  {
    resource: 'ROUTES', 
    action: [
      ROUTES.PROFILE, 
      ROUTES.GROW,
      ROUTES.LEARNING,
      ROUTES.CAREER_PATH,
      ROUTES.CREATE_COURSE,
      ROUTES.PRAISE,
      ROUTES.ONBOARDING,
      ROUTES.MY_COURSES,
      ROUTES.COURSES_LIBRARY,
      ROUTES.COURSE_ID,
      ROUTES.COURSE_ASSIGNED,
      ROUTES.LOGOUT,
      ROUTES.SEARCH_RESULT,
      ROUTES.PUBLIC_VIEW_PAGE,
      ROUTES.PROFILE_SETTINGS,
      ROUTES.TEAM,
      ROUTES.CONTENT_PORTAL,
      ROUTES.CREATE_MICROSITE,
      ROUTES.MICROSITE_ID,
      ROUTES.EXPERIENCE_ID,
      ROUTES.COURSE_COMPLETE
    ], 
    attributes: ['*']
  }
]

const MANAGER_USER_GRANTS = [
  {
    resource: 'ROUTES',
    action: ['*', `!${ROUTES.COMPANY_SETTINGS}`, `!${ROUTES.CONTENT_ANALYTICS}`, `!${ROUTES.CREATE_EXPERIENCE}`]
  },
  {
    resource: 'COMPONENT', 
    action: ['*', `!LEARNINGANALYTICS:DELETE:COURSES`, `!CONTENTS:EXPERINCES`, `!CONTENTS:TEMPLATES`]
  },
]

const rules = {
  "MANAGER": {
    grants: [
      ...MANAGER_USER_GRANTS
    ]
  },
  "IT_ADMIN_MANAGER": {
    grants: [
      {
        resource: 'ROUTES', 
        action: ['*'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['*']
      }
    ]
  },
  "ADMIN_MANAGER": {
    grants: [
      ...MANAGER_USER_GRANTS,
      {
        resource: 'COMPONENT', 
        action: ['LEARNINGANALYTICS:DELETE:COURSES'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:RECOMMENDATION'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:EXPERINCES'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:TEMPLATES'], 
        attributes: ['*']
      },
      {
        resource: 'ROUTES', 
        action: [ROUTES.CREATE_EXPERIENCE], 
        attributes: ['*']
      },
    ]
  },
  "IC": {
    grants: [...IC_USER_GRANTS]
  },
  "IT_ADMIN_IC": {
    grants: [
      ...IC_USER_GRANTS,
      {
        resource: 'ROUTES', 
        action: [ROUTES.COMPANY_SETTINGS, ROUTES.CREATE_EXPERIENCE], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['TEAM:EDIT/DELETE'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['TEAMMEMBER:DELETE'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['TEAMMEMBER:ADDTEAMMEMBER'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['TEAM:ADD-TEAM'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['LEARNINGANALYTICS:DELETE:COURSES'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:RECOMMENDATION'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:EXPERINCES'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:TEMPLATES'], 
        attributes: ['*']
      },
    ]
  },
  "ADMIN_IC": {
    grants: [
      ...IC_USER_GRANTS,
      {
        resource: 'COMPONENT', 
        action: ['TEAM:EDIT/DELETE'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['TEAMMEMBER:DELETE'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['TEAMMEMBER:ADDTEAMMEMBER'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['TEAM:ADD-TEAM'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['LEARNINGANALYTICS:DELETE:COURSES'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:RECOMMENDATION'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:EXPERINCES'], 
        attributes: ['*']
      },
      {
        resource: 'COMPONENT', 
        action: ['CONTENTS:TEMPLATES'], 
        attributes: ['*']
      },
      {
        resource: 'ROUTES', 
        action: [ROUTES.CREATE_EXPERIENCE], 
        attributes: ['*']
      },
    ]
  }
}

export default rules;