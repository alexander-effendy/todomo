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

CREATE TABLE if not exists categories (
  id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL,
  user_email VARCHAR(255) REFERENCES users(email),
  created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  subcategory_name TEXT NOT NULL,
  category INTEGER REFERENCES categories(id),
  subcategories_status BOOLEAN NOT NULL,
  created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generalTasks (
  id SERIAL PRIMARY KEY,
  task_name TEXT NOT NULL,
  task_status BOOLEAN NOT NULL,
  task_description VARCHAR(300) NOT NULL,
  category INTEGER REFERENCES categories(id),
  created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  task_name TEXT NOT NULL,
  task_status BOOLEAN NOT NULL,
  task_description VARCHAR(300) NOT NULL,
  subcategory INTEGER REFERENCES subcategories(id),
  category INTEGER REFERENCES categories(id),
  created_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);