"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintService = void 0;
const connection_1 = require("../database/connection");
class SprintService {
    constructor() {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = (0, connection_1.getDatabase)();
    }
    getByBoardId(boardId) {
        return this.db.prepare('SELECT * FROM sprints WHERE board_id = ? ORDER BY created_at DESC').all(boardId);
    }
    getActive(boardId) {
        return this.db.prepare("SELECT * FROM sprints WHERE board_id = ? AND status = 'active'").get(boardId);
    }
    create(sprint) {
        const stmt = this.db.prepare(`
      INSERT INTO sprints (board_id, name, start_date, end_date, goal, status)
      VALUES (@board_id, @name, @start_date, @end_date, @goal, 'future')
    `);
        const info = stmt.run({
            ...sprint,
            start_date: sprint.start_date || null,
            end_date: sprint.end_date || null,
            goal: sprint.goal || null
        });
        return this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(info.lastInsertRowid);
    }
    startSprint(id) {
        this.db.prepare("UPDATE sprints SET status = 'active' WHERE id = ?").run(id);
        return this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(id);
    }
    closeSprint(id) {
        this.db.prepare("UPDATE sprints SET status = 'closed' WHERE id = ?").run(id);
        return this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(id);
    }
}
exports.SprintService = SprintService;
