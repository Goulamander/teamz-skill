const db = require('../db');
const utils = require('../utils');

const GetSchema = (req, res, next) => {
    let schema = '';
    var domain = req.headers.host;
    var tenant = domain.split('.')[0];
    var subDomain = utils.GetValidSubDomain(tenant);

    if(req.payload) {
        
        if(!!req.payload.tenant === true) {
            schema = req.payload.tenant
            setSchemaValue(schema, (err, schemaName) => {
                if(err) {
                    return res.status(500).json({
                        status:500, success:false, message: err
                    });
                }
                next();
            });
        } else {
            schema = 'public';
            setSchemaValue(schema, (err, schemaName) => {
                if(err) {
                    return res.status(500).json({
                        status:500, success:false, message: err
                    });
                }
                next();
            });
        }

    } else if(!!req.body.tenant === true || subDomain !== 'app') {
        db.checkSamlData('s_subdomain', subDomain, 'ts_tenants', 'ts_admin', function(err, found, schemaName) {
            if(err) {
                return res.status(500).json({
                    status:500, success:false, message: err
                });
            }
           
            if(found) {
                schema = schemaName.s_tenant_name;
                setSchemaValue(schema, (err, schemaName) => {
                    if(err) {
                        return res.status(500).json({
                            status:500, success:false, message: err
                        });
                    }
                    next();
                });
            } else {
                return res.status(404).json({status:404, success:false, message: "Invalid tenant"})
            }
        })
    } else {
        schema = 'public';
        setSchemaValue(schema, (err, schemaName) => {
            if(err) {
                return res.status(500).json({
                    status:500, success:false, message: err
                });
            }
            next();
        });
    }
};


function setSchemaValue(schema, cb) {

    db.CheckSchema((err, setSchema) => {
        if(err) {
            cb(err);
        }
        console.log("seleted schema", setSchema.search_path);
        if(setSchema.search_path === schema) {
            cb(null, schema);
        } else {
            db.SetSchema(schema, (err, schemaName) => {
                if(err) {
                    cb(err);
                }
                console.log("new search path", schemaName);
                cb(null, schema);
            })
        }
    })
}

module.exports = GetSchema;