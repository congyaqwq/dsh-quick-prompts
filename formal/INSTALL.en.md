# Installing quick-prompts (formal)

`formal/` is the **formal installable client-plugin package**: it turns quick-prompts from a dynamic plugin into a persistent plugin in your deployment (auto-loads on DSH startup; no per-session `cordis_define` + `cordis_run`).

🌐 [中文](INSTALL.md)

## What it is

- `package.json` — declares `dsh.client: { platform: "web" }` plus `exports["./client"]`.
- `lib/index.js` — plugin node half (empty `apply`, so the package appears in the host Loader).
- `lib/client.js` — **prebuilt** browser bundle (`window.__ModuleLoader__.load(...)`, plain JS, no JSX, no tsdown rebuild needed).
- `install.sh` — one-shot install script.

## Dynamic vs formal

| | Dynamic plugin (`../client.js`) | Formal package (`formal/`) |
| --- | --- | --- |
| Lifetime | in-process, lost on restart | persistent across restarts |
| Loading | `cordis_define` + `cordis_run` | host composition + DSH startup |
| Code format | `code.client` function body | `window.__ModuleLoader__.load` bundle |
| Service access | `ctx.get('slots')` | `inject: ['slots', 'locale']` + `ctx.slots` |

Feature parity: chips, click-to-fill/send, per-item color, localStorage persistence, zh/en bilingual.

## Install

### 1. Run the install script

```bash
cd quick-prompts/formal
./install.sh
# or point at your DSH install:
DSH_ROOT=/path/to/dsh ./install.sh
```

The script:

1. copies `package/` into `<DSH install>/node_modules/@deepseek-ai/dsh-client-ui-quick-prompts/`;
2. idempotently inserts into the host composition `dsh-web-app/cordis.patch.yml`:

   ```yaml
   # Composer quick-prompts bar: chips above the input, configurable / send-on-click / per-item color.
   - id: ui-quick-prompts
     name: '@deepseek-ai/dsh-client-ui-quick-prompts'
   ```

### 2. Manual install (if the script doesn't fit)

1. Copy the whole `package/` directory to:

   ```
   <DSH install>/node_modules/@deepseek-ai/dsh-client-ui-quick-prompts/
   ```

2. Add to the host composition (usually `node_modules/@deepseek-ai/dsh-web-app/cordis.patch.yml`, in the client-ui list right after `ui-goal`):

   ```yaml
   - id: ui-quick-prompts
     name: '@deepseek-ai/dsh-client-ui-quick-prompts'
   ```

### 3. Restart & verify

Restart DSH (web profile), refresh the page. The quick-prompts bar should appear above the composer.

> The default DSH install dir is `~/.npm-global/lib/node_modules/@deepseek-ai/dsh`. Use `DSH_ROOT` if your deployment lives elsewhere (pnpm/npx, etc.).

## Uninstall

1. Remove the `ui-quick-prompts` row from `cordis.patch.yml`.
2. Delete `node_modules/@deepseek-ai/dsh-client-ui-quick-prompts/`.
3. Restart DSH.

(Saved config is in browser localStorage; to also clear it, run `localStorage.removeItem('dsh.quick-prompts.config.v1')` in the console.)

## Notes

- `lib/client.js` is a hand-written final bundle (not a tsdown artifact), so **no build is required**; if you edit source and want to repackage, regenerate `lib/client.js` with `tsdown` following DSH's `packages/client/ui-*` conventions.
- The install script edits the deployment's `cordis.patch.yml`; it prints each step before running. If your deployment assembles the host composition differently, use the manual method to add the row to the correct client-ui list.
