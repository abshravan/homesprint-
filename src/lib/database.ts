// IndexedDB wrapper for HomeSprint
// This replaces the SQLite database used in the Electron version

const DB_NAME = 'homesprint';
const DB_VERSION = 1;

interface DBSchema {
    users: { id?: number; username: string; display_name: string; email?: string; avatar_url?: string; role: string; created_at: string; updated_at: string };
    projects: { id?: number; name: string; key: string; description?: string; created_by: number; created_at: string; updated_at: string };
    issue_types: { id?: number; name: string; icon?: string; color?: string; description?: string };
    issues: { id?: number; issue_key: string; project_id: number; issue_type_id: number; summary: string; description?: string; status: string; priority: string; assignee_id?: number; reporter_id: number; created_at: string; updated_at: string; due_date?: string; resolved_at?: string; story_points?: number; epic_link?: number; sprint_id?: number; original_estimate?: number; remaining_estimate?: number; time_spent?: number; procrastination_level?: string; excuse_category?: string; netflix_episodes?: number; likelihood_completion?: number; spouse_approval_required?: boolean; energy_level_required?: string; budget_impact?: string };
    sprints: { id?: number; project_id: number; name: string; goal?: string; start_date?: string; end_date?: string; status: string; created_at: string };
    boards: { id?: number; project_id: number; name: string; type: string; columns?: string; filter_query?: string; created_at: string };
    comments: { id?: number; issue_id: number; author_id: number; content: string; parent_comment_id?: number; created_at: string; updated_at: string; is_edited: boolean; is_passive_aggressive?: boolean };
}

type StoreName = keyof DBSchema;

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
                    sprintsStore.createIndex('project_id', 'project_id');
                }

                if (!db.objectStoreNames.contains('boards')) {
                    const boardsStore = db.createObjectStore('boards', { keyPath: 'id', autoIncrement: true });
                    boardsStore.createIndex('project_id', 'project_id');
                }

                if (!db.objectStoreNames.contains('comments')) {
                    const commentsStore = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
                    commentsStore.createIndex('issue_id', 'issue_id');
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

    async getAll<T extends StoreName>(storeName: T): Promise<DBSchema[T][]> {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getById<T extends StoreName>(storeName: T, id: number): Promise<DBSchema[T] | undefined> {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex<T extends StoreName>(storeName: T, indexName: string, value: any): Promise<DBSchema[T] | undefined> {
        const store = await this.getStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.get(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllByIndex<T extends StoreName>(storeName: T, indexName: string, value: any): Promise<DBSchema[T][]> {
        const store = await this.getStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
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

    async update<T extends StoreName>(storeName: T, data: DBSchema[T]): Promise<void> {
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
    if (dbInstance?.db) {
        dbInstance.db.close();
        dbInstance = null;
    }
}
