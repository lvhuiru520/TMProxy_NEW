import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
// import * as path from "path";
const updaterEventListener = (win: BrowserWindow) => {
    const updateUrl = "https://cdn.mobilemd.cn/aliyun-TMProxy/";

    // const updateUrl = "http://127.0.0.1:8888/update/";
    // autoUpdater.updateConfigPath = path.join(__dirname, "../app-update.yml");

    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL(updateUrl);

    ipcMain.handle("main:check-for-update", async () => {
        return await autoUpdater.checkForUpdates(); // 检查更新
    });
    ipcMain.on("main:download-update", () => {
        autoUpdater.downloadUpdate(); // 下载更新
    });
    ipcMain.on("main:quit-and-install", () => {
        autoUpdater.quitAndInstall(); // 退出并安装
    });
    ipcMain.handle("main:get-current-version", () => {
        return autoUpdater.currentVersion.version;
    });

    autoUpdater.on("update-cancelled", (info) => {
        console.log("cancelled", info); // 取消更新
    });
    autoUpdater.on("update-not-available", (info) => {
        console.log("not available", info); // 没有可用的更新
        win.webContents.send("main:update-not-available");
    });
    autoUpdater.on("checking-for-update", () => {
        win.webContents.send("main:checking-for-update");
    });
    autoUpdater.on("error", (error) => {
        win.webContents.send("main:update-error", error.message);
    });
    autoUpdater.on("update-available", (message) => {
        console.log("find available version", message); // 有可用的更新
        win.webContents.send("main:update-available", message.version);
    });
    autoUpdater.on("update-downloaded", () => {
        // 下载完成
        win.webContents.send("main:update-downloaded");
    });
    autoUpdater.on("download-progress", ({ percent }) => {
        win.webContents.send("main:download-progress", percent);
    });
};

export { updaterEventListener };
