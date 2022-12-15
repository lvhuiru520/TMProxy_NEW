import { uuid } from "../../../utils/tools";
import { IConfig } from "../../../utils/interfaces/config.type";

const getTargetList = (list: string[] = []) => {
    return list.map((item) => ({
        id: uuid(8),
        target: item,
    }));
};

// 添加预设值
const handlePreset = (config: IConfig) => {
    const _targetList = getTargetList([
        "http://trialos.test.com",
        "http://itaimei.test.taimei.com",
        "https://uat.trialos.com.cn",
        "https://www.trialos.com.cn",
        "http://itaimei.test.taimei.com/api/engress-gateway/dev/finance-web-hjp",
    ]);
    config.proxy.targetList = _targetList;
    config.proxy.templateList = [
        {
            id: uuid(8),
            templateName: "Test环境自定义模板1-匹配所有请求",
            detail: {
                protocol: "http",
                port: 8080,
                mode: "direct",
                targetId: _targetList[0].id,
            },
        },
        {
            id: uuid(8),
            templateName: "Test环境自定义模板2-指定路由",
            detail: {
                protocol: "http",
                port: 8080,
                mode: "advanced",
                proxyList: [
                    {
                        context: ["/api/finance-web"],
                        cookieDomainRewrite: [
                            {
                                key: "*",
                                value: "",
                            },
                        ],
                        headers: [
                            {
                                key: "Connection",
                                value: "keep-alive",
                            },
                        ],
                        changeOrigin: true,
                        enable: true,
                        targetId: _targetList[_targetList.length - 1].id,
                        pathRewrite: [
                            {
                                key: "/api/finance-web",
                                value: "/",
                            },
                        ],
                    },
                    {
                        context: ["**"],
                        cookieDomainRewrite: [
                            {
                                key: "*",
                                value: "",
                            },
                        ],
                        headers: [
                            {
                                key: "Connection",
                                value: "keep-alive",
                            },
                        ],
                        changeOrigin: true,
                        enable: true,
                        targetId: _targetList[0].id,
                    },
                ],
            },
        },
        {
            id: uuid(8),
            templateName: "自定义模板2-手动配置",
            detail: {
                protocol: "http",
                port: 8080,
                mode: "manual",
                proxy: "[\n  {\n    context: [`/file`],\n    target: 'http://file.test.com',\n    changeOrigin: true,\n  },\n  {\n    context: [`**`],\n    target: 'http://trialos.test.com/',\n    changeOrigin: true,\n    cookieDomainRewrite: {\n      '*': '',\n    },\n  },\n]",
            },
        },
    ];
};

export { handlePreset };
