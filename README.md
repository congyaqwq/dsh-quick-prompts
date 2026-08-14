# quick-prompts · 常用语快捷指令

悬浮在 DeepSeek Harness 对话框（输入框）上方的常用语快捷指令条：点击即可把预设提示词填入输入框，或直接发送。支持自定义指令、每条指令独立颜色，配置持久化保存。

## 功能

- 在输入框上方渲染一排「快捷指令」胶囊按钮（默认：提交代码、给方案、解释代码、写测试、代码审查）。
- **点击填入**：把对应提示词填入输入框（输入框为空则直接填入，否则换行追加）。
- **点击并发送**（每条指令可单独开启，默认关闭）：开启后点击该胶囊会把提示词直接发送出去，该胶囊会以该指令的颜色高亮。
- **每条指令独立颜色**：编辑器中每条指令带一个颜色选择器，作用到该胶囊的 hover 边框/文字和「点击并发送」高亮。
- **持久化**：配置保存在浏览器 `localStorage`（key：`dsh.quick-prompts.config.v1`），插件停止/重启、页面刷新后配置仍保留；`localStorage` 不可用时自动降级为内存态。
- **配置**：点击「⚙ 配置」进入内联编辑器，可增删改每个指令的名称、提示词、颜色与「点击并发送」开关，保存/取消。
- **明暗主题自适应**：中性色使用 `--dsw-alias-*` 主题变量，自动适配明暗主题。

## 安装 / 加载

本插件是 **DeepSeek Harness 动态 Cordis 插件**（纯 Client 侧，无构建、零依赖）。加载方式：

1. 打开 DeepSeek Harness Web GUI。
2. 将本仓库的 [`client.js`](./client.js) 内容作为 `code.client` 传入 `cordis_define`，例如：

   ```text
   cordis_define(plugin: { kind: 'new', idPrefix: 'qprom' }, code: { client: <client.js 的内容> })
   ```

3. 用返回的 `pluginId` / `packageId` 调用 `cordis_run` 激活。

> 说明：`client.js` 就是动态插件的 `code.client` 函数体（`return { apply(ctx) { … } }`），可直接整体复制粘贴使用，不需要 import / 构建。

## 文件结构

```
deepseek-harness-plugins/
└── quick-prompts/
    ├── client.js    # 客户端插件源码（code.client 函数体）
    ├── LICENSE      # MIT 协议
    ├── README.md    # 本文档
    └── package.json # 元数据（仅用于仓库展示，非 npm 依赖包）
```

## 插件实现要点

- **挂载槽位**：`conversation.input.dock`（输入框上方的整行区域，list 槽，注册 `id: 'quick-prompts'`）。
- **写入输入框**：使用槽位 owner props 的 `inputActions.setDraft(text)`；读取当前草稿用 `input.draft`。
- **直接发送**：使用 `inputActions.submit()`。
- **对齐**：`.qp-root` 套用与输入框一致的对齐公式（`--dsh-composer-side-clearance` / `--dsh-composer-card-max-width`）。
- **每条指令换色**：胶囊内联设置 `--chip-color`，CSS 用 `var(--chip-color, var(--dsw-alias-brand-primary))` 取色。
- **持久化**：启动时从 `localStorage` 读取（`normalize` 校验字段并回填默认值），保存时写回 `localStorage`，读写均 try/catch 兜底。
- **生命周期**：所有副作用（样式、槽位注册、订阅）都归属当前 Cordis Fiber，停止/更新/删除时自动清理。

## 默认指令

| 名称 | 提示词 | 默认颜色 |
| --- | --- | --- |
| 提交代码 | 请帮我提交代码：检查当前 git 变更，生成规范的 commit message 并执行提交。 | `#4D6BFE` |
| 给方案 | 请针对上面的问题给出一个完整方案，包括思路、步骤、注意事项和风险。 | `#10A37F` |
| 解释代码 | 请解释这段代码的作用和实现思路。 | `#8B5CF6` |
| 写测试 | 请为下面的代码编写单元测试。 | `#F59E0B` |
| 代码审查 | 请对下面的代码进行代码审查，指出问题并给出改进建议。 | `#F97316` |

## 已知限制

- 配置保存在**浏览器 localStorage**，仅对当前浏览器有效；清除浏览器数据或换浏览器会丢失（可自行扩展为 Host 侧 `settings` 服务持久化）。
- 动态插件本身是临时、进程内的，DSH 重启后需要重新 `cordis_define` + `cordis_run`（配置会从 localStorage 自动恢复）。

## License

[MIT](./LICENSE)
