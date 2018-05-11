DROP DATABASE IF EXISTS chat;
CREATE DATABASE chat;

\c chat;

CREATE TABLE chatusers (
  ID SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE messages (
  ID SERIAL PRIMARY KEY,
  to_id INT,
  FOREIGN KEY (to_id) REFERENCES chatusers(id),
  from_id INT,
  FOREIGN KEY (from_id) REFERENCES chatusers(id),
  text VARCHAR,
  timestamp TIMESTAMP
);
