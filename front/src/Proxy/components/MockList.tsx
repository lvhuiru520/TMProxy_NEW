import React from "react";
import { Button, Form, FormInstance, Input, message, Select } from "antd";

import FormItemLabel from "./FormItemLabel";
import CardFormList from "./CardFormList";

const MockList = (props: {
    name: string;
    form: FormInstance;
    cardRef?: React.Ref<unknown>;
}) => {
    const { name, form, cardRef } = props;
    const methodList = ["get", "post", "put", "delete"];
    const itemRender = (name, restField, formItemLayout) => {
        return (
            <>
                <Form.Item
                    label={<FormItemLabel>method</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                    name={[name, "method"]}
                    wrapperCol={{ span: 18 }}
                    rules={[{ required: true, message: "必选项" }]}
                >
                    <Select allowClear placeholder="请选择">
                        {methodList.map((item) => (
                            <Select.Option key={item} value={item}>
                                {item.toUpperCase()}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label={<FormItemLabel>path</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                    name={[name, "path"]}
                    wrapperCol={{ span: 18 }}
                    rules={[{ required: true, message: "必填项" }]}
                >
                    <Input allowClear placeholder="请输入" />
                </Form.Item>
                <Form.Item
                    label={<FormItemLabel>data</FormItemLabel>}
                    {...restField}
                    {...formItemLayout}
                    name={[name, "data"]}
                    wrapperCol={{ span: 18 }}
                    rules={[
                        { required: true, message: "必填项", whitespace: true },
                        {
                            validator: async (rule, value) => {
                                if (value) {
                                    JSON.parse(value);
                                }
                            },
                        },
                    ]}
                >
                    <Input.TextArea allowClear placeholder="请输入" />
                </Form.Item>
            </>
        );
    };
    return (
        <CardFormList
            itemRender={itemRender}
            name={name}
            getCardTitle={(_name) => {
                const path = form?.getFieldValue([name, _name, "path"]);
                return path;
            }}
            ref={cardRef}
            addValue={{ enable: true, method: "get" }}
            extraElement={(_name) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                const data = form.getFieldValue([
                                    name,
                                    _name,
                                    "data",
                                ]);
                                if (data) {
                                    try {
                                        const _data = JSON.parse(data);
                                        if (
                                            _data &&
                                            typeof _data === "object"
                                        ) {
                                            form.setFieldValue(
                                                [name, _name, "data"],
                                                JSON.stringify(_data, null, 4)
                                            );
                                        }
                                    } catch (error) {
                                        message.error(error.message);
                                    }
                                }
                            }}
                        >
                            格式化
                        </Button>
                    </>
                );
            }}
        />
    );
};

export default MockList;
