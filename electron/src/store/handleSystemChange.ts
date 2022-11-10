import { IConfig } from "../../../utils/interfaces/config.type";
import { autoStart } from "../autoStart";

const handleSystemConfig = (oldConfig: IConfig, newConfig: IConfig) => {
    if (
        oldConfig.setting.system.autoStart !==
        newConfig.setting.system.autoStart
    ) {
        autoStart(newConfig.setting.system.autoStart);
    }
};

export { handleSystemConfig };
