// IndexedDB wrapper for HomeSprint
// This replaces the SQLite database used in the Electron version

const DB_NAME = 'homesprint';
const DB_VERSION = 3;

interface DBSchema {
    users: { id?: number; username: string; display_name: string; email?: string; avatar_url?: string; role: 'admin' | 'member' | 'guest'; created_at: string; updated_at: string };
    projects: { id?: number; name: string; key: string; description?: string; created_by: number; created_at: string; updated_at: string };
    issue_types: { id?: number; name: string; icon?: string; color?: string; description?: string };
    issues: { id?: number; issue_key: string; project_id: number; issue_type_id: number; summary: string; description?: string; status: string; priority: string; assignee_id?: number; reporter_id: number; created_at: string; updated_at: string; due_date?: string; resolved_at?: string; story_points?: number; epic_link?: number; sprint_id?: number; original_estimate?: number; remaining_estimate?: number; time_spent?: number; procrastination_level?: string; excuse_category?: string; netflix_episodes?: number; likelihood_completion?: number; spouse_approval_required?: boolean; energy_level_required?: string; budget_impact?: string };
    sprints: { id?: number; board_id: number; name: string; goal?: string; start_date?: string; end_date?: string; status: 'active' | 'future' | 'closed'; created_at: string };
    boards: { id?: number; project_id: number; name: string; type: 'scrum' | 'kanban'; columns?: string; filter_query?: string; created_at: string };
    comments: { id?: number; issue_id: number; author_id: number; content: string; parent_comment_id?: number; created_at: string; updated_at: string; is_edited: boolean; is_passive_aggressive?: boolean };
    issue_history: { id?: number; issue_id: number; user_id: number; field_name: string; old_value?: string; new_value?: string; change_type: 'created' | 'updated' | 'deleted'; created_at: string };
    user_stats: { id?: number; user_id: number; total_points: number; current_streak: number; longest_streak: number; tasks_completed: number; tasks_abandoned: number; last_completion_date?: string; level: number; updated_at: string };
    user_achievements: { id?: number; user_id: number; achievement_id: string; earned_at: string; progress?: number };
    excuses: { id?: number; category: string; text: string; severity: 'minor' | 'moderate' | 'critical'; usage_count: number; rating: number; created_at: string };
}

type StoreName = keyof DBSchema;

// Helper type for stored entities (id is required after storage)
type Stored<T> = T & { id: number };

class Database {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<void> | null = null;

    async init(): Promise<void> {
        if (this.db) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create object stores (tables)
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    usersStore.createIndex('username', 'username', { unique: true });
                }

                if (!db.objectStoreNames.contains('projects')) {
                    const projectsStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
                    projectsStore.createIndex('key', 'key', { unique: true });
                }

                if (!db.objectStoreNames.contains('issue_types')) {
                    const issueTypesStore = db.createObjectStore('issue_types', { keyPath: 'id', autoIncrement: true });
                    issueTypesStore.createIndex('name', 'name', { unique: true });
                }

                if (!db.objectStoreNames.contains('issues')) {
                    const issuesStore = db.createObjectStore('issues', { keyPath: 'id', autoIncrement: true });
                    issuesStore.createIndex('issue_key', 'issue_key', { unique: true });
                    issuesStore.createIndex('project_id', 'project_id');
                    issuesStore.createIndex('assignee_id', 'assignee_id');
                    issuesStore.createIndex('status', 'status');
                    issuesStore.createIndex('sprint_id', 'sprint_id');
                }

                if (!db.objectStoreNames.contains('sprints')) {
                    const sprintsStore = db.createObjectStore('sprints', { keyPath: 'id', autoIncrement: true });
                    sprintsStore.createIndex('board_id', 'board_id');
                }

                if (!db.objectStoreNames.contains('boards')) {
                    const boardsStore = db.createObjectStore('boards', { keyPath: 'id', autoIncrement: true });
                    boardsStore.createIndex('project_id', 'project_id');
                }

