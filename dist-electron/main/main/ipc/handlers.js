"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIpcHandlers = registerIpcHandlers;
const electron_1 = require("electron");
const channels_1 = require("../../shared/constants/channels");
const user_service_1 = require("../services/user.service");
const project_service_1 = require("../services/project.service");
const issue_service_1 = require("../services/issue.service");
const comment_service_1 = require("../services/comment.service");
const board_service_1 = require("../services/board.service");
const sprint_service_1 = require("../services/sprint.service");
function registerIpcHandlers() {
    const userService = new user_service_1.UserService();
    const projectService = new project_service_1.ProjectService();
    const issueService = new issue_service_1.IssueService();
    const commentService = new comment_service_1.CommentService();
    const boardService = new board_service_1.BoardService();
    const sprintService = new sprint_service_1.SprintService();
    // User Handlers
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.USERS_GET_ALL, () => {
        return userService.getAll();
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.USERS_CREATE, (_, user) => {
        return userService.create(user);
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.USERS_LOGIN, (_, username) => {
        return userService.login(username);
    });
    // Project Handlers
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.PROJECTS_GET_ALL, () => {
        return projectService.getAll();
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.PROJECTS_CREATE, (_, project) => {
        return projectService.create(project);
    });
    // Issue Handlers
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.ISSUES_GET_ALL, () => {
        return issueService.getAll();
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.ISSUES_CREATE, (_, issue) => {
        return issueService.create(issue);
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.ISSUES_UPDATE, (_, { id, status }) => {
        return issueService.updateStatus(id, status);
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.ISSUES_GET_DASHBOARD_STATS, () => {
        return issueService.getDashboardStats();
    });
    // Comment Handlers
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.COMMENTS_GET_BY_ISSUE, (_, issueId) => {
        return commentService.getByIssueId(issueId);
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.COMMENTS_CREATE, (_, comment) => {
        return commentService.create(comment);
    });
    // Board Handlers
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.BOARDS_GET_ALL, () => {
        return boardService.getAll();
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.BOARDS_CREATE, (_, board) => {
        return boardService.create(board);
    });
    // Sprint Handlers
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.SPRINTS_GET_BY_BOARD, (_, boardId) => {
        return sprintService.getByBoardId(boardId);
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.SPRINTS_CREATE, (_, sprint) => {
        return sprintService.create(sprint);
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.SPRINTS_START, (_, id) => {
        return sprintService.startSprint(id);
    });
    electron_1.ipcMain.handle(channels_1.IPC_CHANNELS.SPRINTS_CLOSE, (_, id) => {
        return sprintService.closeSprint(id);
    });
}
