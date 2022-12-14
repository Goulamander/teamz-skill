INSERT INTO ts_skills (s_skill, i_parent_skill_id, e_type, t_created, t_modified)
    VALUES ('Management Skills', 0, 'Boolean', now(), now()),
          ('Communication Skills', 1, 'Boolean', now(), now()),
          ('Team Building', 1, 'Boolean', now(), now()),
          ('Hiring', 1, 'Boolean', now(), now()),
          ('Performance Management', 1, 'Boolean', now(), now()),
          ('Executive Coaching', 1, 'Boolean', now(), now()),
          ('Leadership Skills', 1, 'Boolean', now(), now()),
          ('Industry Presence', 1, 'Boolean', now(), now()),
          ('Other..', 1, 'Boolean', now(), now()),

          ('People Skills', 0, 'Boolean', now(), now()),
          ('Empathy', 10, 'Boolean', now(), now()),
          ('Negotiation', 10, 'Boolean', now(), now()),
          ('Diversity and Inclusion', 10, 'Boolean', now(), now()),
          ('Conflict Resolution', 10, 'Boolean', now(), now()),
          ('Mental Health', 10, 'Boolean', now(), now()),
          ('Work Life Balance', 10, 'Boolean', now(), now()),
          ('Interpersonal Skill', 10, 'Boolean', now(), now()),
          ('Other..', 10, 'Boolean', now(), now()),
          
          ('Functional Domain Skills', 0, 'Multiple', now(), now()),
          ('Software Engineering', 19, 'Multiple', now(), now()),
          ('Hardware Engineering', 19, 'Multiple', now(), now()),
          ('Product Management', 19, 'Multiple', now(), now()),
          ('Product Marketing', 19, 'Multiple', now(), now()),
          ('Customer Success', 19, 'Multiple', now(), now()),
          ('IT Operation', 19, 'Multiple', now(), now()),
          ('Human Resource', 19, 'Multiple', now(), now()),
          ('Sales', 19, 'Multiple', now(), now()),

          ('Other Interest', 0, 'Multiple', now(), now()),
          ('Hiker', 28, 'Multiple', now(), now()),
          ('Biker', 28, 'Multiple', now(), now()),
          ('Camper', 28, 'Multiple', now(), now()),
          ('Wine Enthusiast', 28, 'Multiple', now(), now()),
          ('Gamer', 28, 'Multiple', now(), now()),
          ('Foodie', 28, 'Multiple', now(), now()),
          
          ('Data Science', 20, 'Multiple', now(), now()),
          ('SW Development Language', 20, 'Multiple', now(), now()),
          ('DevOps', 20, 'Multiple', now(), now()),
          ('Data Engineering', 20, 'Multiple', now(), now()),
          ('DataBase', 20, 'Multiple', now(), now()),
          ('UI/UX', 20, 'Multiple', now(), now()),

          ('System Design', 21, 'Multiple', now(), now()),
          ('Computer Architecture', 21, 'Multiple', now(), now()),
          ('Digital & Logic Design', 21, 'Multiple', now(), now()),
          ('Verification', 21, 'Multiple', now(), now()),
          ('Signal Integrity', 21, 'Multiple', now(), now()),
          ('VLSI Design', 21, 'Multiple', now(), now()),

          ('Product Strategy', 22, 'Multiple', now(), now()),
          ('Consumer SW Product', 22, 'Multiple', now(), now()),
          ('Enterprise SW Product', 22, 'Multiple', now(), now()),
          ('Hardware Product', 22, 'Multiple', now(), now()),
          ('Certificate program', 22, 'Multiple', now(), now()),
          ('Agile Development', 22, 'Multiple', now(), now()),

          ('Growth Strategy', 23, 'Multiple', now(), now()),
          ('Market Research', 23, 'Multiple', now(), now()),
          ('Marketing Analytics', 23, 'Multiple', now(), now()),
          ('Brand Management', 23, 'Multiple', now(), now()),
          ('Product Positioning', 23, 'Multiple', now(), now()),
          ('Certificate program', 23, 'Multiple', now(), now()),

          ('Strategy for CSMs', 24, 'Multiple', now(), now()),
          ('Customer On-boarding', 24, 'Multiple', now(), now()),
          ('Customer Support', 24, 'Multiple', now(), now()),
          ('Customer Analytics', 24, 'Multiple', now(), now()),
          ('Sales Enablement', 24, 'Multiple', now(), now()),
          ('Certificate program', 24, 'Multiple', now(), now()),

          ('Strategic Management', 26, 'Multiple', now(), now()),
          ('Recruitment and Staffing', 26, 'Multiple', now(), now()),
          ('Training & Development', 26, 'Multiple', now(), now()),
          ('Compensation & Benefits', 26, 'Multiple', now(), now()),
          ('Safety & Health', 26, 'Multiple', now(), now()),
          ('Employee & Labor Relations', 26, 'Multiple', now(), now()),

          ('Sales Skills', 27, 'Multiple', now(), now()),
          ('Sales Operation', 27, 'Multiple', now(), now()),
          ('Sales Enablement', 27, 'Multiple', now(), now()),
          ('Sales Management', 27, 'Multiple', now(), now()),
          ('CRM Software', 27, 'Multiple', now(), now()),
          ('Certificate program', 27, 'Multiple', now(), now());

