CREATE TABLE IF NOT EXISTS posts_b ( 
    post INTEGER NOT NULL UNIQUE AUTOINCREMENT,
    thread INTEGER DEFAULT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email TEXT DEFAULT NULL,
    postName TEXT,
    comment TEXT,
    file TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS posts_know ( 
    post INTEGER NOT NULL UNIQUE AUTOINCREMENT,
    thread INTEGER DEFAULT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email TEXT DEFAULT NULL,
    postName TEXT,
    comment TEXT,
    file TEXT DEFAULT NULL
);

-- CREATE TABLE IF NOT EXISTS threads (
--     -- boardId INTEGER,
--     threadId INTEGER PRIMARY KEY AUTOINCREMENT,
--     opComment TEXT NOT NULL
--     -- FOREIGN KEY (boardId)
--     -- REFERENCES boards (boardId)
--     --     ON DELETE CASCADE
-- );

CREATE TABLE IF NOT EXISTS boards (
    uri TEXT
    boardId INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
);
-- 
INSERT INTO boards VALUES
('b', 'Random', NULL)

INSERT INTO boards VALUES
('know', 'Knowledge and Information', NULL)