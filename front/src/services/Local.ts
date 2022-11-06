const { ipcRenderer } = window.require("electron");

const onCloseServer = () => {
    ipcRenderer.send("local:close");
};
const onStartServer = (value: string) => {
    ipcRenderer.send("local:start", value);
};

export { onCloseServer, onStartServer };
