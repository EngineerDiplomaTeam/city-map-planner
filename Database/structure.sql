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

-- Structure: tables, sequences, functions, views
drop table if exists data.test;
create table data.test (
  id bigint generated always as identity,
  text text
);

insert into data.test (text) values ('Test 1'), ('Test 2');

drop table if exists user_data.test;
create table user_data.test (
  id bigint generated always as identity,
  text text
);

insert into user_data.test (text) values ('Test 1'), ('Test 2'), ('Test 3');
-- TODO: Replace test with actual structure
