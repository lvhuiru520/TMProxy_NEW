import React, {
    forwardRef,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    FormInstance,
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
    getTarget: () => string;
    foldAllNum: number;
    specifiedFoldInfo: {
        type: "unfold" | "fold";
        index: number;
    } | null;
}) => {
    const {
        index,
        onMove,
        list,
        name,
        getTarget,
        foldAllNum,
        specifiedFoldInfo,
    } = props;

    const [fold, setFold] = useState(false);

    useEffect(() => {
        setFold(foldAllNum % 2 !== 0);
    }, [foldAllNum]);
    useEffect(() => {
        setFold(false);
    }, []);
    useEffect(() => {
        if (specifiedFoldInfo && index === specifiedFoldInfo.index) {
            switch (specifiedFoldInfo.type) {
                case "fold":
                    setFold(true);
                    break;
                case "unfold":
                    setFold(false);
                    break;
            }
        }
    }, [specifiedFoldInfo]);

    const renderArrow = () => {
        const upArrow = (
            <Button
                size="small"
                icon={<ArrowUpOutlined />}
                title="上移"
                onClick={() => {
                    onMove(index, index - 1);
                }}
            />
        );
        const downArrow = (
            <Button
                size="small"
                icon={<ArrowDownOutlined />}
                title="下移"
                onClick={() => {
                    onMove(index, index + 1);
                }}
            />
        );
        const moveToTop = (
            <Button
                size="small"
                onClick={() => {
                    onMove(index, 0);
                }}
            >
                移动至顶
            </Button>
        );
        const moveToBottom = (
            <Button
                size="small"
                onClick={() => {
                    onMove(index, list.length - 1);
                }}
            >
                移动至底
            </Button>
        );

        return (
            <>
                {index !== 0 && moveToTop}
                {index !== list.length - 1 && moveToBottom}
                {index !== 0 && upArrow}
                {index !== list.length - 1 && downArrow}
            </>
        );
    };
    const target = getTarget();
    return (
        <Card
            title={
                <div
                    onClick={() => {
                        setFold(!fold);
                    }}
                >
                    <Form.Item
                        noStyle
                        name={[name, "enable"]}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                            onClick={(_, e) => {
                                e.stopPropagation();
                            }}
                        />
                    </Form.Item>
                    <span style={{ marginLeft: 8 }}>
                        <Badge dot status="processing" />
                        <span title={target}>{target}</span>
                    </span>
                </div>
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
                        {fold ? "展开" : "折叠"}
                    </Button>
                </Space>
            }
            bodyStyle={{
                display: fold ? "none" : "unset",
            }}
        >
            {props.children}
        </Card>
    );
};

const ProxyGroupFormItem = (
    props: {
        name: string;
        targetOptions: JSX.Element[] | undefined;
        form: FormInstance;
    },
    ref
) => {
    const { name, targetOptions, form } = props;
    const [foldAllNum, setFoldAllNum] = useState(2); // 约定奇数折叠，偶数展开
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    const [specifiedFoldInfo, setSpecifiedFoldInfo] = useState<{
        type: "unfold" | "fold";
        index: number;
    } | null>(null);

    useImperativeHandle(ref, () => ({
        setSpecifiedFoldInfo,
    }));

    const onFoldAll = () => {
        // 折叠
        setFoldAllNum(
            (foldAllNum + 1) % 2 !== 0 ? foldAllNum + 1 : foldAllNum + 2
        );
    };
    const onUnFoldAll = () => {
        // 展开
        setFoldAllNum(
            (foldAllNum + 1) % 2 === 0 ? foldAllNum + 1 : foldAllNum + 2
        );
    };

    const getTarget = (name: number) => {
        const targetId = form?.getFieldValue([props.name, name, "targetId"]);
        if (targetId) {
            const result = targetOptions?.find((item) => item.key === targetId);
            if (result) {
                return result.props.label;
            }
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", right: 40, top: -40 }}>
                <Space>
                    <Button onClick={onUnFoldAll}>展开全部</Button>
                    <Button onClick={onFoldAll}>折叠全部</Button>
                </Space>
            </div>
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
                            {fields.map(
                                ({ key, name, ...restField }, index) => {
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
                                                    getTarget={() => {
                                                        return getTarget(name);
                                                    }}
                                                    foldAllNum={foldAllNum}
                                                    specifiedFoldInfo={
                                                        specifiedFoldInfo
                                                    }
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
                                                        <FormItemLayout
                                                            colSpan={24}
                                                        >
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
                                                                    checkedChildren="true"
                                                                    unCheckedChildren="false"
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
                                                        <FormItemLayout
                                                            colSpan={22}
                                                        >
                                                            <Form.Item
                                                                {...restField}
                                                                {...formItemLayout}
                                                                name={[
                                                                    name,
                                                                    "targetId",
                                                                ]}
                                                                rules={[
                                                                    {
                                                                        required:
                                                                            true,
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
                                                                    {
                                                                        targetOptions
                                                                    }
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
                                                            name={[
                                                                name,
                                                                "context",
                                                            ]}
                                                            minLength={1}
                                                            getValueFromEvent={(
                                                                e
                                                            ) =>
                                                                e.target.value?.trim()
                                                            }
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
                                                            getValueFromEvent={(
                                                                e
                                                            ) =>
                                                                e.target.value?.trim()
                                                            }
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
                                                            name={[
                                                                name,
                                                                "pathRewrite",
                                                            ]}
                                                            getValueFromEvent={(
                                                                e
                                                            ) =>
                                                                e.target.value?.trim()
                                                            }
                                                        />
                                                    </Form.Item>
                                                </CardWithFold>
                                                <Popconfirm
                                                    title="确定要删除吗？"
                                                    onConfirm={() =>
                                                        remove(name)
                                                    }
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
                                }
                            )}
                        </Row>
                        <FormItemLayout
                            rowGutter={gap}
                            colSpan={ColSpanList[0]}
                        >
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
        </div>
    );
};

export default forwardRef(ProxyGroupFormItem);
