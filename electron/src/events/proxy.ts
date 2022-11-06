import { cloneDeep } from "lodash";
import { ipcMain } from "electron";
import { store } from "../store/index";
import { createProxyServer, closeProxyServer } from "../proxy/index";
import { IProxy } from "../../../utils/interfaces/config.type";
import { EServerStatus } from "../../../utils/enums";

const proxyEventListener = () => {
    ipcMain.on(`proxy:close`, () => {
        closeProxyServer();
    });
    ipcMain.on(`proxy:start`, async (event, params) => {
        createProxyServer({
            params,
            onStart: (url: string) => {
                event.reply(`proxy:listening`, url);
                store.set("proxyServerStatus", EServerStatus.running);
            },
            onClose: () => {
                event.reply(`proxy:closed`);
                store.set("proxyServerStatus", EServerStatus.closed);
            },
            onAddressInUse: (port: number) => {
                event.reply(`proxy:address-in-use`, port);
            },
            onLogInfo: (message) => {
                event.reply("proxy:log-info", message);
            },
            onLogError: (error) => {
                event.reply("proxy:log-error", error);
            },
        });
    });

    ipcMain.handle(
        "proxy:modify",
        async (event, params: { key: keyof IProxy; data: any }) => {
            const { key, data } = params;
            const config = cloneDeep(store.get("config"));
            config.proxy[key] = data;
            await store.set("config", config);
            event.sender.send(`main:refresh-config`);
            return {
                success: true,
            };
        }
    );
};

export { proxyEventListener };
