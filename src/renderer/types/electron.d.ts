import { CreateUserDto } from '../../shared/types/user.types';
import { CreateProjectDto } from '../../shared/types/project.types';
import { CreateIssueDto, Issue } from '../../shared/types/issue.types';

import { CreateCommentDto, Comment } from '../../shared/types/comment.types';
import { CreateBoardDto, Board } from '../../shared/types/board.types';
import { CreateSprintDto, Sprint } from '../../shared/types/sprint.types';

export interface DashboardStats {
    totalIssues: number;
    overdueIssues: number;
    completedIssues: number;
    inProgressIssues: number;
}

export interface IElectronAPI {
    users: {
        getAll: () => Promise<any[]>;
        create: (user: CreateUserDto) => Promise<any>;
        login: (username: string) => Promise<any>;
    };
    projects: {
        getAll: () => Promise<any[]>;
        create: (project: CreateProjectDto) => Promise<any>;
    };
    issues: {
        getAll: () => Promise<Issue[]>;
        create: (issue: CreateIssueDto) => Promise<Issue>;
        updateStatus: (id: number, status: string) => Promise<Issue>;
        getDashboardStats: () => Promise<DashboardStats>;
    };
    comments: {
        getByIssueId: (issueId: number) => Promise<Comment[]>;
        create: (comment: CreateCommentDto) => Promise<Comment>;
    };
    boards: {
        getAll: () => Promise<Board[]>;
        create: (board: CreateBoardDto) => Promise<Board>;
    };
    sprints: {
        getByBoardId: (boardId: number) => Promise<Sprint[]>;
        create: (sprint: CreateSprintDto) => Promise<Sprint>;
        start: (id: number) => Promise<Sprint>;
        close: (id: number) => Promise<Sprint>;
    };
}

declare global {
    interface Window {
        api: IElectronAPI;
    }
}
