#!/usr/bin/env bash
#
# 安装 quick-prompts 正式客户端插件到 DeepSeek Harness 部署。
#
# 它会做两件事：
#   1. 把 ./package 复制到 <DSH 安装目录>/node_modules/@deepseek-ai/dsh-client-ui-quick-prompts/
#   2. 在 host 组合 dsh-web-app/cordis.patch.yml 里（幂等）加入 ui-quick-prompts 行
#
# 用法：
#   ./install.sh                      # 使用默认 DSH 安装目录
#   DSH_ROOT=/path/to/dsh ./install.sh
#   ./install.sh /path/to/dsh
#
# 完成后需重启 DSH（web profile）并刷新页面。

set -euo pipefail

DSH_ROOT="${DSH_ROOT:-${1:-$HOME/.npm-global/lib/node_modules/@deepseek-ai/dsh}}"
PKG_DIR="$DSH_ROOT/node_modules/@deepseek-ai/dsh-client-ui-quick-prompts"
PATCH_FILE="$DSH_ROOT/node_modules/@deepseek-ai/dsh-web-app/cordis.patch.yml"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_PKG="$SCRIPT_DIR/package"

if [ ! -d "$DSH_ROOT" ]; then
  echo "错误：找不到 DSH 安装目录：$DSH_ROOT" >&2
  echo "请通过 DSH_ROOT=/path/to/dsh ./install.sh 指定正确路径。" >&2
  exit 1
fi
if [ ! -f "$PATCH_FILE" ]; then
  echo "错误：找不到 host 组合文件：$PATCH_FILE" >&2
  echo "你的部署若用别的方式组装 host 组合，请手动把下面这行加入对应 client-ui 列表：" >&2
  echo "    - id: ui-quick-prompts" >&2
  echo "      name: '@deepseek-ai/dsh-client-ui-quick-prompts'" >&2
  exit 1
fi

echo "==> 复制插件包到 $PKG_DIR"
rm -rf "$PKG_DIR"
mkdir -p "$PKG_DIR"
cp -R "$SRC_PKG"/. "$PKG_DIR"/

if grep -q 'dsh-client-ui-quick-prompts' "$PATCH_FILE"; then
  echo "==> host 组合里已存在 ui-quick-prompts 行，跳过插入"
else
  echo "==> 在 host 组合里加入 ui-quick-prompts 行"
  BLOCK="$(cat <<'EOF'
    # 常用语快捷指令条：输入框上方的常用语胶囊，支持配置/点击并发送/每指令换色。
    - id: ui-quick-prompts
      name: '@deepseek-ai/dsh-client-ui-quick-prompts'
EOF
)"
  awk -v block="$BLOCK" '
    { print }
    /dsh-client-ui-goal/ && !done { print block; done = 1 }
  ' "$PATCH_FILE" > "$PATCH_FILE.tmp" && mv "$PATCH_FILE.tmp" "$PATCH_FILE"
fi

echo ""
echo "✅ 安装完成。"
echo "下一步：重启 DSH（web profile），然后刷新浏览器页面。"
echo "插件配置会保存在浏览器 localStorage，重启后自动恢复。"
