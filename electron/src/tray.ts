import { BrowserWindow, Tray, Menu, nativeImage, app, dialog } from "electron";
import path from "path";
import treeKill from "tree-kill";
import { store } from "./store/index";
import { EServerStatus } from "../../utils/enums";

const handleQuitEvent = () => {
    // 处理程序退出相关逻辑
    return new Promise<void>((resolve, reject) => {
        const localServer = store.get("localServer");
        if (localServer.status === EServerStatus.running) {
            const timer = setInterval(() => {
                const localServer = store.get("localServer");
                if (localServer.status === EServerStatus.closed) {
                    resolve();
                    clearInterval(timer);
                }
            }, 100);
            if (localServer.pid) {
                treeKill(localServer.pid, (err) => {
                    if (err) {
                        dialog.showErrorBox("退出时错误", err?.message || "");
                        clearInterval(timer);
                        reject();
                    } else {
                        clearInterval(timer);
                        resolve();
                    }
                });
            }
        } else {
            resolve();
        }
    });
};

const createTray = (win: BrowserWindow) => {
    let icon;
    if (process.platform === "darwin") {
        icon = nativeImage.createFromPath(
            path.join(__dirname, "./assets/icon-16.png")
        );
    } else {
        icon = nativeImage.createFromPath(
            path.join(__dirname, "./assets/icon.png")
        );
    }
    const tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "主界面",
            click: () => {
                win.show();
            },
        },
        {
            label: "关于",
            click: () => {
                win.show();
                win.webContents.send("main:show-about");
            },
        },
        {
            label: "重启",
            click: () => {
                handleQuitEvent().then(() => {
                    app.relaunch();
                    app.exit();
                });
            },
        },
        {
            label: "退出",
            click: () => {
                handleQuitEvent().then(() => {
                    app.exit();
                });
            },
        },
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip("TMProxy");
    tray.setTitle("TMProxy");

    tray.on("click", function () {
        win.show();
    });
};

export { createTray };
