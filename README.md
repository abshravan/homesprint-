# HomeSprint

> A satirical project management system that applies enterprise software complexity to mundane household tasks. Because why manage your chores simply when you can overcomplicate everything?

## Overview

HomeSprint is a Jira parody web application built with React, TypeScript, and IndexedDB. It brings all the "joy" of enterprise project management tools to your home life, complete with sprint planning, burndown charts, and passive-aggressive comment tracking.

## Features

- **Issue Management**: Create, track, and procrastinate on household tasks
- **Scrum & Kanban Boards**: Visualize your domestic chaos
- **Sprint Planning**: Commit to tasks you'll never finish
- **Dashboard**: Real-time stats on your unproductivity
- **Comments**: Leave passive-aggressive notes for your household members
- **Parody Fields**: Track procrastination levels, spouse approval requirements, and more
- **Offline-First**: All data stored locally in your browser with IndexedDB

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: shadcn/ui (Radix UI) + Tailwind CSS
- **Database**: IndexedDB (browser storage)
- **State Management**: TanStack Query + Zustand
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Build Tool**: Vite
- **Validation**: Zod

## Prerequisites

- Node.js 20+
- npm 10+
- Modern web browser with IndexedDB support

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd homesprint-
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start the Vite dev server on `http://localhost:5173`

## Project Structure

```
homesprint-/
├── src/
│   ├── lib/                    # Core libraries
│   │   └── database.ts        # IndexedDB wrapper
│   ├── services/              # Business logic layer
│   │   ├── issue.service.ts
│   │   ├── project.service.ts
│   │   ├── user.service.ts
│   │   ├── comment.service.ts
│   │   ├── board.service.ts
│   │   └── sprint.service.ts
│   ├── renderer/              # React frontend
│   │   ├── components/        # UI components
│   │   │   ├── boards/       # Board components (Kanban, Scrum)
│   │   │   ├── layout/       # Layout components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── hooks/            # React Query hooks
│   │   ├── pages/            # Page components
│   │   └── App.tsx           # React app entry
│   └── shared/                # Shared types & validation
│       ├── types/             # TypeScript interfaces
│       └── validation/        # Zod validation schemas
├── dist/                      # Production build output
└── index.html                 # Entry HTML file
```

## Database

The application uses IndexedDB for browser-based storage. All data is stored locally in your browser and persists across sessions.

### IndexedDB Stores

- `users` - User accounts
- `projects` - Projects with unique keys
- `issue_types` - Epic, Story, Task, Bug, Chore, Argument, Mystery
- `issues` - Tasks with full tracking
- `sprints` - Sprint planning data
- `boards` - Kanban and Scrum boards
- `comments` - Issue comments and discussions

Data is automatically initialized with seed data on first launch.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Development

### Adding New Features

1. Define types in `src/shared/types/`
2. Create validation schemas in `src/shared/validation/`
3. Update IndexedDB schema in `src/lib/database.ts`
4. Add service methods in `src/services/`
5. Create React hooks in `src/renderer/hooks/`
6. Build UI components in `src/renderer/components/`

### Data Validation

All data mutations are validated using Zod schemas before being stored in IndexedDB:

```typescript
// Example from issue.service.ts
const validatedIssue = CreateIssueDtoSchema.parse(issue);
```

This ensures type safety and data integrity at runtime.

## Deployment

Build the production bundle:

```bash
npm run build
```

The `dist/` folder contains the static files ready for deployment to any web server or hosting platform:

- Netlify
- Vercel
- GitHub Pages
- Any static file host

## Browser Support

Requires a modern browser with support for:
- IndexedDB
- ES2020
- React 18
- CSS Grid & Flexbox

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Persistence

All data is stored in your browser's IndexedDB. Data persists across sessions but is tied to your browser and domain. To backup or transfer data:

1. Use browser developer tools to export IndexedDB
2. Or implement export/import features (future enhancement)

**Note**: Clearing browser data will delete all HomeSprint data.

## Known Issues

The following features from the spec are not yet implemented:
- Data export/import functionality
- Custom issue type creation (predefined types work)
- Extended status workflows (Procrastinating, YouTube Tutorial, etc.)
- Advanced parody field functionality
- Automation rules
- Notification system
- Achievement badges & gamification
- Advanced reporting (velocity charts, cumulative flow)

See `ISSUES.md` for the full issue list.

## Architecture Notes

- **Offline-First**: Works without internet connection
- **Local Storage**: All data in IndexedDB (browser database)
- **Type Safety**: Full TypeScript coverage with runtime validation
- **Query Caching**: TanStack Query for efficient data fetching
- **Error Boundaries**: Graceful error handling in React
- **Validation**: Zod schemas for all data mutations

## Troubleshooting

### IndexedDB Not Available
If IndexedDB is not supported or disabled in your browser, the app will not function. Enable IndexedDB in browser settings.

### Data Not Persisting
Check that you're not in private/incognito mode, which may prevent IndexedDB persistence.

### Port 5173 Already in Use
Kill the existing Vite process or change the port in `vite.config.ts`:
```typescript
server: {
    port: 3000, // your preferred port
}
```

## Contributing

This is a parody project. Contributions that increase the absurdity while maintaining functionality are welcome!

## License

MIT

---

Remember: The best way to manage your household is to overthink it completely. Happy procrastinating!
