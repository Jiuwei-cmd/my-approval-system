# 审批系统项目介绍

## 1. 项目概述

本项目是一个基于前后端分离架构的企业审批管理系统，旨在为企业提供高效、规范的审批流程管理解决方案。系统支持审批项目的创建、查询、审批、撤回等全流程管理，并提供文件上传功能，满足企业日常办公中的各种审批需求。

在线链接地址：[http://47.109.150.26/](http://47.109.150.26/)

接口地址：[Apifox](https://app.apifox.com/project/7498365)

## 2. 技术栈

### 2.1 前端技术栈

- **React 18**：用于构建用户界面的JavaScript库
- **TypeScript**：提供类型安全的JavaScript超集
- **Vite**：现代化的前端构建工具，提供极速的开发体验
- **Ant Design**：企业级UI组件库
- **Redux Toolkit**：状态管理工具
- **React Router**：路由管理

### 2.2 后端技术栈

- **Node.js**：JavaScript运行时环境
- **Express**：Web应用框架
- **MySQL**：关系型数据库
- **Multer**：文件上传中间件
- **腾讯云COS SDK**：云存储服务SDK

## 3. 项目结构

```
my-approval-system-server-file/
├── approval_project.sql        # 数据库初始化脚本
├── client/                     # 前端项目目录
│   ├── src/
│   │   ├── components/         # 通用组件
│   │   ├── constants/          # 常量定义
│   │   ├── pages/              # 页面组件
│   │   │   ├── Approval/       # 审批管理页面
│   │   │   ├── Apply/          # 申请页面
│   │   ├── router/             # 路由配置
│   │   ├── services/           # API服务
│   │   ├── store/              # Redux状态管理
│   │   └── utils/              # 工具函数
├── server/                     # 后端项目目录
│   ├── dataBase/               # 数据库操作
│   ├── routes/                 # API路由
│   ├── uploads/                # 文件上传临时目录
```

## 4. 核心功能模块

### 4.1 审批项目管理

- **新建审批**：申请人填写审批项目信息，上传相关文件
- **审批列表**：支持按状态、部门、时间等条件筛选查询
- **审批详情**：查看审批项目的详细信息和附件
- **审批处理**：审批员可以审批通过或拒绝
- **撤回申请**：申请人在审批完成前可以撤回申请

### 4.2 文件上传功能

- **图片上传**：支持JPG、PNG、GIF等格式，最大8MB
- **Excel上传**：支持.xlsx和.xls格式的表格文件
- **云存储**：文件存储在腾讯云COS，保证数据安全

### 4.3 权限管理

- **申请人角色**：可以创建、查看、撤回自己的审批项目
- **审批员角色**：可以查看待审批项目，进行审批操作

## 5. 数据库设计

### 5.1 审批项目表 (project)

| 字段名                | 类型           | 描述                                       |
| ------------------ | ------------ | ---------------------------------------- |
| key                | int          | 主键ID                                     |
| status             | varchar(20)  | 审批状态：pending/approved/rejected/withdrawn |
| createTime         | datetime     | 创建时间                                     |
| approvalTime       | datetime     | 审批完成时间                                   |
| approvalItem       | varchar(255) | 审批事项名称                                   |
| approvalDepartment | varchar(100) | 申请部门                                     |
| approvalContent    | text         | 审批内容详情                                   |
| executionTime      | date         | 计划执行日期                                   |

### 5.2 项目图片附件表 (project_files)

| 字段名         | 类型           | 描述        |
| ----------- | ------------ | --------- |
| id          | int          | 主键ID      |
| project_id  | int          | 关联的审批项目ID |
| uid         | varchar(100) | 文件唯一标识    |
| name        | varchar(255) | 文件名       |
| status      | varchar(50)  | 文件状态      |
| url         | text         | 文件URL     |
| create_time | datetime     | 创建时间      |
| is_deleted  | varchar(255) | 是否删除      |

### 5.3 项目Excel附件表 (project_excelfile)

| 字段名         | 类型           | 描述        |
| ----------- | ------------ | --------- |
| id          | int          | 主键ID      |
| project_id  | int          | 关联的审批项目ID |
| uid         | varchar(255) | 文件唯一标识    |
| name        | varchar(255) | 文件名       |
| status      | varchar(50)  | 文件状态      |
| url         | text         | 文件URL     |
| create_time | datetime     | 创建时间      |
| is_deleted  | varchar(255) | 是否删除      |

## 6. API接口说明

### 6.1 审批管理接口

- **GET /api/get**：获取审批列表，支持分页和筛选
- **GET /api/getDetail**：获取审批项目详情
- **PUT /api/update**：更新审批项目
- **POST /api/create**：新建审批项目
- **PUT /api/withdraw**：撤回审批项目
- **POST /api/handle**：处理审批项目（通过/拒绝）

### 6.2 文件上传接口

- **POST /api/upload**：上传文件到腾讯云COS

## 7. 系统特点

1. **前后端分离**：采用现代化的前后端分离架构，提高开发效率
2. **类型安全**：前端使用TypeScript确保严格的参数校验
3. **权限控制**：基于角色的权限管理，确保数据安全
4. **高性能**：使用Vite构建工具和高效的数据库查询优化
5. **可扩展性**：模块化设计，便于功能扩展和维护

## 8. 部署说明

### 8.1 数据库部署

1. 创建MySQL数据库
2. 执行`approval_project.sql`初始化数据库表结构和数据

### 8.2 后端部署

1. 进入`server`目录
2. 执行`npm install`安装依赖
3. 配置`.env`文件，设置数据库连接信息和腾讯云COS密钥
4. 执行`npm start`启动服务

### 8.3 前端部署

1. 进入`client`目录
2. 执行`npm install`安装依赖
3. 执行`npm run build`构建生产版本
4. 将`dist`目录部署到Web服务器

## 9. 开发指南

### 9.1 前端开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 9.2 后端开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
