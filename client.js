return {
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    // 配置保存在内存中，随本动态插件生命周期有效（停止/重启即重置为默认值）。
    const DEFAULTS = [
      { id: 'commit',  label: '提交代码', prompt: '请帮我提交代码：检查当前 git 变更，生成规范的 commit message 并执行提交。', send: false },
      { id: 'plan',    label: '给方案',   prompt: '请针对上面的问题给出一个完整方案，包括思路、步骤、注意事项和风险。', send: false },
      { id: 'explain', label: '解释代码', prompt: '请解释这段代码的作用和实现思路。', send: false },
      { id: 'test',    label: '写测试',   prompt: '请为下面的代码编写单元测试。', send: false },
      { id: 'review',  label: '代码审查', prompt: '请对下面的代码进行代码审查，指出问题并给出改进建议。', send: false },
    ]
    const PRESETS = ['#4D6BFE', '#10A37F', '#F59E0B', '#F97316', '#EF4444', '#EC4899', '#8B5CF6', '#64748B']
    let state = { items: DEFAULTS.map((d) => ({ ...d })), accent: '#4D6BFE' }
    const listeners = new Set()
    const store = {
      get: () => state,
      subscribe: (fn) => { listeners.add(fn); return () => { listeners.delete(fn) } },
      set: (partial) => { state = { ...state, ...partial }; for (const fn of listeners) fn() },
    }
    let seq = 0
    const nextId = () => 'p' + (++seq)

    styles.insert(`
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
      .qp-chip:hover { border-color: var(--qp-accent, var(--dsw-alias-brand-primary)); color: var(--qp-accent, var(--dsw-alias-brand-primary)); }
      .qp-chip-send { border-color: var(--qp-accent, var(--dsw-alias-brand-primary)); color: var(--qp-accent, var(--dsw-alias-brand-primary)); }
      .qp-chip-gear { color: var(--dsw-alias-label-secondary); }
      .qp-editor {
        display: flex; flex-direction: column; gap: 6px;
        padding: 8px; border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px; background: var(--dsw-alias-bg-layer-1);
      }
      .qp-edit-accent { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding-bottom: 6px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
      .qp-edit-accent-label { color: var(--dsw-alias-label-secondary); font-size: 12px; }
      .qp-swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; padding: 0; }
      .qp-swatch:hover { border-color: var(--dsw-alias-label-secondary); }
      .qp-swatch-active { border-color: var(--dsw-alias-label-primary); }
      .qp-color-input { width: 28px; height: 24px; padding: 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: transparent; cursor: pointer; }
      .qp-edit-row { display: flex; gap: 6px; align-items: center; }
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
      .qp-edit-send input { accent-color: var(--qp-accent, var(--dsw-alias-brand-primary)); cursor: pointer; margin: 0; }
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
      .qp-btn-primary { background: var(--qp-accent, var(--dsw-alias-brand-primary)); border-color: var(--qp-accent, var(--dsw-alias-brand-primary)); color: #fff; }
    `)

    function useStore() {
      const [snapshot, setSnapshot] = React.useState(() => store.get())
      React.useEffect(() => {
        setSnapshot(store.get())
        return store.subscribe(() => setSnapshot(store.get()))
      }, [])
      return snapshot
    }

    function Editor(props) {
      const [rows, setRows] = React.useState(() => props.initial.map((r) => ({ ...r })))
      const [accent, setAccent] = React.useState(props.accent)
      const update = (id, field, value) => setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
      const remove = (id) => setRows(rows.filter((r) => r.id !== id))
      const add = () => setRows(rows.concat([{ id: nextId(), label: '', prompt: '', send: false }]))
      const save = () => props.onSave(rows.filter((r) => (r.label || '').trim() !== '' && (r.prompt || '').trim() !== ''), accent)

      return React.createElement('div', { className: 'qp-editor' },
        React.createElement('div', { className: 'qp-edit-accent' },
          React.createElement('span', { className: 'qp-edit-accent-label' }, '主题色'),
          PRESETS.map((c) => React.createElement('button', {
            key: c, type: 'button', className: accent === c ? 'qp-swatch qp-swatch-active' : 'qp-swatch',
            style: { background: c }, title: c, onClick: () => setAccent(c),
          })),
          React.createElement('input', {
            type: 'color', className: 'qp-color-input', value: accent,
            onChange: (e) => setAccent(e.target.value),
          }),
        ),
        rows.map((row) => React.createElement('div', { key: row.id, className: 'qp-edit-row' },
          React.createElement('input', {
            className: 'qp-edit-label', value: row.label, placeholder: '名称，如：提交代码',
            onChange: (e) => update(row.id, 'label', e.target.value),
          }),
          React.createElement('input', {
            className: 'qp-edit-prompt', value: row.prompt, placeholder: '提示词，点击后填入输入框',
            onChange: (e) => update(row.id, 'prompt', e.target.value),
          }),
          React.createElement('label', { className: 'qp-edit-send', title: '开启后点击该指令会直接把提示词发送出去' },
            React.createElement('input', {
              type: 'checkbox', checked: !!row.send,
              onChange: (e) => update(row.id, 'send', e.target.checked),
            }),
            '点击并发送',
          ),
          React.createElement('button', {
            className: 'qp-edit-del', type: 'button', title: '删除', onClick: () => remove(row.id),
          }, '✕'),
        )),
        React.createElement('div', { className: 'qp-editor-foot' },
          React.createElement('button', { className: 'qp-btn', type: 'button', onClick: add }, '+ 添加'),
          React.createElement('div', { className: 'qp-spacer' }),
          React.createElement('button', { className: 'qp-btn', type: 'button', onClick: props.onCancel }, '取消'),
          React.createElement('button', { className: 'qp-btn qp-btn-primary', type: 'button', onClick: save }, '保存'),
        ),
      )
    }

    function QuickPrompts(props) {
      const state = useStore()
      const items = state.items
      const accent = state.accent
      const [editing, setEditing] = React.useState(false)
      const draft = props.input && typeof props.input.draft === 'string' ? props.input.draft : ''
      const setDraft = props.inputActions && props.inputActions.setDraft
      const submit = props.inputActions && props.inputActions.submit

      const insert = (item) => {
        if (typeof setDraft !== 'function') return
        const text = (item.prompt || '').trim()
        if (!text) return
        if (item.send) {
          setDraft(text)
          if (typeof submit === 'function') submit()
        } else {
          const next = draft.trim() === '' ? text : draft.replace(/\s+$/, '') + '\n' + text
          setDraft(next)
        }
      }

      return React.createElement('div', { className: 'qp-root', style: { '--qp-accent': accent } },
        editing
          ? React.createElement(Editor, {
              initial: items,
              accent: accent,
              onSave: (next, nextAccent) => { store.set({ items: next, accent: nextAccent }); setEditing(false) },
              onCancel: () => setEditing(false),
            })
          : React.createElement('div', { className: 'qp-row' },
              items.map((item) => React.createElement('button', {
                key: item.id, className: item.send ? 'qp-chip qp-chip-send' : 'qp-chip', type: 'button',
                title: item.send ? item.prompt + '（点击直接发送）' : item.prompt,
                onClick: () => insert(item),
              }, item.label)),
              React.createElement('button', {
                className: 'qp-chip qp-chip-gear', type: 'button', title: '配置快捷指令',
                onClick: () => setEditing(true),
              }, '⚙ 配置'),
            ),
      )
    }

    slots.inject('conversation.input.dock', () => slots.register(
      { name: 'conversation.input.dock', id: 'quick-prompts', order: -10, label: () => '快捷指令' },
      (props) => React.createElement(QuickPrompts, props),
    ))
  },
}