                if (!db.objectStoreNames.contains('comments')) {
                    const commentsStore = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
                    commentsStore.createIndex('issue_id', 'issue_id');
                }

                if (!db.objectStoreNames.contains('issue_history')) {
                    const historyStore = db.createObjectStore('issue_history', { keyPath: 'id', autoIncrement: true });
                    historyStore.createIndex('issue_id', 'issue_id');
                    historyStore.createIndex('user_id', 'user_id');
                    historyStore.createIndex('created_at', 'created_at');
                }

                // Gamification tables
                if (!db.objectStoreNames.contains('user_stats')) {
                    const userStatsStore = db.createObjectStore('user_stats', { keyPath: 'id', autoIncrement: true });
                    userStatsStore.createIndex('user_id', 'user_id', { unique: true });
                }

                if (!db.objectStoreNames.contains('user_achievements')) {
                    const achievementsStore = db.createObjectStore('user_achievements', { keyPath: 'id', autoIncrement: true });
                    achievementsStore.createIndex('user_id', 'user_id');
                    achievementsStore.createIndex('achievement_id', 'achievement_id');
                }

                if (!db.objectStoreNames.contains('excuses')) {
                    const excusesStore = db.createObjectStore('excuses', { keyPath: 'id', autoIncrement: true });
                    excusesStore.createIndex('category', 'category');
                    excusesStore.createIndex('rating', 'rating');
                }

                // Seed initial data
                const transaction = (event.target as IDBOpenDBRequest).transaction!;

                // Seed issue types
                const issueTypesStore = transaction.objectStore('issue_types');
                const issueTypes = [
                    { name: 'Epic', icon: 'zap', color: '#904ee2', description: 'Major household initiatives' },
                    { name: 'Story', icon: 'bookmark', color: '#65ba43', description: 'User-facing household tasks' },
                    { name: 'Task', icon: 'check-square', color: '#4bade8', description: 'Simple actionable items' },
                    { name: 'Bug', icon: 'alert-circle', color: '#e13c3c', description: 'Things that went wrong' },
                    { name: 'Chore', icon: 'clipboard', color: '#f5a623', description: 'Basic household maintenance' },
                    { name: 'Argument', icon: 'message-circle', color: '#ff0000', description: 'Unresolved disputes' },
                    { name: 'Mystery', icon: 'help-circle', color: '#9013fe', description: 'Unexplained phenomena' },
                ];
                issueTypes.forEach(type => issueTypesStore.add(type));

                // Seed admin user
                const usersStore = transaction.objectStore('users');
                usersStore.add({
                    username: 'admin',
                    display_name: 'Household Admin',
                    role: 'admin',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });

                // Seed default project
                const projectsStore = transaction.objectStore('projects');
                projectsStore.add({
                    name: 'HomeSprint',
                    key: 'HOME',
                    description: 'Family task management and household operations',
                    created_by: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });

