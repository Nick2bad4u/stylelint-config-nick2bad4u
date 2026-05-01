#!/usr/bin/env node

/**
 * Keep `peerDependencies.stylelint` aligned with the currently installed
 * `devDependencies.stylelint` upper range.
 *
 * Why: npm does not support `$stylelint` indirection in `peerDependencies`
 * (that syntax is supported for `overrides` only), so we synchronize the
 * top-end range explicitly after dependency updates.
 *
 * Usage:
 *
 * ```sh
 * node scripts/sync-peer-stylelint-range.mjs
 * ```
 *
 * The script is idempotent — if the peer range already matches, it exits
 * without writing.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * Resolved path to the repository root `package.json`.
 *
 * @type {string}
 */
const packageJsonPath = fileURLToPath(
    new URL("../package.json", import.meta.url)
);

/**
 * Fallback floor range used when the existing `peerDependencies.stylelint`
 * entry is absent or cannot be parsed. Represents the minimum Stylelint major
 * that this shared config is compatible with.
 *
 * @type {string}
 */
const minimumSupportedStylelintRange = "^16.0.0";

/**
 * Read and JSON-parse `package.json`.
 *
 * @returns {Promise<Record<string, unknown>>}
 *
 * @throws {TypeError} When the file cannot be read or parsed.
 */
const readPackageJson = async () => {
    try {
        const content = await readFile(packageJsonPath, "utf8");
        return /** @type {Record<string, unknown>} */ (JSON.parse(content));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new TypeError(
            `Failed to read package.json at ${packageJsonPath}: ${message}`,
            { cause: error }
        );
    }
};

/**
 * Resolve a floor range from the existing peer entry when possible. Falls back
 * to {@link minimumSupportedStylelintRange}.
 *
 * The floor is the first `||`-delimited segment of the current peer range,
 * allowing the script to preserve backwards-compatibility windows that were
 * intentionally added in earlier runs (e.g. `"^16.0.0 || ^17.0.0"`).
 *
 * @param {unknown} existingPeerRange
 *
 * @returns {string}
 */
const resolvePeerFloorRange = (existingPeerRange) => {
    if (typeof existingPeerRange !== "string") {
        return minimumSupportedStylelintRange;
    }

    const [floorCandidate] = existingPeerRange
        .split("||")
        .map((part) => part.trim());

    return floorCandidate ?? minimumSupportedStylelintRange;
};

/**
 * Narrow an unknown value to a non-null object record.
 *
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) => typeof value === "object" && value !== null;

/**
 * Main synchronization routine.
 *
 * 1. Reads `devDependencies.stylelint` as the new upper bound.
 * 2. Reads the current `peerDependencies.stylelint` to extract the floor.
 * 3. Writes `floor || devRange` back when the value has changed.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
    const packageJson = await readPackageJson();

    const devDependencies = packageJson["devDependencies"];
    const peerDependencies = packageJson["peerDependencies"];

    if (!isRecord(devDependencies) || !isRecord(peerDependencies)) {
        throw new TypeError(
            "Expected package.json to include object-valued devDependencies and peerDependencies"
        );
    }

    const devStylelintRange = devDependencies["stylelint"];

    if (
        typeof devStylelintRange !== "string" ||
        devStylelintRange.trim().length === 0
    ) {
        throw new TypeError(
            "Expected devDependencies.stylelint to be a non-empty string range"
        );
    }

    const peerFloorRange = resolvePeerFloorRange(peerDependencies["stylelint"]);

    // When the floor and dev range are identical, emit a single-segment range
    // to avoid a redundant `^x || ^x` expression.
    const nextPeerStylelintRange =
        peerFloorRange === devStylelintRange
            ? devStylelintRange
            : `${peerFloorRange} || ${devStylelintRange}`;

    if (peerDependencies["stylelint"] === nextPeerStylelintRange) {
        console.log(
            `peerDependencies.stylelint already aligned: ${nextPeerStylelintRange}`
        );
        return;
    }

    peerDependencies["stylelint"] = nextPeerStylelintRange;

    try {
        await writeFile(
            packageJsonPath,
            `${JSON.stringify(packageJson, null, 4)}\n`,
            "utf8"
        );
        console.log(
            `Updated peerDependencies.stylelint to: ${nextPeerStylelintRange}`
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new TypeError(
            `Failed to write updated package.json: ${message}`,
            { cause: error }
        );
    }
};

/**
 * Entry point — executes {@link main} and surfaces any errors as a non-zero
 * process exit.
 */
try {
    await main();
} catch (error) {
    console.error(
        "sync-peer-stylelint-range:",
        error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
}
