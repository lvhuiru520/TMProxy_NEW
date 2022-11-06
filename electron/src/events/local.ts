import { ipcMain } from "electron";
import treeKill from "tree-kill";
import { EServerStatus } from "../../../utils/enums";
import { localChildProcess } from "../child-process/local";
import { store } from "../store/index";

const localEventListener = () => {
    ipcMain.on(`local:start`, (event, params) => {
        const { onStdout, onStderr, onClose, pid } = localChildProcess(params);
        event.reply(`local:started`); // 这里判断程序已经启动是否合理？
        store.set("localServer", {
            status: EServerStatus.running,
            pid,
        });

        onStdout((data) => {
            event.reply(`local:connection`, data);
        });
        onStderr((data) => {
            event.reply(`local:connection`, data);
        });
        onClose(() => {
            event.reply(`local:closed`);
            store.set("localServer", {
                status: EServerStatus.closed,
            });
        });
        ipcMain.once(`local:close`, () => {
            if (pid) {
                treeKill(pid);
            }
        });
    });
};

export { localEventListener };
