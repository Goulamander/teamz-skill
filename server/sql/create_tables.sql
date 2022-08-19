
-- #TEAMZ SKILL DATABASE

--  --------
--  TS_ROLES
--  --------
CREATE TABLE ts_roles
  (
  k_id                           SERIAL PRIMARY KEY,
  s_role                         TEXT NOT NULL,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );

-- --------
-- TS_USER
-- --------
CREATE TABLE ts_user
  (
  k_user_id                       UUID PRIMARY KEY,
  s_email                         TEXT UNIQUE NOT NULL,
  s_profile_pic                   TEXT NULL,
  s_upload_pp                     TEXT NULL,
  s_first_name                    TEXT NULL,
  s_last_name                     TEXT NULL,
  s_zip_code                      VARCHAR NULL,
  s_team_id                       TEXT NULL,
  s_manager_id                    TEXT NULL,
  s_department                    TEXT NULL,
  s_employee_number               varchar NULL,
  s_manager                       TEXT NULL,
  t_dob                           DATE NULL,
  s_job_title                     TEXT NULL,
  k_role_id                       INTEGER REFERENCES TS_ROLES (k_id),
  s_job_level                     TEXT NULL,
  s_motto                         TEXT NULL,
  b_is_slack_user                 BOOLEAN NOT NULL,
  b_is_new_user                   BOOLEAN NOT NULL DEFAULT TRUE,
  s_search_text                   TSVECTOR NULL,
  t_last_login                    TIMESTAMP,
  t_created                       TIMESTAMP NOT NULL,
  t_modified                      TIMESTAMP NOT NULL
  ) 
  WITH (
    OIDS=FALSE
  );

--  ------------
--  TS_USER_AUTH
--  ------------
CREATE TABLE ts_user_auth
  (
  k_user_id                      UUID PRIMARY KEY REFERENCES TS_USER (k_user_id),
  s_password                     TEXT,
  s_salt                         TEXT,
  s_access_token                 TEXT NULL,
  b_verified                     BOOLEAN NOT NULL DEFAULT FALSE,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );

