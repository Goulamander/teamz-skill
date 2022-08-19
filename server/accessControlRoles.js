
let ICRoles = [
    {   "resource": "/api/v1/courses", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/courses", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/courses", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/courses", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/courses/recommendation", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/courses/recommendation", "action": "GET", "attributes": ["*"] },

    {   "resource": "/api/v1/profile", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/profile", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/profile", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/profile", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/custom-course", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/custom-course/library", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/library", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course/library", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/library", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/custom-course/:c_id", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/:c_id", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course/:c_id", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/:c_id", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/custom-course/assign", "action": "GET", "attributes": ["*"]   },

    {   "resource": "/api/v1/custom-course/assign/:c_id", "action": "GET", "attributes": ["*"]   },
    
    {   "resource": "/api/v1/custom-course/assign/complete/:c_id", "action": "GET", "attributes": ["*"]   },

    {   "resource": "/api/v1/custom-course/assign/startcourse", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/startcourse", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course/assign/startcourse", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/startcourse", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/custom-course/assign/markcomplete", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/markcomplete", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course/assign/markcomplete", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/markcomplete", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/custom-course/assign/complete", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/complete", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course/assign/complete", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/complete", "action": "DELETE", "attributes": ["*"] },
    
    {   "resource": "/api/v1/custom-course/assign/step/pitch", "action": "POST", "attributes": ["*"] },
    
    {   "resource": "/api/v1/weekly-update", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/weekly-update", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/weekly-update", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/weekly-update", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/get-weekly-update", "action": "POST", "attributes": ["*"] },

    {   "resource": "/api/v1/work-highlights", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/work-highlights", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/work-highlights", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/work-highlights", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/achievement", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/achievement", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/achievement", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/achievement", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/course-recommend", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/course-recommend", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/course-recommend", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/course-recommend", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/onboarding/send-invites", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/onboarding/send-invites", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/onboarding/send-invites", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/onboarding/send-invites", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/onboarding", "action": "*", "attributes": ["*"] },

    {   "resource": "/api/okta/saml", "action": "*", "attributes": ["*"]   },
    {   "resource": "/api/okta/saml/register", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/okta/saml/login", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/okta/saml/logout", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/user-profile/:_id", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/profile/search", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/profile/user-skills", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/my-learning", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/my-learning/:c_id", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/isassign/:c_id", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/delete/:c_id", "action": "DELETE", "attributes": ["*"] },
    {   "resource": "/api/v1/upload-video", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/upload-microsite-recorded-video", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/step/quiz", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/step/quiz/get", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/step/feedback/requested", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/step/feedback/forme", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/team", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/team/team-members/:team_id", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/my-contents", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/my-contents", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/create-microsite", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/modify-microsite", "action": "PUT", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/microsite/:microsite_link", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/popular-contents", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/my-shares", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/microsite/content-cards", "action": "DELETE", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/microsite/add-new-content", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/recommended-contents", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/popular-tags", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/library-images", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/edit-portal-content", "action": "PUT", "attributes": ["*"] },
    { "resource": "/api/v1/profile/company-logo", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/profile/company-logo", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/experiences", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/experiences/experience/:experience_link", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/save-get-share-link", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/save-upload-video", "action": "*", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/save-cta-text", "action": "*", "attributes": ["*"] }
];

let ManagerRoles = [
    {   "resource": "/api/v1/custom-course/assign", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course/assign", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign", "action": "DELETE", "attributes": ["*"] },

    {   "resource": "/api/v1/custom-course/assign/:c_id", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/:c_id", "action": "GET", "attributes": ["*"]   },
    {   "resource": "/api/v1/custom-course/assign/:c_id", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/assign/:c_id", "action": "DELETE", "attributes": ["*"] },
    
    {   "resource": "/api/v1/upload", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1//get-file/:filename", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/direct-reports", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/step/feedback", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/step/feedback/requested", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/custom-course/step/feedback/forme", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/learners", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/learners/learner", "action": "*", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/courses", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/courses/course/:c_id", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/learning-analytics/courses/course/:c_id/:user_id", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/team", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/team", "action": "PUT", "attributes": ["*"] },
    {   "resource": "/api/v1/team", "action": "DELETE", "attributes": ["*"] },
    {   "resource": "/api/v1/team/team-members", "action": "POST", "attributes": ["*"] },
    {   "resource": "/api/v1/team/get-all-org-users/:team_id", "action": "GET", "attributes": ["*"] },
    {   "resource": "/api/v1/team/team-members", "action": "DELETE", "attributes": ["*"] },
    {   "resource": "/api/v1/team/assign-course", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/microsites/save-get-share-link", "action": "POST", "attributes": ["*"] }
];

let ITAdminManager = [
    { "resource": "*", "action": "*", "attributes": ["*"] }
];

let ITAdminIC = [
    { "resource": ['*', '!/api/v1/learning-analytics/direct-reports', '!/api/v1/analytics/opportunity-amount', '!/api/v1/analytics/quota-attainment'], "action": "*", "attributes": ["*"] }
];


let AdminManager = [
    { "resource": "/api/v1/learning-analytics/learners", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/learning-analytics/learners/learner/:user_id", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/learning-analytics/courses", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/learning-analytics/courses/course/:c_id", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/learning-analytics/courses/course/:c_id/:user_id", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/analytics/quota-attainment", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/analytics/opportunity-amount", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/learning-analytics/courses/delete", "action": "DELETE", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker/add-tags", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker/delete-contents", "action": "DELETE", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker/add-contents-to-portal", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/recommended-contents", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/popular-tags", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-analytics", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/profile/company-logo", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/experiences/create-experience", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/experiences/update-experience", "action": "PUT", "attributes": ["*"] },
    { "resource": "/api/v1/admin/def-exp-templates", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/admin/def-exp-templates", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/admin/def-exp-templates/template/:template_link", "action": "GET", "attributes": ["*"] },
]

let AdminIC = [
    { "resource": "/api/v1/analytics/quota-attainment", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/analytics/opportunity-amount", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/learning-analytics/courses/delete", "action": "DELETE", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker/add-tags", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker/delete-contents", "action": "DELETE", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-picker/add-contents-to-portal", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/popular-tags", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/recommended-contents", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/content-analytics", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/profile/company-logo", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/experiences/create-experience", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/content-portal/experiences/update-experience", "action": "PUT", "attributes": ["*"] },
    { "resource": "/api/v1/admin/def-exp-templates", "action": "POST", "attributes": ["*"] },
    { "resource": "/api/v1/admin/def-exp-templates", "action": "GET", "attributes": ["*"] },
    { "resource": "/api/v1/admin/def-exp-templates/template/:template_link", "action": "GET", "attributes": ["*"] },
]

let grants = {
    "IC": {
        "grants": [...ICRoles]
    },

    "MANAGER": {
        "grants": [...ICRoles, ...ManagerRoles]
    },

    "IT_ADMIN_MANAGER": {
        "grants": [...ITAdminManager]
    },

    "IT_ADMIN_IC": {
        "grants": [...ITAdminIC]
    },

    "ADMIN_MANAGER": {
        "grants": [...ICRoles, ...ManagerRoles, ...AdminManager]
    },

    "ADMIN_IC": {
        "grants": [...ICRoles, ...ManagerRoles, ...AdminIC]
    }
}

module.exports = grants;