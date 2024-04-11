CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX users_username_idx ON users (username);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE friends (
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  PRIMARY KEY (sender_id, receiver_id)
);

CREATE INDEX friends_sender_id_idx ON friends (sender_id);
CREATE INDEX friends_receiver_id_idx ON friends (receiver_id);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX messages_sender_id_idx ON messages (sender_id);
CREATE INDEX messages_receiver_id_idx ON messages (receiver_id);
CREATE INDEX messages_created_at_idx ON messages (created_at);