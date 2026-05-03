import stylelint from "stylelint";
import sharedConfig from "stylelint-config-nick2bad4u";
import { describe, expect, it } from "vitest";

import config from "../stylelint.config.mjs";

describe("stylelint-config-nick2bad4u preset", () => {
    it("exports a stylelint config object", () => {
        expect.assertions(2);

        expect(typeof sharedConfig).toBe("object");
        expect(sharedConfig).toBeTruthy();
    });

    it("contains the expected top-level stylelint sections", () => {
        expect.assertions(4);

        expect(Array.isArray(sharedConfig.extends)).toBeTruthy();
        expect(Array.isArray(sharedConfig.plugins)).toBeTruthy();
        expect(Array.isArray(sharedConfig.overrides)).toBeTruthy();
        expect(typeof sharedConfig.rules).toBe("object");
    });

    it("matches the direct package entrypoint export", () => {
        expect.assertions(1);

        expect(sharedConfig).toBe(config);
    });

    it("includes baseline standard presets", () => {
        expect.assertions(3);

        expect(
            (sharedConfig.extends ?? []).includes("stylelint-config-standard")
        ).toBeTruthy();
        expect(
            (sharedConfig.extends ?? []).includes(
                "stylelint-config-standard-scss"
            )
        ).toBeTruthy();
        expect(
            (sharedConfig.extends ?? []).includes(
                "stylelint-config-tailwindcss"
            )
        ).toBeTruthy();
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

        expect(lintResult.errored).toBeFalsy();
        expect(unknownRuleWarnings).toHaveLength(0);
    });
});
