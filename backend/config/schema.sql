-- run: 
-- psql database-url -f schema.sql

CREATE TABLE if not exists users (
  kinde_user_id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username TEXT NOT NULL,
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL,
  user_email VARCHAR(255) REFERENCES users(email),
  created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE tasks (
--   id SERIAL PRIMARY KEY,
--   category_id INTEGER REFERENCES categories(id),
--   title TEXT NOT NULL
-- );