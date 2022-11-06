import { Modal, Select } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";

import {
    IProxyTemplateList,
    IProxyDetail,
} from "../../../../utils/interfaces/config.type";

const ReferTemplate = (
    props: {
        templateList: IProxyTemplateList;
        onOk: (detail: IProxyDetail) => void;
    },
    ref
) => {
    const { templateList, onOk } = props;
    const [visible, setVisible] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<IProxyDetail>(
        {} as IProxyDetail
    );
    useImperativeHandle(ref, () => ({ setVisible }));

    return (
        <Modal
            open={visible}
            title="引用模板"
            onCancel={() => {
                setVisible(false);
            }}
            width={300}
            onOk={() => {
                onOk(selectedDetail || {});
                setVisible(false);
            }}
            destroyOnClose
            centered
            okText="确定"
            cancelText="取消"
        >
            <Select
                style={{ width: 260 }}
                allowClear
                showSearch
                optionFilterProp="name"
                onChange={(value) => {
                    const result = templateList.find(
                        (item) => item.id === value
                    );
                    if (result) {
                        setSelectedDetail(result.detail);
                    }
                }}
                placeholder="请选择模板"
            >
                {templateList?.map((item) => (
                    <Select.Option
                        key={item.id}
                        value={item.id}
                        name={item.templateName}
                    >
                        {item.templateName}
                    </Select.Option>
                ))}
            </Select>
        </Modal>
    );
};

export default forwardRef(ReferTemplate);
