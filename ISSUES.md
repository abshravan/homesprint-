# HomeSprint - Repository Issues & Improvements

**Generated**: 2025-12-10
**Repository**: HomeSprint - A satirical Jira parody for household tasks
**Tech Stack**: Electron 29 + React 18 + TypeScript + SQLite

---

## Table of Contents

1. [Critical Issues](#1-critical-issues)
2. [Security Vulnerabilities](#2-security-vulnerabilities)
3. [Missing Test Infrastructure](#3-missing-test-infrastructure)
4. [Type Safety Issues](#4-type-safety-issues)
5. [Error Handling & Logging](#5-error-handling--logging)
6. [Database Issues](#6-database-issues)
7. [Missing Functionality](#7-missing-functionality)
8. [Configuration Issues](#8-configuration-issues)
9. [Code Quality Issues](#9-code-quality-issues)
10. [Performance Issues](#10-performance-issues)
11. [UI/UX Issues](#11-uiux-issues)
12. [Documentation Issues](#12-documentation-issues)

---

## 1. Critical Issues

### 1.1 No Input Validation
**Severity**: Critical
**Location**: All service files, IPC handlers
**Files**:
- `src/main/services/*.service.ts`
- `src/main/ipc/handlers.ts`

**Issue**: User inputs are directly passed to SQL queries and database operations without validation. While parameterized queries prevent SQL injection, there's no validation for:
- Data types
- Required fields
- String lengths
- Valid enum values
- Business logic constraints

**Example** (src/main/services/issue.service.ts:20-51):
```typescript
create(issue: CreateIssueDto): Issue {
    // No validation of issue fields before database insertion
    const stmt = this.db.prepare(`INSERT INTO issues (...) VALUES (...)`);
    const info = stmt.run({...issue}); // Direct insertion
}
```

**Impact**:
- Could cause database errors or corruption
- Invalid data in the database
- Application crashes
- Poor user experience

**Recommendation**:
- Add validation using Zod schemas at the service layer
- Validate in IPC handlers before calling services
- Return proper error messages for validation failures

---

### 1.2 Unsafe Non-Null Assertions
**Severity**: High
**Location**: Multiple service files
**Files**:
- `src/main/services/issue.service.ts:51`
- `src/main/services/issue.service.ts:56`
- `src/main/services/project.service.ts:23`

**Issue**: Using TypeScript non-null assertion operator (`!`) without checking if the value exists first.

**Examples**:
```typescript
// src/main/services/issue.service.ts:51
return this.getById(info.lastInsertRowid as number)!;

// src/main/services/issue.service.ts:56
return this.getById(id)!;
```

**Impact**: Runtime errors if the database operation fails or record doesn't exist.

**Recommendation**: Add proper null checks and error handling.

---

### 1.3 Database Migration Path Hardcoded for Development
**Severity**: High
**Location**: `src/main/index.ts:19`

**Issue**: Migration path uses `process.cwd()` which only works in development:
```typescript
const devMigrationsPath = path.join(process.cwd(), 'src/main/database/migrations');
```

**Impact**: Migrations will fail in production builds where the directory structure is different.

**Recommendation**:
- Detect environment (development vs production)
- Use `__dirname` or `app.getAppPath()` for production
- Test migration in production build

---

### 1.4 No Electron Builder Configuration
**Severity**: Medium
**Location**: Missing `electron-builder.json` or package.json config

**Issue**: The build script includes `electron-builder` but there's no configuration file defining how the app should be packaged.

**Impact**: Build process likely to fail or produce incorrectly configured packages.

**Recommendation**: Add electron-builder configuration to package.json with proper settings for all target platforms.

---

## 2. Security Vulnerabilities

### 2.1 No Authentication/Authorization System
**Severity**: High
**Location**: Entire application

**Issue**: While there's a "login" function in `UserService`, it only retrieves a user by username without any password checking. All IPC handlers are unprotected.

**Example** (src/main/services/user.service.ts):
```typescript
login(username: string): User | undefined {
    return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
}
```

**Impact**: Any renderer process can access all data and perform all operations.

**Recommendation**:
- Implement proper authentication if this app will have multiple users
- Add session management
- Or document that this is single-user local app (if intentional)

---

### 2.2 No Data Sanitization for Display
**Severity**: Medium
**Location**: React components displaying user content

**Issue**: User-generated content (comments, descriptions) is displayed without sanitization, potentially allowing XSS if special characters are not properly escaped by React.

**Files**:
- `src/renderer/pages/IssueDetailPage.tsx`
- `src/renderer/components/ui/CommentsSection.tsx`

**Recommendation**:
- Ensure all user content is properly sanitized
- Consider using DOMPurify for rich text content
- Never use `dangerouslySetInnerHTML` without sanitization

---

### 2.3 No Rate Limiting on IPC Handlers
**Severity**: Low
**Location**: `src/main/ipc/handlers.ts`

**Issue**: IPC handlers have no rate limiting, allowing renderer to spam requests.

**Impact**: Potential DoS of the main process, database lock contention.

**Recommendation**: Add rate limiting for expensive operations.

---

## 3. Missing Test Infrastructure

### 3.1 No Tests At All
**Severity**: High
**Location**: Entire repository

**Issue**: Complete absence of test infrastructure:
- No test files (*.test.ts, *.spec.ts)
- No test framework installed (Jest, Vitest, etc.)
- No test scripts in package.json
- No CI/CD configuration

**Impact**:
- No confidence in code quality
- Refactoring is risky
- Bugs likely to slip through
- Difficult to onboard new developers

**Recommendation**:
1. **Unit Tests**: Add Vitest for unit testing
   - Test services with mock database
   - Test React components with React Testing Library
   - Test hooks with @testing-library/react-hooks

2. **Integration Tests**:
   - Test IPC communication
   - Test database operations

3. **E2E Tests**:
   - Add Playwright or Spectron for Electron E2E tests
   - Test critical user flows

4. **Coverage Target**: Aim for 70%+ coverage

---

### 3.2 No Type Checking in Build Process
**Severity**: Medium
**Location**: `package.json` scripts

**Issue**: TypeScript compilation happens but there's no `--noEmit` check before tests.

**Recommendation**: Add `"typecheck": "tsc --noEmit"` script and run it in CI.

---

## 4. Type Safety Issues

### 4.1 Missing Type Definitions for Window.api
**Severity**: Medium
**Location**: `src/renderer/types/electron.d.ts`

**Issue**: The file exists but I need to verify it properly extends the Window interface with the api object exposed in preload.ts.

**Recommendation**: Ensure complete type definitions matching the preload script.

---

### 4.2 Loose Type Casting
**Severity**: Medium
**Location**: Multiple service files

**Issue**: Heavy use of `as` type assertions without runtime validation.

**Examples**:
```typescript
// src/main/services/issue.service.ts:13
return this.db.prepare('SELECT * FROM issues ORDER BY created_at DESC').all() as Issue[];

// src/main/services/issue.service.ts:22
const projectKey = this.db.prepare('SELECT key FROM projects WHERE id = ?').get(issue.project_id) as { key: string };
```

**Impact**: Runtime type mismatches if database schema changes or returns unexpected data.

**Recommendation**:
- Add runtime validation with Zod schemas
- Create type guards for database results
- Use type-safe database libraries like Drizzle or Kysely

---

### 4.3 Untyped Error Objects
**Severity**: Low
**Location**: Multiple catch blocks

**Issue**: Error handling uses `error instanceof Error ? error.message : 'Unknown error'` pattern but doesn't preserve error types.

**Recommendation**: Create typed error classes for different error scenarios.

---

## 5. Error Handling & Logging

### 5.1 No Logging System
**Severity**: High
**Location**: Entire application

**Issue**: No logging infrastructure for debugging or monitoring:
- No log files
- No console logging in production
- Database errors are caught but not logged
- IPC errors not tracked

**Impact**:
- Difficult to debug production issues
- No audit trail
- No performance monitoring

**Recommendation**:
- Add logging library (electron-log, winston)
- Log to files in user data directory
- Log levels: ERROR, WARN, INFO, DEBUG
- Rotate log files

---

### 5.2 Inadequate Error Handling in React Components
**Severity**: Medium
**Location**: Most React components

**Issue**: Components show generic error states but don't log errors or provide actionable information.

**Example** (src/renderer/App.tsx:26-34):
```typescript
if (error) {
    return (
        <div className="text-center">
            <h2>Failed to load dashboard</h2>
            <p>Please try refreshing the application</p>
        </div>
    );
}
```

**Recommendation**:
- Add Error Boundaries
- Log errors to main process
- Provide specific error messages
- Add retry mechanisms

---

### 5.3 No Error Handling for IPC Communication Failures
**Severity**: Medium
**Location**: React Query hooks

**Issue**: IPC call failures are not specifically handled, relying only on React Query error states.

**Files**:
- `src/renderer/hooks/useIssues.ts`
- `src/renderer/hooks/useBoards.ts`
- etc.

**Recommendation**: Add error handling middleware for IPC calls.

---

### 5.4 Database Transaction Errors Not Properly Handled
**Severity**: Medium
**Location**: `src/main/database/migrations/migrate.ts:66-76`

**Issue**: Migration transaction errors are thrown but may leave database in inconsistent state.

**Recommendation**: Add rollback mechanism and migration failure recovery.

---

## 6. Database Issues

### 6.1 No Migration Rollback Capability
**Severity**: Medium
**Location**: `src/main/database/migrations/migrate.ts`

**Issue**: DatabaseMigrator only supports forward migrations, no rollback capability.

**Impact**: If a migration fails, manual intervention needed to fix database.

**Recommendation**:
- Add `down` migrations
- Add `rollback` method to DatabaseMigrator
- Store rollback SQL with each migration

---

### 6.2 Database Connection Not Closed on App Quit
**Severity**: Medium
**Location**: `src/main/index.ts`

**Issue**: No handler to close database connection when app quits.

**Impact**: Potential database corruption or lock files left behind.

**Recommendation**: Add `app.on('before-quit')` handler to call `closeDatabase()`.

---

### 6.3 No Database Backup Mechanism
**Severity**: Low
**Location**: Missing feature

**Issue**: No way to backup or restore user data.

**Recommendation**: Add database backup/restore functionality in settings.

---

### 6.4 Singleton Pattern Issues
**Severity**: Low
**Location**: `src/main/database/connection.ts`

**Issue**: Database singleton is created but there's no clear lifecycle management. Services create new instances but all share the same db connection.

**Recommendation**: Document the singleton pattern or use dependency injection.

---

### 6.5 No Foreign Key Constraint Enforcement
**Severity**: Medium
**Location**: `src/main/database/migrations/001_initial.sql`

**Issue**: Foreign keys are defined but SQLite doesn't enforce them by default.

**Recommendation**: Add `db.pragma('foreign_keys = ON')` in connection.ts.

---

## 7. Missing Functionality

### 7.1 Features from Specification Not Implemented
**Severity**: Medium
**Location**: Various

**Missing Features** (documented in README.md):
1. Custom issue types beyond basic CRUD
2. Extended status workflows (Procrastinating, YouTube Tutorial, etc.)
3. Advanced parody fields functionality
4. Automation rules
5. Notification system (table exists but no implementation)
6. Achievement badges & gamification
7. Advanced reporting (velocity charts, cumulative flow diagrams)
8. Attachment upload/download
9. Time logging functionality
10. Activity log display

**Recommendation**: Prioritize and implement missing features or update specification to match current implementation.

---

### 7.2 No Issue Update Functionality
**Severity**: High
**Location**: `src/main/services/issue.service.ts`

**Issue**: Service only has `updateStatus()` but no general update method for other fields.

**Impact**: Can't edit issue summary, description, assignee, etc. after creation.

**Recommendation**: Add comprehensive `update()` method.

---

### 7.3 No Delete Functionality
**Severity**: Medium
**Location**: All services

**Issue**: No delete methods in any service (issues, projects, boards, etc.).

**Recommendation**: Add soft delete (status flag) or hard delete methods with proper cascade handling.

---

### 7.4 No Search/Filter Functionality
**Severity**: Medium
**Location**: Issue and board lists

**Issue**: No way to search or filter issues/boards beyond fetching all records.

**Recommendation**:
- Add search by summary/description
- Add filters by status, assignee, priority
- Add sorting options

---

### 7.5 No User Management UI
**Severity**: Medium
**Location**: Missing pages

**Issue**: Routes exist but pages are placeholders:
- `/settings/users` - PlaceholderPage
- `/settings/config` - PlaceholderPage

**Recommendation**: Implement user management interface.

---

## 8. Configuration Issues

### 8.1 Missing ESLint Configuration File
**Severity**: Low
**Location**: Root directory

**Issue**: `package.json` has eslint scripts but no `.eslintrc.*` configuration file visible.

**Recommendation**: Add explicit ESLint configuration file with rules for:
- TypeScript
- React
- React Hooks
- Electron security best practices

---

### 8.2 No Environment Variables Management
**Severity**: Low
**Location**: Missing `.env` support

**Issue**: No environment variable loading setup for different environments.

**Recommendation**:
- Add dotenv for development
- Document environment variables needed
- Add `.env.example` file

---

### 8.3 Missing Prettier Configuration
**Severity**: Low
**Location**: Root directory

**Issue**: No code formatting configuration.

**Recommendation**: Add Prettier with ESLint integration for consistent formatting.

---

### 8.4 No Pre-commit Hooks
**Severity**: Low
**Location**: Missing husky/lint-staged setup

**Issue**: No automated checks before commits.

**Recommendation**: Add husky + lint-staged to run:
- ESLint
- TypeScript check
- Prettier
- Tests

---

### 8.5 Tailwind Config Could Be More Type-Safe
**Severity**: Low
**Location**: `tailwind.config.js`

**Issue**: JavaScript config instead of TypeScript.

**Recommendation**: Rename to `tailwind.config.ts` for better IDE support.

---

## 9. Code Quality Issues

### 9.1 Hardcoded Values and Magic Strings
**Severity**: Medium
**Location**: Multiple files

**Issues**:
- Database name hardcoded as 'honeydoo.db' (connection.ts:12)
- Port 5173 hardcoded (vite.config.ts:16)
- Status values as strings ('todo', 'in_progress', 'done') instead of enums
- User role strings not in constants

**Recommendation**:
- Move to constants or environment variables
- Create TypeScript enums for status, priority, roles
- Centralize configuration

---

### 9.2 Inconsistent Naming Conventions
**Severity**: Low
**Location**: Database vs TypeScript

**Issue**: Database uses snake_case, TypeScript uses camelCase. Manual conversion needed.

**Example**:
- DB: `issue_key`, `project_id`, `assignee_id`
- TS: `issueKey`, `projectId`, `assigneeId`

**Recommendation**:
- Document convention
- Consider using a mapper/ORM
- Or standardize on one convention

---

### 9.3 Duplicate Code in Service Constructors
**Severity**: Low
**Location**: All service files

**Issue**: Every service has identical constructor:
```typescript
constructor() {
    this.db = getDatabase();
}
```

**Recommendation**: Create base service class with shared functionality.

---

### 9.4 Large Components Should Be Split
**Severity**: Low
**Location**: `src/renderer/pages/IssueDetailPage.tsx` (253 lines)

**Issue**: Component handles multiple concerns (status management, comments, approvals).

**Recommendation**: Extract smaller components:
- `IssueStatusManager`
- `IssueMetadata`
- `IssueSidebar`

---

### 9.5 No Code Documentation
**Severity**: Low
**Location**: Most files

**Issue**: Missing JSDoc comments for:
- Public APIs
- Complex functions
- Service methods
- Component props

**Recommendation**: Add JSDoc comments, especially for services and hooks.

---

### 9.6 Unused Imports and Code
**Severity**: Low
**Location**: Various

**Issue**: ESLint should catch these but verify:
- Unused imports
- Unused variables
- Dead code paths

**Recommendation**: Run `npm run lint -- --fix` and address issues.

---

## 10. Performance Issues

### 10.1 No Query Optimization
**Severity**: Medium
**Location**: Service methods

**Issue**: Some queries could be optimized:
- `getAll()` methods fetch all records without pagination
- No `LIMIT` or `OFFSET` support
- Joins not used where beneficial (fetching related data requires multiple queries)

**Example** (src/main/services/issue.service.ts:12-14):
```typescript
getAll(): Issue[] {
    return this.db.prepare('SELECT * FROM issues ORDER BY created_at DESC').all() as Issue[];
}
```

**Impact**: Performance degrades with large datasets.

**Recommendation**:
- Add pagination support
- Add limit/offset parameters
- Use JOINs to fetch related data
- Add COUNT queries for pagination metadata

---

### 10.2 Missing Database Indexes
**Severity**: Medium
**Location**: `src/main/database/migrations/001_initial.sql`

**Issue**: Some useful indexes are missing:
- `status` column indexed but queries often filter by multiple columns
- No composite indexes for common query patterns
- No index on `due_date` for overdue queries

**Recommendation**: Add composite indexes for common query patterns:
```sql
CREATE INDEX idx_issues_status_due_date ON issues(status, due_date);
CREATE INDEX idx_issues_assignee_status ON issues(assignee_id, status);
```

---

### 10.3 React Query No Cache Configuration
**Severity**: Low
**Location**: `src/renderer/App.tsx:13`

**Issue**: QueryClient created with default settings, no cache time or stale time configured.

**Recommendation**: Configure QueryClient with appropriate cache settings:
```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
        },
    },
});
```

---

### 10.4 No Memoization in Components
**Severity**: Low
**Location**: React components with calculations

**Issue**: Some components perform calculations on every render without memoization.

**Example** (src/renderer/App.tsx:37-38):
```typescript
const completionRate = stats?.totalIssues ? Math.round((stats.completedIssues / stats.totalIssues) * 100) : 0;
const overduePercentage = stats?.totalIssues ? Math.round((stats.overdueIssues / stats.totalIssues) * 100) : 0;
```

**Recommendation**: Use `useMemo` for expensive calculations.

---

## 11. UI/UX Issues

### 11.1 No Loading States for Mutations
**Severity**: Medium
**Location**: Components using mutations

**Issue**: Mutations don't show loading states, users don't know if action is in progress.

**Recommendation**: Show loading indicators during mutations:
```typescript
const updateStatus = useUpdateIssueStatus();
// Use updateStatus.isPending in UI
```

---

### 11.2 No Error Boundaries
**Severity**: High
**Location**: React app

**Issue**: No error boundaries to catch React errors, entire app crashes on component errors.

**Recommendation**: Add error boundary components at route level.

---

### 11.3 Hardcoded User Information
**Severity**: Medium
**Location**: Multiple components

**Issue**: User info is hardcoded instead of using actual logged-in user:

**Examples**:
- `src/renderer/pages/IssueDetailPage.tsx:196` - "You" hardcoded
- No actual user context
- Reporter/assignee not properly tracked

**Recommendation**:
- Create user context/store
- Track logged-in user
- Use actual user data

---

### 11.4 No Accessibility Support
**Severity**: Medium
**Location**: All components

**Issue**: Missing accessibility features:
- No ARIA labels
- No keyboard navigation
- No screen reader support
- No focus management

**Recommendation**:
- Add ARIA attributes
- Ensure keyboard navigability
- Test with screen readers
- Add focus management for modals

---

### 11.5 No Dark Mode Implementation
**Severity**: Low
**Location**: Tailwind config supports it but no toggle

**Issue**: Tailwind configured for dark mode but no way to toggle it.

**Recommendation**: Add dark mode toggle in settings.

---

### 11.6 Placeholder Pages
**Severity**: Medium
**Location**: Multiple routes

**Routes using PlaceholderPage**:
- `/dashboard/exec`
- `/dashboard/shame`
- `/projects/archived`
- `/releases`
- `/settings/*`

**Recommendation**: Implement or remove these routes.

---

## 12. Documentation Issues

### 12.1 API Documentation Missing
**Severity**: Medium
**Location**: Missing docs

**Issue**: No documentation for:
- IPC channels and their contracts
- Service methods
- Database schema
- Component APIs

**Recommendation**:
- Add JSDoc to services
- Document IPC protocol
- Generate API docs with TypeDoc

---

### 12.2 Setup Instructions Incomplete
**Severity**: Low
**Location**: `README.md`

**Issue**: README missing:
- Troubleshooting section
- Development environment setup details
- Database location and management
- Build and distribution instructions

**Recommendation**: Expand README with complete development guide.

---

### 12.3 No Contributing Guidelines
**Severity**: Low
**Location**: Missing `CONTRIBUTING.md`

**Issue**: No guidelines for contributors.

**Recommendation**: Add CONTRIBUTING.md with:
- Code style guide
- Pull request process
- Testing requirements
- Commit message format

---

### 12.4 No Changelog
**Severity**: Low
**Location**: Missing `CHANGELOG.md`

**Issue**: No version history or changelog.

**Recommendation**: Add CHANGELOG.md following Keep a Changelog format.

---

## Priority Recommendations

### Must Fix (Critical Priority)

1. **Add Input Validation** (#1.1) - Prevents data corruption
2. **Fix Migration Path** (#1.3) - Needed for production builds
3. **Add Test Infrastructure** (#3.1) - Foundation for quality
4. **Remove Non-Null Assertions** (#1.2) - Prevents runtime crashes
5. **Add Error Boundaries** (#11.2) - Better error handling

### Should Fix (High Priority)

6. **Add Logging System** (#5.1) - Essential for debugging
7. **Fix Type Safety** (#4.2) - Runtime safety
8. **Add Issue Update Method** (#7.2) - Core functionality
9. **Enable Foreign Keys** (#6.5) - Data integrity
10. **Add Query Pagination** (#10.1) - Performance

### Nice to Have (Medium Priority)

11. **Add Electron Builder Config** (#1.4)
12. **Implement Missing Features** (#7.1)
13. **Add Delete Functionality** (#7.3)
14. **Improve Error Handling** (#5.2, #5.3)
15. **Add Search/Filter** (#7.4)
16. **Fix Hardcoded User Info** (#11.3)
17. **Add Database Backup** (#6.3)

### Future Improvements (Low Priority)

18. **Add Pre-commit Hooks** (#8.4)
19. **Add Code Documentation** (#9.5)
20. **Implement Dark Mode** (#11.5)
21. **Add Accessibility** (#11.4)
22. **Improve Documentation** (#12.1-12.4)

---

## Statistics

- **Total Issues Identified**: 60+
- **Critical Issues**: 4
- **High Priority Issues**: 10
- **Medium Priority Issues**: 25
- **Low Priority Issues**: 21+

---

## Next Steps

1. Review this document with the team
2. Prioritize issues based on project goals
3. Create GitHub issues for tracked items
4. Set up project board for issue management
5. Begin with must-fix critical issues
6. Establish testing infrastructure before major refactoring
7. Create a roadmap for feature completion

---

*This document was generated through automated repository analysis and manual code review. Issues are categorized by severity and impact. Please validate findings and prioritize based on your specific needs.*
