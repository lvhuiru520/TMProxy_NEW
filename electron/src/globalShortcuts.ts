import { BrowserWindow, globalShortcut, app } from "electron";

const onLoad = () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        if (!globalShortcut.isRegistered("Alt+F12")) {
            globalShortcut.register("Alt+F12", () => {
                if (win.webContents.isDevToolsOpened()) {
                    win.webContents.closeDevTools();
                } else {
                    win.webContents.openDevTools();
                }
            });
        }
    }
};
const unregisterFn = () => {
    globalShortcut.unregister("Alt+F12");
};

export default (showOrHiddenWindowShortcut: any) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        app.whenReady().then(() => {
            if (showOrHiddenWindowShortcut) {
                globalShortcut.register(showOrHiddenWindowShortcut, () => {
                    if (win.isVisible() && !win.isMinimized()) {
                        win.hide();
                    } else {
                        win.show();
                    }
                });
            }

            win.on("show", () => {
                onLoad();
            });
            win.on("focus", () => {
                onLoad();
            });
            win.on("hide", () => {
                unregisterFn();
            });
            win.on("minimize", () => {
                unregisterFn();
            });
            win.on("blur", () => {
                unregisterFn();
            });
        });
    }
};
