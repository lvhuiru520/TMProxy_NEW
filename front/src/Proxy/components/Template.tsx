import React, { useEffect, useRef, useState } from "react";
import { Button, Drawer, message } from "antd";
import { cloneDeep } from "lodash";

import EditableTable from "./EditableTable";
import ProxyDetail from "./Detail";

import { getConfigServer } from "../../services/index";
import { modifyProxy } from "../../services/proxy";

import {
    IProxy,
    IProxyDetail,
    IProxyTemplateList,
    IProxyTemplateItem,
} from "../../../../utils/interfaces/config.type";

const ProxyTemplate = () => {
    const [dataSource, setDataSource] = useState<IProxyTemplateList>([]);
    const [visible, setVisible] = useState(false);
    const [proxyConfig, setProxyConfig] = useState<IProxy>({} as IProxy);
    const [currentTemplate, setCurrentTemplate] = useState<IProxyTemplateItem>(
        {} as IProxyTemplateItem
    );
    const ProxyDetailRef = useRef<{
        onValidateFields: (
            onFinish: (values) => void,
            onFinishFailed?: ((errorInfo) => void) | undefined
        ) => void;
    }>();
    useEffect(() => {
        getConfig();
    }, []);

    const getConfig = () => {
        getConfigServer().then((res) => {
            setDataSource(res.proxy.templateList || []);
            setProxyConfig(res.proxy);
        });
    };

    const onChange = (
        templateList: IProxyTemplateList,
        callback?: () => void
    ) => {
        modifyProxy({
            key: "templateList",
            data: templateList,
        }).then(() => {
            getConfig(); // refresh
            callback?.();
        });
    };

    const onSaveDetail = (values: IProxyDetail) => {
        const _dataSource = cloneDeep(dataSource);
        const result = _dataSource.find(
            (item) => item.id === currentTemplate.id
        );
        if (result) {
            result.detail = values;
        }
        onChange(_dataSource, () => {
            setVisible(false);
            message.success("操作成功");
        });
    };

    return (
        <>
            <EditableTable
                data={dataSource}
                editColTitle="模板名称"
                editItemKey="templateName"
                onUpdate={(dataSource) => {
                    onChange(dataSource);
                }}
                onView={(record) => {
                    setCurrentTemplate(record);
                    setVisible(true);
                }}
            />
            <Drawer
                open={visible}
                title="模板详情"
                width={"calc(100vw - 210px)"}
                onClose={() => {
                    setVisible(false);
                }}
                maskClosable={false}
                destroyOnClose
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                ProxyDetailRef.current?.onValidateFields(
                                    (values) => {
                                        onSaveDetail(values);
                                    }
                                );
                            }}
                        >
                            保存
                        </Button>
                    </div>
                }
            >
                <ProxyDetail
                    targetList={proxyConfig.targetList}
                    ref={ProxyDetailRef}
                    detail={currentTemplate.detail || {}}
                />
            </Drawer>
        </>
    );
};

export default ProxyTemplate;
