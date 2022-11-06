const { ipcRenderer } = window.require("electron");

const onDownloadProgressEventHandler = (
    callback: (progress: number) => void
) => {
    ipcRenderer.on("main:download-progress", (event, progress: number) => {
        callback(progress);
    });
};
const onUpdateDownloadedEventHandler = (callback: () => void) => {
    ipcRenderer.on("main:update-downloaded", () => {
        callback();
    });
};
const onUpdateErrorEventHandler = (callback: (message: string) => void) => {
    ipcRenderer.on("main:update-error", (event, message) => {
        callback(message);
    });
};
const onUpdateAvailableEventHandler = (
    callback: (newVersion: string) => void
) => {
    ipcRenderer.once("main:update-available", (event, newVersion) => {
        callback(newVersion);
    });
};
const onShowAboutEventHandler = (callback: () => void) => {
    ipcRenderer.on("main:show-about", () => {
        callback();
    });
};
const onUpdateNotAvailableEventHandler = (callback: () => void) => {
    ipcRenderer.on("main:update-not-available", () => {
        callback();
    });
};
const onCheckingForUpdateEventHandler = (callback: () => void) => {
    ipcRenderer.on("main:checking-for-update", () => {
        callback();
    });
};

export {
    onDownloadProgressEventHandler,
    onUpdateDownloadedEventHandler,
    onUpdateErrorEventHandler,
    onUpdateAvailableEventHandler,
    onShowAboutEventHandler,
    onUpdateNotAvailableEventHandler,
    onCheckingForUpdateEventHandler,
};
