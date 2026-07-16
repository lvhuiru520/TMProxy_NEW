# TMProxy

> 🚀 A cross-platform proxy management tool built with Electron + React for frontend and backend local development.

TMProxy 是一个基于 Electron 构建的跨平台代理管理工具，旨在简化前后端联调过程中复杂的代理配置、Mock 数据切换以及多环境管理，提高团队研发效率。

该项目最初来源于团队内部研发工具，在日常开发中用于统一管理本地代理规则，减少开发环境切换成本。

---

## ✨ Features

- 🌍 多环境代理管理（Dev / Test / UAT / Prod）
- 🔄 一键切换代理配置
- 🎯 Mock 数据管理
- ⚙️ 自定义代理规则
- 💻 Windows / macOS 跨平台支持
- 🚀 本地开发快速启动
- 📦 Electron 桌面应用

---

## Screenshot

> （建议放几张截图）

- 首页
- Proxy 管理
- Mock 管理
- 环境配置

---

## Tech Stack

- Electron
- React
- TypeScript
- Ant Design
- Axios
- Node.js

---

## Why TMProxy

在传统开发过程中，经常需要：

- 修改 webpack / vite proxy
- 修改 hosts
- 手动切换环境
- Mock 与真实接口频繁切换

对于一个拥有多个后端服务的项目来说，这些重复工作会浪费大量开发时间。

TMProxy 将这些能力统一到桌面应用中，使开发人员可以通过可视化界面完成代理管理，而无需频繁修改项目配置。

---

## Architecture

```
                ┌───────────────────────┐
                │      Electron App     │
                └──────────┬────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     Proxy Manager     Mock Manager    Environment
          │                │            Configuration
          └────────────────┼────────────────┘
                           │
                   Local HTTP Proxy
                           │
              ┌────────────┴────────────┐
              │                         │
        Backend Service A         Backend Service B
```

---

## Project Structure

```
src
├── components
├── pages
├── hooks
├── services
├── utils
├── store
├── router
└── assets
```

---

## Getting Started

```bash
git clone https://github.com/lvhuiru520/TMProxy_NEW.git

cd TMProxy_NEW

npm install

npm run dev
```

---

## Build

```bash
npm run build
```

Electron Package

```bash
npm run electron:build
```

---

## Core Functions

### Proxy Management

支持多个代理规则管理。

例如：

```
/api
    ↓
http://localhost:8080
```

可以快速切换：

```
localhost

↓

dev

↓

test

↓

uat
```

无需修改项目配置。

---

### Mock Management

支持 Mock 数据管理。

开发过程中可以快速切换：

- Mock
- Real API

方便联调。

---

### Environment Management

支持多环境配置：

- Development
- Testing
- UAT
- Production

开发人员无需重复修改环境变量。

---

## Future Plan

计划继续完善：

- 支持 HTTPS Proxy
- 支持 WebSocket Proxy
- 请求历史记录
- 接口抓包
- 插件化扩展
- 自动同步代理配置

---

## Motivation

这个项目来源于团队内部研发实践。

希望通过桌面工具统一代理管理方式，降低多人协作下的环境维护成本，提高前后端联调效率。

---

## License

MIT
