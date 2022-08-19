import likeIcon from '../assets/img/like-icon.png'
import recommendIcon from '../assets/img/recommend.png'
import linkIcon from '../assets/img/llink.png'
import addBlueIcon from '../assets/img/add_blue_icon.png';

export const appConstant = {
  BASE_URL: process.env.REACT_APP_NODE_ENV === 'developmemt' ? `${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BASE_URL}` : `${process.env.REACT_APP_PROTOCOL}${window.location.host}`,
  SLACK_AUTH_API: '/api/slack/auth',
  SIGNUP_API: '/api/v1/register',
  LOGIN_API: '/api/v1/login',
  CHECK_SANDBOX_TENANT_EXIST: '/api/v1/sandbox/check-tenant-exist',
  GET_ONBOARDING_API: '/api/v1/onboarding', 
  SEND_INVITES_API: '/api/v1/onboarding/send-invites', 
  SAVE_PROFILE_API: '/api/v1/profile',
  GET_SKILLS: '/api/v1/get-skills',
  GET_PROFILE: '/api/v1/profile',
  UPDATE_PROFILE: '/api/v1/profile',
  GET_WEEKLY_UPDATE: '/api/v1/get-weekly-update',
  SAVE_WEEKLY_UPDATE: '/api/v1/weekly-update',
  SAVE_WORK_HIGHLIGHTS: '/api/v1/work-highlights',
  GET_CSV: '/api/v1/get-file/',
  UPLOAD_CSV: '/api/v1/upload',
  COURSES_API: '/api/v1/courses',
  RECOMMEND_COURSE_API: '/api/v1/courses/recommendation',
  UNFURLING_API: '/api/unfurling',
  COURSE_RECOMMEND_API: '/api/v1/course-recommend',
  CREATE_CUSTOM_COURSE_API: '/api/v1/custom-course',
  GET_CUSTOM_COURSE_API: '/api/v1/custom-course',
  DELETE_CUSTOM_COURSE_API: '/api/v1/custom-course/delete',
  DELETE_DRAFT_CUSTOM_COURSE_API: '/api/v1/custom-course',
  ASSIGN_CUSTOM_COURSE_API: '/api/v1/custom-course/assign',
  ASSIGN_CUSTOM_COURSE_TEAM_API: '/api/v1/team/assign-course',
  GET_ASSIGN_CUSTOM_COURSE_API: '/api/v1/custom-course/assign',
  GET_ASSIGN_CUSTOM_COURSE_BY_ID_API: '/api/v1/custom-course/assign',
  GET_ASSIGN_CUSTOM_COMPLETE_COURSE_BY_ID_API: '/api/v1/custom-course/assign/complete',
  START_ASSIGN_CUSTOM_COURSE: '/api/v1/custom-course/assign/startcourse',
  COMPLETE_ASSIGN_CUSTOM_COURSE_STEP: '/api/v1/custom-course/assign/markcomplete',
  ASSIGN_CUSTOM_COURSE_STEP_ADD_PITCH: '/api/v1/custom-course/assign/step/pitch',
  COMPLETE_ASSIGN_CUSTOM_COURSE: '/api/v1/custom-course/assign/complete',
  GET_CUSTOM_COURSES_LIBRARY_API: '/api/v1/custom-course/library',
  GET_SAML_SETINGS_API: '/api/okta/saml/company-setting',
  PUT_SAML_SETINGS_API: '/api/okta/saml/company-setting',
  PUT_SAML_AZURE_METADATA_API: '/api/okta/saml/azure-xml-metadata',
  PUT_SAML_OKTA_METADATA_API: '/api/okta/saml/okta-xml-metadata',
  PUT_ADMIN_PASSWORD_API: '/api/okta/saml/update-password',
  SAML_LOGOUT_API: '/api/okta/saml/logout',
  ACHIEVEMENTS_API: '/api/v1/achievement',
  ANALYTICS_COURSES_API: '/api/v1/learning-analytics/courses',
  ANALYTICS_LEARNERS_API: '/api/v1/learning-analytics/learners',
  ANALYTICS_MY_LEARNING_API: '/api/v1/learning-analytics/my-learning',
  ANALYTICS_COURSE_BY_ID_API: '/api/v1/learning-analytics/courses/course/',
  DELETE_ANALYTICS_COURSE_API: '/api/v1/learning-analytics/courses/delete',
  ANALYTICS_LEARNER_BY_ID_API: '/api/v1/learning-analytics/learners/learner',
  ANALYTICS_MY_LEARNING_BY_ID_API: '/api/v1/learning-analytics/my-learning/',
  DIRECT_REPORT_API: '/api/v1/learning-analytics/direct-reports',
  GET_USER_DETAIL_API: '/api/v1/learning-analytics/user-profile',
  SEARCH_API: '/api/v1/profile/search',
  GET_USER_SKILLS_API: '/api/v1/profile/user-skills',
  SET_USER_SKILLS_API: '/api/v1/profile/user-skills',
  MY_LEARNING: '/api/v1/learning-analytics/my-learning',
  GET_OEMBED: '/api/v1/custom-course/oembed',
  UPLOAD_VIDEO: '/api/v1/upload-video',
  UPLOAD_MICROSITE_RECORDED_VIDEO: '/api/v1/upload-microsite-recorded-video',

  COURSE_REVIEW_FEEDBACK_REQUESTED_API: '/api/v1/custom-course/step/feedback/requested',
  COURSE_REVIEW_FEEDBACK_FOR_ME_API: '/api/v1/custom-course/step/feedback/forme',
  COURSE_REVIEW_SAVE_FEEDBACK_API: '/api/v1/custom-course/step/feedback',

  GET_COURSE_STEP_QUIZ_ANSWERS: '/api/v1/custom-course/step/quiz/get',
  SAVE_COURSE_STEP_QUIZ_ANSWERS: '/api/v1/custom-course/step/quiz',
  GET_PEOPLE_ACCESS: '/api/v1/manage-access',
  UPDATE_PEOPLE_ACCESS: '/api/v1/manage-access',
  SALESFORCE_EMAIL: '/api/v1/salesforce/salesforce-email',
  VERIFY_USER: '/api/verify',
  TEAM_API: '/api/v1/team',
  TEAM_MEMBERS: '/api/v1/team/team-members',
  ALL_ORG_USERS: '/api/v1/team/get-all-org-users',
  OPPORTUNITY_AMOUNT_API: '/api/v1/analytics/opportunity-amount',
  QUOTA_ATTAINMENT_API: '/api/v1/analytics/quota-attainment',
  GDRIVE_CONTENT: '/api/v1/content-portal/content-picker',
  CONTENT_ANALYTICS: '/api/v1/content-portal/content-analytics',
  POPULAR_CONTENT: '/api/v1/content-portal/popular-contents',
  RECOMMENDED_CONTENT: '/api/v1/content-portal/recommended-contents',
  MY_CONTENT: '/api/v1/content-portal/my-contents',
  CREATE_MICROSITE: '/api/v1/content-portal/microsites/create-microsite',
  CREATE_EXPERIENCE: '/api/v1/content-portal/experiences/create-experience',
  UPDATE_EXPERIENCE: '/api/v1/content-portal/experiences/update-experience',
  GET_EXPERIENCES: '/api/v1/content-portal/experiences',
  GET_DEF_EXP_TEMPLATES: '/api/v1/admin/def-exp-templates',
  SAVE_COMPANY_LOGO: '/api/v1/profile/company-logo',
  GET_COMPANY_LOGO: '/api/v1/profile/company-logo',
  SAVE_SHARE_LINK_DATA: '/api/v1/content-portal/microsites/save-get-share-link',
  SAVE_UPLOAD_VIDEO_DATA: '/api/v1/content-portal/microsites/save-upload-video',
  SAVE_CTA_TEXT_DATA: '/api/v1/content-portal/microsites/save-cta-text',
  UPDATE_MICROSITE: '/api/v1/content-portal/microsites/modify-microsite',
  GET_MICROSITE_BY_LINK: '/api/v1/content-portal/microsites/microsite',
  GET_EXPERIENCE_BY_LINK: '/api/v1/content-portal/experiences/experience',
  GET_DEF_EXP_TEMPLATES_BY_LINK: '/api/v1/admin/def-exp-templates/template',
  GET_MICROSITES: '/api/v1/content-portal/microsites',
  GET_MYSHARES: '/api/v1/content-portal/microsites/my-shares',
  LIBRARY_IMAGES: '/api/v1/content-portal/library-images',
  EDIT_CONTENT: '/api/v1/content-portal/edit-portal-content',
  CONTENT_POPULAR_TAGS: '/api/v1/content-portal/popular-tags',
  ADD_TAGS: '/api/v1/content-portal/content-picker/add-tags',
  DELETE_CONTENTS: '/api/v1/content-portal/content-picker/delete-contents',
  ADD_CONTENTS_TO_PORTAL: '/api/v1/content-portal/content-picker/add-contents-to-portal',
  DELETE_MICROSITE_CONTENTS: '/api/v1/content-portal/microsites/microsite/content-cards',
  ADD_CONTENT_TO_MICROSSITE: '/api/v1/content-portal/microsites/microsite/add-new-content',
}

