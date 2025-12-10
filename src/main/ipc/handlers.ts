import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../../shared/types/user.types';
import { ProjectService } from '../services/project.service';
import { IssueService } from '../services/issue.service';
import { CreateProjectDto } from '../../shared/types/project.types';
import { CreateIssueDto } from '../../shared/types/issue.types';

import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../../shared/types/comment.types';

import { BoardService } from '../services/board.service';
import { SprintService } from '../services/sprint.service';
import { CreateBoardDto } from '../../shared/types/board.types';
import { CreateSprintDto } from '../../shared/types/sprint.types';

export function registerIpcHandlers() {
    const userService = new UserService();
    const projectService = new ProjectService();
    const issueService = new IssueService();
    const commentService = new CommentService();
    const boardService = new BoardService();
    const sprintService = new SprintService();

    // User Handlers
    ipcMain.handle(IPC_CHANNELS.USERS_GET_ALL, () => {
        return userService.getAll();
    });

    ipcMain.handle(IPC_CHANNELS.USERS_CREATE, (_, user: CreateUserDto) => {
        return userService.create(user);
    });

    ipcMain.handle(IPC_CHANNELS.USERS_LOGIN, (_, username: string) => {
        return userService.login(username);
    });

    // Project Handlers
    ipcMain.handle(IPC_CHANNELS.PROJECTS_GET_ALL, () => {
        return projectService.getAll();
    });

    ipcMain.handle(IPC_CHANNELS.PROJECTS_CREATE, (_, project: CreateProjectDto) => {
        return projectService.create(project);
    });

    // Issue Handlers
    ipcMain.handle(IPC_CHANNELS.ISSUES_GET_ALL, () => {
        return issueService.getAll();
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_CREATE, (_, issue: CreateIssueDto) => {
        return issueService.create(issue);
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_UPDATE, (_, { id, status }: { id: number, status: string }) => {
        return issueService.updateStatus(id, status);
    });

    ipcMain.handle(IPC_CHANNELS.ISSUES_GET_DASHBOARD_STATS, () => {
        return issueService.getDashboardStats();
    });

    // Comment Handlers
    ipcMain.handle(IPC_CHANNELS.COMMENTS_GET_BY_ISSUE, (_, issueId: number) => {
        return commentService.getByIssueId(issueId);
    });

    ipcMain.handle(IPC_CHANNELS.COMMENTS_CREATE, (_, comment: CreateCommentDto) => {
        return commentService.create(comment);
    });

    // Board Handlers
    ipcMain.handle(IPC_CHANNELS.BOARDS_GET_ALL, () => {
        return boardService.getAll();
    });

    ipcMain.handle(IPC_CHANNELS.BOARDS_CREATE, (_, board: CreateBoardDto) => {
        return boardService.create(board);
    });

    // Sprint Handlers
    ipcMain.handle(IPC_CHANNELS.SPRINTS_GET_BY_BOARD, (_, boardId: number) => {
        return sprintService.getByBoardId(boardId);
    });

    ipcMain.handle(IPC_CHANNELS.SPRINTS_CREATE, (_, sprint: CreateSprintDto) => {
        return sprintService.create(sprint);
    });

    ipcMain.handle(IPC_CHANNELS.SPRINTS_START, (_, id: number) => {
        return sprintService.startSprint(id);
    });

    ipcMain.handle(IPC_CHANNELS.SPRINTS_CLOSE, (_, id: number) => {
        return sprintService.closeSprint(id);
    });
}
