import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";

import { store } from "./store/index";

import { mainEventListener } from "./events/index";
import { localEventListener } from "./events/local";
import { proxyEventListener } from "./events/proxy";
import { updaterEventListener } from "./events/updater";

import { autoStart } from "./autoStart";
import { createTray } from "./tray";
import { initConfig } from "./config/index";
import globalShortcut from "./globalShortcuts";

const isDev = process.env.NODE_ENV === "development";

const createWindow = async () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
        title: "TMProxy",
        icon: path.join(__dirname, "./assets/icon.png"),
        center: true,
        useContentSize: false,
        minWidth: 768,
    });
    // 窗口聚焦
    win.focus();
    //最大化窗口
    win.maximize();
    Menu.setApplicationMenu(null);
    if (isDev) {
        // 开发时更新用
        Object.defineProperty(app, "isPackaged", {
            get() {
                return true;
            },
        });
    }

    if (isDev) {
        win.webContents.openDevTools();
        win.loadURL("http://localhost:3000");
    } else {
        await win.loadURL(
            "file://" + path.join(__dirname, "./front/index.html")
        );
    }
    win.on("close", (e) => {
        e.preventDefault();
        win.hide();
    });
    return win;
};

app.whenReady()
    .then(createWindow)
    .then((win) => {
        initConfig().then(() => {
            const config = store.get("config");
            console.log(config, "config");
            autoStart(config.setting.system.autoStart);
            globalShortcut(config.setting.system.shortcuts.showOrHiddenWindow);
        });
        createTray(win);
        return win;
    })
    .then((win) => {
        mainEventListener();
        proxyEventListener();
        localEventListener();
        updaterEventListener(win);
    });
