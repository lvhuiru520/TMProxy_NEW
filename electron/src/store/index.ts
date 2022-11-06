import { dialog } from "electron";
import path from "node:path";
import fsPromises from "node:fs/promises";

import { IConfig } from "../../../utils/interfaces/config.type";
import { EServerStatus } from "../../../utils/enums";

import { defaultConfig } from "../config/index";
import { CONFIG_FILENAME } from "../constants/index";

interface IStore {
    config: IConfig;
    configFileStatus: {
        errorCode?: string;
        status: boolean;
    };
    proxyServerStatus: EServerStatus;
    localServer: {
        pid?: number;
        status: EServerStatus;
    };
}

class Store {
    private storage: IStore = {
        config: defaultConfig,
        configFileStatus: {
            status: true,
        },
        proxyServerStatus: EServerStatus.ready,
        localServer: {
            status: EServerStatus.ready,
        },
    };
    constructor() {}

    set<T extends keyof IStore>(key: T, value: IStore[T]): Promise<void> {
        return new Promise(async (resolve) => {
            switch (key) {
                case "config":
                    const configFileStatus = store.get("configFileStatus");
                    if (configFileStatus.status) {
                        const root =
                            process.env.HOME || process.env.USERPROFILE;
                        if (root) {
                            const userProfileConfig = path.join(
                                root,
                                CONFIG_FILENAME
                            );
                            await fsPromises
                                .writeFile(
                                    userProfileConfig,
                                    JSON.stringify(value, null, 4)
                                )
                                .then(() => {
                                    this.storage[key] = value;
                                })
                                .catch((err) => {
                                    if (err) {
                                        store.set("configFileStatus", {
                                            errorCode: err?.code,
                                            status: false,
                                        });
                                        dialog.showErrorBox(
                                            "错误信息",
                                            err?.message
                                        );
                                    }
                                });
                        }
                    } else {
                        this.storage[key] = value;
                    }
                    break;
                default:
                    this.storage[key] = value;
                    break;
            }
            resolve();
        });
    }

    get<T extends keyof IStore>(key: T): IStore[T] {
        return this.storage[key];
    }
}

export const store = new Store();
