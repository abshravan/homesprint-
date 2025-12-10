"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    // Add IPC methods here
    ping: () => electron_1.ipcRenderer.invoke('ping'),
});
