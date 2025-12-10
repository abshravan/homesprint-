import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

interface Migration {
    version: number;
    filename: string;
    sql: string;
}

export class DatabaseMigrator {
    private db: Database.Database;
    private migrationsPath: string;

    constructor(db: Database.Database, migrationsPath: string) {
        this.db = db;
        this.migrationsPath = migrationsPath;
        this.initMigrationsTable();
    }

    private initMigrationsTable(): void {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        filename TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }

    private getCurrentVersion(): number {
        const result = this.db
            .prepare('SELECT MAX(version) as version FROM schema_migrations')
            .get() as { version: number | null };
        return result.version || 0;
    }

    private getMigrationFiles(): Migration[] {
        if (!fs.existsSync(this.migrationsPath)) {
            throw new Error(`Migrations path not found: ${this.migrationsPath}`);
        }

        const files = fs.readdirSync(this.migrationsPath)
            .filter((f: string) => f.endsWith('.sql'))
            .sort();

        return files.map((filename: string) => {
            const version = parseInt(filename.split('_')[0]);
            const sql = fs.readFileSync(
                path.join(this.migrationsPath, filename),
                'utf-8'
            );
            return { version, filename, sql };
        });
    }

    public migrate(): void {
        const currentVersion = this.getCurrentVersion();
        const migrations = this.getMigrationFiles()
            .filter(m => m.version > currentVersion);

        if (migrations.length === 0) {
            return;
        }

        const runMigration = this.db.transaction((migration: Migration) => {
            try {
                this.db.exec(migration.sql);
                this.db.prepare(`
                  INSERT INTO schema_migrations (version, filename)
                  VALUES (?, ?)
                `).run(migration.version, migration.filename);
            } catch (error) {
                throw new Error(`Failed to apply migration ${migration.filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });

        for (const migration of migrations) {
            runMigration(migration);
        }
    }
}
