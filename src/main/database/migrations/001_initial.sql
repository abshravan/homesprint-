-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'member', -- admin, member, guest
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL, -- e.g., 'HOME', 'KITCHEN'
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Issue types table
CREATE TABLE issue_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL, -- Epic, Story, Task, Bug, etc.
    icon TEXT,
    color TEXT,
    description TEXT
);

-- Issues table (main table)
CREATE TABLE issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_key TEXT UNIQUE NOT NULL, -- e.g., 'HOME-123'
    project_id INTEGER NOT NULL REFERENCES projects(id),
    issue_type_id INTEGER NOT NULL REFERENCES issue_types(id),
    
    -- Basic fields
    summary TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo', -- todo, in_progress, done, etc.
    priority TEXT DEFAULT 'medium', -- blocker, critical, major, minor, trivial
    
    -- Assignment
    assignee_id INTEGER REFERENCES users(id),
    reporter_id INTEGER NOT NULL REFERENCES users(id),
    
    -- Dates
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    resolved_at DATETIME,
    
    -- Agile fields
    story_points INTEGER,
    epic_link INTEGER REFERENCES issues(id),
    sprint_id INTEGER REFERENCES sprints(id),
    
    -- Time tracking
    original_estimate INTEGER, -- minutes
    remaining_estimate INTEGER,
    time_spent INTEGER,
    
    -- Parody fields
    procrastination_level TEXT, -- low, medium, high, extreme
    excuse_category TEXT,
    netflix_episodes INTEGER DEFAULT 0,
    likelihood_completion INTEGER CHECK(likelihood_completion >= 0 AND likelihood_completion <= 100),
    spouse_approval_required BOOLEAN DEFAULT 0,
    energy_level_required TEXT,
    budget_impact TEXT,
    
    -- Metadata
    labels TEXT, -- JSON array stored as text
    components TEXT, -- JSON array
    custom_fields TEXT -- JSON object for extensibility
);

-- Sprints table
CREATE TABLE sprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    name TEXT NOT NULL,
    goal TEXT,
    start_date DATETIME,
    end_date DATETIME,
    status TEXT DEFAULT 'future', -- future, active, closed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    parent_comment_id INTEGER REFERENCES comments(id), -- for threaded replies
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT 0
);

-- Attachments table
CREATE TABLE attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Time logs table
CREATE TABLE time_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    time_spent INTEGER NOT NULL, -- minutes
    work_description TEXT,
    started_at DATETIME,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity log table
CREATE TABLE activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    action_type TEXT NOT NULL, -- created, updated, commented, status_changed, etc.
    old_value TEXT,
    new_value TEXT,
    field_changed TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Boards table
CREATE TABLE boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- kanban, scrum
    columns TEXT NOT NULL, -- JSON array of column definitions
    filter_query TEXT, -- Saved filter for board
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    issue_id INTEGER REFERENCES issues(id),
    type TEXT NOT NULL, -- assigned, mentioned, due_soon, overdue, etc.
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_issues_project ON issues(project_id);
CREATE INDEX idx_issues_assignee ON issues(assignee_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_sprint ON issues(sprint_id);
CREATE INDEX idx_comments_issue ON comments(issue_id);
CREATE INDEX idx_activity_issue ON activity_log(issue_id);
CREATE INDEX idx_activity_created ON activity_log(created_at);

-- Triggers for updated_at
CREATE TRIGGER update_issues_timestamp 
AFTER UPDATE ON issues
BEGIN
    UPDATE issues SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_users_timestamp 
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger for activity logging
CREATE TRIGGER log_issue_status_change
AFTER UPDATE OF status ON issues
WHEN OLD.status != NEW.status
BEGIN
    INSERT INTO activity_log (issue_id, user_id, action_type, old_value, new_value, field_changed)
    VALUES (NEW.id, NEW.assignee_id, 'status_changed', OLD.status, NEW.status, 'status');
END;

-- Seed initial data
INSERT INTO issue_types (name, icon, color, description) VALUES 
('Epic', 'zap', '#904ee2', 'Major household initiatives'),
('Story', 'bookmark', '#65ba43', 'User-facing household tasks'),
('Task', 'check-square', '#4bade8', 'Simple actionable items'),
('Bug', 'alert-circle', '#e13c3c', 'Things that went wrong'),
('Chore', 'clipboard', '#f5a623', 'Basic household maintenance'),
('Argument', 'message-circle', '#ff0000', 'Unresolved disputes'),
('Mystery', 'help-circle', '#9013fe', 'Unexplained phenomena');

INSERT INTO users (username, display_name, role) VALUES ('admin', 'Household Admin', 'admin');
