# HoneyDo - Technical Stack Documentation

## Technology Stack Overview

**Application Type:** Desktop Application (Cross-platform)  
**Architecture:** Electron-based local-first application  
**Data Persistence:** SQLite embedded database with local file system storage

---

## Table of Contents

1. [Technology Stack Components](#technology-stack-components)
2. [Project Architecture](#project-architecture)
3. [Development Environment Setup](#development-environment-setup)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [IPC Communication](#ipc-communication)
7. [State Management](#state-management)
8. [Build & Packaging](#build--packaging)
9. [Dependencies](#dependencies)
10. [Development Workflow](#development-workflow)
11. [Testing Strategy](#testing-strategy)
12. [Security Considerations](#security-considerations)

---

## Technology Stack Components

### Frontend Layer

#### React 18+
- **Purpose:** UI component framework
- **Why React:**
  - Component-based architecture for reusable UI elements
  - Large ecosystem for UI libraries
  - Excellent developer tools and community support
  - Virtual DOM for efficient updates
  - Perfect for complex interactive boards (Kanban, Scrum)

#### TypeScript 5+
- **Purpose:** Type-safe JavaScript
- **Why TypeScript:**
  - Catch bugs at compile time
  - Better IDE autocomplete and refactoring
  - Self-documenting code through interfaces
  - Easier maintenance as project grows
  - Excellent integration with React

#### Tailwind CSS 3+
- **Purpose:** Utility-first CSS framework
- **Why Tailwind:**
  - Rapid UI development
  - Consistent design system
  - Small bundle size with purging
  - Easy to create "enterprise" aesthetic
  - No naming conventions needed

#### Additional Frontend Libraries

**shadcn/ui**
- Pre-built accessible React components
- Built on Radix UI primitives
- Customizable with Tailwind
- Copy-paste component approach

**React Router v6**
- Client-side routing
- Navigate between views (Dashboard, Boards, Issue Details)

**React Query (TanStack Query)**
- Server state management
- Caching and synchronization
- Optimistic updates
- Background refetching

**Zustand**
- Lightweight state management
- For UI state (filters, modals, selected items)
- Less boilerplate than Redux

**date-fns**
- Date manipulation and formatting
- Lightweight alternative to Moment.js
- Tree-shakeable

**@dnd-kit**
- Modern drag-and-drop library
- Accessible and performant
- Perfect for Kanban boards

**Recharts**
- React chart library
- For burndown charts, velocity charts
- Simple API, customizable

---

### Backend Layer (Electron Main Process)

#### Electron 28+
- **Purpose:** Desktop application framework
- **Why Electron:**
  - Cross-platform (Windows, Mac, Linux)
  - Single codebase
  - Access to Node.js APIs and file system
  - Native menus, dialogs, system tray
  - Auto-update capabilities

#### Node.js 20 LTS
- **Purpose:** JavaScript runtime for Electron main process
- **Why Node.js:**
  - Same language as frontend
  - NPM ecosystem access
  - File system operations
  - Process management

---

### Database Layer

#### SQLite 3
- **Purpose:** Embedded relational database
- **Why SQLite:**
  - Zero-configuration
  - Single file database
  - ACID compliant
  - Full SQL support
  - No server needed
  - Perfect for local-first apps
  - Supports up to 281 TB database size

#### better-sqlite3
- **Purpose:** Node.js SQLite bindings
- **Why better-sqlite3:**
  - Synchronous API (simpler than async)
  - Much faster than node-sqlite3
  - Prepared statements
  - Transaction support
  - TypeScript definitions available

---

### Storage Layer

#### Local File System
- **Purpose:** Store database and attachments
- **Location Structure:**
  ```
  ~/Documents/HoneyDo/          (or user-selected location)
  ├── database/
  │   └── honeydoo.db           (SQLite database)
  ├── attachments/
  │   ├── issue-{id}/
  │   │   ├── image1.jpg
  │   │   └── document.pdf
  │   └── ...
  ├── exports/
  │   └── backup-2024-01-15.json
  └── logs/
      └── app.log
  ```

#### electron-store
- **Purpose:** Store app preferences and settings
- **Why electron-store:**
  - Simple key-value storage
  - JSON-based
  - Auto-saves
  - Cross-platform path handling

---

## Project Architecture

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron App                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │          Renderer Process (React App)              │    │
│  │                                                     │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│  │  │ Components  │  │  React Query │  │ Zustand  │ │    │
│  │  │  - Dashboard│  │   (Cache)    │  │ (UI State)│ │    │
│  │  │  - Kanban   │  └──────────────┘  └──────────┘ │    │
│  │  │  - Issues   │                                  │    │
│  │  └─────────────┘                                  │    │
│  │         │                                          │    │
│  │         ▼                                          │    │
│  │  ┌─────────────────────────────────────────────┐ │    │
│  │  │         IPC Renderer (contextBridge)        │ │    │
│  │  └─────────────────────────────────────────────┘ │    │
│  └───────────────────────┬─────────────────────────┘    │
│                          │                               │
│                          │ IPC Communication             │
│                          │                               │
│  ┌───────────────────────▼─────────────────────────┐    │
│  │             Main Process (Node.js)               │    │
│  │                                                   │    │
│  │  ┌──────────────┐  ┌─────────────────────────┐ │    │
│  │  │ IPC Handlers │  │   Database Service       │ │    │
│  │  │              │──│   (better-sqlite3)       │ │    │
│  │  └──────────────┘  └─────────────────────────┘ │    │
│  │                                                   │    │
│  │  ┌──────────────┐  ┌─────────────────────────┐ │    │
│  │  │ File System  │  │   Window Management      │ │    │
│  │  │   Service    │  │   Menu / Tray / Dialogs  │ │    │
│  │  └──────────────┘  └─────────────────────────┘ │    │
│  └───────────────────────┬─────────────────────────┘    │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │             Local File System                    │    │
│  │  ┌────────────┐  ┌──────────────────────────┐  │    │
│  │  │ SQLite DB  │  │  Attachments / Exports   │  │    │
│  │  └────────────┘  └──────────────────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Process Communication

#### Main Process Responsibilities
- Window lifecycle management
- Database operations (CRUD)
- File system operations
- Native OS integration (menus, notifications, tray)
- Auto-updates
- Application settings

#### Renderer Process Responsibilities
- UI rendering and user interactions
- State management (UI state)
- Data caching and optimization
- Client-side validation
- Routing

---

## Development Environment Setup

### Prerequisites

```bash
# Required software versions
Node.js: 20.x LTS
npm: 10.x or yarn: 1.22.x
Git: Latest

# Operating System Requirements
- Windows 10/11 (x64)
- macOS 10.13+ (Intel or Apple Silicon)
- Linux (Ubuntu 20.04+, Fedora 32+)
```

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/yourusername/honeydoo.git
cd honeydoo

# 2. Install dependencies
npm install

# 3. Install Electron development tools
npm install -g electron

# 4. Set up environment variables
cp .env.example .env

# 5. Run development server
npm run dev
```

### Environment Variables

```env
# .env.example
NODE_ENV=development
ELECTRON_IS_DEV=1

# Database
DB_NAME=honeydoo.db
DB_PATH=./data

# Application
APP_NAME=HoneyDo
APP_VERSION=1.0.0

# Logging
LOG_LEVEL=debug
LOG_PATH=./logs

# Feature Flags (for parody features)
ENABLE_RIDICULOUS_METRICS=true
ENABLE_EXCUSE_GENERATOR=true
ENABLE_GUILT_NOTIFICATIONS=true
```

---

## Project Structure

```
honeydoo/
├── src/
│   ├── main/                      # Electron main process
│   │   ├── index.ts              # Main entry point
│   │   ├── preload.ts            # Preload script (contextBridge)
│   │   ├── database/
│   │   │   ├── connection.ts     # SQLite connection
│   │   │   ├── migrations/       # Database migrations
│   │   │   │   ├── 001_initial.sql
│   │   │   │   ├── 002_add_parody_fields.sql
│   │   │   │   └── migrate.ts
│   │   │   └── queries/          # SQL query functions
│   │   │       ├── issues.ts
│   │   │       ├── users.ts
│   │   │       ├── sprints.ts
│   │   │       └── comments.ts
│   │   ├── services/
│   │   │   ├── issue.service.ts  # Business logic
│   │   │   ├── file.service.ts   # File operations
│   │   │   ├── backup.service.ts # Export/Import
│   │   │   └── notification.service.ts
│   │   ├── ipc/
│   │   │   ├── handlers.ts       # IPC event handlers
│   │   │   └── channels.ts       # Channel definitions
│   │   ├── menu/
│   │   │   └── application-menu.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── paths.ts
│   │
│   ├── renderer/                  # React application
│   │   ├── src/
│   │   │   ├── App.tsx           # Root component
│   │   │   ├── main.tsx          # Entry point
│   │   │   ├── components/
│   │   │   │   ├── ui/           # Reusable UI components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Dialog.tsx
│   │   │   │   │   ├── Select.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   └── MainLayout.tsx
│   │   │   │   ├── issues/
│   │   │   │   │   ├── IssueCard.tsx
│   │   │   │   │   ├── IssueDetail.tsx
│   │   │   │   │   ├── IssueForm.tsx
│   │   │   │   │   └── IssueList.tsx
│   │   │   │   ├── boards/
│   │   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   │   ├── KanbanColumn.tsx
│   │   │   │   │   └── ScrumBoard.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   │   └── QuickStats.tsx
│   │   │   │   └── reports/
│   │   │   │       ├── BurndownChart.tsx
│   │   │   │       ├── VelocityChart.tsx
│   │   │   │       └── ShameBoard.tsx
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── BoardPage.tsx
│   │   │   │   ├── IssueDetailPage.tsx
│   │   │   │   ├── ReportsPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useIssues.ts
│   │   │   │   ├── useComments.ts
│   │   │   │   ├── useSprints.ts
│   │   │   │   └── useDatabase.ts
│   │   │   ├── store/
│   │   │   │   ├── uiStore.ts    # Zustand store
│   │   │   │   └── types.ts
│   │   │   ├── api/
│   │   │   │   ├── ipc.ts        # IPC wrapper functions
│   │   │   │   └── types.ts
│   │   │   ├── utils/
│   │   │   │   ├── date.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── validation.ts
│   │   │   ├── styles/
│   │   │   │   └── globals.css
│   │   │   └── types/
│   │   │       ├── issue.types.ts
│   │   │       ├── user.types.ts
│   │   │       └── index.ts
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── assets/
│   │   │       ├── icons/
│   │   │       └── images/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── shared/                    # Shared types between main/renderer
│       ├── types/
│       │   ├── ipc.types.ts
│       │   ├── database.types.ts
│       │   └── common.types.ts
│       └── constants/
│           ├── channels.ts        # IPC channel names
│           └── enums.ts
│
├── resources/                     # Application resources
│   ├── icons/
│   │   ├── icon.icns             # Mac icon
│   │   ├── icon.ico              # Windows icon
│   │   └── icon.png              # Linux icon
│   └── installer/
│       └── background.png
│
├── scripts/
│   ├── build.js                  # Build script
│   └── notarize.js               # macOS notarization
│
├── tests/
│   ├── main/
│   │   └── database.test.ts
│   └── renderer/
│       └── components/
│           └── IssueCard.test.tsx
│
├── electron-builder.yml          # Build configuration
├── package.json
├── tsconfig.json                 # TypeScript config (base)
├── tsconfig.main.json            # TypeScript config (main)
├── tsconfig.renderer.json        # TypeScript config (renderer)
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

---

## Database Schema

### SQLite Schema Design

```sql
-- migrations/001_initial.sql

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
```

### Database Migrations System

```typescript
// src/main/database/migrations/migrate.ts
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

interface Migration {
  version: number;
  filename: string;
  sql: string;
}

export class DatabaseMigrator {
  private db: Database.Database;
  private migrationsPath: string;

  constructor(db: Database.Database, migrationsPath: string) {
    this.db = db;
    this.migrationsPath = migrationsPath;
    this.initMigrationsTable();
  }

  private initMigrationsTable(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        filename TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private getCurrentVersion(): number {
    const result = this.db
      .prepare('SELECT MAX(version) as version FROM schema_migrations')
      .get() as { version: number | null };
    return result.version || 0;
  }

  private getMigrationFiles(): Migration[] {
    const files = fs.readdirSync(this.migrationsPath)
      .filter(f => f.endsWith('.sql'))
      .sort();

    return files.map(filename => {
      const version = parseInt(filename.split('_')[0]);
      const sql = fs.readFileSync(
        path.join(this.migrationsPath, filename),
        'utf-8'
      );
      return { version, filename, sql };
    });
  }

  public migrate(): void {
    const currentVersion = this.getCurrentVersion();
    const migrations = this.getMigrationFiles()
      .filter(m => m.version > currentVersion);

    if (migrations.length === 0) {
      console.log('Database is up to date');
      return;
    }

    this.db.transaction(() => {
      for (const migration of migrations) {
        console.log(`Applying migration ${migration.filename}...`);
        this.db.exec(migration.sql);
        this.db.prepare(`
          INSERT INTO schema_migrations (version, filename)
          VALUES (?, ?)
        `).run(migration.version, migration.filename);
      }
    })();

    console.log(`Applied ${migrations.length} migration(s)`);
  }
}
```

---

## IPC Communication

### Channel Definitions

```typescript
// src/shared/constants/channels.ts
export const IPC_CHANNELS = {
  // Issues
  ISSUES_GET_ALL: 'issues:getAll',
  ISSUES_GET_BY_ID: 'issues:getById',
  ISSUES_CREATE: 'issues:create',
  ISSUES_UPDATE: 'issues:update',
  ISSUES_DELETE: 'issues:delete',
  ISSUES_SEARCH: 'issues:search',
  
  // Comments
  COMMENTS_GET_BY_ISSUE: 'comments:getByIssue',
  COMMENTS_CREATE: 'comments:create',
  COMMENTS_UPDATE: 'comments:update',
  COMMENTS_DELETE: 'comments:delete',
  
  // Projects
  PROJECTS_GET_ALL: 'projects:getAll',
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_UPDATE: 'projects:update',
  
  // Users
  USERS_GET_ALL: 'users:getAll',
  USERS_GET_CURRENT: 'users:getCurrent',
  USERS_CREATE: 'users:create',
  
  // Sprints
  SPRINTS_GET_ACTIVE: 'sprints:getActive',
  SPRINTS_CREATE: 'sprints:create',
  SPRINTS_CLOSE: 'sprints:close',
  
  // Files
  FILES_UPLOAD: 'files:upload',
  FILES_DELETE: 'files:delete',
  FILES_OPEN: 'files:open',
  
  // Backup
  BACKUP_EXPORT: 'backup:export',
  BACKUP_IMPORT: 'backup:import',
  
  // Notifications
  NOTIFICATIONS_GET: 'notifications:get',
  NOTIFICATIONS_MARK_READ: 'notifications:markRead',
  
  // App
  APP_GET_VERSION: 'app:getVersion',
  APP_GET_DATA_PATH: 'app:getDataPath',
  
  // Window
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
} as const;
```

### Preload Script (Context Bridge)

```typescript
// src/main/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/channels';

// Type-safe IPC API
const electronAPI = {
  // Issues
  issues: {
    getAll: (projectId: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.ISSUES_GET_ALL, projectId),
    
    getById: (id: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.ISSUES_GET_BY_ID, id),
    
    create: (issue: CreateIssueDTO) => 
      ipcRenderer.invoke(IPC_CHANNELS.ISSUES_CREATE, issue),
    
    update: (id: number, updates: Partial<Issue>) => 
      ipcRenderer.invoke(IPC_CHANNELS.ISSUES_UPDATE, id, updates),
    
    delete: (id: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.ISSUES_DELETE, id),
    
    search: (query: string, filters?: SearchFilters) => 
      ipcRenderer.invoke(IPC_CHANNELS.ISSUES_SEARCH, query, filters),
  },
  
  // Comments
  comments: {
    getByIssue: (issueId: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.COMMENTS_GET_BY_ISSUE, issueId),
    
    create: (comment: CreateCommentDTO) => 
      ipcRenderer.invoke(IPC_CHANNELS.COMMENTS_CREATE, comment),
    
    update: (id: number, content: string) => 
      ipcRenderer.invoke(IPC_CHANNELS.COMMENTS_UPDATE, id, content),
    
    delete: (id: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.COMMENTS_DELETE, id),
  },
  
  // Projects
  projects: {
    getAll: () => 
      ipcRenderer.invoke(IPC_CHANNELS.PROJECTS_GET_ALL),
    
    create: (project: CreateProjectDTO) => 
      ipcRenderer.invoke(IPC_CHANNELS.PROJECTS_CREATE, project),
    
    update: (id: number, updates: Partial<Project>) => 
      ipcRenderer.invoke(IPC_CHANNELS.PROJECTS_UPDATE, id, updates),
  },
  
  // Users
  users: {
    getAll: () => 
      ipcRenderer.invoke(IPC_CHANNELS.USERS_GET_ALL),
    
    getCurrent: () => 
      ipcRenderer.invoke(IPC_CHANNELS.USERS_GET_CURRENT),
    
    create: (user: CreateUserDTO) => 
      ipcRenderer.invoke(IPC_CHANNELS.USERS_CREATE, user),
  },
  
  // Sprints
  sprints: {
    getActive: (projectId: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.SPRINTS_GET_ACTIVE, projectId),
    
    create: (sprint: CreateSprintDTO) => 
      ipcRenderer.invoke(IPC_CHANNELS.SPRINTS_CREATE, sprint),
    
    close: (id: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.SPRINTS_CLOSE, id),
  },
  
  // Files
  files: {
    upload: (issueId: number, filePath: string) => 
      ipcRenderer.invoke(IPC_CHANNELS.FILES_UPLOAD, issueId, filePath),
    
    delete: (attachmentId: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.FILES_DELETE, attachmentId),
    
    open: (filePath: string) => 
      ipcRenderer.invoke(IPC_CHANNELS.FILES_OPEN, filePath),
  },
  
  // Backup
  backup: {
    export: (filePath: string) => 
      ipcRenderer.invoke(IPC_CHANNELS.BACKUP_EXPORT, filePath),
    
    import: (filePath: string) => 
      ipcRenderer.invoke(IPC_CHANNELS.BACKUP_IMPORT, filePath),
  },
  
  // Notifications
  notifications: {
    get: (userId: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATIONS_GET, userId),
    
    markRead: (id: number) => 
      ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATIONS_MARK_READ, id),
    
    // Listen for new notifications
    onNew: (callback: (notification: Notification) => void) => {
      ipcRenderer.on('notification:new', (_, notification) => callback(notification));
      return () => ipcRenderer.removeAllListeners('notification:new');
    },
  },
  
  // App
  app: {
    getVersion: () => 
      ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION),
    
    getDataPath: () => 
      ipcRenderer.invoke(IPC_CHANNELS.APP_GET_DATA_PATH),
  },
  
  // Window controls
  window: {
    minimize: () => 
      ipcRenderer.send(IPC_CHANNELS.WINDOW_MINIMIZE),
    
    maximize: () => 
      ipcRenderer.send(IPC_CHANNELS.WINDOW_MAXIMIZE),
    
    close: () => 
      ipcRenderer.send(IPC_CHANNELS.WINDOW_CLOSE),
  },
};

// Expose to renderer
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type definitions for renderer
export type ElectronAPI = typeof electronAPI;
```

### IPC Handlers (Main Process)

```typescript
// src/main/ipc/handlers.ts
import { ipcMain, dialog } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';
import { IssueService } from '../services/issue.service';
import { CommentService } from '../services/comment.service';
import { ProjectService } from '../services/project.service';
import { FileService } from '../services/file.service';

export class IPCHandlers {
  constructor(
    private issueService: IssueService,
    private commentService: CommentService,
    private projectService: ProjectService,
    private fileService: FileService
  ) {}

  public registerHandlers(): void {
    // Issues
    ipcMain.handle(IPC_CHANNELS.ISSUES_GET_ALL, async (_, projectId: number) => {
      return this.issueService.getAll(projectId);
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_GET_BY_ID, async (_, id: number) => {
      return this.issueService.getById(id);
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_CREATE, async (_, issue: CreateIssueDTO) => {
      return this.issueService.create(issue);
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_UPDATE, async (_, id: number, updates: Partial<Issue>) => {
      return this.issueService.update(id, updates);
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_DELETE, async (_, id: number) => {
      return this.issueService.delete(id);
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_SEARCH, async (_, query: string, filters?: SearchFilters) => {
      return this.issueService.search(query, filters);
    });

    // Comments
    ipcMain.handle(IPC_CHANNELS.COMMENTS_GET_BY_ISSUE, async (_, issueId: number) => {
      return this.commentService.getByIssue(issueId);
    });

    ipcMain.handle(IPC_CHANNELS.COMMENTS_CREATE, async (_, comment: CreateCommentDTO) => {
      return this.commentService.create(comment);
    });

    // Projects
    ipcMain.handle(IPC_CHANNELS.PROJECTS_GET_ALL, async () => {
      return this.projectService.getAll();
    });

    ipcMain.handle(IPC_CHANNELS.PROJECTS_CREATE, async (_, project: CreateProjectDTO) => {
      return this.projectService.create(project);
    });

    // Files
    ipcMain.handle(IPC_CHANNELS.FILES_UPLOAD, async (_, issueId: number, filePath: string) => {
      return this.fileService.upload(issueId, filePath);
    });

    // Backup with dialog
    ipcMain.handle(IPC_CHANNELS.BACKUP_EXPORT, async (event) => {
      const { filePath } = await dialog.showSaveDialog({
        title: 'Export HoneyDo Data',
        defaultPath: `honeydoo-backup-${new Date().toISOString().split('T')[0]}.json`,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      if (filePath) {
        return this.fileService.exportData(filePath);
      }
      return null;
    });

    // Window controls
    ipcMain.on(IPC_CHANNELS.WINDOW_MINIMIZE, (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      window?.minimize();
    });

    ipcMain.on(IPC_CHANNELS.WINDOW_MAXIMIZE, (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (window?.isMaximized()) {
        window.unmaximize();
      } else {
        window?.maximize();
      }
    });

    ipcMain.on(IPC_CHANNELS.WINDOW_CLOSE, (event) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      window?.close();
    });
  }
}
```

### Using IPC in React Components

```typescript
// src/renderer/src/hooks/useIssues.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useIssues(projectId: number) {
  const queryClient = useQueryClient();

  // Fetch all issues
  const { data: issues, isLoading, error } = useQuery({
    queryKey: ['issues', projectId],
    queryFn: () => window.electronAPI.issues.getAll(projectId),
  });

  // Create issue mutation
  const createMutation = useMutation({
    mutationFn: (issue: CreateIssueDTO) => 
      window.electronAPI.issues.create(issue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
    },
  });

  // Update issue mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Issue> }) =>
      window.electronAPI.issues.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
    },
  });

  // Delete issue mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => window.electronAPI.issues.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
    },
  });

  return {
    issues,
    isLoading,
    error,
    createIssue: createMutation.mutate,
    updateIssue: updateMutation.mutate,
    deleteIssue: deleteMutation.mutate,
  };
}

// Usage in component
function IssueList({ projectId }: { projectId: number }) {
  const { issues, isLoading, createIssue } = useIssues(projectId);

  const handleCreate = () => {
    createIssue({
      summary: 'Take out trash',
      projectId,
      issueTypeId: 1,
      reporterId: 1,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create Issue</button>
      {issues?.map(issue => (
        <div key={issue.id}>{issue.summary}</div>
      ))}
    </div>
  );
}
```

---

## State Management

### React Query for Server State

```typescript
// src/renderer/src/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Query keys factory
export const queryKeys = {
  issues: {
    all: (projectId: number) => ['issues', projectId] as const,
    detail: (id: number) => ['issues', 'detail', id] as const,
    search: (query: string, filters?: SearchFilters) => 
      ['issues', 'search', query, filters] as const,
  },
  comments: {
    byIssue: (issueId: number) => ['comments', issueId] as const,
  },
  projects: {
    all: ['projects'] as const,
    detail: (id: number) => ['projects', id] as const,
  },
  sprints: {
    active: (projectId: number) => ['sprints', 'active', projectId] as const,
  },
};
```

### Zustand for UI State

```typescript
// src/renderer/src/store/uiStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Filters
  activeFilters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  
  // Modals
  modals: {
    createIssue: boolean;
    issueDetail: { open: boolean; issueId: number | null };
    settings: boolean;
  };
  openModal: (modal: keyof UIState['modals'], data?: any) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  
  // Board view
  boardView: 'kanban' | 'scrum';
  setBoardView: (view: 'kanban' | 'scrum') => void;
  
  // Selected items
  selectedIssues: number[];
  selectIssue: (id: number) => void;
  deselectIssue: (id: number) => void;
  clearSelection: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Sidebar
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        
        // Filters
        activeFilters: {},
        setFilters: (filters) => set({ activeFilters: filters }),
        clearFilters: () => set({ activeFilters: {} }),
        
        // Modals
        modals: {
          createIssue: false,
          issueDetail: { open: false, issueId: null },
          settings: false,
        },
        openModal: (modal, data) =>
          set((state) => ({
            modals: {
              ...state.modals,
              [modal]: typeof data === 'object' ? { open: true, ...data } : true,
            },
          })),
        closeModal: (modal) =>
          set((state) => ({
            modals: {
              ...state.modals,
              [modal]: typeof state.modals[modal] === 'object' 
                ? { open: false, issueId: null } 
                : false,
            },
          })),
        
        // Board view
        boardView: 'kanban',
        setBoardView: (view) => set({ boardView: view }),
        
        // Selected items
        selectedIssues: [],
        selectIssue: (id) =>
          set((state) => ({ selectedIssues: [...state.selectedIssues, id] })),
        deselectIssue: (id) =>
          set((state) => ({
            selectedIssues: state.selectedIssues.filter((i) => i !== id),
          })),
        clearSelection: () => set({ selectedIssues: [] }),
        
        // Theme
        theme: 'light',
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'honeydoo-ui-storage',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          boardView: state.boardView,
          theme: state.theme,
        }),
      }
    )
  )
);

// Usage in component
function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  
  return (
    <div className={sidebarCollapsed ? 'w-16' : 'w-64'}>
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        Toggle
      </button>
    </div>
  );
}
```

---

## Build & Packaging

### electron-builder Configuration

```yaml
# electron-builder.yml
appId: com.honeydoo.app
productName: HoneyDo
copyright: Copyright © 2024

directories:
  buildResources: resources
  output: dist

files:
  - '!**/.vscode/*'
  - '!src/*'
  - '!electron.vite.config.{js,ts,mjs,cjs}'
  - '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}'
  - '!{.env,.env.*,.npmrc,pnpm-lock.yaml}'

asarUnpack:
  - resources/**

afterSign: scripts/notarize.js

win:
  executableName: HoneyDo
  target:
    - target: nsis
      arch:
        - x64
  icon: resources/icons/icon.ico

nsis:
  artifactName: ${name}-${version}-setup.${ext}
  shortcutName: ${productName}
  uninstallDisplayName: ${productName}
  createDesktopShortcut: always
  oneClick: false
  allowToChangeInstallationDirectory: true

mac:
  entitlementsInherit: build/entitlements.mac.plist
  extendInfo:
    - NSCameraUsageDescription: Application requests access to device's camera.
    - NSMicrophoneUsageDescription: Application requests access to device's microphone.
    - NSDocumentsFolderUsageDescription: Application requests access to user's Documents folder.
  notarize: false
  target:
    - target: default
      arch:
        - x64
        - arm64
  icon: resources/icons/icon.icns

dmg:
  artifactName: ${name}-${version}-${arch}.${ext}
  icon: resources/icons/icon.icns

linux:
  target:
    - AppImage
    - deb
  maintainer: youremail@example.com
  category: Utility
  icon: resources/icons/
  desktop:
    Name: HoneyDo
    Comment: Enterprise Task Management for Home
    Categories: Utility;Office;

appImage:
  artifactName: ${name}-${version}-${arch}.${ext}

npmRebuild: false
publish:
  provider: generic
  url: https://example.com/auto-update
```

### Package.json Scripts

```json
{
  "name": "honeydoo",
  "version": "1.0.0",
  "description": "Enterprise Task Management for Domestic Operations",
  "main": "dist-electron/main/index.js",
  "scripts": {
    "dev": "electron-vite dev",
    "build": "npm run typecheck && electron-vite build",
    "preview": "electron-vite preview",
    "typecheck": "npm run typecheck:main && npm run typecheck:renderer",
    "typecheck:main": "tsc --noEmit -p tsconfig.main.json",
    "typecheck:renderer": "tsc --noEmit -p tsconfig.renderer.json",
    "lint": "eslint . --ext .js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "dist:win": "electron-builder --win",
    "dist:mac": "electron-builder --mac",
    "dist:linux": "electron-builder --linux",
    "postinstall": "electron-builder install-app-deps"
  },
  "dependencies": {
    "@electron-toolkit/preload": "^3.0.0",
    "@electron-toolkit/utils": "^3.0.0",
    "better-sqlite3": "^9.2.2",
    "electron-store": "^8.1.0",
    "electron-updater": "^6.1.7"
  },
  "devDependencies": {
    "@electron-toolkit/tsconfig": "^1.0.1",
    "@tanstack/react-query": "^5.17.10",
    "@types/better-sqlite3": "^7.6.8",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "electron": "^28.1.0",
    "electron-builder": "^24.9.1",
    "electron-vite": "^2.0.0",
    "eslint": "^8.56.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.10",
    "zustand": "^4.4.7"
  }
}
```

### Build Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Type checking
npm run typecheck        # Check TypeScript errors

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode

# Production builds
npm run dist             # Build for current platform
npm run dist:win         # Build for Windows
npm run dist:mac         # Build for macOS  
npm run dist:linux       # Build for Linux

# Preview build
npm run pack             # Build unpacked directory (fast)
```

---

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    // Electron
    "electron": "^28.1.0",
    "@electron-toolkit/preload": "^3.0.0",
    "@electron-toolkit/utils": "^3.0.0",
    "electron-store": "^8.1.0",
    "electron-updater": "^6.1.7",
    
    // Database
    "better-sqlite3": "^9.2.2",
    
    // React
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    
    // State Management
    "@tanstack/react-query": "^5.17.10",
    "zustand": "^4.4.7",
    
    // UI Components
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    "lucide-react": "^0.303.0",
    
    // Drag and Drop
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    
    // Forms
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.3",
    
    // Charts
    "recharts": "^2.10.3",
    
    // Date
    "date-fns": "^3.0.6",
    
    // Utilities
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    // TypeScript
    "typescript": "^5.3.3",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "@types/better-sqlite3": "^7.6.8",
    
    // Build tools
    "electron-builder": "^24.9.1",
    "electron-vite": "^2.0.0",
    "vite": "^5.0.10",
    "@vitejs/plugin-react": "^4.2.1",
    
    // CSS
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    
    // Code Quality
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0",
    "prettier": "^3.1.1",
    "prettier-plugin-tailwindcss": "^0.5.10",
    
    // Testing
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1"
  }
}
```

---

## Development Workflow

### Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/issue-kanban-board
# ... make changes
git add .
git commit -m "feat: implement kanban board drag and drop"
git push origin feature/issue-kanban-board

# Commit message conventions
# feat: New feature
# fix: Bug fix
# docs: Documentation changes
# style: Code style changes (formatting)
# refactor: Code refactoring
# test: Adding tests
# chore: Maintenance tasks
```

### Code Quality Commands

```bash
# Linting
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues

# Formatting
npm run format            # Format all files

# Type checking
npm run typecheck         # Check types without building

# Pre-commit (recommended: use husky)
npm run lint && npm run typecheck
```

### Hot Reload Development

The development environment includes:
- **Hot Module Replacement (HMR)** for React components
- **Automatic restart** for main process changes
- **DevTools** enabled by default
- **React DevTools** integration
- **Source maps** for debugging

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

```typescript
// tests/renderer/components/IssueCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { IssueCard } from '@/components/issues/IssueCard';

describe('IssueCard', () => {
  const mockIssue = {
    id: 1,
    issueKey: 'HOME-1',
    summary: 'Take out trash',
    status: 'todo',
    priority: 'high',
  };

  it('renders issue summary', () => {
    render(<IssueCard issue={mockIssue} />);
    expect(screen.getByText('Take out trash')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<IssueCard issue={mockIssue} onClick={onClick} />);
    
    fireEvent.click(screen.getByText('Take out trash'));
    expect(onClick).toHaveBeenCalledWith(mockIssue);
  });
});
```

### Database Tests

```typescript
// tests/main/database/issues.test.ts
import Database from 'better-sqlite3';
import { IssueService } from '@/main/services/issue.service';

describe('IssueService', () => {
  let db: Database.Database;
  let issueService: IssueService;

  beforeEach(() => {
    db = new Database(':memory:');
    // Run migrations
    issueService = new IssueService(db);
  });

  afterEach(() => {
    db.close();
  });

  it('creates a new issue', () => {
    const issue = issueService.create({
      summary: 'Test issue',
      projectId: 1,
      issueTypeId: 1,
      reporterId: 1,
    });

    expect(issue.id).toBeDefined();
    expect(issue.summary).toBe('Test issue');
  });

  it('updates issue status', () => {
    const issue = issueService.create({
      summary: 'Test issue',
      projectId: 1,
      issueTypeId: 1,
      reporterId: 1,
    });

    issueService.update(issue.id, { status: 'done' });
    const updated = issueService.getById(issue.id);

    expect(updated.status).toBe('done');
  });
});
```

---

## Security Considerations

### Context Isolation

```typescript
// Electron security best practices
const mainWindow = new BrowserWindow({
  webPreferences: {
    // Enable context isolation
    contextIsolation: true,
    
    // Disable Node.js integration in renderer
    nodeIntegration: false,
    
    // Use preload script
    preload: path.join(__dirname, 'preload.js'),
    
    // Disable remote module
    enableRemoteModule: false,
    
    // Sandbox renderer process
    sandbox: true,
  },
});
```

### Input Validation

```typescript
// Validate all inputs from renderer
ipcMain.handle('issues:create', async (_, issue: CreateIssueDTO) => {
  // Validate with Zod
  const schema = z.object({
    summary: z.string().min(1).max(255),
    projectId: z.number().positive(),
    priority: z.enum(['blocker', 'critical', 'major', 'minor', 'trivial']),
  });

  const validated = schema.parse(issue);
  return issueService.create(validated);
});
```

### SQL Injection Prevention

```typescript
// ALWAYS use prepared statements
// GOOD
const stmt = db.prepare('SELECT * FROM issues WHERE id = ?');
const issue = stmt.get(id);

// BAD - Never do this!
const issue = db.prepare(`SELECT * FROM issues WHERE id = ${id}`).get();
```

### File System Access

```typescript
// Restrict file access to app data directory
import { app } from 'electron';
import path from 'path';

const APP_DATA_PATH = app.getPath('userData');

function validateFilePath(filePath: string): boolean {
  const resolved = path.resolve(filePath);
  return resolved.startsWith(APP_DATA_PATH);
}

// Use in file operations
if (!validateFilePath(userProvidedPath)) {
  throw new Error('Invalid file path');
}
```

---

## Performance Optimization

### Database Optimization

```typescript
// Use transactions for bulk operations
db.transaction(() => {
  for (const issue of issues) {
    insertStmt.run(issue);
  }
})();

// Create indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
  CREATE INDEX IF NOT EXISTS idx_issues_assignee ON issues(assignee_id);
`);

// Use prepared statements
const stmt = db.prepare('SELECT * FROM issues WHERE project_id = ?');
// Reuse this statement multiple times
```

### React Optimization

```typescript
// Memoize expensive computations
const sortedIssues = useMemo(() => {
  return issues?.sort((a, b) => a.priority - b.priority);
}, [issues]);

// Memoize components
const IssueCard = memo(({ issue }) => {
  return <div>{issue.summary}</div>;
});

// Use React Query's built-in caching
const { data } = useQuery({
  queryKey: ['issues', projectId],
  queryFn: () => api.getIssues(projectId),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

### Bundle Size Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

---

## Logging & Debugging

### Logger Setup

```typescript
// src/main/utils/logger.ts
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export class Logger {
  private logPath: string;

  constructor() {
    const logDir = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logPath = path.join(logDir, 'app.log');
  }

  private write(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data ? JSON.stringify(data) : undefined,
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(this.logPath, logLine);

    // Also console.log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    this.write('INFO', message, data);
  }

  error(message: string, data?: any) {
    this.write('ERROR', message, data);
  }

  debug(message: string, data?: any) {
    this.write('DEBUG', message, data);
  }

  warn(message: string, data?: any) {
    this.write('WARN', message, data);
  }
}

export const logger = new Logger();
```

---

## Deployment Checklist

### Pre-Release

- [ ] Run all tests (`npm test`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds for all platforms
- [ ] Test database migrations
- [ ] Update version in `package.json`
- [ ] Update CHANGELOG.md
- [ ] Test on clean machine
- [ ] Verify file associations
- [ ] Test auto-update (if implemented)

### Release Process

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Build for all platforms
npm run dist

# 3. Test installers
# - Windows: dist/HoneyDo-1.0.0-setup.exe
# - Mac: dist/HoneyDo-1.0.0-arm64.dmg
# - Linux: dist/HoneyDo-1.0.0-x86_64.AppImage

# 4. Create GitHub release
# 5. Upload installers
# 6. Publish release notes
```

---

## Troubleshooting

### Common Issues

**Issue: `better-sqlite3` build fails**
```bash
# Solution: Rebuild native modules
npm run postinstall
# or
./node_modules/.bin/electron-rebuild
```

**Issue: TypeScript errors in main/renderer**
```bash
# Check correct tsconfig is being used
npm run typecheck:main
npm run typecheck:renderer
```

**Issue: Database locked**
```typescript
// Solution: Ensure proper connection closing
process.on('exit', () => {
  db.close();
});
```

**Issue: IPC not working**
```typescript
// Check:
// 1. Channel names match in preload and handlers
// 2. Context bridge exposes API correctly
// 3. Renderer uses window.electronAPI
```

---

## Additional Resources

### Documentation Links
- [Electron Documentation](https://www.electronjs.org/docs/latest)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

### Community
- Electron Discord
- React Community Discord
- Stack Overflow tags: electron, react, typescript

---

## Conclusion

This tech stack provides a solid foundation for building HoneyDo as a robust, performant, cross-platform desktop application. The combination of Electron, React, TypeScript, and SQLite offers:

- **Type Safety**: TypeScript throughout
- **Performance**: SQLite for fast local data access
- **Developer Experience**: Hot reload, modern tooling
- **User Experience**: Native desktop feel
- **Maintainability**: Clear separation of concerns
- **Testability**: Unit and integration tests

The parody nature of the project allows for iterative development where even "incomplete" features can be shipped as part of the joke, making it perfect for a solo developer or small team.

**Next Steps:**
1. Set up project structure
2. Implement database schema and migrations
3. Create basic CRUD operations
4. Build core UI components
5. Add parody features incrementally
6. Test and iterate

Happy coding! 🐝
