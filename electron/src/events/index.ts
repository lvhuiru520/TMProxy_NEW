import { ipcMain } from "electron";
import { store } from "../store/index";
import killPort from "kill-port";
import cloneDeep from "lodash.clonedeep";
const mainEventListener = () => {
    ipcMain.handle(`main:get-config`, () => {
        return store.get("config");
    });

    ipcMain.handle(`main:kill-port`, (event, port) => {
        return killPort(port);
    });

    ipcMain.handle(`main:modify-setting`, async (event, setting) => {
        const config = cloneDeep(store.get("config"));
        config.setting = setting;
        await store.set("config", config);
        event.sender.send(`main:refresh-config`);
        return {
            success: true,
        };
    });
};

export { mainEventListener };
