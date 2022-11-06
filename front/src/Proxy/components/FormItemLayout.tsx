import { Col, Row } from "antd";
import React from "react";

const FormItemLayout = (props: {
    rowGutter?: number | [number, number];
    colSpan: number[] | number;
    children: React.ReactNode[] | React.ReactNode;
    key?: number;
    style?: React.CSSProperties;
}) => {
    const { rowGutter, children, colSpan, key, style } = props;

    return (
        <Row gutter={rowGutter} key={key} style={style}>
            {React.Children.map(children, (item, index) => {
                return (
                    <Col
                        key={index}
                        span={
                            typeof colSpan === "number"
                                ? colSpan
                                : colSpan[index]
                        }
                    >
                        {item}
                    </Col>
                );
            })}
        </Row>
    );
};

export default FormItemLayout;
