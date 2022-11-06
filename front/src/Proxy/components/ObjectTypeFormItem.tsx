import React from "react";
import { Button, Form, Input, Popconfirm } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import FormItemLayout from "./FormItemLayout";

const gap = 8;
const ColSpanList = [11, 11, 2];
const ObjectTypeFormItem = (props: {
    name: string | [number, string];
    minLength?: number;
    valueRequired?: boolean;
}) => {
    const { name, minLength = 0, valueRequired = false } = props;
    return (
        <Form.List
            name={name}
            rules={[
                {
                    validator: async (_, names) => {
                        if (names?.length < minLength) {
                            return Promise.reject(
                                new Error(`至少要有${minLength}项`)
                            );
                        }
                    },
                },
            ]}
        >
            {(fields, { add, remove }, { errors }) => (
                <>
                    <FormItemLayout rowGutter={[gap, gap]} colSpan={24}>
                        {fields.map(({ key, name, ...restField }) => (
                            <FormItemLayout
                                rowGutter={gap}
                                colSpan={ColSpanList}
                                key={key}
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, "key"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "必填项",
                                        },
                                    ]}
                                >
                                    <Input placeholder="请输入" allowClear />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, "value"]}
                                    rules={[
                                        {
                                            required: valueRequired,
                                            message: "必填项",
                                        },
                                    ]}
                                >
                                    <Input placeholder="请输入" allowClear />
                                </Form.Item>
                                <Popconfirm
                                    title="确定要删除吗？"
                                    onConfirm={() => remove(name)}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <MinusCircleOutlined
                                        style={{
                                            fontSize: 16,
                                            paddingTop: gap,
                                            color: "red",
                                        }}
                                    />
                                </Popconfirm>
                            </FormItemLayout>
                        ))}
                    </FormItemLayout>

                    <FormItemLayout
                        rowGutter={gap}
                        colSpan={ColSpanList[0] + ColSpanList[1]}
                    >
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                        >
                            新增
                        </Button>
                    </FormItemLayout>
                    <Form.ErrorList errors={errors} />
                </>
            )}
        </Form.List>
    );
};

export default ObjectTypeFormItem;
