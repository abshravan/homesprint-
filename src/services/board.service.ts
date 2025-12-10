import { getDatabase } from '../lib/database';
import { Board, CreateBoardDto } from '../shared/types/board.types';
import { CreateBoardDtoSchema } from '../shared/validation/board.validation';

export class BoardService {
    private db = getDatabase();

    async getAll(): Promise<Board[]> {
        const boards = await this.db.getAll('boards');
        return boards.sort((a, b) => a.name.localeCompare(b.name));
    }

    async getByProjectId(projectId: number): Promise<Board[]> {
        return await this.db.getAllByIndex('boards', 'project_id', projectId);
    }

    async create(board: CreateBoardDto): Promise<Board> {
        // Validate input
        const validatedBoard = CreateBoardDtoSchema.parse(board);

        const now = new Date().toISOString();
        const boardData = {
            ...validatedBoard,
            created_at: now,
        };

        const id = await this.db.add('boards', boardData);
        const createdBoard = await this.db.getById('boards', id);

        if (!createdBoard) {
            throw new Error('Failed to create board: Could not retrieve created board');
        }

        return createdBoard;
    }
}

// Singleton instance
let boardServiceInstance: BoardService | null = null;

export function getBoardService(): BoardService {
    if (!boardServiceInstance) {
        boardServiceInstance = new BoardService();
    }
    return boardServiceInstance;
}
