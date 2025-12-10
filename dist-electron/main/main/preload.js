"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const channels_1 = require("../shared/constants/channels");
electron_1.contextBridge.exposeInMainWorld('api', {
    users: {
        getAll: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.USERS_GET_ALL),
        create: (user) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.USERS_CREATE, user),
        login: (username) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.USERS_LOGIN, username),
    },
    projects: {
        getAll: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.PROJECTS_GET_ALL),
        create: (project) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.PROJECTS_CREATE, project),
    },
    issues: {
        getAll: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ISSUES_GET_ALL),
        create: (issue) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ISSUES_CREATE, issue),
        updateStatus: (id, status) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ISSUES_UPDATE, { id, status }),
        getDashboardStats: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ISSUES_GET_DASHBOARD_STATS),
    },
    comments: {
        getByIssueId: (issueId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.COMMENTS_GET_BY_ISSUE, issueId),
        create: (comment) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.COMMENTS_CREATE, comment),
    },
    boards: {
        getAll: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.BOARDS_GET_ALL),
        create: (board) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.BOARDS_CREATE, board),
    },
    sprints: {
        getByBoardId: (boardId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SPRINTS_GET_BY_BOARD, boardId),
        create: (sprint) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SPRINTS_CREATE, sprint),
        start: (id) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SPRINTS_START, id),
        close: (id) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SPRINTS_CLOSE, id),
    },
});