                // Seed excuse templates
                if (db.objectStoreNames.contains('excuses')) {
                    const excusesStore = transaction.objectStore('excuses');
                    const excuses = [
                        { category: 'Technical', text: 'The WiFi was acting up and I couldn\'t access the task list', severity: 'minor' as const, usage_count: 0, rating: 3.5, created_at: new Date().toISOString() },
                        { category: 'Health', text: 'I had a migraine from overthinking the task complexity', severity: 'moderate' as const, usage_count: 0, rating: 4.0, created_at: new Date().toISOString() },
                        { category: 'Time', text: 'I was waiting for the optimal planetary alignment to maximize productivity', severity: 'critical' as const, usage_count: 0, rating: 4.8, created_at: new Date().toISOString() },
                        { category: 'Research', text: 'Still researching the best method - found 47 YouTube tutorials to watch first', severity: 'moderate' as const, usage_count: 0, rating: 4.5, created_at: new Date().toISOString() },
                        { category: 'Energy', text: 'Mercury was in retrograde affecting my motivation levels', severity: 'critical' as const, usage_count: 0, rating: 5.0, created_at: new Date().toISOString() },
                        { category: 'Planning', text: 'Needed to create a detailed spreadsheet to plan the task first', severity: 'minor' as const, usage_count: 0, rating: 3.8, created_at: new Date().toISOString() },
                        { category: 'Weather', text: 'Too sunny outside, didn\'t want to waste the nice weather indoors', severity: 'minor' as const, usage_count: 0, rating: 3.2, created_at: new Date().toISOString() },
                        { category: 'Weather', text: 'Too rainy outside, the gloomy weather affected my mood', severity: 'minor' as const, usage_count: 0, rating: 3.0, created_at: new Date().toISOString() },
                        { category: 'Netflix', text: 'Had to finish the series to understand the full character arc for... reasons', severity: 'critical' as const, usage_count: 0, rating: 4.9, created_at: new Date().toISOString() },
                        { category: 'Social', text: 'Someone was wrong on the internet and I had to correct them', severity: 'moderate' as const, usage_count: 0, rating: 4.3, created_at: new Date().toISOString() },
                        { category: 'Preparation', text: 'Couldn\'t find the right motivational playlist on Spotify', severity: 'moderate' as const, usage_count: 0, rating: 4.1, created_at: new Date().toISOString() },
                        { category: 'Equipment', text: 'Waiting for the perfect ergonomic chair to arrive before starting', severity: 'minor' as const, usage_count: 0, rating: 3.6, created_at: new Date().toISOString() },
                        { category: 'Philosophical', text: 'Questioning the existential meaning of household chores in the grand scheme of the universe', severity: 'critical' as const, usage_count: 0, rating: 4.7, created_at: new Date().toISOString() },
                        { category: 'Technical', text: 'The task management app was down... wait, that\'s this app', severity: 'minor' as const, usage_count: 0, rating: 3.3, created_at: new Date().toISOString() },
                        { category: 'Family', text: 'Spouse looked at me funny, interpreted as disapproval of my approach', severity: 'moderate' as const, usage_count: 0, rating: 4.2, created_at: new Date().toISOString() },
                    ];
                    excuses.forEach(excuse => excusesStore.add(excuse));
                }
            };
        });

        return this.initPromise;
    }

    private async getStore(storeName: StoreName, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
        await this.init();
        if (!this.db) throw new Error('Database not initialized');
        const transaction = this.db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    async getAll<T extends StoreName>(storeName: T): Promise<Stored<DBSchema[T]>[]> {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as Stored<DBSchema[T]>[]);
            request.onerror = () => reject(request.error);
        });
    }

    async getById<T extends StoreName>(storeName: T, id: number): Promise<Stored<DBSchema[T]> | undefined> {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result ? (request.result as Stored<DBSchema[T]>) : undefined);
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex<T extends StoreName>(storeName: T, indexName: string, value: any): Promise<Stored<DBSchema[T]> | undefined> {
        const store = await this.getStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.get(value);
            request.onsuccess = () => resolve(request.result ? (request.result as Stored<DBSchema[T]>) : undefined);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllByIndex<T extends StoreName>(storeName: T, indexName: string, value: any): Promise<Stored<DBSchema[T]>[]> {
        const store = await this.getStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result as Stored<DBSchema[T]>[]);
            request.onerror = () => reject(request.error);
        });
    }

    async add<T extends StoreName>(storeName: T, data: Omit<DBSchema[T], 'id'>): Promise<number> {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async update<T extends StoreName>(storeName: T, data: Stored<DBSchema[T]>): Promise<void> {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async delete<T extends StoreName>(storeName: T, id: number): Promise<void> {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async count<T extends StoreName>(storeName: T, indexName?: string, value?: any): Promise<number> {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            let request: IDBRequest;
            if (indexName && value !== undefined) {
                const index = store.index(indexName);
                request = index.count(value);
            } else {
                request = store.count();
            }
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.initPromise = null;
        }
    }
}

// Singleton instance
let dbInstance: Database | null = null;

export function getDatabase(): Database {
    if (!dbInstance) {
        dbInstance = new Database();
    }
    return dbInstance;
}

export function closeDatabase(): void {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
}
