import Store from "electron-store";

import { store } from "../store/index";
import { IConfig } from "../../../utils/interfaces/config.type";
import { handlePreset } from "./preset";
// 默认值
const defaultConfig: IConfig = {
    proxy: {
        detail: {},
        templateList: [],
        targetList: [],
        mockList: [],
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
        proxy: {
            maxRowLength: 1000,
        },
    },
};
const eStore = new Store({
    defaults: {
        "tm-config": JSON.stringify(defaultConfig),
    },
});

// 初始化config
const initConfig = async () => {
    return new Promise<void>((resolve) => {
        if (eStore.has("tm-config")) {
            const result = eStore.get("tm-config");
            store.set("config", JSON.parse(result.toString() || "{}"));
            resolve();
        } else {
            handlePreset(defaultConfig);
            eStore.set("tm-config", defaultConfig);
            resolve();
        }
    });
};

const setConfig = (value: string) => {
    eStore.set("tm-config", value);
};

export { initConfig, eStore, defaultConfig, setConfig };
