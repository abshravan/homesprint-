"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseMigrator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DatabaseMigrator {
    constructor(db, migrationsPath) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "migrationsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = db;
        this.migrationsPath = migrationsPath;
        this.initMigrationsTable();
    }
    initMigrationsTable() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        filename TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    getCurrentVersion() {
        const result = this.db
            .prepare('SELECT MAX(version) as version FROM schema_migrations')
            .get();
        return result.version || 0;
    }
    getMigrationFiles() {
        // In production, we might need to handle this differently if files are bundled
        // For now, we assume files are available on disk
        if (!fs_1.default.existsSync(this.migrationsPath)) {
            console.warn(`Migrations path not found: ${this.migrationsPath}`);
            return [];
        }
        const files = fs_1.default.readdirSync(this.migrationsPath)
            .filter((f) => f.endsWith('.sql'))
            .sort();
        return files.map((filename) => {
            const version = parseInt(filename.split('_')[0]);
            const sql = fs_1.default.readFileSync(path_1.default.join(this.migrationsPath, filename), 'utf-8');
            return { version, filename, sql };
        });
    }
    migrate() {
        const currentVersion = this.getCurrentVersion();
        const migrations = this.getMigrationFiles()
            .filter(m => m.version > currentVersion);
        if (migrations.length === 0) {
            console.log('Database is up to date');
            return;
        }
        const runMigration = this.db.transaction((migration) => {
            console.log(`Applying migration ${migration.filename}...`);
            this.db.exec(migration.sql);
            this.db.prepare(`
          INSERT INTO schema_migrations (version, filename)
          VALUES (?, ?)
        `).run(migration.version, migration.filename);
        });
        for (const migration of migrations) {
            runMigration(migration);
        }
        console.log(`Applied ${migrations.length} migration(s)`);
    }
}
exports.DatabaseMigrator = DatabaseMigrator;
