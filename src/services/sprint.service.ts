import { getDatabase } from '../lib/database';
import { Sprint, CreateSprintDto } from '../shared/types/sprint.types';
import { CreateSprintDtoSchema } from '../shared/validation/sprint.validation';

export class SprintService {
    private db = getDatabase();

    async getByBoardId(boardId: number): Promise<Sprint[]> {
        const sprints = await this.db.getAllByIndex('sprints', 'project_id', boardId);
        return sprints.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    async getActive(boardId: number): Promise<Sprint | undefined> {
        const sprints = await this.getByBoardId(boardId);
        return sprints.find(sprint => sprint.status === 'active');
    }

    async create(sprint: CreateSprintDto): Promise<Sprint> {
        // Validate input
        const validatedSprint = CreateSprintDtoSchema.parse(sprint);

        const now = new Date().toISOString();
        const sprintData = {
            ...validatedSprint,
            status: 'future',
            created_at: now,
        };

        const id = await this.db.add('sprints', sprintData);
        const createdSprint = await this.db.getById('sprints', id);

        if (!createdSprint) {
            throw new Error('Failed to create sprint: Could not retrieve created sprint');
        }

        return createdSprint;
    }

    async startSprint(id: number): Promise<Sprint> {
        const sprint = await this.db.getById('sprints', id);
        if (!sprint) {
            throw new Error(`Sprint with id ${id} not found`);
        }

        const updatedSprint = {
            ...sprint,
            status: 'active',
        };

        await this.db.update('sprints', updatedSprint);
        return updatedSprint;
    }

    async closeSprint(id: number): Promise<Sprint> {
        const sprint = await this.db.getById('sprints', id);
        if (!sprint) {
            throw new Error(`Sprint with id ${id} not found`);
        }

        const updatedSprint = {
            ...sprint,
            status: 'closed',
        };

        await this.db.update('sprints', updatedSprint);
        return updatedSprint;
    }
}

// Singleton instance
let sprintServiceInstance: SprintService | null = null;

export function getSprintService(): SprintService {
    if (!sprintServiceInstance) {
        sprintServiceInstance = new SprintService();
    }
    return sprintServiceInstance;
}