export const  skillsTypes = {
  MANAGEMENT_SKILLS: 'MANAGEMENT_SKILLS', 
  PEOPLE_SKILLS: 'PEOPLE_SKILLS', 
  FUNCTIONAL_DOMAIN_SKILLS: 'FUNCTIONAL_DOMAIN_SKILLS', 
  OTHER_SKILLS: 'OTHER_SKILLS'
};

export const skillsConstant = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate', 
  ADVANCED: 'Advanced', 
  NOT_MY_THING: 'Not my thing'
}

export const weeklyUpdatesPlaceholder = {
  execution: 'Write your weekly activity on execution here. Good description of execution is succinct, aligned with articulated long-term strategy and quantifiable.',
  craftsmanship: 'Craftsmanship is defined as the quality of design and workmanship shown in your work. Unreadable, unmaintainable, untestable, poorly documented, non-reusable code, purposeless complexity, bad user experiences and unpredictable services are the things we avoid my excellent craftsmanship.',
  leadership: 'Inspire others to accomplish a common objective or mission. Set a great example for yours peers to follow. Make an impact. As a manager, your leadership expand beyond owning a technical roadmap and roadmaps to co-owning career development of the folks you manage.',
  mentoring: 'Coach and Mentor those with different experiences than yours. Be a leader who you would want to follow. Join our mentorship program to be a mentor. We take mentoring others seriously.'
}

