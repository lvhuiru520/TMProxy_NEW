import React from "react";
import { Tabs } from "antd";
import TargetList from "./components/TargetList";
import ProxyTemplate from "./components/Template";

const ProxyConfig = () => {
    return (
        <Tabs
            style={{
                height: "calc(100vh - 20px)",
                padding: 10,
            }}
            type="card"
            destroyInactiveTabPane
            items={[
                {
                    key: "targetList",
                    label: "target列表",
                    children: <TargetList />,
                },
                {
                    key: "template",
                    label: "代理模板",
                    children: <ProxyTemplate />,
                },
            ]}
        />
    );
};

export default ProxyConfig;
