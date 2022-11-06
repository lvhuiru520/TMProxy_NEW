const { ipcRenderer } = window.require("electron");
const modifySettingServer = async (params) => {
    return await ipcRenderer.invoke("main:modify-setting", params);
};

export { modifySettingServer };
