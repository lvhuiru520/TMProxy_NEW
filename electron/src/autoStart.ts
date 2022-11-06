import { app } from "electron";
import path from "path";

const autoStart = (autoStart: boolean) => {
    const appFolder = path.dirname(process.execPath);
    const updateExe = path.resolve(appFolder, "TMProxy.exe");
    const exeName = path.basename(process.execPath);
    app.setLoginItemSettings({
        openAtLogin: autoStart,
        path: updateExe,
        args: [
            "--processStart",
            `"${exeName}"`,
            "--process-start-args",
            `"--hidden"`,
        ],
    });
};

export { autoStart };
