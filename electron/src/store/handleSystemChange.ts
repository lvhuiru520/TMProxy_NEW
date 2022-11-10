import { globalShortcut } from "electron";
import { IConfig } from "../../../utils/interfaces/config.type";
import { autoStart } from "../autoStart";
import globalShortcuts from "../globalShortcuts";

const handleSystemConfig = (oldConfig: IConfig, newConfig: IConfig) => {
    if (
        oldConfig.setting.system.autoStart !==
        newConfig.setting.system.autoStart
    ) {
        autoStart(newConfig.setting.system.autoStart);
    }

    const oldShowOrHiddenWindow =
        oldConfig.setting.system.shortcuts.showOrHiddenWindow;
    const newShowOrHiddenWindow =
        newConfig.setting.system.shortcuts.showOrHiddenWindow;

    if (oldShowOrHiddenWindow !== newShowOrHiddenWindow) {
        if (oldShowOrHiddenWindow) {
            globalShortcut.unregister(
                oldConfig.setting.system.shortcuts.showOrHiddenWindow
            );
        }
        if (newShowOrHiddenWindow) {
            globalShortcuts(newShowOrHiddenWindow);
        }
    }
};

export { handleSystemConfig };
