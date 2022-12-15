import React from "react";
import { FormInstance, Select, Switch, Form } from "antd";

import ObjectTypeFormItem from "./ObjectTypeFormItem";
import FormItemLabel from "./FormItemLabel";
import ListTypeFormItem from "./ListTypeFormItem";
import FormItemLayout from "./FormItemLayout";
import CardFormList from "./CardFormList";

const ProxyGroupFormItem = (props: {
    name: string;
    targetOptions: JSX.Element[] | undefined;
    form: FormInstance;
    cardRef?: React.Ref<unknown>;
}) => {
    const { name, targetOptions, form, cardRef } = props;

    const getTarget = (name: number) => {
        const targetId = form?.getFieldValue([props.name, name, "targetId"]);
        if (targetId) {
            const result = targetOptions?.find((item) => item.key === targetId);
            if (result) {
                return result.props.label;
            }
        }
    };
    const itemRender = (name, restField, formItemLayout) => {
        return (
            <>
                <Form.Item
                    label={<FormItemLabel>changeOrigin</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                >
                    <FormItemLayout colSpan={24}>
                        <Form.Item
                            name={[name, "changeOrigin"]}
                            valuePropName="checked"
                            {...restField}
                            {...formItemLayout}
                            noStyle
                        >
                            <Switch
                                checkedChildren="true"
                                unCheckedChildren="false"
                            />
                        </Form.Item>
                    </FormItemLayout>
                </Form.Item>
                <Form.Item
                    label={<FormItemLabel>ws</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                >
                    <FormItemLayout colSpan={24}>
                        <Form.Item
                            name={[name, "ws"]}
                            valuePropName="checked"
                            {...restField}
                            {...formItemLayout}
                            noStyle
                        >
                            <Switch
                                checkedChildren="true"
                                unCheckedChildren="false"
                            />
                        </Form.Item>
                    </FormItemLayout>
                </Form.Item>
                <Form.Item
                    label={<FormItemLabel>target</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                    required
                >
                    <FormItemLayout colSpan={22}>
                        <Form.Item
                            {...restField}
                            {...formItemLayout}
                            name={[name, "targetId"]}
                            rules={[
                                {
                                    required: true,
                                    message: "target不能为空",
                                },
                            ]}
                            noStyle
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                showSearch
                                optionFilterProp="label"
                            >
                                {targetOptions}
                            </Select>
                        </Form.Item>
                    </FormItemLayout>
                </Form.Item>
                <Form.Item
                    label={<FormItemLabel>context</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                    required
                >
                    <ListTypeFormItem
                        name={[name, "context"]}
                        minLength={1}
                        getValueFromEvent={(e) => e.target.value?.trim()}
                    />
                </Form.Item>
                <Form.Item
                    label={<FormItemLabel>cookieDomainRewrite</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                >
                    <ObjectTypeFormItem
                        name={[name, "cookieDomainRewrite"]}
                        getValueFromEvent={(e) => e.target.value?.trim()}
                    />
                </Form.Item>
                <Form.Item
                    label={<FormItemLabel>pathRewrite</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                >
                    <ObjectTypeFormItem
                        name={[name, "pathRewrite"]}
                        getValueFromEvent={(e) => e.target.value?.trim()}
                    />
                </Form.Item>
                <Form.Item
                    label={<FormItemLabel>headers</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                >
                    <ObjectTypeFormItem
                        name={[name, "headers"]}
                        getValueFromEvent={(e) => e.target.value?.trim()}
                    />
                </Form.Item>
            </>
        );
    };
    const initialValue = [
        {
            context: ["**"],
            cookieDomainRewrite: [
                {
                    key: "*",
                    value: "",
                },
            ],
            headers: [
                {
                    key: "Connection",
                    value: "keep-alive",
                },
            ],
            changeOrigin: true,
            enable: true,
        },
    ];
    return (
        <CardFormList
            name={name}
            itemRender={itemRender}
            getCardTitle={getTarget}
            minLength={1}
            initialValue={initialValue}
            addValue={initialValue[0]}
            ref={cardRef}
        />
    );
};

export default ProxyGroupFormItem;
