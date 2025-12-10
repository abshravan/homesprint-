import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/channels';
import { CreateUserDto } from '../shared/types/user.types';
import { CreateProjectDto } from '../shared/types/project.types';
import { CreateIssueDto } from '../shared/types/issue.types';

import { CreateCommentDto } from '../shared/types/comment.types';
import { CreateBoardDto } from '../shared/types/board.types';
import { CreateSprintDto } from '../shared/types/sprint.types';

contextBridge.exposeInMainWorld('api', {
    users: {
        getAll: () => ipcRenderer.invoke(IPC_CHANNELS.USERS_GET_ALL),
        create: (user: CreateUserDto) => ipcRenderer.invoke(IPC_CHANNELS.USERS_CREATE, user),
        login: (username: string) => ipcRenderer.invoke(IPC_CHANNELS.USERS_LOGIN, username),
    },
    projects: {
        getAll: () => ipcRenderer.invoke(IPC_CHANNELS.PROJECTS_GET_ALL),
        create: (project: CreateProjectDto) => ipcRenderer.invoke(IPC_CHANNELS.PROJECTS_CREATE, project),
    },
    issues: {
        getAll: () => ipcRenderer.invoke(IPC_CHANNELS.ISSUES_GET_ALL),
        create: (issue: CreateIssueDto) => ipcRenderer.invoke(IPC_CHANNELS.ISSUES_CREATE, issue),
        updateStatus: (id: number, status: string) => ipcRenderer.invoke(IPC_CHANNELS.ISSUES_UPDATE, { id, status }),
        getDashboardStats: () => ipcRenderer.invoke(IPC_CHANNELS.ISSUES_GET_DASHBOARD_STATS),
    },
    comments: {
        getByIssueId: (issueId: number) => ipcRenderer.invoke(IPC_CHANNELS.COMMENTS_GET_BY_ISSUE, issueId),
        create: (comment: CreateCommentDto) => ipcRenderer.invoke(IPC_CHANNELS.COMMENTS_CREATE, comment),
    },
    boards: {
        getAll: () => ipcRenderer.invoke(IPC_CHANNELS.BOARDS_GET_ALL),
        create: (board: CreateBoardDto) => ipcRenderer.invoke(IPC_CHANNELS.BOARDS_CREATE, board),
    },
    sprints: {
        getByBoardId: (boardId: number) => ipcRenderer.invoke(IPC_CHANNELS.SPRINTS_GET_BY_BOARD, boardId),
        create: (sprint: CreateSprintDto) => ipcRenderer.invoke(IPC_CHANNELS.SPRINTS_CREATE, sprint),
        start: (id: number) => ipcRenderer.invoke(IPC_CHANNELS.SPRINTS_START, id),
        close: (id: number) => ipcRenderer.invoke(IPC_CHANNELS.SPRINTS_CLOSE, id),
    },
});
