#!/usr/bin/env bash
#
# 安装 dsh-quick-prompts（本地 checkout / 或从 npm）。
#
# 用法：
#   ./install.sh                          # 从当前目录（link:）安装本 checkout
#   ./install.sh dsh-quick-prompts        # 从 npm 安装（等价 dsh plugin add）
#   ./install.sh link:/path/to/checkout   # 指定任意 pnpm spec
#
# 依赖 dsh CLI（`dsh plugin` 转发给 pnpm 并自动注册 bundle）。
# 完成后需重启 dsh web 并刷新页面。

set -euo pipefail

PROFILE="${DSH_PROFILE:-web}"
SPEC="${1:-link:$PWD}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 相对路径 spec 以调用目录为锚点（dsh plugin 内部也会这样做）；这里统一从 formal/ 目录安装自身。
if [ -z "${1:-}" ]; then
  cd "$SCRIPT_DIR"
fi

echo "==> dsh plugin --profile $PROFILE add $SPEC"
dsh plugin --profile "$PROFILE" add "$SPEC"

echo ""
echo "✅ 已加入 profile「$PROFILE」。"
echo "下一步：重启 dsh web 进程并刷新页面（插件集合变更需重启生效）。"
