import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { Modal, message } from "antd";

import { killPortServer } from "../services/index";

const killPort = (props, ref) => {
    const [visible, setVisible] = useState(false);
    const [params, setParams] = useState<{ port: number; visible: boolean }>();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (params?.visible) {
            setVisible(true);
        }
    }, [params]);

    useImperativeHandle(ref, () => ({
        setParams,
    }));

    return (
        <Modal
            title={`端口号${params?.port}被占用`}
            open={visible}
            okText="是"
            cancelText="否"
            centered
            destroyOnClose
            onOk={() => {
                setConfirmLoading(true);
                if (params?.port) {
                    killPortServer(params.port)
                        .then(() => {
                            message.success("操作成功");
                        })
                        .catch((err) => {
                            message.error(err);
                        })
                        .finally(() => {
                            setConfirmLoading(false);
                            setVisible(false);
                        });
                }
            }}
            confirmLoading={confirmLoading}
            onCancel={() => {
                setVisible(false);
            }}
        >
            <p>{`是否强制终止${params?.port}端口号?`}</p>
        </Modal>
    );
};

export default forwardRef(killPort);
