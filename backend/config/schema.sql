-- run: 
-- psql database-url -f schema.sql

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  content TEXT NOT NULL
);