# Installing quick-prompts (formal)

🌐 [中文](INSTALL.md)

`formal/` is the **formal installable DSH bundle package** (`dsh-quick-prompts`): it declares both `dsh.bundle.patch` (auto-registered into the profile via `dsh plugin add`) and `dsh.client` (the client-UI half bundled into the web app). It loads on DSH startup — no per-session `cordis_define` + `cordis_run`.

## What it is

- `package.json` — dual `dsh.bundle.patch` + `dsh.client` declaration, `exports["./client"]`.
- `cordis.patch.yml` — composition patch inserting the `ui-quick-prompts` row.
- `lib/index.js` — node half (empty `apply`).
- `lib/client.js` — **prebuilt** browser bundle (`window.__ModuleLoader__.load(...)`, plain JS, no JSX, no tsdown needed).
- `install.sh` — one-shot install script.
- `.npmrc` — pins the public npm registry (for publishing).

## Install

### From npm (recommended)

```bash
dsh plugin --profile web add dsh-quick-prompts
# restart dsh web, then refresh the page
```

`dsh plugin` = pnpm install + auto-registering any `dsh.bundle.patch`-declaring package into `dsh.profile.bundles`. Plugin-set changes take effect on restart.

### Local checkout

```bash
cd quick-prompts/formal
./install.sh          # = dsh plugin --profile web add "link:$PWD"
# restart dsh web, then refresh the page
```

### Manual

```bash
dsh plugin --profile web add "link:/path/to/quick-prompts/formal"
```

## Uninstall

```bash
dsh plugin --profile web remove dsh-quick-prompts
# restart dsh web
```

(Saved browser config lives in localStorage; to also clear it, run `localStorage.removeItem('dsh.quick-prompts.config.v1')` in the console.)

## Publishing to npm

See the repo root README's publishing notes; `formal/.npmrc` already pins the registry to public npmjs.

## Notes

- DSH runtime packages (`@deepseek-ai/dsh-client-*`) are declared as **optional peer dependencies**, so pnpm won't pull a second DSH/Cordis copy into the profile (runtime symbol-splitting).
- After install, check whether `~/.dsh/profiles/web/node_modules/@deepseek-ai` was materialized as a real directory; if so, handle it per DSH's local rules.
