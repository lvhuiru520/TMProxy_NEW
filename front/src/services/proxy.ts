const { ipcRenderer } = window.require("electron");
const startProxyServer = async (params) => {
    return await ipcRenderer.send("proxy:start", params);
};
const closeProxyServer = async () => {
    return await ipcRenderer.send("proxy:close");
};
const onAddressInUseServer = (callback: (port: number) => void) => {
    ipcRenderer.on("proxy:address-in-use", (event, port) => {
        callback(port);
    });
};

const modifyProxy = async (params) => {
    return await ipcRenderer.invoke("proxy:modify", params);
};

export {
    startProxyServer,
    closeProxyServer,
    onAddressInUseServer,
    modifyProxy,
};
