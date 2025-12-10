import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { Board, CreateBoardDto } from '../../shared/types/board.types';
import { CreateBoardDtoSchema } from '../../shared/validation/board.validation';

export class BoardService {
    private db: Database;

    constructor() {
        this.db = getDatabase();
    }

    getAll(): Board[] {
        return this.db.prepare('SELECT * FROM boards ORDER BY name').all() as Board[];
    }

    getByProjectId(projectId: number): Board[] {
        return this.db.prepare('SELECT * FROM boards WHERE project_id = ?').all(projectId) as Board[];
    }

    create(board: CreateBoardDto): Board {
        // Validate input
        const validatedBoard = CreateBoardDtoSchema.parse(board);

        const stmt = this.db.prepare(`
      INSERT INTO boards (project_id, name, type)
      VALUES (@project_id, @name, @type)
    `);

        const info = stmt.run(validatedBoard);
        const createdBoard = this.db.prepare('SELECT * FROM boards WHERE id = ?').get(info.lastInsertRowid) as Board | undefined;

        if (!createdBoard) {
            throw new Error('Failed to create board: Could not retrieve created board');
        }

        return createdBoard;
    }
}
