-- run: 
-- psql database-url -f schema.sql

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  kinde_user_id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username TEXT NOT NULL,
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE categories (
--   id SERIAL PRIMARY KEY,
--   title TEXT NOT NULL,
--   userId INTEGER REFERENCES users(kinde_user_id)
-- );

-- CREATE TABLE tasks (
--   id SERIAL PRIMARY KEY,
--   category_id INTEGER REFERENCES categories(id),
--   title TEXT NOT NULL
-- );