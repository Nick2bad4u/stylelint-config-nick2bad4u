import stylelint from "stylelint";
import packageConfig from "stylelint-config-nick2bad4u";
import { describe, expect, it } from "vitest";

import sourceConfig from "../src/stylelint.config";

describe("stylelint-config-nick2bad4u preset", () => {
    it("exports a stylelint config object", () => {
        expect.assertions(1);

        expect(sourceConfig).toBeTypeOf("object");
    });

    it("contains the expected top-level stylelint sections", () => {
        expect.assertions(4);

        expect(sourceConfig.extends).toStrictEqual([
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
        expect(sourceConfig.plugins).toHaveLength(18);
        expect(sourceConfig.overrides).toHaveLength(6);
        expect(sourceConfig.rules).toHaveProperty("prettier/prettier", true);
    });

    it("matches the package entrypoint export", () => {
        expect.assertions(1);

        expect(packageConfig).toStrictEqual(sourceConfig);
    });

    it("matches the direct package entrypoint export", async () => {
        expect.assertions(1);

        const { default: config } = await import("../dist/stylelint.config.js");

        expect(packageConfig).toBe(config);
    });

    it("includes baseline and plugin all presets", () => {
        expect.assertions(9);

        expect(sourceConfig.extends).toContain("stylelint-config-standard");
        expect(sourceConfig.extends).toContain(
            "stylelint-config-standard-scss"
        );
        expect(sourceConfig.extends).toContain("stylelint-config-tailwindcss");
        expect(sourceConfig.extends).toContain(
            "stylelint-plugin-grid/configs/grid-all"
        );
        expect(sourceConfig.extends).toContain(
            "stylelint-plugin-css-performance-budget/configs/performance-budget-all"
        );
        expect(sourceConfig.extends).toContain(
            "stylelint-plugin-container-query-sanity/configs/container-query-all"
        );
        expect(sourceConfig.extends).not.toContain(
            "stylelint-plugin-grid/configs/grid-recommended"
        );
        expect(sourceConfig.extends).not.toContain(
            "stylelint-plugin-css-performance-budget/configs/performance-budget-recommended"
        );
        expect(sourceConfig.extends).not.toContain(
            "stylelint-plugin-container-query-sanity/configs/container-query-recommended"
        );
    });

    it("does not contain unknown Stylelint rules", async () => {
        expect.assertions(2);

        const lintResult = await stylelint.lint({
            code: "a { color: red; }",
            config: sourceConfig,
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
