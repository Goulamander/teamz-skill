'use strict';

const pg = require('pg');
const Config = require('./config');

function db() {
    this.pgConfig = {
        host: Config.DB_HOST,
        user: Config.DB_USER,
        database: Config.DB_NAME,
        password: Config.DB_PASSWORD,
        port: Config.DB_PORT,
        max: Config.DB_MAX_POOL,
        idleTimeoutMillis: Config.DB_IDLE_TIMEOUT
    };

    this.pool = new pg.Pool(this.pgConfig);
}


db.prototype.GetSkills = function (cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_skills()", function (err, result) {
            if (err) {
                console.error("error running func_get_skills db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.InsertUserDetails = function (guid, name, email, profile_pic, access_token, team_id, slackUser, userRole, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }

        client.query("SELECT * from func_insert_userdetails($1, $2, $3, $4, $5, $6, $7, $8)", [guid, name, email, profile_pic, access_token, team_id, slackUser, userRole], function (err, result) {
            if (err) {
                console.error("error running func_insert_userdetails db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_insert_userdetails db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null);
        });
    });
}

db.prototype.GetUser = function(username, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }

        client.query("SELECT * FROM func_get_user($1)", [username], function (err, result) {
            if (err) {
                console.error("error running func_get_user db function", err);
                cb(err, null);
                return;
            }

            done();
            
            if (result.rowCount < 1) {
                cb(null, false);
                return;
            }

            if (result.rowCount > 1) {
                cb(new Error("There is more than one entry in the database with username " + username));
                return;
            }

            cb(null, true, result.rows[0]);
        });
    });
}

db.prototype.InsertInvites = function (guid, name, email, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_insert_invites($1, $2, $3)", [guid, name, email], function (err, result) {
            if (err) {
                console.error("error running func_insert_invites db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_insert_invites db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null);
        });
    });
}

