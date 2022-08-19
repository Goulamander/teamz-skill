CREATE OR REPLACE FUNCTION func_insert_userdetails(IN in_user_uuid uuid, IN in_name text, IN in_email text, IN in_profile_pic text, IN in_access_token text, IN in_team_id text, IN in_slack_user boolean, IN in_user_role integer) 
    RETURNS uuid AS 
$$
BEGIN
    INSERT INTO ts_user (k_user_id, s_first_name, s_email, s_profile_pic, s_team_id,  b_is_slack_user, k_role_id, t_created, t_modified)
    VALUES (in_user_uuid, in_name, in_email, in_profile_pic, in_team_id, in_slack_user, in_user_role, now(), now());
    INSERT INTO ts_user_auth (k_user_id, s_access_token, t_created, t_modified)
    VALUES (in_user_uuid, in_access_token, now(), now());
    
    RETURN in_user_uuid;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_user(IN in_user_email text) 
    RETURNS TABLE(
        uuid uuid, 
        email text, 
        profile_pic text, 
        first_name text,
        last_name text, 
        is_slack_user boolean,
        first_time_user boolean,
        user_role integer,
        access_token text,
        password text,
        salt text,
        verified boolean
    ) AS 
$$
BEGIN
    RETURN QUERY
    SELECT ts_user.k_user_id AS uuid, ts_user.s_email AS email, ts_user.s_profile_pic AS profile_pic, ts_user.s_first_name AS first_name, ts_user.s_last_name AS last_name, ts_user.b_is_slack_user AS is_slack_user, ts_user.b_is_new_user AS first_time_user, ts_user.k_role_id AS user_role, ts_user_auth.s_access_token AS access_token, ts_user_auth.s_password AS password, ts_user_auth.s_salt AS salt, ts_user_auth.b_verified AS verified FROM ts_user INNER JOIN ts_user_auth ON ts_user.k_user_id = ts_user_auth.k_user_id WHERE ts_user.s_email = in_user_email;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_skills() 
    RETURNS TABLE(
        id integer, 
        parent_skill_name text,
        skill_parent_id integer
    ) AS 
$$
BEGIN
    RETURN QUERY
    -- SELECT ts1.k_id AS id, ts1.s_skill AS parent_skill_name, ts2.s_skill AS skills_name, ts2.i_parent_skill_id AS skill_parent_id, ts2.k_id AS child_skill_id FROM ts_skills ts1 
    -- INNER JOIN ts_skills ts2
    -- ON ts1.k_id = ts2.i_parent_skill_id;
    SELECT ts.k_id AS id, ts.s_skill AS parent_skills_name, ts.i_parent_skill_id AS skill_parent_id FROM ts_skills ts WHERE ts.i_parent_skill_id = 0; 
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_insert_invites(IN in_user_uuid uuid, IN in_name text, IN in_email text) 
    RETURNS text AS 
$$
BEGIN
    INSERT INTO ts_invites (k_user_id, s_name, s_email, t_created, t_modified)
    VALUES (in_user_uuid, in_name, in_email, now(), now());    
    RETURN in_email;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_save_profile(IN in_user_uuid uuid, IN in_first_name text, IN in_last_name text, IN in_zip_code varchar, IN in_birthday date, IN in_job_title text, IN in_job_level text, IN in_motto text, IN in_user_role integer) 
    RETURNS text AS 
$$
BEGIN
    UPDATE ts_user SET (s_first_name, s_last_name, s_zip_code, t_dob, s_job_title, s_job_level, s_motto, b_is_new_user, k_role_id, s_search_text, t_modified) = 
    (in_first_name, in_last_name, in_zip_code, in_birthday, in_job_title, in_job_level, in_motto, false, in_user_role, (to_tsvector(in_first_name) || to_tsvector(in_last_name) || to_tsvector(s_email)), now())
    WHERE ts_user.k_user_id = in_user_uuid;
    RETURN in_first_name;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;


CREATE OR REPLACE FUNCTION func_get_child_skills(IN in_parent_id integer) 
    RETURNS TABLE(
        id integer, 
        name text
    ) AS 
$$
BEGIN
    RETURN QUERY
    SELECT ts.k_id AS id, ts.s_skill AS name FROM ts_skills ts WHERE ts.i_parent_skill_id = in_parent_id ORDER BY ts.k_id; 
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_save_skills(IN in_user_uuid uuid, IN in_skill_id integer, IN in_skill_value SKILLVALUE) 
    RETURNS uuid AS 
$$
BEGIN
    INSERT INTO ts_user_skills (k_user_id, k_skill_id, e_value, t_created, t_modified)
    VALUES (in_user_uuid, in_skill_id, in_skill_value, now(), now());
    
    RETURN in_user_uuid;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

------Code below removed intentionally------