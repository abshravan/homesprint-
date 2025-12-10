import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
    if (db) return db;

    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'honeydoo.db');

    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    try {
        db = new Database(dbPath);
        db.pragma('journal_mode = WAL');
    } catch (error) {
        throw new Error(`Failed to open database at ${dbPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return db;
}

export function closeDatabase() {
    if (db) {
        db.close();
        db = null;
    }
}