INSERT INTO ts_roles (k_id, s_role, t_created, t_modified)
    VALUES ('1', 'MANAGER', now(), now()),
    ('2', 'IT_ADMIN_MANAGER', now(), now()),
    ('3', 'ADMIN_MANAGER', now(), now()),
    ('4', 'IC', now(), now()),
    ('5', 'IT_ADMIN_IC', now(), now()),
    ('6', 'ADMIN_IC', now(), now());

INSERT INTO ts_cp_popular_tags (s_tag_name, e_tag_type, s_tag_color, t_created, t_modified)
    VALUES ('Webinar', 'CONTENT_TAG', '#77D1F3', now(), now()),
    ('Customer case study', 'CONTENT_TAG', '#FEE2D5', now(), now()),   
    ('Solution brief', 'CONTENT_TAG', '#FFEAB6', now(), now()),   
    ('White Papers', 'CONTENT_TAG', '#FFD66E', now(), now()),   
    ('Ebooks', 'CONTENT_TAG', '#F82B60', now(), now()),   
    ('Demos & videos', 'CONTENT_TAG', '#2D7FF9', now(), now()),   
    ('Data sheets', 'CONTENT_TAG', '#CDB0FF', now(), now()),   
    ('Analyst Report', 'CONTENT_TAG', '#FFDAF6', now(), now()),   
    ('All Stages', 'CONTENT_STAGE_TAG', '#9CC7FF', now(), now()),   
    ('Prospecting', 'CONTENT_STAGE_TAG', '#EDE2FE', now(), now()),   
    ('Qualification', 'CONTENT_STAGE_TAG', '#D1F7C4', now(), now()),   
    ('Proposal', 'CONTENT_STAGE_TAG', '#93E088', now(), now()),   
    ('Value Proposition', 'CONTENT_STAGE_TAG', '#B2158B', now(), now()),   
    ('Account Management', 'CONTENT_STAGE_TAG', '#48C17B', now(), now());

INSERT INTO ts_microsite_library (s_image_url, s_header_color, s_image_type, t_created, t_modified)
    VALUES ('dist/library/logo_images/default_logo.png', '', 'Logo', now(), now()),
    ('dist/library/logo_images/netskope_logo.png', '', 'Logo', now(), now()),  
    ('dist/library/bg_images/bg_1.jpg', '#33180a', 'Background', now(), now()),  
    ('dist/library/bg_images/bg_2.jpg', '#080e1c', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_3.jpg', '#4077b8', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_4.jpg', '#304144', 'Background', now(), now()),  
    ('dist/library/bg_images/bg_5.jpg', '#a37e7f', 'Background', now(), now()),  
    ('dist/library/bg_images/bg_6.jpg', '#191e2b', 'Background', now(), now()),  
    ('dist/library/bg_images/bg_7.jpg', '#465f6f', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_8.jpg', '#144064', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_9.jpg', '#f2cc87', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_10.jpg', '#0891fc', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_11.jpg', '#514677', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_12.jpg', '#17192f', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_13.jpg', '#b1b1b1', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_14.jpg', '#63453d', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_15.jpg', '#153923', 'Background', now(), now()),   
    ('dist/library/bg_images/bg_16.jpg', '#c7b9b4', 'Background', now(), now());   