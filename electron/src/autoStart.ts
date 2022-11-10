import { app } from "electron";

const autoStart = (autoStart: boolean) => {
    app.setLoginItemSettings({
        openAtLogin: autoStart,
    });
};

export { autoStart };
