const { ipcRenderer } = window.require("electron");

const onStartedEventHandler = (callback: () => void) => {
    ipcRenderer.on("local:started", () => {
        callback();
    });
};
const onClosedEventHandler = (callback: () => void) => {
    ipcRenderer.on("local:closed", () => {
        callback();
    });
};
const onConnectionEventHandler = (callback: (data) => void) => {
    ipcRenderer.on("local:connection", (event, data) => {
        callback(data);
    });
};

const onRemoveAllListeners = () => {
    return Promise.all([
        ipcRenderer.removeAllListeners("local:connection"),
        ipcRenderer.removeAllListeners("local:started"),
        ipcRenderer.removeAllListeners("local:closed"),
    ]);
};

export {
    onStartedEventHandler,
    onClosedEventHandler,
    onConnectionEventHandler,
    onRemoveAllListeners,
};
