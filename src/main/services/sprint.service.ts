import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { Sprint, CreateSprintDto } from '../../shared/types/sprint.types';

export class SprintService {
    private db: Database;

    constructor() {
        this.db = getDatabase();
    }

    getByBoardId(boardId: number): Sprint[] {
        return this.db.prepare('SELECT * FROM sprints WHERE board_id = ? ORDER BY created_at DESC').all(boardId) as Sprint[];
    }

    getActive(boardId: number): Sprint | undefined {
        return this.db.prepare("SELECT * FROM sprints WHERE board_id = ? AND status = 'active'").get(boardId) as Sprint | undefined;
    }

    create(sprint: CreateSprintDto): Sprint {
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

        return this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(info.lastInsertRowid) as Sprint;
    }

    startSprint(id: number): Sprint {
        this.db.prepare("UPDATE sprints SET status = 'active' WHERE id = ?").run(id);
        return this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(id) as Sprint;
    }

    closeSprint(id: number): Sprint {
        this.db.prepare("UPDATE sprints SET status = 'closed' WHERE id = ?").run(id);
        return this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(id) as Sprint;
    }
}
