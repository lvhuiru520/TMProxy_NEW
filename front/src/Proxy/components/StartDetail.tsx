import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import { Drawer, Result, Button, message, Spin, Typography, Space } from "antd";
import { changeLogStatusServer, closeProxyServer } from "../../services/proxy";
import {
    onLogError,
    onLogInfo,
    onRemoveAllListeners,
} from "../../events/proxy";
import { EServerStatus } from "../../../../utils/enums";
import { proxyLogStatus } from "../../../../utils/interfaces/config.type";
const { ipcRenderer } = window.require("electron");

const ProxyStartDetail = (props: {
    startInfo?: string;
    status: EServerStatus;
}) => {
    const { startInfo, status } = props;
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [logStatus, setLogStatus] = useState<proxyLogStatus>("start");
    const appendChildren = ({ parent, message, type }) => {
        const divDom = document.createElement("div");
        divDom.innerHTML = `${message}   ----->Time:${new Date().toLocaleString()}`;
        if (type === "error") {
            divDom.style.color = "red";
        }
        parent.appendChild(divDom);
        parent.scrollTo(0, parent.scrollHeight);
    };
    useEffect(() => {
        onLogError((message) => {
            appendChildren({
                parent: contentRef.current,
                message,
                type: "error",
            });
        });
        onLogInfo((message) => {
            appendChildren({
                parent: contentRef.current,
                message,
                type: "info",
            });
        });
        changeLogStatusServer("start").then(() => {
            setLogStatus("start");
        });
        return () => {
            const fn = async () => {
                await onRemoveAllListeners();
            };
            fn();
        };
    }, []);
    const onClear = () => {
        if (contentRef.current) {
            contentRef.current.innerHTML = ""; // 清空
        }
    };
    const onChangeLogStatus = () => {
        let _logStatus;
        if (logStatus === "start") {
            _logStatus = "pause";
        } else {
            _logStatus = "start";
        }
        changeLogStatusServer(_logStatus).then(() => {
            setLogStatus(_logStatus);
        });
    };

    return (
        <div>
            <div
                style={{
                    height: "calc(50vh - 88px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {status === EServerStatus.ready && (
                    <Spin spinning size="large" />
                )}
                {status === EServerStatus.running && (
                    <>
                        <Result
                            status="success"
                            subTitle={
                                <>
                                    <Typography.Link
                                        copyable={{
                                            tooltips: ["复制", "复制成功"],
                                        }}
                                    >
                                        {startInfo}
                                    </Typography.Link>
                                </>
                            }
                            extra={[
                                <Button
                                    type="primary"
                                    danger
                                    key="console"
                                    onClick={() => {
                                        closeProxyServer();
                                    }}
                                >
                                    停止服务
                                </Button>,
                            ]}
                        />
                    </>
                )}
            </div>
            <div style={{ marginBottom: 8, textAlign: "right" }}>
                <Space>
                    <Button type="primary" onClick={onClear}>
                        清空
                    </Button>
                    {logStatus === "start" ? (
                        <Button
                            type="primary"
                            danger
                            onClick={onChangeLogStatus}
                        >
                            暂停
                        </Button>
                    ) : (
                        <Button onClick={onChangeLogStatus}>开始</Button>
                    )}
                </Space>
            </div>
            <div
                style={{
                    height: "calc(50vh)",
                    overflowY: "auto",
                    color: "#fff",
                    padding: 10,
                    backgroundColor: "#000",
                    scrollBehavior: "smooth",
                    fontSize: 14,
                    whiteSpace: "pre-wrap",
                    position: "relative",
                }}
                ref={contentRef}
            />
        </div>
    );
};

const Wrapper = (props, ref) => {
    const [visible, setVisible] = useState(false);
    useImperativeHandle(ref, () => ({ setVisible }));
    const [detailParams, setDetailParams] = useState<{
        status: EServerStatus;
        startInfo?: string;
    }>({
        status: EServerStatus.ready,
    });

    useEffect(() => {
        ipcRenderer.on("proxy:listening", (event, data) => {
            setVisible(true);
            setDetailParams({
                startInfo: data,
                status: EServerStatus.running,
            });
        });

        ipcRenderer.on("proxy:closed", () => {
            message.success("终止成功");
            setVisible(false);
            setDetailParams({
                status: EServerStatus.closed,
            });
        });
    }, []);
    return (
        <Drawer
            open={visible}
            width={"calc(100vw - 220px)"}
            destroyOnClose
            getContainer={false}
            mask={false}
            closable={false}
            bodyStyle={{
                padding: 10,
            }}
        >
            <ProxyStartDetail {...detailParams} />
        </Drawer>
    );
};

export default forwardRef(Wrapper);
