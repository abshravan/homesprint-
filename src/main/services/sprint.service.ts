import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { Sprint, CreateSprintDto } from '../../shared/types/sprint.types';
import { CreateSprintDtoSchema } from '../../shared/validation/sprint.validation';

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
        // Validate input
        const validatedSprint = CreateSprintDtoSchema.parse(sprint);

        const stmt = this.db.prepare(`
      INSERT INTO sprints (board_id, name, start_date, end_date, goal, status)
      VALUES (@board_id, @name, @start_date, @end_date, @goal, 'future')
    `);

        const info = stmt.run({
            ...validatedSprint,
            start_date: validatedSprint.start_date || null,
            end_date: validatedSprint.end_date || null,
            goal: validatedSprint.goal || null
        });

        const createdSprint = this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(info.lastInsertRowid) as Sprint | undefined;

        if (!createdSprint) {
            throw new Error('Failed to create sprint: Could not retrieve created sprint');
        }

        return createdSprint;
    }

    startSprint(id: number): Sprint {
        const result = this.db.prepare("UPDATE sprints SET status = 'active' WHERE id = ?").run(id);

        if (result.changes === 0) {
            throw new Error(`Sprint with id ${id} not found`);
        }

        const updatedSprint = this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(id) as Sprint | undefined;

        if (!updatedSprint) {
            throw new Error(`Failed to start sprint: Could not retrieve sprint with id ${id}`);
        }

        return updatedSprint;
    }

    closeSprint(id: number): Sprint {
        const result = this.db.prepare("UPDATE sprints SET status = 'closed' WHERE id = ?").run(id);

        if (result.changes === 0) {
            throw new Error(`Sprint with id ${id} not found`);
        }

        const updatedSprint = this.db.prepare('SELECT * FROM sprints WHERE id = ?').get(id) as Sprint | undefined;

        if (!updatedSprint) {
            throw new Error(`Failed to close sprint: Could not retrieve sprint with id ${id}`);
        }

        return updatedSprint;
    }
}
