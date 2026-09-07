# stylelint-config-nick2bad4u

[![NPM license.](https://flat.badgen.net/npm/license/stylelint-config-nick2bad4u?color=purple)](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u/blob/main/LICENSE) [![NPM total downloads.](https://flat.badgen.net/npm/dt/stylelint-config-nick2bad4u?color=pink)](https://www.npmjs.com/package/stylelint-config-nick2bad4u) [![Latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/stylelint-config-nick2bad4u?color=cyan)](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/stylelint-config-nick2bad4u?color=yellow)](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/stylelint-config-nick2bad4u?color=green)](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/stylelint-config-nick2bad4u?color=red)](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u/issues) [![Codecov.](https://flat.badgen.net/codecov/github/Nick2bad4u/stylelint-config-nick2bad4u?color=blue)](https://codecov.io/gh/Nick2bad4u/stylelint-config-nick2bad4u)

Shared Stylelint config for Nick2bad4u projects.

## Install

```sh
npm install --save-dev stylelint-config-nick2bad4u stylelint
```

This package ships the Stylelint configs, plugins, and custom syntaxes needed
by the shared preset. Consuming projects only need to provide their own
`stylelint` installation.

## Usage

Use it as an extended shared config in your project `.stylelintrc.*`:

```json
{
 "extends": ["stylelint-config-nick2bad4u"]
}
```

Or in `stylelint.config.mjs`:

```js
import config from "stylelint-config-nick2bad4u";

export default config;
```

If you prefer to keep a local config wrapper for overrides, compose it like
this:

```js
import sharedConfig from "stylelint-config-nick2bad4u";

export default {
 ...sharedConfig,
 rules: {
  ...sharedConfig.rules,
  "declaration-no-important": null,
 },
};
```

## What this config includes

- Standard modern Stylelint presets
- SCSS support
- File progress and a process-shutdown summary via
  `stylelint-plugin-file-progress/configs/recommended`
- Tailwind compatibility
- Docusaurus CSS support
- Accessibility, logical CSS, and performance plugins
- CSS Grid correctness rules via
  `stylelint-plugin-grid/configs/grid-all`
- CSS performance budget rules via
  `stylelint-plugin-css-performance-budget/configs/performance-budget-all`
- Container query correctness rules via
  `stylelint-plugin-container-query-sanity/configs/container-query-all`
- Vue single-file component parsing and Vue-specific CSS syntax support via
  `postcss-html` and targeted Vue rule overrides

## Supported syntax surfaces

The shared config includes overrides and parsers for:

- plain CSS
- SCSS
- HTML with inline styles
- Vue single-file components
- CSS-in-JS in JS / TS / JSX / TSX
- styled-jsx
- CSS Modules

## Package notes

- Source config: `src/stylelint.config.ts`
- Package entrypoint: `dist/stylelint.config.js`
- Build command: `npm run build`
- Export style: ESM only
- Peer dependency: `stylelint@^17.14.0`
- Node.js: `>=22.12.0`

## File progress

Version 3 enables file progress by default and requires Stylelint 17.14.0 or
newer within major 17, plus Node.js 22.12.0 or newer. Upgrade Stylelint and Node.js
when moving from version 2. Some included CommonJS plugins load Stylelint's ESM
entrypoint, which requires Node.js 22.12.0 in the supported Node 22 line.

Progress uses `stderr`, leaving `stdout` available to API callers and fixed CSS.
The Stylelint CLI also writes diagnostics to `stderr`. For a separate JSON report,
use `stylelint "**/*.css" --formatter json --output-file stylelint-report.json`;
read the report file instead of combining progress and diagnostics into one pipe.
Progress also appears in CI and other non-interactive terminals.
Counts cover observed file-processing events across the process; cached files
and files that fail to parse before rules execute may not appear. The summary
runs when the process exits, including in applications that call Stylelint
more than once.

Disable progress through a local rule override:

```js
export default {
 extends: ["stylelint-config-nick2bad4u"],
 rules: {
  "file-progress/activate": null,
 },
};
```

To keep only the summary, set `"file-progress/activate"` to
`[true, { mode: "summary-only" }]`. See the
[plugin options and colored demonstrations](https://nick2bad4u.github.io/stylelint-plugin-file-progress/)
for the other display modes and presets.

## Development checks

Run before publishing or opening a PR:

```sh
npm run lint:all
npm run coverage
npm run release:verify
```

For maintainers, see [MAINTAINER\_GUIDE.md](./MAINTAINER_GUIDE.md).