export const workHighlightPlaceholder = {
  workHighlights: 'Leading core Data Services Team - building reliable and scalable infrastructure and data services. Engineering leader for a globally distributed team of 12 software engineers. Defined vision and technical direction for Org Migration technology. Significant leaps in technology- ETL workflow to migrate data from various sources including database, HBase, SOLR search indexes, DNS.Initiated engagement with EMEA customers to enable regional alignment- partnered with @Akash, Director of Engineering, Internal Capacity Optimization Team. '
}

// Enum
export const LearningTypes = [
  { name: 'LEARNING_PATH', title: 'Create a Learning Path' },
  { name: 'SALES_ENGINEERING_TRAINING', title: 'Create a Sales Engineering Training'},
  { name: 'SALES_REP_TRAINING', title: 'Create a Sales Rep Training' },
]
export const QuizQuesTypesKey = {
  WELCOME_TEXT: 'WELCOME_TEXT', 
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE', 
  CHECKBOXES: 'CHECKBOXES', 
  DROPDOWN: 'DROPDOWN', 
  RATING: 'RATING'
}

export const QuizQuesTypes = [
  {key: 'WELCOME_TEXT', value: 'Welcome Text', iconName: 'free-txt'}, 
  {key: 'MULTIPLE_CHOICE', value: 'Multiple Choice', iconName: 'multi-choice'}, 
  {key: 'CHECKBOXES', value: 'Checkboxes', iconName: 'checkbox'}, 
  {key: 'DROPDOWN', value: 'Dropdown', iconName: 'dropdown'}, 
  {key: 'RATING', value: 'Rating', iconName: 'rating'}
]

