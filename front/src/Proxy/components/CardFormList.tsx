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
    FormListFieldData,
    Popconfirm,
    Row,
    Space,
    Switch,
} from "antd";

import {
    MinusCircleOutlined,
    PlusOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";
import FormItemLayout from "./FormItemLayout";

const gap = 8;
const ColSpanList = [23, 1];

const CardWithFold = (props: {
    children: ReactNode;
    index: number;
    list: FormListFieldData[];
    name: number;
    onMove: (from: number, to: number) => void;
    cardTitle: string;
    foldAllNum: number;
    specifiedFoldInfo: {
        type: "unfold" | "fold";
        index: number;
    } | null;
    extraElement?: (name: number) => React.ReactNode;
}) => {
    const {
        index,
        onMove,
        list,
        name,
        cardTitle,
        foldAllNum,
        specifiedFoldInfo,
        extraElement,
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
    return (
        <Card
            headStyle={{ background: "#e9e9e9" }}
            hoverable
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
                        <span title={cardTitle}>{cardTitle}</span>
                    </span>
                </div>
            }
            extra={
                <Space>
                    {extraElement?.(name)}
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

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const CardFormList = (
    props: {
        name: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialValue?: any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addValue?: any;
        itemRender: (
            name: number,
            restField: {
                fieldKey?: number | undefined;
            },
            formItemLayout: {
                labelCol: {
                    span: number;
                };
                wrapperCol: {
                    span: number;
                };
            }
        ) => JSX.Element;
        getCardTitle: (name: number) => string;
        minLength?: number;
        extraElement?: (name: number) => React.ReactNode;
    },
    ref
) => {
    const {
        name,
        initialValue,
        itemRender,
        getCardTitle,
        minLength = 0,
        extraElement,
        addValue,
    } = props;
    const [foldAllNum, setFoldAllNum] = useState(2); // 约定奇数折叠，偶数展开

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
                            if (names?.length < minLength) {
                                return Promise.reject(
                                    new Error(`至少有${minLength}组`)
                                );
                            }
                        },
                    },
                ]}
                initialValue={initialValue}
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
                                                    cardTitle={getCardTitle(
                                                        name
                                                    )}
                                                    foldAllNum={foldAllNum}
                                                    specifiedFoldInfo={
                                                        specifiedFoldInfo
                                                    }
                                                    extraElement={extraElement}
                                                >
                                                    {itemRender(
                                                        name,
                                                        restField,
                                                        formItemLayout
                                                    )}
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
                                onClick={() => add(addValue)}
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

export default forwardRef(CardFormList);
