"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
const connection_1 = require("../database/connection");
class BoardService {
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
        return this.db.prepare('SELECT * FROM boards ORDER BY name').all();
    }
    getByProjectId(projectId) {
        return this.db.prepare('SELECT * FROM boards WHERE project_id = ?').all(projectId);
    }
    create(board) {
        const stmt = this.db.prepare(`
      INSERT INTO boards (project_id, name, type)
      VALUES (@project_id, @name, @type)
    `);
        const info = stmt.run(board);
        return this.db.prepare('SELECT * FROM boards WHERE id = ?').get(info.lastInsertRowid);
    }
}
exports.BoardService = BoardService;