export const QUIZ_STATUSES = {
  N_A: 'N/A', 
  UNSTARTED: 'UnStarted', 
  STARTED: 'Started', 
  COMPLETED: 'Completed'
}

export const usersTypes = [
  {
    id: 1,
    role: "All Team Managers"
  }
]

export const customCourseTags = ["New Hire", "Introductory", "Customer case study", "Product Update"]

export const customCourseStateConstant = {
  SAVE: 'Save',
  DRAFT: 'Draft'
}

export const courseTypes = {
  ASSIGNED: 'ASSIGNED',
  CURRENT: 'CURRENT',
  COMPLETE: 'COMPLETE',
  MY_PUB_COURSES: 'MY_PUB_COURSES',
  SAVE: 'SAVE',
  DRAFT: 'DRAFT'
}

export const assignCourseState = {
  UNSTART: 'UnStart',
  START: 'Start',
  COMPLETE: 'Complete'
}

export const custCourseStepTypeConstant = {
  INTERNAL_CONTENT: 'InternalContent',
  EXTERNAL_CONTENT: 'ExternalContent',
  ACTIVITY        : 'Activity',
  TASKTOCOMPLETE_QUIZ  : 'TaskToComplete_Quiz',
  TASKTOCOMPLETE_RECORDEDVIDEO  : 'TaskToComplete_RecordedVideo',
  TASKTOCOMPLETE_VIDEO  : 'TaskToComplete_Video',
}

export const draftActionControls = [
  {
    key: 'delete',
    title: 'Delete draft'
  }
]

export const assignActionControls = [
  {
    key: 'assign',
    title: 'Assign Course'
  },
  {
    key: 'assignToTeam',
    title: 'Assign to Team'
  }
]

export const managerAssignActionControls = [
  {
    key: 'assignToTeam',
    title: 'Assign to Team'
  }
]


export const myPubCourseActionControls = [
  {
    key: 'edit',
    title: 'Edit course'
  },
  {
    key: 'delete',
    title: 'Delete course'
  }
]

export const shareLinkActionControls = [
  {
    key: 'download',
    title: 'Download'
  },
  {
    key: 'getSharableLink',
    title: 'Get shareable link'
  }
]

export const nestedCourseForm = [
  {
    key: 'editCourse',
    title: 'Edit Progress'
  },
  {
    key: 'recommendedCourse',
    title: 'Recommend this course'
  }
]
export const userRoles = ["Manager", "IT Admin Manager", "Admin Manager", "IC", "IT Admin IC", "Admin IC"]

// this is usersRoleTypes 'type' attr map based on userRoles
export const UserRolesTypeMap = ["NORMAL", "IT", "HR", "NORMAL", "IT", "HR"]

export const usersRoleTypes = [
  {
    id: 1,
    role: "Manager",
    type: 'NORMAL'
  },
  {
    id: 2,
    role: "IT Admin + Manager",
    type: 'IT'
  },
  {
    id: 3,
    role: "HR Admin + Manager",
    type: 'HR'
  },
  {
    id: 4,
    role: "Individual contiributor",
    type: 'NORMAL'
  },
  {
    id: 5,
    role: "IT Admin + IC",
    type: 'IT'
  },
  {
    id: 6,
    role: "HR Admin + IC",
    type: 'HR'
  }
]

// export const filterIntervals = ['all', 'last 6 months','last month', 'last week'];
// export const filterCType = ['all', 'LEARNING_PATH', 'SALES_ENGINEERING_TRAINING', 'SALES_REP_TRAINING'];
export const filterIntervals = [
  {
    key: 'all',
    title: 'All'
  },
  { 
    key: 'last 6 months',
    title: 'last 6 months'
  },
  {
    key: 'last month',
    title: 'last month'
  },
  {
    key: 'last week',
    title: 'last week'
  }
];
export const filterCType = [
  {
    key: 'all',
    title: 'All',
  },
  {
    key: 'LEARNING_PATH',
    title: 'Learning Path' 
  },
  {
    key: 'SALES_ENGINEERING_TRAINING',
    title:  'Sales Engineering Training'
  },
  {
    key: 'SALES_REP_TRAINING',
    title: 'Sales Rep Training'
  }
];

