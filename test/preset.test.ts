import type { Linter } from "eslint";

import nickTwoBadFourU, {
    createConfig,
    presets,
} from "eslint-config-nick2bad4u";
import { describe, expect, it } from "vitest";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- Linter.Config is ESLint's mutable public config shape. */

const getRuleNames = (configEntries: readonly Linter.Config[]): Set<string> => {
    const ruleNames = configEntries.flatMap((configEntry) =>
        Object.keys(configEntry.rules ?? {})
    );

    return new Set(ruleNames);
};

const getRegisteredPluginNames = (
    configEntries: readonly Linter.Config[]
): Set<string> => {
    const pluginNames = configEntries.flatMap((configEntry) =>
        Object.keys(configEntry.plugins ?? {})
    );

    return new Set(pluginNames);
};

const hasRuleFromPlugin = (
    configEntries: readonly Linter.Config[],
    pluginName: string
): boolean =>
    [...getRuleNames(configEntries)].some((ruleName) =>
        ruleName.startsWith(`${pluginName}/`)
    );
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable after local Linter.Config helpers. */

describe("eslint-config-nick2bad4u presets", () => {
    it("exposes plugin-style flat config presets", () => {
        expect.assertions(4);

        expect(nickTwoBadFourU.configs).toBe(presets);
        expect(presets.all.length).toBeGreaterThan(0);
        expect(presets.recommended).toBe(presets.all);
        expect(Array.isArray(presets.all)).toBeTruthy();
    });

    it.each([
        ["withoutChunkyLint", "chunkylint"],
        ["withoutCopilot", "copilot"],
        ["withoutDocusaurus2", "docusaurus-2"],
        ["withoutEtcMisc", "etc-misc"],
        ["withoutFileProgress2", "file-progress-2"],
        ["withoutGithubActions2", "github-actions-2"],
        ["withoutImmutable2", "immutable-2"],
        ["withoutRepo", "repo"],
        ["withoutSdl2", "sdl-2"],
        ["withoutStylelint2", "stylelint-2"],
        ["withoutTsconfig", "tsconfig"],
        ["withoutTsdocRequire2", "tsdoc-require-2"],
        ["withoutTypefest", "typefest"],
        ["withoutTypedoc", "typedoc"],
        ["withoutUptimeWatcher", "uptime-watcher"],
        ["withoutVite", "vite"],
        ["withoutWriteGoodComments2", "write-good-comments-2"],
    ] as const)(
        "removes %s plugin rules from the preset",
        (presetName, pluginName) => {
            expect.assertions(2);

            const preset = presets[presetName];
            const registeredPluginNames = getRegisteredPluginNames(preset);

            expect(hasRuleFromPlugin(preset, pluginName)).toBeFalsy();
            expect(registeredPluginNames.has(pluginName)).toBeFalsy();
        }
    );

    it("keeps full preset rules in the all preset", () => {
        expect.assertions(2);

        expect(hasRuleFromPlugin(presets.all, "copilot")).toBeTruthy();
        expect(hasRuleFromPlugin(presets.all, "typefest")).toBeTruthy();
    });

    it("supports local source-rule plugin replacement via createConfig", () => {
        expect.assertions(1);

        const localTypefestPlugin = {
            configs: {
                experimental: {
                    rules: {
                        "typefest/local-only": "error",
                    },
                },
            },
            rules: {},
        };

        const configEntries = createConfig({
            plugins: {
                typefest: localTypefestPlugin,
            },
        });

        expect(
            getRuleNames(configEntries).has("typefest/local-only")
        ).toBeTruthy();
    });
});
