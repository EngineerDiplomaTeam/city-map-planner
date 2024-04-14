-- Schemas
create schema if not exists data;
create schema if not exists user_data;

-- Privileges
grant all on schema data to group city_planner_user; -- OSM, Mass transit, etc (data fetched by service)
grant all privileges on all tables in schema data to group city_planner_user;
grant all privileges on all functions in schema data to group city_planner_user;
grant all privileges on all procedures in schema data to group city_planner_user;
grant all privileges on all sequences in schema data to group city_planner_user;

grant all on schema user_data to group city_planner_user; -- Custom POIs, settings, etc (irrecoverable data)
grant all privileges on all tables in schema user_data to group city_planner_user;
grant all privileges on all functions in schema user_data to group city_planner_user;
grant all privileges on all procedures in schema user_data to group city_planner_user;
grant all privileges on all sequences in schema user_data to group city_planner_user;
