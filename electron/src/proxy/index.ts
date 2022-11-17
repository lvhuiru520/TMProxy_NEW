import http from "node:http";
import events from "node:events";
import { Socket } from "node:net";
import { createProxyMiddleware } from "http-proxy-middleware";
import {
    OnProxyReqCallback,
    LogProviderCallback,
} from "http-proxy-middleware/dist/types";
import express from "express";

import { store } from "../store";
import { looseJsonParse } from "../utils";
import {
    IProxyDetail,
    objectType,
    proxyLogStatus,
} from "../../../utils/interfaces/config.type";

events.EventEmitter.defaultMaxListeners = 0;
const commonErrorCode = {
    EACCES: "权限被拒绝",
    EADDRINUSE: "地址已被使用",
    ECONNREFUSED: "连接被服务器拒绝",
    ECONNRESET: "对等方重置连接",
    EEXIST: "文件存在",
    EISDIR: "是目录",
    EMFILE: "系统中打开的文件太多",
    ENOENT: "无此文件或目录",
    ENOTDIR: "不是目录",
    ENOTEMPTY: "目录不为空",
    ENOTFOUND: "域名系统查找失败",
    EPERM: "不允许操作",
    EPIPE: "断开的管道",
    ETIMEDOUT: "操作超时",
};

const host = "127.0.0.1";

const socketList: Socket[] = [];
let server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
>;

const handleObjectList = (
    list: objectType[],
    obj: { [key: string]: string }
) => {
    if (list?.length) {
        list.forEach((item) => {
            obj[item.key] = item.value || "";
        });
    }
};

const createProxyServer = async ({
    params,
    log,
    onStart,
    onClose,
    onAddressInUse,
    onLogError,
    onLogInfo,
}: {
    params: IProxyDetail;
    log: { status: proxyLogStatus };
    onStart: (url: string) => void;
    onClose: () => void;
    onAddressInUse: (port: number) => void;
    onLogInfo: (message: string) => void;
    onLogError: (error: string) => void;
}) => {
    const app = express();
    params.mockList
        ?.filter((item) => item.enable)
        .forEach((item) => {
            app[item.method](item.path, (req, res) => {
                res.send(item.data);
            });
        });
    const targetList = store.get("config").proxy.targetList || [];
    const logProvider = () => {
        return {
            log: function (message: string) {
                onLogInfo(message);
                console.log(message);
            },
            info: function (message: string) {
                onLogInfo(message);
                console.info(message);
            },
            warn: function (message: string) {
                onLogError(message);
                console.warn(message);
            },
            error: function (message: string) {
                onLogError(message);
                console.warn(message);
            },
        };
    };
    const defaultOptions: {
        logProvider: LogProviderCallback;
        onProxyReq: OnProxyReqCallback;
    } = {
        logProvider,
        onProxyReq: (proxyReq, req) => {
            if (log.status === "start") {
                const originUrl = `[${req.method}] ${req.protocol}://${req.headers.host}${req.path}`;
                const targetUrl = `[${proxyReq.method}] ${proxyReq.protocol}//${
                    proxyReq.getHeaders().host
                }${proxyReq.path}`;
                logProvider().log(`${originUrl} ---> ${targetUrl}`);
            }
        },
    };

    switch (params.mode) {
        case "direct": {
            const result = targetList.find(
                (item) => item.id === params.targetId
            );
            if (result) {
                const proxy = createProxyMiddleware("**", {
                    changeOrigin: true,
                    cookieDomainRewrite: { "*": "" },
                    target: result.target,
                    headers: {
                        Connection: "keep-alive",
                    },
                    ...defaultOptions,
                });
                app.use(proxy);
            }
            break;
        }
        case "advanced": {
            const proxyList = params.proxyList || [];
            proxyList
                .filter((item) => item.enable)
                .forEach((item) => {
                    const result = targetList.find(
                        (targetItem) => targetItem.id === item.targetId
                    );
                    if (result) {
                        const cookieDomainRewrite = {};
                        const pathRewrite = {};
                        handleObjectList(
                            item.cookieDomainRewrite || [],
                            cookieDomainRewrite
                        );
                        handleObjectList(item.pathRewrite || [], pathRewrite);
                        const proxy = createProxyMiddleware(item.context, {
                            changeOrigin: item.changeOrigin,
                            cookieDomainRewrite: cookieDomainRewrite,
                            pathRewrite: pathRewrite,
                            target: result.target,
                            ...defaultOptions,
                        });
                        app.use(proxy);
                    }
                });
            break;
        }
        case "manual": {
            try {
                const value = looseJsonParse(params.proxy);
                if (value) {
                    const createItemProxy = (option: object) => {
                        let obj: any = {};
                        for (const key in option) {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    option,
                                    key
                                )
                            ) {
                                obj[key] = option[key];
                            }
                        }
                        if (obj.context) {
                            const proxy = createProxyMiddleware(obj.context, {
                                ...option,
                                ...defaultOptions,
                            });
                            app.use(proxy);
                        }
                    };
                    if (Array.isArray(value)) {
                        value.forEach((item) => {
                            createItemProxy(item);
                        });
                    } else if (typeof value === "object") {
                        createItemProxy(value);
                    }
                }
            } catch (error: any) {
                onLogError(error?.message);
                console.error(error?.message);
            }
            break;
        }
    }
    server = http.createServer(app);
    server.on(
        "error",
        (
            error: Error & {
                code: keyof typeof commonErrorCode;
            }
        ) => {
            if (error.code === "EADDRINUSE") {
                onAddressInUse(params.port as number);
            }
            onLogError(
                (error.code ? commonErrorCode[error.code] || error.code : "") +
                    error.message
            );
        }
    );

    server.on("connection", (socket) => {
        socketList.push(socket);
        socket.once("close", () => {
            const index = socketList.indexOf(socket);
            socketList.splice(index, 1);
        });
    });

    server.on("close", () => {
        onClose();
    });

    server.listen(params.port, host, () => {
        const addressInfo = server.address();
        if (!addressInfo) {
            onStart(`${params.protocol}://${host}:${params.port}`);
        } else if (typeof addressInfo === "object") {
            const { address, family, port } = addressInfo;
            const protocolList = [
                {
                    protocol: "http",
                    family: "IPv4",
                },
                {
                    protocol: "https",
                    family: "IPv6",
                },
            ];
            onStart(
                `${
                    protocolList.find((item) => item.family === family)
                        ?.protocol
                }://${address}:${port}`
            );
        } else {
            onStart(`${params.protocol}://${host}:${params.port}`);
        }
    });
};
const closeProxyServer = () => {
    socketList.forEach((item) => {
        item.destroy();
    });
    server.close();
};

export { createProxyServer, closeProxyServer };
