import child_process from "node:child_process";
import path from "node:path";

import { store } from "../store/index";

const localChildProcess = (script: string) => {
    const filePath = store.get("config").setting.local.filePath;
    if (filePath) {
        const localProject = child_process.exec(`npm run ${script}`, {
            cwd: path.dirname(filePath),
            maxBuffer: Math.pow(2, 50),
        });
        localProject.unref();

        const onStdout = (callback = (data: any) => {}) => {
            localProject.stdout?.on("data", (data) => {
                callback(data);
            });
        };
        const onStderr = (callback = (data: any) => {}) => {
            localProject.stderr?.on("data", (data) => {
                callback(data);
            });
        };

        const onClose = (callback = () => {}) => {
            localProject.on("close", (code, signal) => {
                // 子进程关闭
                callback();
            });
        };

        return {
            onStderr,
            onStdout,
            onClose,
            pid: localProject.pid,
        };
    } else {
        throw Error(`filePath: ${filePath}}`);
    }
};
export { localChildProcess };
