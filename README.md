# HomeSprint

> A satirical project management system that applies enterprise software complexity to mundane household tasks. Because why manage your chores simply when you can overcomplicate everything?

## Overview

HomeSprint is a Jira parody application built with Electron, React, and SQLite. It brings all the "joy" of enterprise project management tools to your home life, complete with sprint planning, burndown charts, and passive-aggressive comment tracking.

## Features

- **Issue Management**: Create, track, and procrastinate on household tasks
- **Scrum & Kanban Boards**: Visualize your domestic chaos
- **Sprint Planning**: Commit to tasks you'll never finish
- **Dashboard**: Real-time stats on your unproductivity
- **Comments**: Leave passive-aggressive notes for your household members
- **Parody Fields**: Track procrastination levels, spouse approval requirements, and more

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: shadcn/ui (Radix UI) + Tailwind CSS
- **Desktop Framework**: Electron
- **Database**: SQLite with better-sqlite3
- **State Management**: TanStack Query + Zustand
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit

## Prerequisites

- Node.js 20+
- npm 10+

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HomeSprint
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will:
- Start Vite dev server on port 5173
- Compile TypeScript for Electron main process
- Launch the Electron application

## Project Structure

```
HomeSprint/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── database/           # SQLite database & migrations
│   │   ├── ipc/                # IPC handlers
│   │   ├── services/           # Business logic layer
│   │   └── index.ts            # Main process entry
│   ├── renderer/               # React frontend
│   │   ├── components/         # UI components
│   │   │   ├── boards/        # Board components (Kanban, Scrum)
│   │   │   ├── layout/        # Layout components
│   │   │   └── ui/            # Reusable UI components
│   │   ├── hooks/             # React Query hooks
│   │   ├── pages/             # Page components
│   │   └── App.tsx            # React app entry
│   └── shared/                 # Shared types & constants
│       ├── constants/          # IPC channels
│       └── types/              # TypeScript interfaces
├── dist/                       # Vite build output
└── dist-electron/             # Electron build output
```

## Database

The application uses SQLite with a local database stored in your user data directory:
- **Linux**: `~/.config/HomeSprint/honeydoo.db`
- **macOS**: `~/Library/Application Support/HomeSprint/honeydoo.db`
- **Windows**: `%APPDATA%/HomeSprint/honeydoo.db`

Migrations are automatically applied on startup.

## Available Scripts

- `npm run dev` - Start development mode
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development

### Adding New Features

1. Define types in `src/shared/types/`
2. Create database migrations in `src/main/database/migrations/`
3. Add service methods in `src/main/services/`
4. Register IPC handlers in `src/main/ipc/handlers.ts`
5. Update preload API in `src/main/preload.ts`
6. Create React hooks in `src/renderer/hooks/`
7. Build UI components in `src/renderer/components/`

### Database Migrations

Create a new migration file:
```sql
-- src/main/database/migrations/002_your_feature.sql
ALTER TABLE issues ADD COLUMN new_field TEXT;
```

Migrations are automatically applied in order by version number.

## Known Issues

The following features from the spec are not yet implemented:
- Custom issue types (Argument, Mystery, Tech Debt)
- Extended status workflows (Procrastinating, YouTube Tutorial, etc.)
- Advanced parody fields
- Automation rules
- Notification system
- Achievement badges & gamification
- Advanced reporting (velocity charts, cumulative flow)

See the full issue checklist for details.

## Architecture Notes

- **Local-first**: All data stored locally in SQLite
- **IPC Communication**: Renderer ↔ Main process via typed IPC channels
- **Type Safety**: Full TypeScript coverage across main and renderer
- **Query Caching**: TanStack Query for efficient data fetching
- **Security**: Context isolation enabled, no nodeIntegration

## Troubleshooting

### Electron GL Surface Errors
If you see GL surface errors on Linux, hardware acceleration is automatically disabled in the app.

### Database Errors
If the database fails to initialize, the app will quit. Check that the user data directory is writable.

### Port 5173 Already in Use
Kill the existing Vite process or change the port in `package.json` dev scripts.

## Contributing

This is a parody project. Contributions that increase the absurdity while maintaining functionality are welcome!

## License

MIT

---

Remember: The best way to manage your household is to overthink it completely. Happy procrastinating!