export const nestedTeamOptions = [
  {
    key: 'addToTeam',
    title: 'Add to team'
  },
  {
    key: 'manageTeam',
    title: 'Manage Team'
  },
  {
    key: 'editTeam',
    title: 'Edit Team'
  },
  {
    key: 'deleteTeam',
    title: 'Delete Team'
  }
]

export const nestedTeamICOptions = [
  {
    key: 'addToTeam',
    title: 'Add to team'
  },
  {
    key: 'manageTeam',
    title: 'Manage Team'
  }
]

export const contentActionControls = [
  {
    key: 'addToMyContent',
    title: 'Add to my content',
    icon: likeIcon
  },
  {
    key: 'RecommendContent',
    title: 'Recommend content',
    icon: recommendIcon
  },
  {
    key: 'GetSharableLink',
    title: 'Get sharable link',
    icon: linkIcon
  },
  {
    key: 'addToMicrosite',
    title: 'Add to microsites',
    icon: addBlueIcon
  },
]

export const contentActionWthRecControls = [
  {
    key: 'addToMyContent',
    title: 'Add to my content',
    icon: likeIcon
  },
  {
    key: 'GetSharableLink',
    title: 'Get sharable link',
    icon: linkIcon
  },
  {
    key: 'addToMicrosite',
    title: 'Add to microsites',
    icon: addBlueIcon
  },
]

export const contentMyActionControls = [
  {
    key: 'RecommendContent',
    title: 'Recommend content',
    icon: recommendIcon
  },
  {
    key: 'GetSharableLink',
    title: 'Get sharable link',
    icon: linkIcon
  },
  {
    key: 'addToMicrosite',
    title: 'Add to microsites',
    icon: addBlueIcon
  },
]

export const contentMyActionWthRecControls = [
  {
    key: 'GetSharableLink',
    title: 'Get sharable link',
    icon: linkIcon
  },
  {
    key: 'addToMicrosite',
    title: 'Add to microsites',
    icon: addBlueIcon
  },
]

export const micrositeConst = {
  header_def_color : '#27424e'
}

export const oppDuring = ['Last 8 Months', 'Last 6 Months', 'Last 4 Months'];
export const salesforceObject = ['Opportunity Amount %', 'Quota Attainment %'];

export const experiencesDefaultTopics = [
  {
    topic_name: 'Discovery',
    topic_bgcolor: '#979797',
    topic_text_color: '#000000',
    topic_link: '',
    topic_link_type: null
  },
  {
    topic_name: 'Solution Exploration',
    topic_bgcolor: '#979797',
    topic_text_color: '#000000',
    topic_link: '',
    topic_link_type: null
  },
  {
    topic_name: 'Requirements Building',
    topic_bgcolor: '#979797',
    topic_text_color: '#000000',
    topic_link: '',
    topic_link_type: null
  },
  {
    topic_name: 'Selection',
    topic_bgcolor: '#979797',
    topic_text_color: '#000000',
    topic_link: '',
    topic_link_type: null
  },
  {
    topic_name: 'Validation',
    topic_bgcolor: '#979797',
    topic_text_color: '#000000',
    topic_link: '',
    topic_link_type: null
  },
  {
    topic_name: 'Consensus Creation',
    topic_bgcolor: '#979797',
    topic_text_color: '#000000',
    topic_link: '',
    topic_link_type: null
  },
]

export const experienceTopicLinkType = {
  fileLink : 'FILE_LINK',
  micrositeLink: 'MICROSITE_LINK'
}

export const MicrositeStyle = {
  videoContent: 'VIDEO_CONTENT',
  gridView: 'GRID_VIEW'
}