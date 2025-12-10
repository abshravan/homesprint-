import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getDatabase } from './database/connection';
import { DatabaseMigrator } from './database/migrations/migrate';
import { registerIpcHandlers } from './ipc/handlers';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Disable hardware acceleration to fix Linux GPU errors
app.disableHardwareAcceleration();

const createWindow = () => {
    // Initialize Database
    try {
        const db = getDatabase();
        const devMigrationsPath = path.join(process.cwd(), 'src/main/database/migrations');
        const migrator = new DatabaseMigrator(db, devMigrationsPath);
        migrator.migrate();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        app.quit();
        throw new Error(`Failed to initialize database: ${errorMessage}`);
    }

    registerIpcHandlers();

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // and load the index.html of the app.
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
