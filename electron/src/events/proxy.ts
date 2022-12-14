import { ipcMain } from "electron";
import cloneDeep from "lodash.clonedeep";

import { store } from "../store/index";
import { createProxyServer, closeProxyServer } from "../proxy/index";
import { IProxy, proxyLogStatus } from "../../../utils/interfaces/config.type";
import { EServerStatus } from "../../../utils/enums";

const proxyEventListener = () => {
    let log: { status: proxyLogStatus } = { status: "start" };
    ipcMain.on(`proxy:close`, () => {
        closeProxyServer();
    });
    ipcMain.handle("proxy:log-status", (event, status) => {
        switch (status) {
            case "start":
                log.status = "start";
                break;
            case "pause":
                log.status = "pause";
                break;
        }
        return {
            success: true,
        };
    });
    ipcMain.on(`proxy:start`, async (event, params) => {
        createProxyServer({
            params,
            log,
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
