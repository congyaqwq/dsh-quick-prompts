window.__ModuleLoader__.load({
  id: "@deepseek-ai/dsh-client-ui-quick-prompts",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

    const KEY = "dsh.quick-prompts.config.v1";
    const DEFAULT_COLOR = "#4D6BFE";
    const DEFAULTS = [
      { id: "commit",  label: "提交代码", prompt: "请帮我提交代码：检查当前 git 变更，生成规范的 commit message 并执行提交。", send: false, color: "#4D6BFE" },
      { id: "plan",    label: "给方案",   prompt: "请针对上面的问题给出一个完整方案，包括思路、步骤、注意事项和风险。", send: false, color: "#10A37F" },
      { id: "explain", label: "解释代码", prompt: "请解释这段代码的作用和实现思路。", send: false, color: "#8B5CF6" },
      { id: "test",    label: "写测试",   prompt: "请为下面的代码编写单元测试。", send: false, color: "#F59E0B" },
      { id: "review",  label: "代码审查", prompt: "请对下面的代码进行代码审查，指出问题并给出改进建议。", send: false, color: "#F97316" },
    ];

    const css = `
      .qp-root {
        box-sizing: border-box;
        width: calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance));
        max-width: var(--dsh-composer-card-max-width);
        margin: 0 auto;
        flex: none;
      }
      .qp-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
      .qp-chip {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 3px 10px; border-radius: 999px;
        border: 1px solid var(--dsw-alias-border-l1);
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-primary);
        font-size: 12px; line-height: 18px; cursor: pointer; white-space: nowrap;
      }
      .qp-chip:hover { border-color: var(--chip-color, var(--dsw-alias-brand-primary)); color: var(--chip-color, var(--dsw-alias-brand-primary)); }
      .qp-chip-send { border-color: var(--chip-color, var(--dsw-alias-brand-primary)); color: var(--chip-color, var(--dsw-alias-brand-primary)); }
      .qp-chip-gear { color: var(--dsw-alias-label-secondary); }
      .qp-editor {
        display: flex; flex-direction: column; gap: 6px;
        padding: 8px; border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px; background: var(--dsw-alias-bg-layer-1);
      }
      .qp-edit-row { display: flex; gap: 6px; align-items: center; }
      .qp-row-color { width: 26px; height: 24px; padding: 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: transparent; cursor: pointer; flex: 0 0 auto; }
      .qp-edit-label { flex: 0 0 140px; }
      .qp-edit-prompt { flex: 1 1 auto; }
      .qp-edit-label, .qp-edit-prompt {
        padding: 5px 8px; border-radius: 6px;
        border: 1px solid var(--dsw-alias-border-l1);
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary); font-size: 12px;
      }
      .qp-edit-send {
        flex: 0 0 auto;
        display: inline-flex; align-items: center; gap: 4px;
        color: var(--dsw-alias-label-secondary); font-size: 12px;
        cursor: pointer; white-space: nowrap; user-select: none;
      }
      .qp-edit-send input { cursor: pointer; margin: 0; }
      .qp-edit-del {
        flex: 0 0 auto; width: 24px; height: 24px; border-radius: 6px;
        border: 1px solid var(--dsw-alias-border-l1); background: transparent;
        color: var(--dsw-alias-label-secondary); cursor: pointer; font-size: 12px;
      }
      .qp-edit-del:hover { color: var(--dsw-alias-state-error-primary); border-color: var(--dsw-alias-state-error-primary); }
      .qp-editor-foot { display: flex; gap: 6px; align-items: center; }
      .qp-spacer { flex: 1 1 auto; }
      .qp-btn {
        padding: 4px 10px; border-radius: 6px;
        border: 1px solid var(--dsw-alias-border-l1); background: transparent;
        color: var(--dsw-alias-label-primary); font-size: 12px; cursor: pointer;
      }
      .qp-btn-primary { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); color: #fff; }
    `;
    const tagId = "@deepseek-ai/dsh-client-ui-quick-prompts/styles.css";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-quick-prompts";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }

    let seq = 0;
    const nextId = () => "p" + (++seq);

    function normalize(raw) {
      const out = [];
      for (const it of raw) {
        if (!it || typeof it !== "object") continue;
        const label = typeof it.label === "string" ? it.label : "";
        const prompt = typeof it.prompt === "string" ? it.prompt : "";
        if (label.trim() === "" || prompt.trim() === "") continue;
        out.push({
          id: typeof it.id === "string" && it.id ? it.id : nextId(),
          label: label,
          prompt: prompt,
          send: !!it.send,
          color: typeof it.color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(it.color) ? it.color : DEFAULT_COLOR,
        });
      }
      return out;
    }

    function loadConfig() {
      try {
        if (typeof localStorage === "undefined") return null;
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        const norm = normalize(parsed);
        return norm.length > 0 ? norm : null;
      } catch (e) {
        return null;
      }
    }

    function persist(items) {
      try {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch (e) {
        // storage unavailable → degrade to in-memory.
      }
    }

    let items = loadConfig() || DEFAULTS.map((d) => ({ ...d }));
    const listeners = new Set();
    const store = {
      get: () => items,
      subscribe: (fn) => { listeners.add(fn); return () => { listeners.delete(fn) } },
      replace: (next) => { items = next; for (const fn of listeners) fn() },
    };

    function useItems() {
      const [snapshot, setSnapshot] = react.useState(() => store.get());
      react.useEffect(() => {
        setSnapshot(store.get());
        return store.subscribe(() => setSnapshot(store.get()));
      }, []);
      return snapshot;
    }

    function Editor(props) {
      const [rows, setRows] = react.useState(() => props.initial.map((r) => ({ ...r })));
      const update = (id, field, value) => setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
      const remove = (id) => setRows(rows.filter((r) => r.id !== id));
      const add = () => setRows(rows.concat([{ id: nextId(), label: "", prompt: "", send: false, color: DEFAULT_COLOR }]));
      const save = () => props.onSave(rows.filter((r) => (r.label || "").trim() !== "" && (r.prompt || "").trim() !== ""));

      return react.createElement("div", { className: "qp-editor" },
        rows.map((row) => react.createElement("div", { key: row.id, className: "qp-edit-row" },
          react.createElement("input", {
            type: "color", className: "qp-row-color", value: row.color || DEFAULT_COLOR, title: "该指令颜色",
            onChange: (e) => update(row.id, "color", e.target.value),
          }),
          react.createElement("input", {
            className: "qp-edit-label", value: row.label, placeholder: "名称，如：提交代码",
            onChange: (e) => update(row.id, "label", e.target.value),
          }),
          react.createElement("input", {
            className: "qp-edit-prompt", value: row.prompt, placeholder: "提示词，点击后填入输入框",
            onChange: (e) => update(row.id, "prompt", e.target.value),
          }),
          react.createElement("label", { className: "qp-edit-send", title: "开启后点击该指令会直接把提示词发送出去" },
            react.createElement("input", {
              type: "checkbox", checked: !!row.send, style: { accentColor: row.color || DEFAULT_COLOR },
              onChange: (e) => update(row.id, "send", e.target.checked),
            }),
            "点击并发送",
          ),
          react.createElement("button", {
            className: "qp-edit-del", type: "button", title: "删除", onClick: () => remove(row.id),
          }, "✕"),
        )),
        react.createElement("div", { className: "qp-editor-foot" },
          react.createElement("button", { className: "qp-btn", type: "button", onClick: add }, "+ 添加"),
          react.createElement("div", { className: "qp-spacer" }),
          react.createElement("button", { className: "qp-btn", type: "button", onClick: props.onCancel }, "取消"),
          react.createElement("button", { className: "qp-btn qp-btn-primary", type: "button", onClick: save }, "保存"),
        ),
      );
    }

    function QuickPrompts(props) {
      const items = useItems();
      const [editing, setEditing] = react.useState(false);
      const draft = props.input && typeof props.input.draft === "string" ? props.input.draft : "";
      const setDraft = props.inputActions && props.inputActions.setDraft;
      const submit = props.inputActions && props.inputActions.submit;

      const insert = (item) => {
        if (typeof setDraft !== "function") return;
        const text = (item.prompt || "").trim();
        if (!text) return;
        if (item.send) {
          setDraft(text);
          if (typeof submit === "function") submit();
        } else {
          const next = draft.trim() === "" ? text : draft.replace(/\s+$/, "") + "\n" + text;
          setDraft(next);
        }
      };

      return react.createElement("div", { className: "qp-root" },
        editing
          ? react.createElement(Editor, {
              initial: items,
              onSave: (next) => { store.replace(next); persist(next); setEditing(false) },
              onCancel: () => setEditing(false),
            })
          : react.createElement("div", { className: "qp-row" },
              items.map((item) => react.createElement("button", {
                key: item.id,
                className: item.send ? "qp-chip qp-chip-send" : "qp-chip",
                type: "button",
                style: { "--chip-color": item.color || DEFAULT_COLOR },
                title: item.send ? item.prompt + "（点击直接发送）" : item.prompt,
                onClick: () => insert(item),
              }, item.label)),
              react.createElement("button", {
                className: "qp-chip qp-chip-gear", type: "button", title: "配置快捷指令",
                onClick: () => setEditing(true),
              }, "⚙ 配置"),
            ),
      );
    }

    function apply(ctx) {
      ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
        name: "conversation.input.dock",
        id: "quick-prompts",
        order: -10,
      }, QuickPrompts));
    }
    const inject = ["slots"];

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
