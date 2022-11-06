import Store from "electron-store";

import { store } from "../store/index";

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
            eStore.set("tm-config", defaultConfig);
            resolve();
        }
    });
};

const setConfig = (value: string) => {
    eStore.set("tm-config", value);
};

export { initConfig, eStore, defaultConfig, setConfig };
