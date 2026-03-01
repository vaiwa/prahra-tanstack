CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clerk_user_id TEXT NOT NULL UNIQUE,
    email TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS game_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_slug TEXT NOT NULL,
    started_at TEXT,
    current_level_index INTEGER NOT NULL DEFAULT 0,
    total_hints_used INTEGER NOT NULL DEFAULT 0,
    total_penalty_sec INTEGER NOT NULL DEFAULT 0,
    is_complete INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    updated_at TEXT NOT NULL,
    UNIQUE (user_id, game_slug),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS level_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_slug TEXT NOT NULL,
    level_id TEXT NOT NULL,
    started_at TEXT,
    completed_at TEXT,
    hints_used INTEGER NOT NULL DEFAULT 0,
    penalty_sec INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    UNIQUE (user_id, game_slug, level_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);