db.prototype.SaveProfileData = function (guid, userData, role, cb) {
    
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_save_profile($1, $2, $3, $4, $5, $6, $7, $8, $9)", [guid, userData.firstname, userData.lastname, userData.zipcode, userData.birthday, userData.job_title, userData.job_level, userData.motto, role], function (err, result) {
            if (err) {
                console.error("error running func_save_profile db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_save_profile db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.GetChildSkills = function (parentId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_child_skills($1)", [parentId], function (err, result) {
            if (err) {
                console.error("error running func_get_child_skills db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.SaveSkills = function (guid, skills, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_save_skills($1, $2, $3)", [guid, skills.skill_id, skills.skill_value], function (err, result) {
            if (err) {
                console.error("error running func_save_skills db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_save_skills db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.InsertUserRegisterDetails = function (guid, email, password, salt, slackUser, user_role, manager_id, department, employee_number, manager,fname, lname, zipcode, job_title, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }

        client.query("SELECT * from func_insert_user_registerdetails($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [guid, email, password, salt, slackUser, true, user_role, manager_id, department, employee_number, manager, fname, lname, zipcode, job_title], function (err, result) {
            if (err) {
                console.error("error running func_insert_user_registerdetails db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_insert_user_registerdetails db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result.rows[0]);
        });
    });
}

db.prototype.GetProfileData = function (guid, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_profile_data($1)", [guid], function (err, result) {
            if (err) {
                console.error("error running func_get_profile_data db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.InsertWeeklyUpdate = function (guid, updatesData, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_insert_weekly_updates($1, $2, $3, $4, $5, $6)", [guid, updatesData.execution, updatesData.craftsmanship, updatesData.leadership, updatesData.mentoring, updatesData.start_date], function (err, result) {
            if (err) {
                console.error("error running func_insert_weekly_updates db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_insert_weekly_updates db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.GetLastCreatedWeeklyRecords = function (guid, startDate, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_last_created_weekly_update($1, $2)", [guid, startDate], function (err, result) {
            if (err) {
                console.error("error running func_get_last_created_weekly_update db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows[0]);
        });
    });
}

db.prototype.UpdateProfileData = function (guid, userData, cb) {
    
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_update_profile($1, $2, $3, $4, $5, $6, $7, $8)", [guid, userData.first_name, userData.last_name, userData.zipcode,   userData.job_title, userData.job_level, userData.motto, userData.profile_pic], function (err, result) {
            if (err) {
                console.error("error running func_update_profile db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_update_profile db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.getWorkHighLights = function(userId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }

        client.query("SELECT * FROM func_get_work_highlights($1)", [userId], function (err, result) {
            if (err) {
                console.error("error running func_get_work_highlights db function", err);
                cb(err, null);
                return;
            }

            done();
            
            if (result.rowCount < 1) {
                cb(null, false);
                return;
            }

            if (result.rowCount > 1) {
                cb(new Error("There is more than one entry in the database with username " + username));
                return;
            }

            cb(null, true, result.rows[0]);
        });
    });
}

db.prototype.insertWorkHighlights = function (guid, data, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_insert_work_highlights($1, $2)", [guid, data.highlights], function (err, result) {
            if (err) {
                console.error("error running func_insert_workhighlights db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_insert_workhighlights db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.updateWorkHighlights = function (guid, data, cb) {
    
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_update_work_highlights($1, $2)", [guid, data.highlights], function (err, result) {
            if (err) {
                console.error("error running func_update_work_highlights db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_update_work_highlights db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.GetWeeklyUpdates = function (guid, dates, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_weekly_update($1, $2, $3)", [guid, dates.start_date, dates.end_date], function (err, result) {
            if (err) {
                console.error("error running func_get_weekly_update db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows[0]);
        });
    });
}

db.prototype.UpdateProfileWithImage = function (guid, userDetails, uploadedImage, cb) {
    let userData = JSON.parse(userDetails.userData);

    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_update_profile_img($1, $2, $3, $4, $5, $6, $7, $8)", [guid, userData.first_name, userData.last_name, userData.zipcode, userData.job_title, userData.job_level, userData.motto, uploadedImage], function (err, result) {
            if (err) {
                console.error("error running func_update_profile_img db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_update_profile_img db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.UpdateSlackDetails = function (guid, name, email, profile_pic, access_token, team_id, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("UPDATE ts_user set (s_name, s_email, s_profile_pic, s_team_id,t_modified) = ($2, $3, $4, $5, $6) where k_user_id = $1",[guid, name, email, profile_pic, team_id, new Date()], function (err, result) {
            if (err) {
                console.error("error running func_update_slack_detail db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_update_slack_detail db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null);
        });
    });
}

db.prototype.UpdateWeeklyUpdate = function (guid, updatesData, cb) {
    
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_update_weekly_updates($1, $2, $3, $4, $5, $6)", [guid, updatesData.execution, updatesData.craftsmanship, updatesData.leadership, updatesData.mentoring, updatesData.start_date], function (err, result) {
            if (err) {
                console.error("error running func_update_weekly_updates db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_update_weekly_updates db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.InsertCourses = function (guid, coursesData, cb) {
    
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_insert_courses($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [guid, coursesData.c_name, coursesData.c_link, coursesData.c_author_name, coursesData.c_by, coursesData.c_progress, coursesData.c_short_des, coursesData.c_logo, coursesData.c_image, coursesData.c_start_date, coursesData.c_end_date], function (err, result) {
            if (err) {
                console.error("error running func_insert_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_insert_courses db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result.rows[0]);
        });
    });
}

db.prototype.GetCourses = function (guid, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_courses($1)", [guid], function (err, result) {
            if (err) {
                console.error("error running func_get_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.UpdateCourses = function (guid, coursesData, cb) {
    
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_update_courses($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [guid, coursesData.c_name, coursesData.c_link, coursesData.c_author_name, coursesData.c_by, coursesData.c_progress, coursesData.c_id, coursesData.c_short_des, coursesData.c_logo, coursesData.c_image, coursesData.c_start_date, coursesData.c_end_date], function (err, result) {
            if (err) {
                console.error("error running func_update_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_update_courses db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.DeleteCourses = function (guid, coursesData, cb) {
    
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_delete_courses($1, $2)", [guid, coursesData.c_id], function (err, result) {
            if (err) {
                console.error("error running func_update_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            if (result.rowCount != 1) {
                cb(new Error("Unexpected result from func_update_courses db function - rowCount is " + result.rowCount));
                return;
            }

            cb(null, result);
        });
    });
}

db.prototype.GetUserSkillsData = function (guid, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_user_skills($1)", [guid], function (err, result) {
            if (err) {
                console.error("error running func_get_user_skills db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetRecommendCourses = function (args1, args2, skill_level, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_recommand_courses($1, $2, $3)", [args1, args2, skill_level], function (err, result) {
            if (err) {
                console.error("error running func_get_recommand_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.InsertCustomCourses = function (guid, coursesData, imageUrl, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
 
        client.query("SELECT * from func_insert_custom_courses($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [guid, coursesData.title, coursesData.description, coursesData.duration, coursesData.user_role, coursesData.tag, coursesData.state, coursesData.is_manager_sign, coursesData.is_step_in_order, coursesData.GetStepTitle(), coursesData.GetStepType(), coursesData.GetStepLink(), imageUrl, coursesData.c_type, coursesData.GetStepIframeUrl()], function (err, result) {
            if (err) {
                console.error("error running func_insert_custom_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows[0]);
        });
    });
}

db.prototype.UpdateCustomCourses = function (guid, courseId, coursesData, imageUrl, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_update_custom_courses($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [guid, courseId, coursesData.title, coursesData.description, coursesData.duration, coursesData.user_role, coursesData.tag, coursesData.state, coursesData.is_manager_sign, coursesData.is_step_in_order,coursesData.GetStepTitle(), coursesData.GetStepType(), coursesData.GetStepLink(), imageUrl, coursesData.GetStepIframeUrl()], function (err, result) {
            if (err) {
                console.error("error running func_update_custom_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetCustomCourses = function (userId, roleId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_custom_courses($1, $2)", [userId, roleId], function (err, result) {
            if (err) {
                console.error("error running func_get_custom_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetTagsCustomCourses = function (userId, roleId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_tags_custom_courses($1, $2)", [userId, roleId], function (err, result) {
            if (err) {
                console.error("error running func_get_tags_custom_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetPopularCustomCourses = function (userId, roleId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_popular_custom_courses($1, $2)", [userId, roleId], function (err, result) {
            if (err) {
                console.error("error running func_get_popular_custom_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetRecentPublishCustomCourses = function (userId, roleId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_recent_publish_custom_courses($1, $2)", [userId, roleId], function (err, result) {
            if (err) {
                console.error("error running func_get_new_hire_custom_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.DeleteDraftCustomCourse = function (userId, courseId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_delete_custom_course($1, $2)", [userId, courseId], function (err, result) {
            if (err) {
                console.error("error running func_delete_draft_custom_course db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.InsertAssignCourses = function (guid, coursesData, stepIds, assignToId, stepTypes, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_insert_assign_courses($1, $2, $3, $4, $5, $6)", [guid, coursesData.c_id, assignToId, 'UnStart', stepIds, stepTypes], function (err, result) {
            if (err) {
                console.error("error running func_insert_assign_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows[0]);
        });
    });
}

db.prototype.GetAssignCourses = function (userId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_assign_courses($1)", [userId], function (err, result) {
            if (err) {
                console.error("error running func_get_assign_courses db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetVerifyEmails = function (emails, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("select k_user_id from ts_user WHERE s_email IN ($1)", [emails], function (err, result) {
            if (err) {
                console.error("error running func_get_skills db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetCustomCourseByCourseId = function (userId, role, courseId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        
        client.query("SELECT * from func_get_custom_course_by_id($1, $2, $3)", [courseId, role, userId], function (err, result) {
            if (err) {
                console.error("error running func_get_custom_course_by_id db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetAssignCourseByCourseId = function (userId, courseId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_get_assign_course_by_id($1, $2)", [userId, courseId], function (err, result) {
            if (err) {
                console.error("error running func_get_assign_course_by_id db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetAssignCompleteCourseById = function (userId, courseId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT tacs.k_step_id AS step_id, tacs.b_complete AS step_complete, tac.t_course_started AS start_time, tccs.s_title AS step_title, tccs.e_type AS step_type, tccs.s_link AS step_link, tccs.k_course_id AS c_id, tcc.s_c_title AS c_title, tcc.s_c_description AS c_description, tcc.s_c_duration AS c_duration, tcc.s_c_tag AS c_tag, tac.e_state AS c_state, tcc.s_c_image AS c_image, tcc.b_manager_sign_off AS c_is_manager_sign, tcc.b_steps_in_order AS c_is_step_in_order, tu.s_first_name AS assigned_by, tcc.b_is_deleted AS c_is_deleted, tcc.e_c_type AS c_type, tsp.s_video_url AS customStepUrl, tsp.s_video_title AS video_title, tac.k_assign_by AS assign_by_id, tac.k_assign_to AS assign_to_id, tacs.e_quiz_tracker AS is_quiz_started, tac.k_id AS assign_c_id, tacs.k_id AS assign_step_id, tacs.s_course_step_result AS quiz_result, tccs.s_iframe_url AS iframe_url FROM ts_assign_course_steps tacs INNER JOIN ts_assign_courses tac ON tac.k_id = tacs.k_course_id INNER JOIN ts_custom_course_steps tccs ON tccs.k_id = tacs.k_step_id INNER JOIN ts_custom_courses tcc ON tcc.k_id = tccs.k_course_id INNER JOIN ts_user tu ON tu.k_user_id = tac.k_assign_by LEFT JOIN ts_c_review_step_feedback tsp ON ( tsp.k_user_id = tac.k_assign_to AND tsp.k_course_id = $2 ) WHERE tac.k_assign_to = $1 AND tac.k_course_id = $2 AND tac.e_state = 'Complete' ORDER BY tacs.k_id ASC", [userId, courseId], function (err, result) {
            if (err) {
                console.error("error running func_get_complete_assign_course_by_id db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });

    });
}

db.prototype.CheckAssignCourseExist = function(userId, courseId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }

        client.query("SELECT * FROM func_check_assign_course_exist($1, $2)", [userId, courseId], function (err, result) {
            if (err) {
                console.error("error running func_check_assign_course_exist db function", err);
                cb(err, null);
                return;
            }

            done();
            
            if (result.rowCount < 1) {
                cb(null, false);
                return;
            }

            if (result.rowCount > 1) {
                cb(new Error("There is more than one entry in the database with username " + username));
                return;
            }
    
            cb(null, true, result.rows[0]);
        });
    });
}

db.prototype.StartAssignCourse = function (guid, courseId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_start_assign_course($1, $2)", [guid, courseId], function (err, result) {
            if (err) {
                console.error("error running func_start_assign_course db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.MarkStepComplete = function (guid, courseId, stepId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_mark_step_complete($1, $2, $3)", [guid, courseId, stepId], function (err, result) {
            if (err) {
                console.error("error running func_mark_step_complete db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.AssignCourseComplete = function (guid, courseId, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_assign_course_complete($1, $2)", [guid, courseId], function (err, result) {
            if (err) {
                console.error("error running func_assign_course_complete db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.GetAllUser = function (guid, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT s_email, k_user_id from ts_user where NOT (k_role_id = (SELECT k_id from ts_roles where s_role = 'manager'))", function (err, result) {
            if (err) {
                console.error("error running func_get_all_user db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

db.prototype.CreateSchema = function (oldSchems, newSchema, cb) {
    this.pool.connect(function (err, client, done) {
        if (err) {
            console.error("error fetching client from pool", err);
            cb(err, null);
            return;
        }
        client.query("SELECT * from func_clone_schema($1, $2)", [oldSchems, newSchema], function (err, result) {
            if (err) {
                console.error("error running func_clone_schema db function", err);
                cb(err, null);
                return;
            }

            done();

            cb(null, result.rows);
        });
    });
}

// ------Code below removed intentionally------

module.exports = new db();