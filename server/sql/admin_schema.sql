-- #TEAMZ SKILL ADMIN SCHEMA

CREATE SCHEMA ts_admin; 

CREATE TABLE ts_admin.ts_tenants
  (
  k_id                           SERIAL PRIMARY KEY,
  k_user_id                      UUID NOT NULL,
  s_subdomain                    TEXT NOT NULL,
  s_sso_admin_email              TEXT,
  s_tenant_name                  TEXT UNIQUE NOT NULL,
  s_company                      TEXT,
  s_company_logo                 TEXT,
  s_placeholder_logo             TEXT,
  s_salesforce_email             TEXT,
  s_entity_type                  TEXT NOT NULL,
  s_entity_id                    TEXT,
  s_cert_url                     TEXT,
  s_team_id                      TEXT,
  s_saml_metadata_xml            TEXT,
  s_callback_url                 TEXT,
  s_entry_point                  TEXT,
  b_saml_enable                  BOOLEAN DEFAULT FALSE,
  b_allow_password_signin        BOOLEAN DEFAULT FALSE,
  t_created                      TIMESTAMP NOT NULL,
  t_modified                     TIMESTAMP NOT NULL
  )
  WITH (
    OIDS=FALSE
  );

CREATE TABLE ts_admin.ts_sys_gen_exp_templates
  (
    k_id                            SERIAL PRIMARY KEY,
    s_title                         TEXT NOT NULL,
    s_description                   TEXT NOT NULL,
    s_logo                          TEXT NOT NULL,
    s_link                          TEXT NOT NULL,
    s_text_to_display               TEXT NOT NULL,
    s_background_img                TEXT NOT NULL,
    t_created                       TIMESTAMP NOT NULL,
    t_modified                      TIMESTAMP NOT NULL
  )
WITH (
  OIDS=FALSE
);

CREATE TABLE ts_admin.ts_sys_gen_exp_template_topics
  (
    k_id                            SERIAL PRIMARY KEY,
    k_experience_id                 INTEGER REFERENCES ts_admin.ts_sys_gen_exp_templates (k_id),
    s_topic_name                    TEXT NOT NULL,
    s_topic_bgcolor                 TEXT NOT NULL,
    s_topic_text_color              TEXT NOT NULL,
    s_topic_link                    TEXT,
    s_topic_link_type               TOPIC_LINK_TYPE,
    t_created                       TIMESTAMP NOT NULL,
    t_modified                      TIMESTAMP NOT NULL
  )
WITH (
  OIDS=FALSE
);

CREATE OR REPLACE FUNCTION ts_admin.func_insert_def_exp_templates(IN in_title TEXT, IN in_short_description TEXT, IN in_link TEXT, IN in_cutomize_link TEXT, IN in_logo TEXT, IN in_backgroung_img TEXT, IN in_topic_name TEXT[], in_topic_bgcolor TEXT[], in_topic_textcolor TEXT[], in_topic_link TEXT[], in_topic_link_type TOPIC_LINK_TYPE[]) 
    RETURNS integer AS 
$$
DECLARE
    topic_name_length           integer;
    topic_bgcolor_length        integer;
    topic_textcolor_length      integer;
    topic_link_length           integer;
    topic_lintype_length        integer;
    experience_id               bigint;
BEGIN

    topic_name_length = array_length(in_topic_name, 1);
    topic_bgcolor_length = array_length(in_topic_bgcolor, 1);
    topic_textcolor_length = array_length(in_topic_textcolor, 1);
    topic_link_length = array_length(in_topic_link, 1);
    topic_lintype_length = array_length(in_topic_link_type, 1);

    IF  topic_name_length != topic_bgcolor_length OR
        topic_name_length != topic_link_length OR
        topic_name_length != topic_textcolor_length OR
        topic_name_length != topic_lintype_length THEN
        RAISE EXCEPTION 'Topics details arrays don''t match in size.';
    END IF;

    INSERT INTO ts_admin.ts_sys_gen_exp_templates (s_title, s_description, s_link, s_text_to_display, s_logo, s_background_img, t_created, t_modified)
    VALUES (in_title, in_short_description, in_link, in_cutomize_link, in_logo, in_backgroung_img, now(), now()) RETURNING k_id into experience_id;

    FOR i IN 1..topic_name_length
    LOOP
       INSERT INTO ts_admin.ts_sys_gen_exp_template_topics (k_experience_id, s_topic_name, s_topic_bgcolor, s_topic_text_color, s_topic_link, s_topic_link_type, t_created, t_modified)
       VALUES (experience_id, in_topic_name[i], in_topic_bgcolor[i], in_topic_textcolor[i], in_topic_link[i], in_topic_link_type[i], now(), now());
    END LOOP;
    RETURN experience_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

-- comments:
--- s_subdomain - IT customer input 
--- s_tenant_name - self created from subdomain. used for internal mapping
--- s_company - user input, company name used as company label. Optional
--- s_cert_url - IDP certifcate uploaded location url
--- s_entity_type - IDP client i.e Okta, Auth0, Slack etc  