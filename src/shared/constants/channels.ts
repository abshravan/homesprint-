export const IPC_CHANNELS = {
    // Issues
    ISSUES_GET_ALL: 'issues:getAll',
    ISSUES_GET_BY_ID: 'issues:getById',
    ISSUES_CREATE: 'issues:create',
    ISSUES_UPDATE: 'issues:update',
    ISSUES_DELETE: 'issues:delete',
    ISSUES_SEARCH: 'issues:search',
    ISSUES_GET_DASHBOARD_STATS: 'issues:getDashboardStats',

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
    USERS_LOGIN: 'users:login', // Mock login

    // Boards
    BOARDS_GET_ALL: 'boards:getAll',
    BOARDS_CREATE: 'boards:create',

    // Sprints
    SPRINTS_GET_BY_BOARD: 'sprints:getByBoard',
    SPRINTS_CREATE: 'sprints:create',
    SPRINTS_START: 'sprints:start',
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
