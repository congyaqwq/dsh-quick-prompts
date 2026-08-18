# quick-prompts · Composer quick prompts

A quick-prompts bar floating above the DeepSeek Harness composer (input box): click a chip to fill a preset prompt into the input, or send it directly. Supports custom prompts, per-item colors, and persisted configuration.

🌐 [中文](README.md)

![Quick-prompts chips above the composer](images/screenshot-chips.png)

![Quick-prompts editor](images/screenshot-editor.png)

## Features

- Renders a row of "quick prompt" chips above the composer (defaults: Commit code, Give a plan, Explain code, Write tests, Code review).
- **Click to fill**: inserts the prompt into the input (fills directly when empty, otherwise appends on a new line).
- **Click to send** (per item, off by default): when enabled, clicking the chip sends the prompt immediately; the chip is highlighted in its item color.
- **Per-item color**: each item has a color picker in the editor, applied to the chip's hover border/text and its "send" highlight.
- **Persistence**: config is saved to browser `localStorage` (key `dsh.quick-prompts.config.v1`) and survives refresh/restart; degrades to in-memory when `localStorage` is unavailable.
- **Edit**: click "⚙ Configure" to open the inline editor — add/edit/remove each item's name, prompt, color, and "send on click" toggle; save or cancel.
- **Bilingual (zh/en)**: UI strings follow the app's current language; on first use with no saved config, default prompts are generated in the active language.
- **Light/dark adaptive**: neutral colors use `--dsw-alias-*` theme tokens, so it adapts automatically.

## Install / load

Two ways: **persistent install** (recommended, loads with DSH startup) or **dynamic plugin** (temporary, in-process preview).

### Option 1: Persistent install

Use the formal client package under [`formal/`](./formal/); it installs into a DSH deployment and loads on startup. See [`formal/INSTALL.en.md`](./formal/INSTALL.en.md):

```bash
cd quick-prompts/formal
./install.sh
# restart DSH, then refresh the page
```

### Option 2: Dynamic plugin (temporary)

A pure-client, no-build, zero-dependency dynamic Cordis plugin version:

1. Open the DeepSeek Harness Web GUI.
2. Pass [`client.js`](./client.js) as `code.client` to `cordis_define`:

   ```text
   cordis_define(plugin: { kind: 'new', idPrefix: 'qprom' }, code: { client: <contents of client.js> })
   ```

3. Activate with `cordis_run` using the returned `pluginId` / `packageId`.

> Note: `client.js` is the `code.client` function body — copy it wholesale; no import/build needed.

## File layout

```
deepseek-harness-plugins/
└── quick-prompts/
    ├── client.js      # dynamic plugin source (code.client body; dev/preview)
    ├── LICENSE        # MIT
    ├── README.md      # this doc (中文)
    ├── README.en.md   # English
    ├── package.json   # repo metadata (display only, not an npm dependency)
    └── formal/        # formal installable package (persistent)
        ├── package.json   # dsh.client declaration + exports["./client"]
        ├── lib/index.js   # node half (empty apply)
        ├── lib/client.js  # prebuilt browser bundle
        ├── install.sh     # one-shot install script
        ├── INSTALL.md     # install/uninstall (中文)
        └── INSTALL.en.md  # install/uninstall (English)
```

## Implementation notes

- **Slot**: `conversation.input.dock` (full-width row above the composer; list slot, registered with `id: 'quick-prompts'`).
- **Write to input**: uses the slot owner props' `inputActions.setDraft(text)`; reads the current draft via `input.draft`.
- **Direct send**: `inputActions.submit()`.
- **Alignment**: `.qp-root` applies the same alignment formula as the composer (`--dsh-composer-side-clearance` / `--dsh-composer-card-max-width`).
- **Per-item color**: chips set `--chip-color` inline; CSS uses `var(--chip-color, var(--dsw-alias-brand-primary))`.
- **Persistence**: reads from `localStorage` on startup (`normalize` validates and backfills defaults); writes back on save; both try/catch-guarded.
- **Bilingual**: dynamic version reads `LocaleSnapshot.active` via `ctx.get('locale')`; formal version uses `inject: ['slots', 'locale']` plus a `useStrings` hook passed through the slot `inject`, subscribing to locale changes.
- **Lifecycle**: every side effect (styles, slot registration, subscriptions) belongs to the current Cordis fiber and is cleaned up on stop/update/remove.

## Default prompts

| Name | Prompt | Color |
| --- | --- | --- |
| Commit code | Please help me commit the code: review the current git changes, generate a proper commit message, and commit. | `#4D6BFE` |
| Give a plan | Please give me a complete plan for the issue above, including approach, steps, caveats, and risks. | `#10A37F` |
| Explain code | Please explain what this code does and how it works. | `#8B5CF6` |
| Write tests | Please write unit tests for the code below. | `#F59E0B` |
| Code review | Please review the code below, point out issues, and suggest improvements. | `#F97316` |

## Known limitations

- Config lives in browser `localStorage` (per browser); clearing browser data or switching browsers loses it (can be extended to Host-side `settings` persistence).
- The dynamic version is temporary/in-process and must be re-defined + re-run after a DSH restart; the formal install (`formal/`) has no such limitation.
- Persistent install of a client-UI plugin requires editing the deployment's host composition and restarting DSH, which `formal/install.sh` performs on the deployment side; this repo only ships the package and script.

## License

[MIT](./LICENSE)
