## Maintainer guide: rules, plugins, and without presets

### 1) Add or edit rules

1. Open `eslint.config.mjs`.
2. Locate the nearest matching config block by `files`/`name`.
3. Prefer updating existing scoped blocks over adding broad global rules.
4. Use actionable comments for non-obvious rule decisions.
5. If a rule needs type info, keep it in a TypeScript parser block with project service or explicit `project` paths.

### 2) Add a new plugin package

1. Add the plugin package to `dependencies` in `package.json`.
2. Import it in `eslint.config.mjs`.
3. Register it inside the appropriate `plugins` map.
4. Add/adjust rules using that plugin's namespace.
5. Decide whether the plugin should have a dedicated `without*` preset.

### 3) Add a new `without*` preset

Use this when consumers need to dogfood local plugin builds or disable packaged plugin rules.

1. In `eslint.config.mjs`, add a preset entry under exported `configs`:

```js
withoutMyPlugin: createConfig({
    plugins: {
        "my-plugin": false,
    },
}),
```

2. In `preset.mjs`, re-export the new preset from `sharedConfigs`.
3. In `index.d.ts`, add the preset property to `Nick2Bad4UEslintConfigPresets`.
4. In `test/preset.test.ts`, add the preset/plugin namespace pair to the `it.each` matrix.
5. In `README.md`, document the new preset in the presets list.

### 4) Dogfood a local plugin in a consumer repo

Use the matching `without*` preset, then append your local plugin registration and rules:

```js
import nick2bad4u from "eslint-config-nick2bad4u";
import localPlugin from "./plugin.mjs";

export default [
    ...nick2bad4u.configs.withoutMyPlugin,
    {
        files: ["src/**/*.{ts,tsx,mts,cts,js,mjs,cjs}"],
        name: "Local MyPlugin rules",
        plugins: {
            "my-plugin": localPlugin,
        },
        rules: {
            ...localPlugin.configs.recommended.rules,
        },
    },
];
```

### 5) Validation checklist (required)

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
