import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { Project, CreateProjectDto } from '../../shared/types/project.types';

export class ProjectService {
    private db: Database;

    constructor() {
        this.db = getDatabase();
    }

    getAll(): Project[] {
        return this.db.prepare('SELECT * FROM projects ORDER BY name').all() as Project[];
    }

    create(project: CreateProjectDto): Project {
        const stmt = this.db.prepare(`
      INSERT INTO projects (name, key, description, created_by)
      VALUES (@name, @key, @description, @created_by)
    `);

        const info = stmt.run(project);
        return this.db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid) as Project;
    }
}
