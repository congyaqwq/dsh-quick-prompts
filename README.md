# quick-prompts · 常用语快捷指令

🌐 [English](README.en.md)

在 DeepSeek Harness 输入框上方显示一排「常用语」胶囊：点击把预设提示词填入输入框，或直接发送。

![输入框上方的快捷指令条](images/screenshot-chips.png)

![快捷指令配置编辑器](images/screenshot-editor.png)

## 功能

- 内置常用指令（提交代码 / 给方案 / 解释代码 / 写测试 / 代码审查），可自由增删改
- 点击填入输入框；每条指令可单独开启「点击并发送」
- 每条指令独立颜色，界面中英双语，明暗主题自适应
- 配置持久化到浏览器 localStorage

## 安装

```bash
dsh plugin --profile web add dsh-quick-prompts
# 重启 dsh web，刷新页面
```

本地安装或卸载详见 [formal/INSTALL.md](./formal/INSTALL.md)。

## License

[MIT](./LICENSE)
