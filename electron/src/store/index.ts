import { IConfig } from "../../../utils/interfaces/config.type";
import { EServerStatus } from "../../../utils/enums";

import { defaultConfig, setConfig } from "../config/index";

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
                    setConfig(JSON.stringify(value));
                    break;
            }
            this.storage[key] = value;
            resolve();
        });
    }

    get<T extends keyof IStore>(key: T): IStore[T] {
        return this.storage[key];
    }
}

export const store = new Store();
