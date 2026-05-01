# stylelint-config-nick2bad4u

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

## Supported syntax surfaces

The shared config includes overrides and parsers for:

- plain CSS
- SCSS / Sass
- HTML with inline styles
- CSS-in-JS in JS / TS / JSX / TSX
- styled-jsx
- CSS Modules

## Package notes

- Package entrypoint: `stylelint.config.mjs`
- Export style: ESM only
- Peer dependency: `stylelint@^17.9.1`

## Development checks

Run before publishing or opening a PR:

```sh
npm run lint:all
npm run coverage
npm run release:verify
```

For maintainers, see [MAINTAINER_GUIDE.md](./MAINTAINER_GUIDE.md).
