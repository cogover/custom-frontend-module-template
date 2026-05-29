# CLAUDE.md

File này cung cấp hướng dẫn cho Claude Code khi làm việc với repository `web-app-template`.

## Project Overview

`web-app-template` là **skeleton/template** để tạo remote app mới trong hệ Module Federation Cogover. Federation đang đặt `name: 'subscription'` (sai — cần đổi khi clone). `remotes` và `exposes` đều rỗng.

## Federation Architecture Overview

Tài liệu hệ thống Module Federation của hệ sinh thái Cogover — đồng bộ trong tất cả các dự án.

### 1. Stack chung
Tất cả dự án dùng **Vite 5** + **React 18** + **`@originjs/vite-plugin-federation`**. File cấu hình federation đặt tại `src/federation/federation.config.tsx` (host `router` dùng `.ts`) và được nạp vào `vite.config.ts` qua hàm factory nhận các `*Origin` từ biến môi trường (`VITE_REMOTE_*_ORIGIN`).

### 2. Bản đồ các app

| Dự án | Federation `name` | Vai trò | Remote tiêu thụ | Module export chính |
|---|---|---|---|---|
| **router** | `workspace` (host) | Host app, chỉ tiêu thụ — không expose | workspace, workspace2, end-user, subscription, sla, report-builder, chat, call-center, admin-tool | – |
| **workspace** | `workspace` | CRM core | end-user, report-builder, workspace2 | ~80 trang Object/DataField/Layout/Filter/Personnel/Role/Agent/Skill/Tool/AppManagement/Settings/DataLibrary… |
| **process** | `w2` | Workflow BPMN editor | app, workspace, end-user, subscription | WorkflowList/Create/Update/Preview, BPMNModal |
| **end-user** | `end_user` | CRM cho end user | workspace, workspace2 | Record CRUD, WorkflowStep/Running/Approve/Form |
| **subscription** | `subscription` | Billing & upgrade | – | Billing, Upgrade, Subscription, ServicePricing, providers |
| **sla** | `subscription` *(name lệch)* | SLA / Transition / Assignment | workspace | TransitionPage, DuplicateRules, AssignmentRule, SLA, WorkSchedule |
| **report-builder** | `subscription` *(name lệch)* | Reports & Dashboards | workspace | Report, Dashboard, ReportType, Snapshot, GoalMetric, AcdPerformance |
| **chat-end-user** | `chat-end-user` | Chat / multichannel / WhatsApp | – | AgentChat, MultiChannel, Routing, IntegrationHub |
| **call-center** | `call_center` | Placeholder (chưa expose module) | – | – |
| **account** | `account` | App account | subscription | TopToolbar, LeftToolbar |
| **web-app-template** | `subscription` | Skeleton template | – | – |

### 3. URL contract (proxy của host `router`)
Dev server `router` proxy mỗi remote về cùng `VITE_FEDERATION_APP_ORIGIN` qua các path namespace, mỗi remote dùng `/<namespace>/assets/remoteEntry.js`:

| Path | Remote |
|---|---|
| `/_workspace` | workspace |
| `/_workspace_2` | process (`w2`) |
| `/_end_user` | end-user |
| `/_subscription` | subscription |
| `/_sla` | sla |
| `/_report_builder` | report-builder |
| `/_chat` | chat-end-user |
| `/_call_center` | call-center |
| `/_cgv_admin` | admin-tool |
| `/o` | root app |

### 4. Shared dependencies (lặp ở mọi config)
`react`, `react-dom`, `react-redux`, `@reduxjs/toolkit`, `react-router-dom`, `@stringeecom/ui-kit`, `@tanstack/react-query`, `react-hook-form`, `yup`, `dayjs`. Tuỳ remote thêm: `@xyflow/react` (sla, report-builder, router), `react-chartjs-2` + `chart.js` (report-builder), `react-simple-typewriter`, `react-gauge-component` (router/end-user).

### 5. Vị trí của `@stringeecom/ui-kit`
ui-kit **không phải Module Federation remote**. Nó là **library độc lập** build bằng `vite-plugin-lib-inject-css` + `vite-plugin-dts` ra `dist/index.{es,umd}.js` + `index.d.ts`, externals `react / react-dom / tailwindcss`. Mọi app cài qua npm (private registry Stringee) và khai báo nó ở mục `shared` của federation để host và mọi remote dùng chung 1 instance singleton — tránh duplicate React/util giữa các bundle.

Để chạy local thay vì cài từ registry, thêm alias vào `vite.config.ts` của app đang chạy. Thay `<path-to-ui-kit-source>` bằng đường dẫn (tương đối tính từ vị trí `vite.config.ts`, hoặc đường tuyệt đối) tới thư mục chứa source code ui-kit trên máy bạn — **tên thư mục tuỳ máy**, không nhất thiết là `ui-kit` (ví dụ `../ui-kit`, `../stringee-ui-kit`, `/Users/me/work/cogover/ui-kit`…):

```ts
{ find: '@stringeecom/ui-kit', replacement: path.resolve(__dirname, '<path-to-ui-kit-source>') }
```

### 6. Lưu ý debug
- 3 file federation (`sla`, `report-builder`, `web-app-template`) đặt nhầm `name: 'subscription'` — chỉ cosmetic, nhưng dễ confuse khi tra log remoteEntry.
- `router/vite.config.ts` khai báo `rollupOptions.external` cho một số module remote (RecordListPage, WorkflowListPage…) để tránh Vite cố bundle khi remote chưa sẵn sàng.
- `call-center` và `web-app-template` hiện chỉ là placeholder, chưa expose module nào.
