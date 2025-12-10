"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = getDatabase;
exports.closeDatabase = closeDatabase;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
let db = null;
function getDatabase() {
    if (db)
        return db;
    const userDataPath = electron_1.app.getPath('userData');
    const dbPath = path_1.default.join(userDataPath, 'honeydoo.db');
    // Ensure directory exists
    const dbDir = path_1.default.dirname(dbPath);
    if (!fs_1.default.existsSync(dbDir)) {
        fs_1.default.mkdirSync(dbDir, { recursive: true });
    }
    try {
        db = new better_sqlite3_1.default(dbPath);
        db.pragma('journal_mode = WAL');
    }
    catch (error) {
        throw new Error(`Failed to open database at ${dbPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return db;
}
function closeDatabase() {
    if (db) {
        db.close();
        db = null;
    }
}
