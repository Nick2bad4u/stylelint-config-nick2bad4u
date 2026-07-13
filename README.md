# stylelint-config-nick2bad4u

[![CI](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/stylelint-config-nick2bad4u.svg)](https://www.npmjs.com/package/stylelint-config-nick2bad4u)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

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
  `stylelint-config-recommended-vue`

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
- Peer dependency: `stylelint@^17.9.1`

## Development checks

Run before publishing or opening a PR:

```sh
npm run lint:all
npm run coverage
npm run release:verify
```

For maintainers, see [MAINTAINER\_GUIDE.md](./MAINTAINER_GUIDE.md).
