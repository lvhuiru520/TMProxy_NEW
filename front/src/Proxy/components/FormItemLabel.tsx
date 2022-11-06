import React from "react";

export default function FormItemLabel(props: { children: React.ReactNode }) {
    return (
        <div
            style={{
                flex: 1,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
            }}
            title={props.children}
        >
            {props.children}
        </div>
    );
}
