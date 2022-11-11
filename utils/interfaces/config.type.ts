interface IProxyDetail {
    port?: number;
    protocol?: "http" | "https";
    mode?: "direct" | "advanced" | "manual";
    targetId?: string;
    proxy?: string;
    proxyList?: IProxyListItem[];
}

interface IProxy {
    targetList: IProxyTargetList;
    templateList: IProxyTemplateList;
    detail: IProxyDetail;
}

interface IConfig {
    proxy: IProxy;
    setting: ISetting;
}

interface ISetting {
    system: {
        autoStart: boolean; // 开机自启动
        shortcuts: {
            showOrHiddenWindow: string;
        };
    };
    local: {
        enable: boolean;
        file?: string;
        filePath?: string;
        autoStart: boolean;
        scriptList?: string[];
        defaultScript?: string;
        port?: number;
        maxRowLength: number;
    };
}

type objectType = {
    key: string;
    value: string;
};
interface IProxyListItem {
    changeOrigin: boolean;
    targetId: string;
    context: string[];
    cookieDomainRewrite?: objectType[];
    pathRewrite?: objectType[];
    enable: boolean;
}

interface IProxyTargetItem {
    id: string;
    target: string;
}
type IProxyTargetList = IProxyTargetItem[];

interface IProxyTemplateItem {
    id: string;
    templateName: string;
    detail: IProxyDetail;
}

type IProxyTemplateList = IProxyTemplateItem[];

export {
    IConfig,
    IProxyTargetList,
    IProxyTargetItem,
    IProxyTemplateItem,
    IProxyTemplateList,
    IProxyDetail,
    IProxy,
    ISetting,
    objectType,
};
