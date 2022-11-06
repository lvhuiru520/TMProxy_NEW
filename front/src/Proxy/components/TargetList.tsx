import React, { useEffect, useState } from "react";

import { getConfigServer } from "../../services/index";
import { IProxyTargetList } from "../../../../utils/interfaces/config.type";
import EditableTable from "./EditableTable";
import { modifyProxy } from "../../services/proxy";

const TargetList = () => {
    const [dataSource, setDataSource] = useState<IProxyTargetList>([]);

    useEffect(() => {
        getConfig();
    }, []);

    const getConfig = () => {
        getConfigServer().then((res) => {
            setDataSource(res.proxy.targetList || []);
        });
    };

    const onChange = (targetList: IProxyTargetList) => {
        setDataSource(targetList);
        modifyProxy({
            key: "targetList",
            data: targetList,
        }).then((res) => {
            if (res.success) {
                getConfig(); // refresh
            }
        });
    };
    return (
        <>
            <EditableTable
                data={dataSource}
                editColTitle="target"
                editItemKey="target"
                onUpdate={(_dataSource) => {
                    onChange(_dataSource);
                }}
            />
        </>
    );
};

export default TargetList;
