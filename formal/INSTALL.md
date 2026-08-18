# 正式安装 quick-prompts

🌐 [English](INSTALL.en.md)

`formal/` 是**正式可安装的 DSH bundle 包**（`dsh-quick-prompts`）：既声明了 `dsh.bundle.patch`（通过 `dsh plugin add` 自动注册进 profile），又声明了 `dsh.client`（客户端 UI 半部分打进 web app）。随 DSH 启动自动加载，无需每次 `cordis_define` + `cordis_run`。

## 它是什么

- `package.json` — `dsh.bundle.patch` + `dsh.client` 双声明，`exports["./client"]`。
- `cordis.patch.yml` — 插入 `ui-quick-prompts` 行的组合 patch。
- `lib/index.js` — node half（空 `apply`）。
- `lib/client.js` — **已构建的**浏览器 bundle（`window.__ModuleLoader__.load(...)`，纯 JS、无 JSX、无需 tsdown）。
- `install.sh` — 一键安装脚本。
- `.npmrc` — 固定公共 npm registry（用于发布）。

## 安装

### 从 npm（推荐）

```bash
dsh plugin --profile web add dsh-quick-prompts
# 重启 dsh web，刷新页面
```

`dsh plugin` = pnpm 安装 + 自动把声明了 `dsh.bundle.patch` 的包加入 `dsh.profile.bundles`。插件集合变更需重启生效。

### 本地 checkout

```bash
cd quick-prompts/formal
./install.sh          # 等价 dsh plugin --profile web add "link:$PWD"
# 重启 dsh web，刷新页面
```

### 手动

```bash
dsh plugin --profile web add "link:/path/to/quick-prompts/formal"
```

## 卸载

```bash
dsh plugin --profile web remove dsh-quick-prompts
# 重启 dsh web
```

（浏览器里保存的配置在 localStorage，如需一并清除：控制台执行 `localStorage.removeItem('dsh.quick-prompts.config.v1')`。）

## 发布到 npm

见仓库根 README 的发布说明；`formal/.npmrc` 已把 registry 固定为公共 npmjs。

## 注意事项

- DSH 运行时包（`@deepseek-ai/dsh-client-*`）声明为**可选 peer dependency**，避免 pnpm 把第二份 DSH/Cordis 打进 profile（运行时符号分裂）。
- 装完建议检查 `~/.dsh/profiles/web/node_modules/@deepseek-ai` 是否被建成真实目录；若是，按 DSH 本机规则处理。
