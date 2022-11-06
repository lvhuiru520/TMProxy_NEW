const { ipcRenderer } = window.require("electron");
import { IConfig } from "../../../utils/interfaces/config.type";

const getConfigServer = function (): Promise<IConfig> {
    return ipcRenderer.invoke("main:get-config");
};

const refreshConfigServer = (callback?: () => void) => {
    ipcRenderer.on("main:refresh-config", () => {
        callback?.();
    });
};

const killPortServer = async (port: number) => {
    return await ipcRenderer.invoke("main:kill-port", port);
};

// 检查更新
const checkForUpdateServer = async () => {
    return await ipcRenderer.invoke("main:check-for-update");
};

// 下载最新包
const downloadUpdateServer = () => {
    return ipcRenderer.send("main:download-update");
};
// 退出并安装
const quitAndInstallServer = () => {
    return ipcRenderer.send("main:quit-and-install");
};

const getCurrentVersionServer = () => {
    return ipcRenderer.invoke("main:get-current-version");
};

export {
    getConfigServer,
    refreshConfigServer,
    killPortServer,
    checkForUpdateServer,
    downloadUpdateServer,
    quitAndInstallServer,
    getCurrentVersionServer,
};
