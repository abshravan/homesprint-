# HomeSprint

> A satirical project management system that applies enterprise software complexity to mundane household tasks. Because why manage your chores simply when you can overcomplicate everything?

## Overview

HomeSprint is a Jira parody web application built with React, TypeScript, and IndexedDB. It brings all the "joy" of enterprise project management tools to your home life, complete with sprint planning, burndown charts, passive-aggressive comment tracking, and spouse approval workflows. Transform simple household chores into an over-engineered productivity nightmare that would make any project manager proud!

## Features

### Core Project Management
- **Issue Management**: Create, track, and procrastinate on household tasks with full CRUD operations
- **Multiple Projects**: Organize tasks across different household domains (HOME, GARDEN, etc.)
- **Issue Types**: Epic, Story, Task, Bug, Chore, Argument, and Mystery
- **Priority Levels**: Blocker, Critical, Major, Medium, Minor, Trivial
- **Status Workflow**: todo → in_progress → in_review → done

### Boards & Planning
- **Scrum Boards**: Sprint planning, backlog management, and burndown charts
- **Kanban Boards**: Column-based visual task management
- **Sprint Management**: Create sprints with goals, track active/future/closed sprints
- **Drag & Drop**: Intuitive task organization (powered by @dnd-kit)

### Dashboards & Reporting
- **System Dashboard**: Real-time stats on total issues, overdue items, in-progress, and completed tasks
- **Executive Dashboard**: Fake metrics with corporate buzzwords (Synergy Index, Household ROI, Strategic KPIs, Bandwidth Utilization)
- **Wall of Shame**: Track procrastinating users and highlight overdue items

### Parody Features (The Fun Stuff!)
- **Excuse Generator**: 21 built-in procrastination excuses for every occasion
- **Guilt Trip System**: Passive-aggressive notifications every 60 seconds to keep you "motivated"
- **Spouse Approval Modal**: Some tasks require spousal sign-off before completion
- **Easter Egg (Konami Code)**: Activate secret "God Mode" with ↑↑↓↓←→←→BA
- **Parody Tracking Fields**:
  - Procrastination Level (low/medium/high/extreme)
  - Netflix Episodes Watched
  - Likelihood of Completion (0-100%)
  - Energy Level Required
  - Budget Impact
  - Excuse Category

### Collaboration
- **Comments System**: Leave notes and passive-aggressive messages on issues
- **User Roles**: Admin, Member, Guest permissions
- **Issue Assignment**: Assign tasks to household members
- **@mentions Support**: Tag users in comments

### Technical Features
- **Offline-First**: All data stored locally in IndexedDB - works without internet
- **Type Safety**: Full TypeScript coverage with runtime validation via Zod
- **React Query Caching**: Automatic data synchronization and optimistic updates
- **Error Boundaries**: Graceful error handling prevents white screen crashes
- **Hash-Based Routing**: Deploy anywhere - no server configuration needed

## Tech Stack

- **Frontend**: React 18 + TypeScript (strict mode)
- **Build Tool**: Vite (lightning-fast HMR on port 5173)
- **UI Components**: shadcn/ui (Radix UI primitives) + Tailwind CSS
- **Database**: IndexedDB (browser-based storage)
- **State Management**: TanStack Query v5 + React Context (Zustand ready for future)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for dashboards and burndown charts
- **Drag & Drop**: @dnd-kit for board interactions
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Validation**: Zod schemas for runtime type checking

## Prerequisites

