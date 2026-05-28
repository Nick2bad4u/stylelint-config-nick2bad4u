import stylelint from "stylelint";
import sharedConfig from "stylelint-config-nick2bad4u";
import { describe, expect, it } from "vitest";

import config from "../stylelint.config.mjs";

describe("stylelint-config-nick2bad4u preset", () => {
    it("exports a stylelint config object", () => {
        expect.assertions(1);

        expect(sharedConfig).toBeTypeOf("object");
    });

    it("contains the expected top-level stylelint sections", () => {
        expect.assertions(4);

        expect(sharedConfig.extends).toStrictEqual([
            "stylelint-config-standard",
            "stylelint-config-recess-order",
            "stylelint-config-idiomatic-order",
            "stylelint-config-standard-scss",
            "stylelint-plugin-docusaurus/configs/docusaurus-all",
            "stylelint-plugin-font/configs/font-all",
            "stylelint-plugin-grid/configs/grid-all",
            "stylelint-plugin-css-performance-budget/configs/performance-budget-all",
            "stylelint-plugin-container-query-sanity/configs/container-query-all",
            "stylelint-config-tailwindcss",
        ]);
        expect(sharedConfig.plugins).toHaveLength(18);
        expect(sharedConfig.overrides).toHaveLength(6);
        expect(sharedConfig.rules).toHaveProperty("prettier/prettier", true);
    });

    it("matches the direct package entrypoint export", () => {
        expect.assertions(1);

        expect(sharedConfig).toBe(config);
    });

    it("includes baseline and plugin all presets", () => {
        expect.assertions(9);

        expect(sharedConfig.extends).toContain("stylelint-config-standard");
        expect(sharedConfig.extends).toContain(
            "stylelint-config-standard-scss"
        );
        expect(sharedConfig.extends).toContain("stylelint-config-tailwindcss");
        expect(sharedConfig.extends).toContain(
            "stylelint-plugin-grid/configs/grid-all"
        );
        expect(sharedConfig.extends).toContain(
            "stylelint-plugin-css-performance-budget/configs/performance-budget-all"
        );
        expect(sharedConfig.extends).toContain(
            "stylelint-plugin-container-query-sanity/configs/container-query-all"
        );
        expect(sharedConfig.extends).not.toContain(
            "stylelint-plugin-grid/configs/grid-recommended"
        );
        expect(sharedConfig.extends).not.toContain(
            "stylelint-plugin-css-performance-budget/configs/performance-budget-recommended"
        );
        expect(sharedConfig.extends).not.toContain(
            "stylelint-plugin-container-query-sanity/configs/container-query-recommended"
        );
    });

    it("does not contain unknown Stylelint rules", async () => {
        expect.assertions(2);

        const lintResult = await stylelint.lint({
            code: "a { color: red; }",
            config: sharedConfig,
        });

        const allWarnings = lintResult.results.flatMap(
            (result) => result.warnings
        );
        const unknownRuleWarnings = allWarnings.filter((warning) =>
            warning.text.toLowerCase().includes("unknown rule")
        );

        expect(lintResult.results).toHaveLength(1);
        expect(unknownRuleWarnings).toHaveLength(0);
    });
});