--  -------------
--  TS_SKILLSTYPE
--  -------------
CREATE TYPE SKILLTYPE AS ENUM ('Boolean', 'Multiple');
--  ---------
--  TS_SKILLS
--  ---------
CREATE TABLE ts_skills
  (
  k_id                           SERIAL PRIMARY KEY,
  s_skill                        TEXT NOT NULL,
  i_parent_skill_id              INTEGER NOT NULL,
  e_type                         SKILLTYPE NOT NULL,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  ----------
--  TS_INVITES
--  ----------
CREATE TABLE ts_invites
  (
  k_id                           SERIAL PRIMARY KEY,
  k_user_id                      UUID REFERENCES TS_USER (k_user_id),
  s_name                         TEXT,
  s_email                        TEXT NOT NULL,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  -------------
--  TS_SKILLVALUE
--  -------------
CREATE TYPE SKILLVALUE AS ENUM ('Default', 'Beginner','Intermediate', 'Advanced', 'Not my thing');
--  -------------
--  TS_USER_SKILL
--  -------------
CREATE TABLE ts_user_skills
  (
  k_id                           SERIAL PRIMARY KEY,
  k_user_id                      UUID REFERENCES TS_USER (k_user_id),
  k_skill_id                     INTEGER REFERENCES ts_skills(k_id),
  e_value                        SKILLVALUE NOT NULL,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  ----------------
--  TS_WEEKLY_UPDATE
--  ----------------
CREATE TABLE ts_weekly_update
  (
  k_id                           SERIAL PRIMARY KEY,
  k_user_id                      UUID REFERENCES TS_USER (k_user_id),
  s_execution                    TEXT NOT NULL,
  s_craftsmanship                TEXT NOT NULL,
  s_leadership                   TEXT NOT NULL,
  s_mentoring                    TEXT NOT NULL,
  t_date                         TIMESTAMP NOT NULL,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  ------------------
--  TS_WORK_HIGHLIGHTS
--  ------------------
CREATE TABLE ts_work_highlights
  (
  k_id                           SERIAL PRIMARY KEY,
  k_user_id                      UUID REFERENCES TS_USER (k_user_id),
  s_highlights                   TEXT NOT NULL,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  ----------
--  TS_COURSES
--  ----------
CREATE TABLE ts_courses
  (
  k_id                           SERIAL PRIMARY KEY,
  k_user_id                      UUID REFERENCES TS_USER (k_user_id),
  s_c_name                       TEXT NOT NULL,
  s_c_link                       TEXT NOT NULL,
  s_c_author_name                TEXT,
  s_c_by                         TEXT NOT NULL,
  s_c_short_des                  TEXT NULL,
  s_c_logo                       TEXT NULL,
  s_c_image                      TEXT NULL,
  s_c_start_date                 DATE NULL,
  s_c_end_date                   DATE NULL,
  b_is_deleted                   BOOLEAN NOT NULL DEFAULT FALSE,
  i_c_progress                   INTEGER NOT NULL,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  ---------------
--  TS_COURSES_DATA
--  ---------------
CREATE TABLE ts_courses_data
  (
    s_skill_name                TEXT,  
    s_skill_subcategory         TEXT,  
    s_course_name               TEXT,
    s_merchant_image_url        TEXT,
    s_merchant_name             TEXT,
    s_merchant_deep_link        TEXT,
    s_language                  TEXT,
    e_course_level              SKILLVALUE,
    s_course_provider           TEXT,
    s_course_description        TEXT,
    s_course_duration           VARCHAR,
    b_is_new                    BOOLEAN NOT NULL DEFAULT FALSE
  )
  WITH (
    OIDS=FALSE
  );

--  ----------------
--  TS_COURSES_STATE
--  ----------------
CREATE TYPE STATE AS ENUM ('Save', 'Draft');

--  ----------------
--  TS_COURSES_TYPE
--  ----------------
CREATE TYPE CC_TYPE AS ENUM ('LEARNING_PATH', 'SALES_ENGINEERING_TRAINING', 'SALES_REP_TRAINING');

--  -----------------
--  TS_CUSTOM_COURSES
--  -----------------
CREATE TABLE ts_custom_courses
  (
  k_id                           SERIAL PRIMARY KEY,
  k_user_id                      UUID REFERENCES TS_USER (k_user_id),
  s_c_title                      TEXT NOT NULL,
  s_c_description                TEXT NOT NULL,
  s_c_duration                   TEXT,
  s_c_image                      TEXT,
  i_access_permission            INTEGER REFERENCES TS_ROLES(k_id),
  s_c_tag                        TEXT NOT NULL,
  e_c_state                      STATE NOT NULL,
  e_c_type                       CC_TYPE NOT NULL,
  b_steps_in_order               BOOLEAN DEFAULT FALSE,
  b_manager_sign_off             BOOLEAN DEFAULT FALSE,
  b_is_deleted                   BOOLEAN DEFAULT FALSE,
  b_is_default_course            BOOLEAN DEFAULT FALSE,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  ------------
--  TS_STEP_TYPE
--  ------------
CREATE TYPE STEPTYPE AS ENUM ('InternalContent', 'ExternalContent','Activity', 'TaskToComplete_Quiz', 'TaskToComplete_RecordedVideo', 'TaskToComplete_Video');
--  ----------------------
--  TS_CUSTOM_COURSE_STEPS
--  ----------------------
CREATE TABLE ts_custom_course_steps
  (
  k_id                           SERIAL PRIMARY KEY,
  k_course_id                    INTEGER REFERENCES  ts_custom_courses(k_id),
  k_user_id                      UUID REFERENCES  ts_user(k_user_id),
  s_link                         TEXT NOT NULL,
  s_title                        TEXT NOT NULL,
  e_type                         STEPTYPE NOT NULL,
  b_is_deleted                   BOOLEAN DEFAULT FALSE,
  s_iframe_url                   TEXT,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );
--  --------------
--  TS_STATESTATUS
--  --------------
CREATE TYPE STATESTATUS AS ENUM ('UnStart', 'Start', 'Complete');
--  -----------------
--  TS_ASSIGN_COURSES
--  -----------------

------Code below removed intentionally------