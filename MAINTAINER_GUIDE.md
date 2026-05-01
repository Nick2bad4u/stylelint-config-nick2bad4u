## Maintainer guide: stylelint config lifecycle

### 1) Add or edit rules

1. Open `stylelint.config.mjs`.
2. Prefer updating existing rule groups/comments over adding duplicate entries.
3. Keep overrides scoped by file globs and syntax requirements.
4. Add clear comments for non-obvious trade-offs (especially disabled rules).

### 2) Add a new plugin package

1. Add the plugin package to `dependencies` in `package.json`.
2. Register it in `plugins` within `stylelint.config.mjs`.
3. Add/adjust matching rules under the correct namespace.
4. Ensure formatter/syntax dependencies exist when required.

### 3) Update package exports/types

1. Keep package exports in `package.json` pointing to `stylelint.config.mjs`.
2. Keep `index.d.ts` aligned with runtime exports.
3. Keep `test/preset.test.ts` validating entrypoint behavior.

### 4) Validation checklist (required)

Run before pushing:

```sh
npm run lint:all
npm run release:verify
```

Optional release notes preview:

```sh
npm run changelog:preview
```

If `git-cliff` reports missing refs locally, ensure your local branch has at least one commit and tracks the expected branch ref.
