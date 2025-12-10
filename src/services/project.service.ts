import { getDatabase } from '../lib/database';
import { Project, CreateProjectDto } from '../shared/types/project.types';
import { CreateProjectDtoSchema } from '../shared/validation/project.validation';

export class ProjectService {
    private db = getDatabase();

    async getAll(): Promise<Project[]> {
        const projects = await this.db.getAll('projects');
        return projects.sort((a, b) => a.name.localeCompare(b.name));
    }

    async create(project: CreateProjectDto): Promise<Project> {
        // Validate input
        const validatedProject = CreateProjectDtoSchema.parse(project);

        const now = new Date().toISOString();
        const projectData = {
            ...validatedProject,
            created_at: now,
            updated_at: now,
        };

        const id = await this.db.add('projects', projectData);
        const createdProject = await this.db.getById('projects', id);

        if (!createdProject) {
            throw new Error('Failed to create project: Could not retrieve created project');
        }

        return createdProject;
    }
}

// Singleton instance
let projectServiceInstance: ProjectService | null = null;

export function getProjectService(): ProjectService {
    if (!projectServiceInstance) {
        projectServiceInstance = new ProjectService();
    }
    return projectServiceInstance;
}
