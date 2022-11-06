import { Button, Card, Form, InputNumber, message, Popconfirm } from "antd";
import React, { useState } from "react";

import { killPortServer } from "../services/index";

const Tools = () => {
    const [port, setPort] = useState<number | null>();

    return (
        <div style={{ height: "calc(100vh - 20px)", padding: 10 }}>
            <Card title="终止端口号" style={{ width: 300 }}>
                <Form layout="inline">
                    <Form.Item label="端口号">
                        <InputNumber
                            min={0}
                            onChange={(value: number | null) => {
                                setPort(value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Popconfirm
                            title={`确定要终止该端口号吗?`}
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                if (port) {
                                    killPortServer(port)
                                        .then(() => {
                                            message.success("操作成功");
                                        })
                                        .catch((err) => {
                                            message.error(err);
                                        });
                                }
                            }}
                        >
                            <Button type="primary" danger>
                                终止
                            </Button>
                        </Popconfirm>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Tools;
