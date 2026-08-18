# dsh-quick-prompts

A quick-prompts bar floating above the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) composer (input box): click a chip to fill a preset prompt into the input, or send it directly. Supports custom prompts, per-item colors, zh/en bilingual, and persisted configuration.

## Features

- Renders a row of "quick prompt" chips above the composer (defaults: Commit code, Give a plan, Explain code, Write tests, Code review).
- **Click to fill** — inserts the prompt into the input (fills directly when empty, otherwise appends on a new line).
- **Click to send** (per item, off by default) — clicking sends the prompt immediately; the chip is highlighted in its item color.
- **Per-item color** — each item has a color picker, applied to the chip's hover border/text and its "send" highlight.
- **Bilingual (zh/en)** — UI strings follow the app's current language; first-run defaults are generated in the active language.
- **Persistence** — config is saved to browser `localStorage` (key `dsh.quick-prompts.config.v1`); degrades to in-memory when unavailable.
- **Light/dark adaptive** — neutral colors use `--dsw-alias-*` theme tokens.

## Install

```bash
dsh plugin --profile web add dsh-quick-prompts
```

Then restart the `dsh web` process and refresh the page.

> `dsh plugin` installs the package and auto-registers it as a profile bundle (it declares `dsh.bundle.patch`). Plugin-set changes take effect on restart.

### Local install (from a checkout)

```bash
cd quick-prompts/formal
./install.sh
```

## Configuration

Click the "⚙ Configure" chip to open the inline editor: add/edit/remove each item's name, prompt, color, and "send on click" toggle. Config persists in browser `localStorage`; clear it with:

```js
localStorage.removeItem('dsh.quick-prompts.config.v1')
```

## License

[MIT](./LICENSE)
