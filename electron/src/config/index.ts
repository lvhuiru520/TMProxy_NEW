import { app, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import Store from "electron-store";

import { store } from "../store/index";
import { CONFIG_FILENAME } from "../constants/index";
// 默认值
const defaultConfig = {
    proxy: {
        detail: {},
        templateList: [],
        targetList: [],
    },
    setting: {
        system: {
            autoStart: false, // 开机自启动
            shortcuts: {
                showOrHiddenWindow: "Alt+Q",
            },
        },
        local: {
            enable: false,
            autoStart: false,
            maxRowLength: 1000,
            scriptList: [],
            file: "[]",
        },
    },
};

// 记录config文件的状态
const recordConfigFileStatus = (status: boolean, errorCode?: string) => {
    store.set("configFileStatus", {
        errorCode,
        status,
    });
};

// 初始化config
const initConfig = async () => {
    return new Promise<void>((resolve) => {
        const root = process.env.HOME || process.env.USERPROFILE;
        const store = new Store();
        console.log(app.getPath("userData"), "userData");
        if (root) {
            const userProfileConfig = path.join(root, CONFIG_FILENAME);
            fs.readFile(userProfileConfig, async (err, data) => {
                if (err) {
                    recordConfigFileStatus(false, err.code);
                    switch (err?.code) {
                        case "ENOENT":
                            // 文件不存在，则创建一个新的
                            fs.writeFile(
                                userProfileConfig,
                                JSON.stringify(defaultConfig, null, 4),
                                (err) => {
                                    if (err) {
                                        console.log(err, "err");
                                        recordConfigFileStatus(false, err.code);
                                    }
                                    resolve();
                                }
                            );
                            break;
                    }
                } else {
                    // 读到config;
                    await store.set(
                        "config",
                        JSON.parse(data.toString() || "{}")
                    );
                    recordConfigFileStatus(true);
                }
                resolve();
            });
        } else {
            dialog.showErrorBox(
                "错误信息",
                `process.env.HOME || process.env.USERPROFILE不存在${
                    process.env.HOME || process.env.USERPROFILE
                }`
            );
            recordConfigFileStatus(
                false,
                "Not found process.env.HOME || process.env.USERPROFILE"
            );
            resolve();
        }
    });
};

export { defaultConfig, initConfig };
