import React from "react";
import ReactDOM from "react-dom/client";

import "reset-css";
import "antd/dist/antd.css";
import "./styles/index.less";

import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(<App />);
