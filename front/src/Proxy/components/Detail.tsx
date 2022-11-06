import { Form, Input, InputNumber, Radio, Select } from "antd";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";

import {
    IProxyDetail,
    IProxyTargetList,
} from "../../../../utils/interfaces/config.type";
import ProxyGroupFormItem from "../components/ProxyGroupFormItem";
const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
};
const ProxyDetail = (
    props: {
        detail?: IProxyDetail;
        targetList?: IProxyTargetList;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onValuesChange?: (changedValues: any, values: any) => void;
    },
    ref
) => {
    const { detail, targetList, onValuesChange } = props;

    const [form] = Form.useForm();
    useImperativeHandle(ref, () => ({
        form,
    }));
    useEffect(() => {
        form.resetFields();
    }, [detail]);
    const mode = Form.useWatch("mode", form);

    const targetOptions = targetList?.map((item) => (
        <Select.Option value={item.id} key={item.id} label={item.target}>
            {item.target}
        </Select.Option>
    ));
    const checkTargetIdExist = (targetId) => {
        return (
            targetList?.length &&
            targetList.find((item) => item.id === targetId)
        );
    };
    const getDefaultTargetId = (targetId) => {
        if (checkTargetIdExist(targetId) && targetId) {
            return targetId;
        } else {
            return undefined;
        }
    };
    return (
        <Form
            {...formItemLayout}
            form={form}
            initialValues={{
                protocol: detail?.protocol || "http",
                port: detail?.port,
                mode: detail?.mode || "direct",
                targetId: getDefaultTargetId(detail?.targetId),
                proxyList: (detail?.proxyList || []).map((item) => {
                    item.targetId = getDefaultTargetId(item.targetId);
                    return item;
                }),
            }}
            scrollToFirstError
            onValuesChange={onValuesChange}
        >
            <Form.Item label="服务">
                <Input.Group compact>
                    <Form.Item noStyle name="protocol">
                        <Select style={{ width: 100 }}>
                            <Select.Option value="http">http</Select.Option>
                            <Select.Option value="https" disabled>
                                https
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Input style={{ width: 100 }} value="127.0.0.1" disabled />
                    <Form.Item
                        noStyle
                        name="port"
                        rules={[
                            {
                                required: true,
                                message: "端口号不能为空",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="请输入端口号"
                            style={{ width: 200 }}
                            min={1024}
                            max={65535}
                        />
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            <Form.Item label="模式" name="mode">
                <Radio.Group>
                    <Radio.Button value="direct">直连</Radio.Button>
                    <Radio.Button value="advanced">高级配置</Radio.Button>
                    <Radio.Button value="manual">手动输入</Radio.Button>
                </Radio.Group>
            </Form.Item>
            {mode === "direct" && (
                <Form.Item label="target">
                    <Form.Item
                        name="targetId"
                        rules={[
                            {
                                required: true,
                                message: "target不能为空",
                            },
                        ]}
                        noStyle
                    >
                        <Select
                            placeholder="请选择"
                            style={{ width: 400 }}
                            allowClear
                            showSearch
                            optionFilterProp="label"
                        >
                            {targetOptions}
                        </Select>
                    </Form.Item>
                </Form.Item>
            )}
            {mode === "advanced" && (
                <Form.Item label="proxy" required>
                    <ProxyGroupFormItem
                        name="proxyList"
                        targetOptions={targetOptions}
                    />
                </Form.Item>
            )}
            {mode === "manual" && (
                <Form.Item
                    label="proxy"
                    required
                    name="proxy"
                    rules={[{ required: true, message: "必填项" }]}
                >
                    <Input.TextArea rows={10} />
                </Form.Item>
            )}
        </Form>
    );
};

export default forwardRef(ProxyDetail);