- Node.js 20+
- npm 10+
- Modern web browser with IndexedDB support (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd homesprint-
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173`

5. **Login:**
- Username: `admin`
- Password: `admin`

The database will automatically initialize with seed data on first launch.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run lint` | Run ESLint with strict rules |
| `npm run preview` | Preview production build locally |

## Project Structure

```
homesprint-/
├── src/
│   ├── lib/                        # Core libraries
│   │   └── database.ts            # IndexedDB wrapper (singleton pattern)
│   │
│   ├── services/                  # Business logic layer
│   │   ├── issue.service.ts       # Issue CRUD + dashboard stats
│   │   ├── project.service.ts     # Project management
│   │   ├── user.service.ts        # Authentication & user profiles
│   │   ├── sprint.service.ts      # Sprint lifecycle management
│   │   ├── board.service.ts       # Board operations
│   │   └── comment.service.ts     # Comments with author enrichment
│   │
│   ├── shared/                    # Shared types & validation
│   │   ├── types/                 # TypeScript interfaces
│   │   │   ├── issue.types.ts
│   │   │   ├── project.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── sprint.types.ts
│   │   │   ├── board.types.ts
│   │   │   └── comment.types.ts
│   │   └── validation/            # Zod runtime validation schemas
│   │       ├── issue.validation.ts
│   │       ├── project.validation.ts
│   │       ├── user.validation.ts
│   │       ├── sprint.validation.ts
│   │       ├── board.validation.ts
│   │       └── comment.validation.ts
│   │
│   └── renderer/                  # React frontend
│       ├── App.tsx                # Main app with routing
│       ├── main.tsx               # Entry point
│       │
│       ├── contexts/
│       │   └── AuthContext.tsx    # Authentication state
│       │
│       ├── components/
│       │   ├── boards/            # Board-specific components
│       │   │   ├── ScrumBoard.tsx
│       │   │   ├── KanbanBoard.tsx
│       │   │   ├── BoardColumn.tsx
│       │   │   ├── IssueCard.tsx
│       │   │   ├── BurndownChart.tsx
│       │   │   └── SprintPlanningModal.tsx
│       │   ├── layout/            # Layout components
│       │   │   ├── MainLayout.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── Header.tsx
│       │   └── ui/                # Reusable UI components
│       │       ├── CommentsSection.tsx
│       │       ├── ExcuseGenerator.tsx
│       │       ├── GuiltTripSystem.tsx
│       │       ├── EasterEggSystem.tsx
│       │       ├── SpouseApprovalModal.tsx
│       │       └── TransitionDialog.tsx
│       │
│       ├── pages/                 # Page components
│       │   ├── LoginPage.tsx
│       │   ├── CreateIssuePage.tsx
│       │   ├── IssueListPage.tsx
│       │   ├── IssueDetailPage.tsx
│       │   ├── BoardListPage.tsx
│       │   ├── BoardDetailPage.tsx
│       │   ├── ExecutiveDashboard.tsx
│       │   ├── WallOfShameDashboard.tsx
│       │   └── MyOpenIssuesPage.tsx
│       │
│       ├── hooks/                 # React Query hooks
│       │   ├── useIssues.ts
│       │   ├── useProjects.ts
│       │   ├── useBoards.ts
│       │   ├── useSprints.ts
│       │   ├── useComments.ts
│       │   ├── useDashboard.ts
│       │   └── useKonamiCode.ts
│       │
│       └── lib/
│           ├── utils.ts           # Utility functions
│           └── excuses.ts         # 21 procrastination excuses
│
├── dist/                          # Production build output
├── index.html                     # Entry HTML file
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config (strict mode)
├── vite.config.ts                 # Vite configuration
└── tailwind.config.js             # Tailwind CSS config
```

## Application Routes

### Authentication
- `/login` - Login page (credentials: admin/admin)

### Dashboards
- `/` - System Dashboard (issue stats)
- `/dashboard/exec` - Executive Overview (fake metrics)
- `/dashboard/shame` - Wall of Shame (procrastination tracker)

### Projects
- `/projects` - List all projects
- `/projects/create` - Create new project
- `/projects/archived` - View archived projects

### Issues
- `/issues` - Search and filter issues
- `/issues/create` - Create new issue
- `/issues/my-open` - Your assigned open issues
- `/issues/reported` - Issues you reported
- `/issues/old` - Issues open since 2023
- `/issues/:id` - Issue detail with comments

### Boards
- `/boards` - List all boards
- `/boards/:id` - Board detail (Scrum/Kanban view)

### Operations
- `/sprints` - Sprint management
- `/backlog` - Product backlog
- `/releases` - Release planning (placeholder)

## Database Schema

HomeSprint uses IndexedDB with the following stores (tables):

### Users
```typescript
{
  id: number (auto-increment)
  username: string (unique index)
  display_name: string
  email?: string
  avatar_url?: string
  role: 'admin' | 'member' | 'guest'
  created_at: ISO string
  updated_at: ISO string
}
```

### Projects
```typescript
{
  id: number
  name: string
  key: string (unique index, e.g., "HOME")
  description?: string
  created_by: number (FK to users.id)
  created_at: ISO string
  updated_at: ISO string
}
```

### Issue Types
```typescript
{
  id: number
  name: string (unique: Epic, Story, Task, Bug, Chore, Argument, Mystery)
  icon?: string (lucide-react icon name)
  color?: string (hex color)
  description?: string
}
```

### Issues
```typescript
{
  id: number
  issue_key: string (unique index, e.g., "HOME-1")
  project_id: number (indexed, FK to projects.id)
  issue_type_id: number (FK to issue_types.id)
  summary: string
  description?: string
  status: 'todo' | 'in_progress' | 'in_review' | 'done' (indexed)
  priority: 'blocker' | 'critical' | 'major' | 'medium' | 'minor' | 'trivial'
  assignee_id?: number (indexed, FK to users.id)
  reporter_id: number (FK to users.id)
  created_at: ISO string
  updated_at: ISO string
  due_date?: ISO string
  resolved_at?: ISO string
  story_points?: number
  epic_link?: number (FK to issues.id)
  sprint_id?: number (indexed, FK to sprints.id)

  // Time tracking
  original_estimate?: number
  remaining_estimate?: number
  time_spent?: number

  // Parody fields
  procrastination_level?: 'low' | 'medium' | 'high' | 'extreme'
  excuse_category?: string
  netflix_episodes?: number
  likelihood_completion?: number (0-100)
  spouse_approval_required?: boolean
  energy_level_required?: string
  budget_impact?: string
}
```

### Sprints
```typescript
{
  id: number
  board_id: number (indexed, FK to boards.id)
  name: string
  goal?: string
  start_date?: ISO string
  end_date?: ISO string
  status: 'active' | 'future' | 'closed'
  created_at: ISO string
}
```

### Boards
```typescript
{
  id: number
  project_id: number (indexed, FK to projects.id)
  name: string
  type: 'scrum' | 'kanban'
  columns?: string
  filter_query?: string
  created_at: ISO string
}
```

### Comments
```typescript
{
  id: number
  issue_id: number (indexed, FK to issues.id)
  author_id: number (FK to users.id)
  content: string
  parent_comment_id?: number (FK for threading)
  created_at: ISO string
  updated_at: ISO string
  is_edited: boolean
  is_passive_aggressive?: boolean
}
```

### Seed Data

On first launch, the database auto-populates with:
- 7 issue types (Epic, Story, Task, Bug, Chore, Argument, Mystery)
- 1 admin user (username: "admin", display_name: "Household Admin")
- 1 default project (name: "HomeSprint", key: "HOME")

## Development Guide

### Architecture Patterns

**Singleton Services**
```typescript
// Services are implemented as singletons
let issueServiceInstance: IssueService | null = null;
export function getIssueService(): IssueService {
    if (!issueServiceInstance) {
        issueServiceInstance = new IssueService();
    }
    return issueServiceInstance;
}
```

**Zod Runtime Validation**
```typescript
// All mutations validated before storage
const validatedIssue = CreateIssueDtoSchema.parse(issue);
// Throws ZodError if validation fails
```

**React Query Caching**
```typescript
// Define query keys for cache management
queryKey: ['issues']              // All issues
queryKey: ['projects', id]        // Single project

// Mutations auto-invalidate caches
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['issues'] });
}
```

**Issue Key Generation**
```typescript
// Auto-generates keys like "HOME-1", "HOME-2"
const count = await this.db.count('issues', 'project_id', projectId);
const issueKey = `${project.key}-${count + 1}`;
```

### Adding New Features

1. **Define Types** in `src/shared/types/`
```typescript
// example.types.ts
export interface Example {
    id?: number;
    name: string;
    created_at: string;
}
```

2. **Create Validation Schema** in `src/shared/validation/`
```typescript
// example.validation.ts
import { z } from 'zod';

export const CreateExampleDtoSchema = z.object({
    name: z.string().min(1),
});
```

3. **Update Database Schema** in `src/lib/database.ts`
```typescript
// Add to DBSchema interface
interface DBSchema {
    examples: Example;
    // ... other stores
}

// Add store creation in init()
const exampleStore = db.createObjectStore('examples', {
    keyPath: 'id',
    autoIncrement: true,
});
```

4. **Create Service** in `src/services/`
```typescript
// example.service.ts
export class ExampleService {
    async create(data: CreateExampleDto): Promise<Example> {
        const validated = CreateExampleDtoSchema.parse(data);
        const id = await this.db.add('examples', validated);
        return this.db.getById('examples', id);
    }
}
```

5. **Create React Hook** in `src/renderer/hooks/`
```typescript
// useExamples.ts
export function useExamples() {
    return useQuery({
        queryKey: ['examples'],
        queryFn: () => getExampleService().getAll(),
    });
}
```

6. **Build UI Component** in `src/renderer/components/`

### Data Flow

```
User Action (Button Click)
    ↓
React Component
    ↓
React Query Hook (useCreateIssue)
    ↓
Service Layer (IssueService.create)
    ↓
Zod Validation (CreateIssueDtoSchema.parse)
    ↓
Database Layer (Database.add)
    ↓
IndexedDB Storage
    ↓
React Query Cache Invalidation
    ↓
Auto-refetch in all useIssues() hooks
    ↓
UI Updates Automatically
```

## Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder contains optimized static files ready for deployment.

### Hosting Options

Deploy to any static hosting service:

**Netlify**
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

**Vercel**
```bash
vercel --prod
```

**GitHub Pages**
```bash
# Set base path in vite.config.ts
base: '/repository-name/'
```

**AWS S3 / CloudFront**
```bash
aws s3 sync dist/ s3://your-bucket-name/
```

**Any Web Server**
```bash
# Just upload contents of dist/ folder
# No server-side configuration needed!
```

## Usage Examples

### Creating an Issue

1. Navigate to `/issues/create`
2. Fill in the form:
   - **Project**: Select "HomeSprint (HOME)"
   - **Type**: Choose "Chore"
   - **Summary**: "Take out the trash"
   - **Priority**: "Critical" (because everything is critical)
   - **Procrastination Level**: "Extreme"
   - **Spouse Approval Required**: ✓
3. Click "Create Issue"
4. Issue is auto-assigned key "HOME-1"

### Moving an Issue Through Workflow

1. Open issue detail: `/issues/1`
2. Click status dropdown
3. Select "In Progress"
4. If spouse approval is required, modal appears
5. Click "Approve" (or procrastinate)
6. Confirmation dialog appears
7. Issue status updates, dashboard refreshes

### Sprint Planning

1. Navigate to `/boards/1` (Scrum board)
2. Click "Plan Sprint"
3. Enter sprint name and goal
4. Drag issues from backlog to sprint
5. Set start/end dates
6. Click "Start Sprint"
7. View burndown chart

### Easter Egg Activation

1. Navigate to any page
2. Enter Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
3. "God Mode Activated!" notification appears
4. Enjoy the secret features!

## Browser Support

### Minimum Requirements
- IndexedDB API
- ES2020 syntax
- CSS Grid & Flexbox
- React 18 compatibility

### Tested Browsers
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |

## Data Persistence & Backup

### How Data is Stored

All data resides in your browser's IndexedDB under the database name `homesprint`. Data persists across sessions and survives page refreshes.

### Data Location

- **Chrome/Edge**: `chrome://settings/cookies` → Site data → localhost
- **Firefox**: `about:preferences#privacy` → Cookies and Site Data
- **Safari**: Preferences → Privacy → Manage Website Data

### Backup Strategies

**Option 1: Browser DevTools**
```
1. Open DevTools (F12)
2. Navigate to Application/Storage tab
3. Select IndexedDB → homesprint
4. Right-click each store → Export
```

**Option 2: Future Export Feature**
- Data export/import functionality is planned (see Known Issues)

### Data Loss Scenarios

⚠️ **Data will be deleted if:**
- Browser cache/cookies are cleared
- Browsing in private/incognito mode (no persistence)
- Browser is uninstalled without backup
- IndexedDB quota is exceeded (rare)

## Troubleshooting

### IndexedDB Not Available

**Symptom:** App shows error "IndexedDB is not available"

**Solutions:**
1. Check if you're in private/incognito mode (disable it)
2. Enable IndexedDB in browser settings
3. Clear site data and reload
4. Try a different browser

### Data Not Persisting

**Symptom:** Data disappears after closing browser

**Solutions:**
1. Ensure you're not in private browsing mode
2. Check browser storage quota hasn't been exceeded
3. Verify IndexedDB is enabled in browser settings
4. Check browser privacy settings aren't blocking storage

### Port 5173 Already in Use

**Symptom:** Dev server won't start

**Solutions:**
```bash
# Option 1: Kill existing process
lsof -ti:5173 | xargs kill -9

# Option 2: Use different port
# Edit vite.config.ts:
server: {
    port: 3000,
}
```

### Build Errors

**Symptom:** `npm run build` fails

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 20+

# Run linter to catch issues
npm run lint
```

### React Query DevTools

Enable dev tools for debugging cache:
```typescript
// Add to App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

## Known Issues & Future Enhancements

### Not Yet Implemented

The following features from the original spec are planned but not completed:

- [ ] Data export/import functionality (JSON/CSV)
- [ ] Custom issue type creation (currently predefined only)
- [ ] Extended status workflows (Procrastinating, YouTube Tutorial, Researching, Avoiding, Delegating)
- [ ] Advanced parody field functionality (blame tracking, mood indicators)
- [ ] Automation rules & triggers
- [ ] Full notification system (beyond guilt trips)
- [ ] Achievement badges & gamification
- [ ] Advanced reporting (velocity charts, cumulative flow diagrams)
- [ ] Drag-and-drop between sprints (UI ready, backend incomplete)
- [ ] Custom dashboards
- [ ] Email notifications (parody spam)
- [ ] Mobile app version

### Known Bugs

See `ISSUES.md` for the complete issue list and tracking.

### Feature Requests

Want to contribute? We welcome PRs that:
- Increase the absurdity while maintaining functionality
- Add more parody fields and humor
- Improve TypeScript type safety
- Enhance UI/UX with better animations
- Add more dashboard widgets
- Implement missing features from the spec

## Authentication & Security

### Current Implementation (Development)

**Mock Authentication:**
- Username: `admin`
- Password: `admin`
- Stored in localStorage (not secure!)
- No encryption
- Suitable for demo/parody only

**⚠️ Security Warning:**
This is a client-side demo app with no real security. Do not use for production or sensitive data.

### For Production Use

If adapting this for real use, implement:

1. **Backend Authentication**
   - OAuth 2.0 / OpenID Connect
   - JWT tokens with refresh mechanism
   - Secure HTTP-only cookies

2. **API Layer**
   - REST or GraphQL backend
   - CORS configuration
   - Rate limiting
   - Input validation

3. **Security Headers**
   - Content Security Policy (CSP)
   - HTTPS only
   - XSS protection

4. **Database Migration**
   - Move from IndexedDB to server-side DB
   - PostgreSQL, MySQL, or MongoDB
   - Proper foreign key constraints

## Performance Optimization

### Current Optimizations

- **Code Splitting**: Vite automatically splits bundles
- **Tree Shaking**: Unused code eliminated in production
- **React Query Caching**: Prevents redundant API calls
- **Lazy Loading**: Routes loaded on-demand
- **IndexedDB Indexes**: Fast lookups on commonly queried fields

### Recommended for Large Datasets

```typescript
// Implement pagination for issue lists
const PAGE_SIZE = 50;

// Add virtual scrolling for long lists
import { useVirtualizer } from '@tanstack/react-virtual';

// Optimize React renders
import { memo } from 'react';
export const IssueCard = memo(IssueCardComponent);
```

## Contributing

This is a parody project, but contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-parody`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit: `git commit -m "Add hilarious feature"`
6. Push: `git push origin feature/amazing-parody`
7. Open a Pull Request

### Contribution Guidelines

- Maintain the satirical tone
- Keep TypeScript strict mode compliance
- Add Zod validation for new data types
- Write clear commit messages
- Don't break existing functionality
- More humor = better PR!

## Inspiration & Credits

Inspired by:
- **Jira**: The enterprise project management tool we love to hate
- **Linear**: Clean, fast issue tracking
- **Trello**: Simple board visualization
- **Corporate Culture**: Buzzwords, metrics, and unnecessary processes

Built with:
- React team for the amazing framework
- Vercel for Vite
- Radix UI for accessible components
- TanStack for React Query
- shadcn for the UI component patterns

## License

MIT License - See LICENSE file for details

## Support

- **Issues**: Report bugs at `ISSUES.md`
- **Documentation**: See `tech-stack-documentation.md`
- **Specification**: Original spec in `home-jira-parody-spec.md`

---

**Remember:** The best way to manage your household is to overthink it completely. Why do the dishes when you can spend 3 hours planning a sprint to optimize your dishwashing workflow? Happy procrastinating! 🚀
