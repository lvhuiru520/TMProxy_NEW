import React, { useEffect, useState } from "react";
import { Modal, Col, Row, Button, Progress, notification } from "antd";

import {
    checkForUpdateServer,
    downloadUpdateServer,
    getCurrentVersionServer,
    quitAndInstallServer,
} from "./services";
import {
    onCheckingForUpdateEventHandler,
    onDownloadProgressEventHandler,
    onShowAboutEventHandler,
    onUpdateAvailableEventHandler,
    onUpdateDownloadedEventHandler,
    onUpdateErrorEventHandler,
    onUpdateNotAvailableEventHandler,
} from "./events/about";

import { EUpdateStatus } from "../../utils/enums";

const About = () => {
    const [visible, setVisible] = useState(false);
    const [progressPercent, setProgressPercent] = useState<number>();
    const [currentVersion, setCurrentVersion] = useState("");

    const [updateInfo, setUpdateInfo] = useState<{
        status: EUpdateStatus;
        newVersion?: string;
    }>({
        status: EUpdateStatus.ready,
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        checkForUpdateServer().finally(() => {
            getCurrentVersionServer().then((version) => {
                console.log(version, "version");
                setCurrentVersion(version);
            });
        });
        onDownloadProgressEventHandler((progress) => {
            setProgressPercent(Math.ceil(progress));
        });
        onUpdateDownloadedEventHandler(() => {
            Modal.confirm({
                title: "下载完成，是否立即退出并安装？",
                okText: "是",
                cancelText: "否",
                onOk() {
                    quitAndInstallServer();
                },
                centered: true,
            });
        });
        onUpdateErrorEventHandler((description) => {
            notification.error({
                message: "软件检查更新报错",
                description,
            });
            setLoading(false);
        });
    }, []);
    useEffect(() => {
        onShowAboutEventHandler(() => {
            setVisible(true);
        });
        onUpdateAvailableEventHandler((newVersion) => {
            setUpdateInfo({
                newVersion,
                status: EUpdateStatus["update-available"],
            });
            setVisible(true);
        });
        onUpdateNotAvailableEventHandler(() => {
            setUpdateInfo({
                status: EUpdateStatus["update-not-available"],
            });
        });
        onCheckingForUpdateEventHandler(() => {
            setUpdateInfo({
                status: EUpdateStatus["checking-for-update"],
            });
        });
    }, []);
    return (
        <Modal
            open={visible}
            title="关于TMProxy"
            width={300}
            footer={false}
            centered
            onCancel={() => {
                setVisible(false);
            }}
        >
            <Row
                justify="center"
                align="middle"
                gutter={[10, 10]}
                style={{ flexDirection: "column" }}
            >
                <Col>当前版本:{currentVersion}</Col>
                {(updateInfo.status === EUpdateStatus["ready"] ||
                    updateInfo.status ===
                        EUpdateStatus["checking-for-update"]) && (
                    <Col>
                        <Button
                            type="primary"
                            onClick={() => {
                                checkForUpdateServer();
                                setLoading(true);
                            }}
                            loading={loading}
                        >
                            版本检测
                        </Button>
                    </Col>
                )}
                {updateInfo.status ===
                    EUpdateStatus["update-not-available"] && (
                    <Col>
                        <Button disabled={true}>已是最新版本</Button>
                    </Col>
                )}
                {updateInfo.status === EUpdateStatus["update-available"] && (
                    <>
                        <Col>
                            <span style={{ color: "red", marginRight: 8 }}>
                                发现新版本:{updateInfo?.newVersion}
                            </span>
                            <Button
                                type="primary"
                                onClick={() => {
                                    downloadUpdateServer();
                                }}
                            >
                                点击下载
                            </Button>
                        </Col>
                        {progressPercent && (
                            <Col>
                                <div style={{ width: 200 }}>
                                    <Progress percent={progressPercent} />
                                </div>
                            </Col>
                        )}
                    </>
                )}
                <Col>
                    <span>BUG/信息反馈:吕慧茹</span>
                </Col>
            </Row>
        </Modal>
    );
};

export default About;
