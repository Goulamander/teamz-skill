const AccessControl = require('role-acl');

const grantsObject = require('../accessControlRoles.js') 
 
const ac = new AccessControl(grantsObject);

const userRolesMapping = ["MANAGER", "IT_ADMIN_MANAGER", "ADMIN_MANAGER", "IC", "IT_ADMIN_IC", "ADMIN_IC"];

const AccessControlCheck = (req, res, next) => {

    let userRole = getUserRoleName(req.payload.role);
    console.log("userRole", userRole);
    if(Object.keys(req.params).length === 0) {
        const permission = ac.can(userRole).execute(req.method).on(req.originalUrl);
        permission.then(data => {
            //console.log(data);
            if(data.granted) {
                next()
            } else {
                res.status(403).end();
            }
        }).catch(err => {
            res.status(403).end(err.message);
        })
    } else {

        let fullPath = req.originalUrl.split('/');
        let endPath = req.route.path.split('/');

        fullPath.splice((fullPath.length - (endPath.length - 1)), (endPath.length - 1));

        let path = `${fullPath.join('/')}${req.route.path}`;

        const permission = ac.can(userRole).execute(req.method).on(path);
        permission.then(data => {
            //console.log(data);
            if(data.granted) {
                next()
            } else {
                res.status(403).end();
            }
        }).catch(err => {
            res.status(403).end(err.message);
        })
    }
}

getUserRoleName = (roleID) => {
    return roleID <= userRolesMapping.length ? userRolesMapping[roleID -1] : 'IC'
}

module.exports = AccessControlCheck;