import nickTwoBadFourU from "eslint-config-nick2bad4u";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.all,

    {
        files: [".gitleaks.toml"],
        name: "Repository/Gitleaks TOML formatting",
        rules: {
            // Prettier owns this file because Tombi's native formatter differs by platform.
            "tombi/tombi": "off",
        },
    },
];

export default config;
