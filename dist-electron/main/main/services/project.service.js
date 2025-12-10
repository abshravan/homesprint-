"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const connection_1 = require("../database/connection");
class ProjectService {
    constructor() {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = (0, connection_1.getDatabase)();
    }
    getAll() {
        return this.db.prepare('SELECT * FROM projects ORDER BY name').all();
    }
    create(project) {
        const stmt = this.db.prepare(`
      INSERT INTO projects (name, key, description, created_by)
      VALUES (@name, @key, @description, @created_by)
    `);
        const info = stmt.run(project);
        return this.db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
    }
}
exports.ProjectService = ProjectService;
