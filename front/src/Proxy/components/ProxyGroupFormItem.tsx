import React, { ReactNode, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    FormListFieldData,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
} from "antd";
import {
    MinusCircleOutlined,
    PlusOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";
import ObjectTypeFormItem from "./ObjectTypeFormItem";
import FormItemLabel from "./FormItemLabel";
import ListTypeFormItem from "./ListTypeFormItem";
import FormItemLayout from "./FormItemLayout";

const gap = 8;
const ColSpanList = [23, 1];

const CardWithFold = (props: {
    children: ReactNode;
    index: number;
    list: FormListFieldData[];
    name: number;
    onMove: (from: number, to: number) => void;
}) => {
    const { index, onMove, list, name } = props;
    const [fold, setFold] = useState(true);

    const renderArrow = () => {
        const upArrow = (
            <Button
                size="small"
                icon={<ArrowUpOutlined />}
                onClick={() => {
                    onMove(index, index - 1);
                }}
            />
        );
        const downArrow = (
            <Button
                size="small"
                icon={<ArrowDownOutlined />}
                onClick={() => {
                    onMove(index, index + 1);
                }}
            />
        );

        return (
            <>
                {index !== 0 && upArrow}
                {index !== list.length - 1 && downArrow}
            </>
        );
    };

    return (
        <Card
            title={
                <Space>
                    <Badge dot status="processing" />
                    <Form.Item
                        noStyle
                        name={[name, "enable"]}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                        />
                    </Form.Item>
                </Space>
            }
            extra={
                <Space>
                    {renderArrow()}
                    <Button
                        size="small"
                        onClick={() => {
                            setFold(!fold);
                        }}
                    >
                        {fold ? "隐藏" : "展开"}
                    </Button>
                </Space>
            }
            bodyStyle={{
                display: fold ? "unset" : "none",
            }}
        >
            {props.children}
        </Card>
    );
};

const ProxyGroupFormItem = (props: {
    name: string;
    targetOptions: JSX.Element[] | undefined;
}) => {
    const { name, targetOptions } = props;
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    return (
        <Form.List
            name={name}
            rules={[
                {
                    validator: async (_, names) => {
                        if (!names || names.length < 1) {
                            return Promise.reject(new Error(`至少有1组`));
                        }
                    },
                },
            ]}
            initialValue={[
                {
                    context: ["**"],
                    cookieDomainRewrite: [
                        {
                            key: "*",
                            value: "",
                        },
                    ],
                    changeOrigin: true,
                    enable: true,
                },
            ]}
        >
            {(fields, { add, remove, move }, { errors }) => (
                <>
                    <Row
                        gutter={[gap, gap]}
                        style={{ paddingBottom: fields?.length ? gap : 0 }}
                    >
                        {fields.map(({ key, name, ...restField }, index) => {
                            return (
                                <Col key={key} span={24}>
                                    <FormItemLayout
                                        rowGutter={gap}
                                        colSpan={ColSpanList}
                                    >
                                        <CardWithFold
                                            index={index}
                                            list={fields}
                                            onMove={move}
                                            name={name}
                                        >
                                            <Form.Item
                                                label={
                                                    <FormItemLabel>
                                                        changeOrigin
                                                    </FormItemLabel>
                                                }
                                                {...restField}
                                                {...formItemLayout}
                                            >
                                                <FormItemLayout colSpan={24}>
                                                    <Form.Item
                                                        name={[
                                                            name,
                                                            "changeOrigin",
                                                        ]}
                                                        valuePropName="checked"
                                                        {...restField}
                                                        {...formItemLayout}
                                                        noStyle
                                                    >
                                                        <Switch
                                                            checkedChildren="开启"
                                                            unCheckedChildren="关闭"
                                                        />
                                                    </Form.Item>
                                                </FormItemLayout>
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    <FormItemLabel>
                                                        target
                                                    </FormItemLabel>
                                                }
                                                {...restField}
                                                {...formItemLayout}
                                                required
                                            >
                                                <FormItemLayout colSpan={22}>
                                                    <Form.Item
                                                        {...restField}
                                                        {...formItemLayout}
                                                        name={[
                                                            name,
                                                            "targetId",
                                                        ]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    "target不能为空",
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
                                                label={
                                                    <FormItemLabel>
                                                        context
                                                    </FormItemLabel>
                                                }
                                                {...restField}
                                                {...formItemLayout}
                                            >
                                                <ListTypeFormItem
                                                    name={[name, "context"]}
                                                    minLength={1}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <FormItemLabel>
                                                        cookieDomainRewrite
                                                    </FormItemLabel>
                                                }
                                                {...restField}
                                                {...formItemLayout}
                                            >
                                                <ObjectTypeFormItem
                                                    name={[
                                                        name,
                                                        "cookieDomainRewrite",
                                                    ]}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <FormItemLabel>
                                                        pathRewrite
                                                    </FormItemLabel>
                                                }
                                                {...restField}
                                                {...formItemLayout}
                                            >
                                                <ObjectTypeFormItem
                                                    name={[name, "pathRewrite"]}
                                                />
                                            </Form.Item>
                                        </CardWithFold>
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
                                </Col>
                            );
                        })}
                    </Row>
                    <FormItemLayout rowGutter={gap} colSpan={ColSpanList[0]}>
                        <Button
                            type="dashed"
                            onClick={() =>
                                add({
                                    context: ["**"],
                                    cookieDomainRewrite: [
                                        {
                                            key: "*",
                                            value: "",
                                        },
                                    ],
                                    changeOrigin: true,
                                    enable: true,
                                })
                            }
                            block
                            icon={<PlusOutlined />}
                        >
                            新增一组
                        </Button>
                        <Form.ErrorList errors={errors} />
                    </FormItemLayout>
                </>
            )}
        </Form.List>
    );
};

export default ProxyGroupFormItem;
