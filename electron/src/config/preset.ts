import { uuid } from "../../../utils/tools";
import { IConfig } from "../../../utils/interfaces/config.type";

const getTargetList = (list: string[] = []) => {
    return list.map((item) => ({
        id: uuid(8),
        target: item,
    }));
};

// 添加预设值
const handlePreset = (config: IConfig) => {};

export { handlePreset };
