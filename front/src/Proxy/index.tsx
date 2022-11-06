import { Button, Layout, message, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/es/form/Form";

import KillPort from "../components/KillPort";
import ProxyStartDetail from "./components/StartDetail";
import ProxyDetail from "./components/Detail";
import ReferTemplate from "./components/ReferTemplate";

import {
    modifyProxy,
    onAddressInUseServer,
    startProxyServer,
} from "../services/proxy";
import {
    IProxyDetail,
    IProxy,
    IConfig,
} from "../../../utils/interfaces/config.type";

const Proxy = (props: { config?: IConfig }) => {
    const { config } = props;

    const [proxyData, setProxyData] = useState<IProxy>({} as IProxy);

    const ProxyDetailRef = useRef<{
        form: FormInstance;
    }>();
    const [detail, setDetail] = useState<IProxyDetail>();
    const ReferTemplateRef = useRef<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }>();
    const ProxyStartDetailRef = useRef<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }>();

    useEffect(() => {
        if (config) {
            setProxyData(config.proxy);
            setDetail(config.proxy.detail);
        }
    }, [config]);

    const modifyProxyDetail = (detail: IProxyDetail) => {
        return modifyProxy({ key: "detail", data: detail });
    };
    const killPortRef = useRef<{
        setParams: ({ port: number, visible: boolean }) => void;
    }>();

    useEffect(() => {
        onAddressInUseServer((port) => {
            ProxyStartDetailRef.current?.setVisible(false);
            killPortRef.current?.setParams({
                visible: true,
                port,
            });
        });
    }, []);
    const onSave = () => {
        if (detail) {
            modifyProxyDetail(detail).then(() => {
                message.success("保存成功");
            });
        }
    };
    const onStart = () => {
        const form = ProxyDetailRef.current?.form;
        form?.validateFields()
            .then((values) => {
                startProxyServer(values);
                ProxyStartDetailRef.current?.setVisible(true);
            })
            .catch((errorInfo) => {
                console.log(errorInfo, "errorInfo");
            });
    };

    return (
        <div style={{ overflow: "hidden", position: "relative" }}>
            <Layout>
                <Layout.Content
                    style={{
                        marginBottom: 10,
                        overflowY: "auto",
                        height: "calc(100vh - 90px)",
                        background: "#fff",
                        padding: 10,
                    }}
                >
                    <ProxyDetail
                        detail={proxyData?.detail}
                        targetList={proxyData?.targetList}
                        onValuesChange={(changedFields, allFields) => {
                            setDetail(allFields);
                        }}
                        ref={ProxyDetailRef}
                    />
                </Layout.Content>
                <Layout.Footer
                    style={{
                        background: "#fff",
                        padding: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        {proxyData?.templateList?.length ? (
                            <Button
                                onClick={() => {
                                    ReferTemplateRef.current?.setVisible(true);
                                }}
                            >
                                引用模板
                            </Button>
                        ) : (
                            ""
                        )}
                    </div>
                    <Button
                        type="primary"
                        shape="round"
                        icon={<PlayCircleOutlined />}
                        size="large"
                        onClick={onStart}
                    >
                        启动
                    </Button>
                    <div>
                        <Space>
                            <Button type="primary" onClick={onSave}>
                                保存
                            </Button>
                        </Space>
                    </div>
                </Layout.Footer>
            </Layout>
            <ProxyStartDetail ref={ProxyStartDetailRef} />
            <KillPort ref={killPortRef} />
            <ReferTemplate
                ref={ReferTemplateRef}
                templateList={proxyData.templateList || []}
                onOk={(detail) => {
                    modifyProxyDetail(detail);
                }}
            />
        </div>
    );
};
export default Proxy;
