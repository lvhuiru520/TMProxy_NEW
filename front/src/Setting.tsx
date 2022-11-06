import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Select,
    Switch,
    Tooltip,
    Typography,
    Upload,
} from "antd";
import { UploadOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import { modifySettingServer } from "./services/setting";
import { IConfig, ISetting } from "../../utils/interfaces/config.type";

const { Title } = Typography;

const Setting = (props: { config?: IConfig }) => {
    const { config } = props;
    const [form] = Form.useForm();

    const [setting, setSetting] = useState<ISetting>({
        local: {},
        system: {},
    } as ISetting);
    useEffect(() => {
        if (config) {
            setSetting(config.setting);
        }
    }, [config]);

    useEffect(() => {
        form.resetFields();
    }, [setting]);

    const localEnable = Form.useWatch("localEnable", form);
    const localAutoStart = Form.useWatch("localAutoStart", form);
    const localDefaultScript = Form.useWatch("localDefaultScript", form);
    const localFile = Form.useWatch("localFile", form);

    const onValuesChange = async (changedFields, allFields) => {
        const options: ISetting = {
            system: {
                autoStart: allFields.autoStart,
                shortcuts: {
                    showOrHiddenWindow: allFields.showOrHiddenWindow,
                },
            },
            local: {
                ...setting.local,
                autoStart: allFields.localAutoStart,
                enable: allFields.localEnable,
                port: allFields.localPort,
                file: JSON.stringify(allFields.localFile),
                defaultScript: allFields.localDefaultScript,
                maxRowLength: allFields.localMaxRowLength,
            },
        };
        if ("localFile" in changedFields) {
            const handleLocalFile = () => {
                return new Promise<void>((resolve) => {
                    const reader = new FileReader();
                    const file = allFields.localFile[0];
                    options.local.filePath = file.originFileObj.path;
                    if (file) {
                        reader.readAsText(file.originFileObj);
                        reader.onload = (data) => {
                            const result = JSON.parse(
                                data.target?.result?.toString() || "{}"
                            );
                            options.local.scriptList =
                                Object.keys(result?.scripts || {}) || [];
                            resolve();
                        };
                        reader.onerror = (e) => {
                            message.error(`解析文件失败${e.target?.error}`);
                            resolve();
                        };
                    }
                });
            };
            if (allFields.localFile?.length) {
                await handleLocalFile();
            } else {
                options.local.scriptList = [];
                options.local.defaultScript = undefined;
                options.local.autoStart = false;
                options.local.filePath = "";
            }
        }
        // 调接口
        modifySettingServer(options);
    };

    return (
        <div
            style={{
                overflow: "auto",
                display: "flex",
                justifyContent: "center",
                height: "calc(100vh - 20px)",
                padding: "20px 10px",
            }}
        >
            <Form
                form={form}
                style={{ width: 500 }}
                onValuesChange={onValuesChange}
                initialValues={{
                    autoStart: setting?.system?.autoStart,
                    localAutoStart: setting?.local?.autoStart,
                    localEnable: setting?.local?.enable,
                    localPort: setting?.local?.port,
                    localDefaultScript: setting.local.defaultScript,
                    localFile: setting?.local.file
                        ? JSON.parse(setting?.local.file)
                        : [],
                    localMaxRowLength: setting?.local?.maxRowLength || 1000,
                    showOrHiddenWindow:
                        setting.system?.shortcuts?.showOrHiddenWindow,
                }}
            >
                <div>
                    <Title level={3}>系统设置</Title>
                    <Form.Item
                        label="开机自启动"
                        name="autoStart"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                        />
                    </Form.Item>
                </div>
                <Divider style={{ margin: "0 0 8px" }} />
                <div>
                    <Title level={3}>本地项目</Title>
                    <Form.Item
                        label="开启本地项目tab页"
                        name="localEnable"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                        />
                    </Form.Item>
                    <Form.Item
                        label="本地项目"
                        name="localFile"
                        required={localEnable}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            return (
                                (e &&
                                    e.fileList.map((item) => ({
                                        ...item,
                                        path: item?.originFileObj?.path,
                                    }))) ||
                                []
                            );
                        }}
                    >
                        <Upload
                            beforeUpload={() => false}
                            accept=".json"
                            maxCount={1}
                            showUploadList={true}
                            openFileDialogOnClick={true}
                            disabled={!localEnable}
                            itemRender={(originNode) => {
                                return (
                                    <div>
                                        {localFile?.[0]?.path
                                            ? `fullPath: ${localFile?.[0]?.path}`
                                            : ""}
                                        {originNode}
                                    </div>
                                );
                            }}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                disabled={!localEnable}
                            >
                                请选择package.json文件
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="本地项目自启动"
                        name="localAutoStart"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            disabled={!localEnable || !localFile?.length}
                        />
                    </Form.Item>
                    <Form.Item
                        label="自启动默认选项"
                        required={localAutoStart}
                        name="localDefaultScript"
                        help={
                            localAutoStart &&
                            !localDefaultScript &&
                            "本地项目自启动必须设置默认选项"
                        }
                        validateStatus={
                            localAutoStart && !localDefaultScript ? "error" : ""
                        }
                    >
                        <Select
                            disabled={!localEnable || !localFile?.length}
                            style={{ width: 200, marginLeft: 8 }}
                            placeholder="请选择自启动执行的选项"
                            allowClear
                        >
                            {setting.local?.scriptList?.map((item) => (
                                <Select.Option value={item} key={item}>
                                    {item}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="localPort"
                        label={
                            <>
                                <span>本地项目端口号</span>
                                <Tooltip
                                    title="用于进程被占用时结束端口号"
                                    arrowPointAtCenter
                                >
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </>
                        }
                    >
                        <InputNumber max={65535} disabled={!localEnable} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <>
                                <span>本地项目最大行数</span>
                                <Tooltip
                                    title="本地项目输出的内容在页面上超出最大行数时会清除，设置值越大占用内容越大"
                                    arrowPointAtCenter
                                >
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </>
                        }
                        name="localMaxRowLength"
                    >
                        <InputNumber
                            max={65535}
                            min={1}
                            disabled={!localEnable}
                        />
                    </Form.Item>
                </div>
                <Divider style={{ margin: "0 0 8px" }} />
                <>
                    <Title level={3}>
                        快捷键
                        <Tooltip
                            title="与其它应用快捷键冲突时会失效"
                            arrowPointAtCenter
                        >
                            <QuestionCircleOutlined style={{ fontSize: 14 }} />
                        </Tooltip>
                    </Title>
                    <Form.Item label="打开/关闭窗口" name="showOrHiddenWindow">
                        <Input
                            style={{ width: 100 }}
                            placeholder="请输入"
                            allowClear
                        />
                    </Form.Item>
                </>
            </Form>
        </div>
    );
};

export default Setting;
