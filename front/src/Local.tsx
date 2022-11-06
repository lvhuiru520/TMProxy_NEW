import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import AnsiUp from "ansi_up";
const ansi_up = new AnsiUp();

import { IConfig } from "../../utils/interfaces/config.type";
import { EServerStatus } from "../../utils/enums";

import {
    onClosedEventHandler,
    onConnectionEventHandler,
    onRemoveAllListeners,
    onStartedEventHandler,
} from "./events/local";

import { onStartServer, onCloseServer } from "./services/Local";

const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 14 },
};

const Local = (props: { config?: IConfig }) => {
    const { config } = props;
    const [form] = Form.useForm();
    const script = Form.useWatch("script", form);

    const [status, setStatus] = useState<EServerStatus>(EServerStatus.ready);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (config) {
            if (status !== EServerStatus.running) {
                form.resetFields();
            }
            if (status === EServerStatus.ready) {
                if (
                    config.setting?.local?.autoStart &&
                    config.setting?.local?.defaultScript
                ) {
                    onStart(config.setting.local.defaultScript);
                }
            }
        }
    }, [config]);

    let lineNum = 1;

    const replaceChildren = ({ parent, arg }) => {
        const divDom = document.createElement("div");
        divDom.innerHTML = ansi_up.ansi_to_html(arg);

        if (lineNum % (config?.setting?.local?.maxRowLength || 1000) === 0) {
            parent.replaceChildren(divDom);
        } else {
            parent.appendChild(divDom);
        }
        parent.appendChild(divDom);
        parent.scrollTo(0, parent.scrollHeight);
        lineNum++;
    };

    useEffect(() => {
        // 通信中
        onConnectionEventHandler((data) => {
            replaceChildren({
                parent: contentRef.current,
                arg: data,
            });
        });
        // 启动了
        onStartedEventHandler(() => {
            if (contentRef.current) {
                contentRef.current.innerHTML = ""; // 清空
            }
            lineNum = 0;
            message.success("启动成功");
            setStatus(EServerStatus.running);
        });
        // 关闭子进程
        onClosedEventHandler(() => {
            setStatus(EServerStatus.closed);
            message.success("终止成功");
        });

        return () => {
            onClose();
            const fn = async () => {
                await onRemoveAllListeners();
            };
            fn();
        };
    }, []);

    const onStart = (_script = script) => {
        onStartServer(_script);
    };

    const onClose = () => {
        onCloseServer();
    };

    return (
        <div style={{ padding: 10 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 10,
                }}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    initialValues={{
                        script: config?.setting?.local?.defaultScript,
                    }}
                >
                    <Form.Item noStyle>
                        <Input
                            value={"npm run"}
                            disabled
                            style={{ width: 100 }}
                            size="large"
                        />
                        <Form.Item noStyle name="script">
                            <Select
                                style={{ width: 300 }}
                                placeholder="请选择"
                                allowClear
                                size="large"
                            >
                                {config?.setting?.local?.scriptList?.map(
                                    (item) => (
                                        <Select.Option value={item} key={item}>
                                            {item}
                                        </Select.Option>
                                    )
                                )}
                            </Select>
                        </Form.Item>

                        {status !== EServerStatus.running && (
                            <Button
                                icon={<PlayCircleOutlined />}
                                type="primary"
                                size="large"
                                onClick={() => {
                                    onStart();
                                }}
                                disabled={!script}
                            >
                                启动
                            </Button>
                        )}
                        {status === EServerStatus.running && (
                            <Button
                                type="primary"
                                size="large"
                                danger
                                icon={<PauseCircleOutlined />}
                                onClick={onClose}
                            >
                                终止
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </div>
            <div
                style={{
                    height: "calc(100vh - 91px)",
                    overflowY: "auto",
                    backgroundColor: "#000",
                    scrollBehavior: "smooth",
                    fontSize: 14,
                    color: "#fff",
                    whiteSpace: "pre-wrap",
                    padding: 10,
                }}
                ref={contentRef}
            />
        </div>
    );
};

export default Local;
