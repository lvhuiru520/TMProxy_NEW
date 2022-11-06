const { ipcRenderer } = window.require("electron");

const onLogInfo = (callback: (message: string) => void) => {
    ipcRenderer.on("proxy:log-info", (event, data) => {
        callback(data);
    });
};
const onLogError = (callback: (message: string) => void) => {
    ipcRenderer.on("proxy:log-error", (event, data) => {
        callback(data);
    });
};
const onRemoveAllListeners = () => {
    return Promise.all([
        ipcRenderer.removeAllListeners("proxy:log-info"),
        ipcRenderer.removeAllListeners("proxy:log-error"),
    ]);
};

export { onLogInfo, onLogError, onRemoveAllListeners };
