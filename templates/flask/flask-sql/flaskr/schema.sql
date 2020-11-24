DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE post (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES user (id)
);

INSERT INTO user (username, password)
VALUES ("Mario", "123");

INSERT INTO user (username, password)
VALUES ("Luigi", "456");

INSERT INTO user (username, password)
VALUES ("Rick Astley", "789");

INSERT INTO post (author_id, created, title, body)
VALUES (1, CURRENT_TIMESTAMP, "First Post", "Pineapple Belongs on Pizza");

INSERT INTO post (author_id, created, title, body)
VALUES (1, CURRENT_TIMESTAMP, "Second Post", "Mario says stay cool");

INSERT INTO post (author_id, created, title, body)
VALUES (3, CURRENT_TIMESTAMP, "Third Post", "Never gonna give you up...");

