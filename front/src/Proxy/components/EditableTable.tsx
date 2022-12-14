import React, { ReactElement, useEffect, useState } from "react";
import {
    Button,
    Divider,
    Input,
    message,
    Popconfirm,
    Space,
    Table,
    Typography,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import cloneDeep from "lodash.clonedeep";

import { uuid } from "../../../../utils/tools";

function EditableTable<
    T extends {
        id: string;
    }
>(props: {
    data: T[];
    editColTitle: string;
    editItemKey: "target" | "templateName";
    onUpdate: (dataSource: T[]) => void;
    onView?: (record: T) => void;
}) {
    const { data, editColTitle, editItemKey } = props;

    const [dataSource, setDataSource] = useState<T[]>([]);
    useEffect(() => {
        setDataSource(data);
    }, [data]);

    const [editRow, setEditRow] = useState<{
        id: string;
        isAdd?: boolean;
    } | void>();

    const isEditing = Boolean(editRow?.id);
    const onUpdate = (dataSource: T[]) => {
        props.onUpdate(dataSource);
    };
    const onMove = (record, index, type) => {
        const _dataSource = cloneDeep(dataSource);
        const temp = _dataSource[type === "up" ? index - 1 : index + 1];
        _dataSource[type === "up" ? index - 1 : index + 1] = record;
        _dataSource[index] = temp;
        onUpdate(_dataSource);
    };

    const onEdit = (record: T) => {
        setEditRow({
            id: record.id,
            [editItemKey]: record[editItemKey],
        });
    };

    const onDelete = (record: T) => {
        const _dataSource = cloneDeep(dataSource);
        const filterData = _dataSource.filter((item) => item.id !== record.id);
        onUpdate(filterData);
        message.success("操作成功");
    };
    const onSave = (record: T) => {
        if (editRow?.[editItemKey]?.trim()) {
            const _dataSource = cloneDeep(dataSource);
            const result = _dataSource.find((item) => item.id === record.id);
            if (result) {
                result[editItemKey] = editRow?.[editItemKey];
            }
            onUpdate(_dataSource);
            setEditRow();
            message.success("操作成功");
        } else {
            message.error("target不能为空");
        }
    };
    const onCancel = (record: T) => {
        if (record.id === editRow?.id && editRow.isAdd) {
            const _dataSource = cloneDeep(dataSource);
            const filterData = _dataSource.filter(
                (item) => item.id !== record.id
            );
            onUpdate(filterData);
        } else {
            onUpdate(dataSource);
        }
        setEditRow(undefined);
    };

    const onAdd = () => {
        const _dataSource = cloneDeep(dataSource);
        const id = uuid(8);
        const options = {
            id,
        };
        _dataSource.unshift(options as T);
        setEditRow({
            isAdd: true,
            ...options,
        });
        setDataSource(_dataSource);
    };

    const onClickDetail = (record: T) => {
        props?.onView?.(record);
    };

    const columns: ColumnsType<T> = [
        {
            title: "排序",
            key: "sort",
            dataIndex: "sort",
            align: "center",
            width: 100,
            render: (_, record, index) => {
                const upArrow = (
                    <Button
                        size="small"
                        icon={<ArrowUpOutlined />}
                        onClick={() => {
                            onMove(record, index, "up");
                        }}
                        disabled={isEditing}
                    />
                );
                const downArrow = (
                    <Button
                        size="small"
                        icon={<ArrowDownOutlined />}
                        onClick={() => {
                            onMove(record, index, "down");
                        }}
                        disabled={isEditing}
                    />
                );
                return (
                    <Space>
                        {index !== 0 && upArrow}
                        {index !== dataSource.length - 1 && downArrow}
                    </Space>
                );
            },
        },
        {
            title: editColTitle,
            key: editItemKey,
            dataIndex: editItemKey,
            render: (text, record) => {
                if (record.id === editRow?.id) {
                    return (
                        <Input
                            defaultValue={text}
                            allowClear
                            placeholder="请输入"
                            onChange={(e) => {
                                setEditRow({
                                    ...editRow,
                                    [editItemKey]: e.target.value?.trim(),
                                });
                            }}
                            autoFocus
                            status={
                                editRow[editItemKey]?.length === 0
                                    ? "error"
                                    : ""
                            }
                        />
                    );
                }
                return (
                    <Typography.Link
                        copyable={{
                            tooltips: ["复制", "复制成功"],
                        }}
                    >
                        {text}
                    </Typography.Link>
                );
            },
        },
        {
            title: "操作",
            key: "actions",
            dataIndex: "actions",
            width: editItemKey === "templateName" ? 250 : 180,
            fixed: "right",
            render: (text, record) => {
                const buttons: ReactElement[] = [];
                const editBtn = (
                    <Button
                        disabled={Boolean(
                            editRow?.id && editRow.id !== record.id
                        )}
                        onClick={() => {
                            onEdit(record);
                        }}
                    >
                        编辑
                    </Button>
                );
                const deleteBtn = (
                    <Popconfirm
                        placement="top"
                        title={"确定要删除这条数据吗？"}
                        onConfirm={() => {
                            onDelete(record);
                        }}
                        okText="是"
                        cancelText="否"
                        disabled={isEditing}
                    >
                        <Button danger type="primary" disabled={isEditing}>
                            删除
                        </Button>
                    </Popconfirm>
                );
                const detailBtn = (
                    <Button
                        type="primary"
                        onClick={() => {
                            onClickDetail(record);
                        }}
                    >
                        详情
                    </Button>
                );
                const saveBtn = (
                    <Button
                        type="primary"
                        onClick={() => {
                            onSave(record);
                        }}
                    >
                        保存
                    </Button>
                );
                const cancelBtn = (
                    <Button
                        onClick={() => {
                            onCancel(record);
                        }}
                    >
                        取消
                    </Button>
                );
                if (editRow?.id === record.id) {
                    buttons.push(saveBtn);
                    buttons.push(cancelBtn);
                } else {
                    buttons.push(editBtn);
                    if (editItemKey === "templateName" && record.id) {
                        buttons.push(detailBtn);
                    }
                    buttons.push(deleteBtn);
                }

                return buttons.map((item, index) => {
                    return (
                        <span key={index}>
                            {item}
                            {index !== buttons.length - 1 && (
                                <Divider type="vertical" />
                            )}
                        </span>
                    );
                });
            },
        },
    ];

    return (
        <>
            <div style={{ paddingBottom: 8 }}>
                <Button type="primary" onClick={onAdd} disabled={isEditing}>
                    新增
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{
                    y: "calc(100vh - 180px)",
                }}
            />
        </>
    );
}

export default EditableTable;
