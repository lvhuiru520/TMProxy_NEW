import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";

import { IConfig } from "../../utils/interfaces/config.type";

import { getConfigServer, refreshConfigServer } from "./services/index";

import styled from "./styles/App.less";
import ProxyConfig from "./Proxy/Config";
import Proxy from "./Proxy";
import Local from "./Local";
import Setting from "./Setting";
import Tools from "./Tools";
import { EMenuKey } from "./utils/enums";
import About from "./About";

type IMenuList = {
    label: string;
    key: EMenuKey;
    children?: {
        label: string;
        key: EMenuKey;
        components: JSX.Element;
        destroyOnInActive?: boolean;
    }[];
    components?: JSX.Element;
    destroyOnInActive?: boolean;
}[];

export default function App() {
    const [config, setConfig] = useState<IConfig>();
    const [activeKey, setActiveKey] = useState<EMenuKey>(EMenuKey.Local);

    useEffect(() => {
        onGetConfig().then((res) => {
            const activeKey = getFirstActiveKey(res.setting.local.enable);
            setActiveKey(activeKey);
        });
        refreshConfigServer(onGetConfig);
    }, []);

    const getFirstActiveKey = (enable) => {
        return enable ? EMenuKey.Local : EMenuKey["Proxy-Proxy"];
    };

    const onGetConfig = async () => {
        return await getConfigServer().then((res) => {
            console.log(res, "config");
            setConfig(res);
            return res;
        });
    };

    const items = [
        {
            label: "本地项目",
            key: EMenuKey.Local,
            components: <Local config={config} />,
        },
        {
            label: "Proxy",
            key: EMenuKey.Proxy,
            children: [
                {
                    label: "代理",
                    key: EMenuKey["Proxy-Proxy"],
                    components: <Proxy config={config} />,
                },
                {
                    label: "配置",
                    key: EMenuKey["Proxy-Config"],
                    components: <ProxyConfig />,
                    destroyOnInActive: true,
                },
            ],
        },
        {
            label: "工具箱",
            key: EMenuKey.Tools,
            components: <Tools />,
            destroyOnInActive: true,
        },
        {
            label: "设置",
            key: EMenuKey.Setting,
            components: <Setting config={config} />,
            destroyOnInActive: true,
        },
    ];

    return (
        <div className={styled.App}>
            <Layout hasSider>
                <Layout.Sider>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultOpenKeys={[EMenuKey.Proxy]}
                        items={items.filter((item) => {
                            if (item.key === EMenuKey.Local) {
                                return config?.setting.local?.enable;
                            }
                            return true;
                        })}
                        className="custom-menu"
                        selectedKeys={[activeKey]}
                        onSelect={(item) => {
                            setActiveKey(item.key as EMenuKey);
                        }}
                    />
                </Layout.Sider>
                <Layout.Content>
                    <div
                        style={{
                            border: "10px solid #e3e3e3",
                            background: "#fff",
                        }}
                    >
                        <HandleMenuContent
                            activeKey={activeKey}
                            items={items}
                        />
                    </div>
                </Layout.Content>
            </Layout>
            <About />
        </div>
    );
}

function HandleMenuContent(props: { activeKey: EMenuKey; items: IMenuList }) {
    const { items, activeKey } = props;

    const render = (list: IMenuList) => {
        return list.map((item) => {
            const content = (
                <div
                    key={item.key}
                    style={{
                        display: item.key === activeKey ? "block" : "none",
                    }}
                >
                    {item?.components}
                </div>
            );
            return item.children?.length
                ? render(item.children)
                : item.destroyOnInActive
                ? item.key === activeKey && content
                : content;
        });
    };
    return <div>{render(items)}</div>;
}
