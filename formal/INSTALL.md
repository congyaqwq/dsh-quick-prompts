# 正式安装 quick-prompts

🌐 [English](INSTALL.en.md)

这里的 `formal/` 是**正式可安装的客户端插件包**，它把 quick-prompts 从「动态插件」变成部署里的持久化插件（随 DSH 启动自动加载，无需每次 `cordis_define` + `cordis_run`）。

## 它是什么

- `package.json` — 带 `dsh.client: { platform: "web" }` 声明 + `exports["./client"]`。
- `lib/index.js` — 插件 node half（空 `apply`，只为让包出现在 host Loader 里）。
- `lib/client.js` — **已构建好的**浏览器 bundle（`window.__ModuleLoader__.load(...)` 格式，纯 JS、无 JSX、无需再 `tsdown` 构建）。
- `install.sh` — 一键安装脚本。

## 与动态插件的区别

| | 动态插件（`../client.js`） | 正式包（`formal/`） |
| --- | --- | --- |
| 生命周期 | 进程内临时，重启即丢 | 随部署持久加载 |
| 加载方式 | `cordis_define` + `cordis_run` | host 组合 + DSH 启动 |
| 代码格式 | `code.client` 函数体 | `window.__ModuleLoader__.load` bundle |
| 服务访问 | `ctx.get('slots')` | `inject: ['slots']` + `ctx.slots` |

两者功能完全一致（胶囊、点击填入/并发送、每指令换色、localStorage 持久化）。

## 安装步骤

### 1. 运行安装脚本

```bash
cd quick-prompts/formal
./install.sh
# 或指定 DSH 安装目录：
DSH_ROOT=/path/to/dsh ./install.sh
```

脚本会：

1. 把 `package/` 复制到 `<DSH 安装目录>/node_modules/@deepseek-ai/dsh-client-ui-quick-prompts/`；
2. 幂等地在 host 组合 `dsh-web-app/cordis.patch.yml` 里插入：

   ```yaml
   # 常用语快捷指令条：输入框上方的常用语胶囊，支持配置/点击并发送/每指令换色。
   - id: ui-quick-prompts
     name: '@deepseek-ai/dsh-client-ui-quick-prompts'
   ```

### 2. 手动方式（如果脚本不合适）

1. 把 `package/` 整个目录复制为：

   ```
   <DSH 安装目录>/node_modules/@deepseek-ai/dsh-client-ui-quick-prompts/
   ```

2. 在 host 组合文件（通常是 `node_modules/@deepseek-ai/dsh-web-app/cordis.patch.yml` 的 client-ui 列表，紧跟 `ui-goal` 之后）加入：

   ```yaml
   - id: ui-quick-prompts
     name: '@deepseek-ai/dsh-client-ui-quick-prompts'
   ```

### 3. 重启并验证

重启 DSH（web profile），刷新页面。输入框上方应出现快捷指令条。

> 注意：默认 DSH 安装目录是 `~/.npm-global/lib/node_modules/@deepseek-ai/dsh`。若你的部署用 pnpm/npx 或别的位置，请用 `DSH_ROOT` 指定实际路径。

## 卸载

1. 从 `cordis.patch.yml` 删除 `ui-quick-prompts` 行；
2. 删除目录 `node_modules/@deepseek-ai/dsh-client-ui-quick-prompts/`；
3. 重启 DSH。

（浏览器里已保存的配置在 localStorage，如需一并清除，可在控制台执行 `localStorage.removeItem('dsh.quick-prompts.config.v1')`。）

## 注意事项

- `lib/client.js` 是手写的最终 bundle（非 tsdown 产物），因此**无需构建**；但如果你改了源码想重新打包，应按 DSH 仓库的 `packages/client/ui-*` 目录规范用 `tsdown` 重新生成 `lib/client.js`。
- 安装脚本会直接改部署里的 `cordis.patch.yml`，运行前它会打印每一步；如部署用别的方式组装 host 组合，请用手动方式把行加到对应的 client-ui 列表。
